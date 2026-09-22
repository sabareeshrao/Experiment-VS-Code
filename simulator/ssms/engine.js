(() => {
  "use strict";

  const APP_ID = "sql_server_management_studio";
  const SUPPORTED_ACTIONS = [
    "openMenu","pressButton","highlightTarget","showNotification","setView",
    "openConnectDialog","setConnectionField","connectServer","disconnectServer","changeDatabase",
    "openObjectExplorer","expandNode","collapseNode","refreshObjectExplorer","refreshNode","selectObject","openObject","showObjectProperties",
    "newQuery","switchQueryTab","closeQueryTab","closeAllQueries","setSql","typeSql","appendSql","selectSqlRange","clearSelection","executeQuery","cancelQuery","parseQuery","changeQueryDatabase",
    "showResults","showMessages","setResultsMode","exportResults","selectAllResults","copyResults","copyResultsWithHeaders","clearResults",
    "showIntelliSense","acceptIntelliSense","refreshIntelliSenseCache","showSyntaxError","clearSyntaxErrors",
    "scriptObjectAs","createTable","insertRows","updateRows","deleteRows","dropTable",
    "saveQuery","saveQueryAs","openSqlFile",
    "createVerticalTabGroup","createHorizontalTabGroup","moveTabToPreviousGroup","moveTabToNextGroup","openWindowsDialog","activateWindow",
    "executeSqlText","beginTransaction","commitTransaction","rollbackTransaction",
    "createIndex","createView","createProcedure","createFunction","createTrigger","addConstraint",
    "showEstimatedExecutionPlan","showActualExecutionPlan","showClientStatistics","setStatisticsIo","setStatisticsTime",
    "openActivityMonitor","setSessions","killSession","openBackupDialog","backupDatabase","openRestoreDialog","restoreDatabase",
    "openSqlServerAgent","createAgentJob","runAgentJob","showTableDesigner","editTopRows","generateScripts","importData","exportData",
    "createLogin","createUser","grantPermission","schemaCompare","showQueryStore","showProfiler","showExtendedEvents",
    "createAgentSchedule","showAgentJobHistory","addLinkedServer","openRegisteredServers","showObjectExplorerDetails","createDatabaseDiagram","openOptions","setEditorOption"
  ];

  let packageRef = null;
  let baseline = null;
  let state = null;
  let autoType = true;
  let seekToken = 0;
  let allowBoundary = true;

  const ui = {
    menu: null,
    connectOpen: false,
    connectionDraft: {},
    modalType: null,
    notification: "",
    intelli: null,
    boundaryTarget: null,
    boundaryFrame: 0,
    resultTab: "results",
    windowsDialogOpen: false,
    propertiesDialog: null,
    exportDialog: null,
    copiedText: ""
  };

  const $ = id => document.getElementById(id);
  const refs = {
    app: $("app"), titleText: $("titleText"), menubar: $("menubar"), toolbar: $("toolbar"), dbSelect: $("dbSelect"),
    leftPane: $("leftPane"), objectTree: $("objectTree"), workspace: $("workspace"), docTabs: $("docTabs"), editorArea: $("editorArea"), queryGroups: $("queryGroups"), resultsPane: $("resultsPane"), resultBody: $("resultBody"),
    statusLeft: $("statusLeft"), statusServer: $("statusServer"), statusDb: $("statusDb"), statusUser: $("statusUser"),
    menuPopup: $("menuPopup"), intelli: $("intelli"), modalBackdrop: $("modalBackdrop"), modal: $("modal"), notification: $("notification"), boundary: $("boundary"), assistant: $("ssmsAssistant"), assistantDrag: $("ssmsAssistantDrag"), assistantTitle: $("ssmsAssistantTitle"), assistantStage: $("ssmsAssistantStage"), assistantMeta: $("ssmsAssistantMeta"), assistantText: $("ssmsAssistantText"), assistantMin: $("ssmsAssistantMin"), assistantClose: $("ssmsAssistantClose")
  };

  const clone = value => JSON.parse(JSON.stringify(value ?? null));
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const norm = s => String(s ?? "").trim().toLowerCase();

  function defaultState() {
    return {
      title: "SQL Server Management Studio",
      version: "",
      connected: false,
      connection: {serverType:"Database Engine",serverName:"",authentication:"Windows Authentication",userName:"",database:"master"},
      currentDatabase: "master",
      currentUser: "",
      statusText: "Disconnected",
      databases: [],
      expandedNodes: [],
      selectedObject: null,
      objectExplorerVisible: true,
      queryTabs: [],
      activeQueryId: null,
      groupMode: "single",
      groups: {a:[],b:[]},
      files: {},
      intellisenseCache: [],
      objectExplorerCache: {},
      objectExplorerStale: false,
      lastRefresh: "",
      activeView: "query", transactionSnapshot:null, statisticsIo:false, statisticsTime:false, sessions:[], logins:[], permissions:[], agentJobs:[], agentJobHistory:[], backups:[], linkedServers:[], registeredServers:[], options:{lineNumbers:true,wordWrap:false,includeActualPlan:false}, featurePanel:null
    };
  }

  function normalizeState(input) {
    const s = Object.assign(defaultState(), clone(input || {}));
    s.connection = Object.assign(defaultState().connection, s.connection || {});
    s.currentDatabase = s.currentDatabase || s.connection.database || "master";
    s.databases = Array.isArray(s.databases) ? s.databases : []; s.databases.forEach(db=>{db.tables=Array.isArray(db.tables)?db.tables:[];db.views=Array.isArray(db.views)?db.views:[];db.procedures=Array.isArray(db.procedures)?db.procedures:[];db.functions=Array.isArray(db.functions)?db.functions:[];db.users=Array.isArray(db.users)?db.users:[];});
    s.queryTabs = Array.isArray(s.queryTabs) ? s.queryTabs.map((t,i)=>normalizeTab(t,i)) : [];
    s.expandedNodes = Array.isArray(s.expandedNodes) ? s.expandedNodes : [];
    s.groups = s.groups && typeof s.groups === "object" ? s.groups : {a:[],b:[]};
    s.groups.a = Array.isArray(s.groups.a) ? s.groups.a : [];
    s.groups.b = Array.isArray(s.groups.b) ? s.groups.b : [];
    if (!s.groups.a.length && s.queryTabs.length) s.groups.a = s.queryTabs.map(t=>t.id);
    if (!s.activeQueryId && s.queryTabs.length) s.activeQueryId = s.queryTabs[0].id;
    s.files = s.files && typeof s.files === "object" ? s.files : {};
    s.intellisenseCache = Array.isArray(s.intellisenseCache) ? s.intellisenseCache : [];
    if (!s.objectExplorerCache || typeof s.objectExplorerCache !== "object" || !Object.keys(s.objectExplorerCache).length) {
      s.objectExplorerCache = {};
      for (const db of s.databases) s.objectExplorerCache[db.name] = clone(db.tables || []);
    }
    s.objectExplorerStale = !!s.objectExplorerStale;
    s.sessions=Array.isArray(s.sessions)?s.sessions:[];s.logins=Array.isArray(s.logins)?s.logins:[];s.permissions=Array.isArray(s.permissions)?s.permissions:[];s.agentJobs=Array.isArray(s.agentJobs)?s.agentJobs:[];s.agentJobHistory=Array.isArray(s.agentJobHistory)?s.agentJobHistory:[];s.backups=Array.isArray(s.backups)?s.backups:[];s.linkedServers=Array.isArray(s.linkedServers)?s.linkedServers:[];s.registeredServers=Array.isArray(s.registeredServers)?s.registeredServers:[];s.options=Object.assign({lineNumbers:true,wordWrap:false,includeActualPlan:false},s.options||{});
    return s;
  }

  function normalizeTab(t, i=0) {
    return Object.assign({
      id: `q${i+1}`, title:`SQLQuery${i+1}.sql`, database:"master", connectionName:"", sql:"", savedPath:"", dirty:false,
      selection:null, syntaxErrors:[], resultMode:"grid", result:{columns:[],rows:[],text:"",file:"",messages:""}, status:"Ready", selectedAll:false
    }, t || {}, {
      syntaxErrors: Array.isArray(t?.syntaxErrors) ? t.syntaxErrors : [],
      result: Object.assign({columns:[],rows:[],text:"",file:"",messages:""}, t?.result || {}), executionPlan: Array.isArray(t?.executionPlan)?t.executionPlan:[], clientStats:Object.assign({},t?.clientStats||{})
    });
  }

  function activeTab() { return state?.queryTabs?.find(t=>t.id===state.activeQueryId) || null; }
  function tabById(id) { return state?.queryTabs?.find(t=>t.id===id) || null; }
  function dbByName(name) { return state?.databases?.find(d=>norm(d.name)===norm(name)); }
  function tableByName(database, tableName) {
    const db = dbByName(database);
    if (!db) return null;
    const full = String(tableName || "");
    return (db.tables || []).find(t=>norm(t.name)===norm(full) || norm(`${t.schema||"dbo"}.${t.name}`)===norm(full));
  }
  function ensureDb(name) {
    let db = dbByName(name);
    if (!db) { db={name:name||"master",system:false,tables:[],views:[],programmability:[],security:[]}; state.databases.push(db); }
    db.tables = Array.isArray(db.tables) ? db.tables : []; db.views=Array.isArray(db.views)?db.views:[]; db.procedures=Array.isArray(db.procedures)?db.procedures:[]; db.functions=Array.isArray(db.functions)?db.functions:[]; db.users=Array.isArray(db.users)?db.users:[];
    return db;
  }

  function loadPackage(pkg) {
    packageRef = pkg;
    baseline = normalizeState(pkg?.apps?.[APP_ID] || {});
    reset();
  }

  function resetUi() {
    ui.menu = null; ui.connectOpen = false; ui.connectionDraft = {}; ui.modalType = null; ui.notification = ""; ui.intelli = null;
    ui.boundaryTarget = null; ui.resultTab = "results"; ui.windowsDialogOpen = false; ui.propertiesDialog = null; ui.exportDialog = null; ui.copiedText = ""; ui.featurePanel=null;
    clearBoundary();
  }

  function reset() {
    state = normalizeState(baseline || {});
    resetUi();
    renderAll();
  }

  function applyTheme(value) {
    const dark = String(value).toLowerCase() === "dark" || value === true;
    document.body.classList.toggle("theme-dark", dark);
    document.body.classList.toggle("theme-light", !dark);
  }

  function renderAll() {
    if (!state) state = defaultState();
    refs.titleText.textContent = `${state.title || "SQL Server Management Studio"}${state.connected && state.connection?.serverName ? ` - ${state.connection.serverName}` : ""}`;
    renderDbSelect(); renderObjectTree(); renderTabs(); renderEditors(); renderResults(); renderStatus(); renderTransients();
    requestAnimationFrame(positionBoundary);
  }

  function renderDbSelect() {
    const names = state.databases.map(d=>d.name);
    if (!names.includes(state.currentDatabase)) names.unshift(state.currentDatabase || "master");
    refs.dbSelect.innerHTML = names.map(n=>`<option value="${esc(n)}" ${n===state.currentDatabase?"selected":""}>${esc(n)}</option>`).join("");
    refs.dbSelect.disabled = !state.connected;
  }

  function expanded(id) { return state.expandedNodes.includes(id); }
  function treeRow({id,label,icon="◻",level=0,hasChildren=false,meta="",dataAttrs=""}) {
    return `<div class="treeRow ${state.selectedObject===id?"selected":""}" data-node="${esc(id)}" ${dataAttrs} style="padding-left:${4+level*15}px"><span class="twisty">${hasChildren?(expanded(id)?"▾":"▸"):""}</span><span class="treeIcon">${icon}</span><span class="treeLabel">${esc(label)}</span>${meta?`<span class="treeMeta">${esc(meta)}</span>`:""}</div>`;
  }

  function renderObjectTree() {
    if (!state.objectExplorerVisible) { refs.leftPane.style.display="none"; refs.workspace.style.gridColumn="1 / -1"; return; }
    refs.leftPane.style.display="grid"; refs.workspace.style.gridColumn="auto";
    if (!state.connected) {
      refs.objectTree.innerHTML = treeRow({id:"connect-root",label:"Connect to a server...",icon:"🔌",level:0}); return;
    }
    let html = "";
    const server = state.connection?.serverName || "SQL Server";
    html += treeRow({id:"server",label:server,icon:"🖥",level:0,hasChildren:true,meta:state.connection?.authentication||""});
    if (expanded("server")) {
      html += treeRow({id:"databases",label:"Databases",icon:"🗄",level:1,hasChildren:true});
      if (expanded("databases")) {
        const systems = state.databases.filter(d=>d.system);
        const users = state.databases.filter(d=>!d.system);
        if (systems.length) {
          html += treeRow({id:"systemDatabases",label:"System Databases",icon:"📁",level:2,hasChildren:true});
          if (expanded("systemDatabases")) systems.forEach(db=>{html+=renderDatabaseNode(db,3);});
        }
        users.forEach(db=>{html+=renderDatabaseNode(db,2);});
      }
      html += treeRow({id:"security",label:"Security",icon:"🔐",level:1,hasChildren:true});
      if(expanded("security"))(state.logins||[]).forEach(l=>{html+=treeRow({id:`login:${l.name}`,label:l.name,icon:"👤",level:2,meta:l.type||"Login"});});
      html += treeRow({id:"serverObjects",label:"Server Objects",icon:"📦",level:1,hasChildren:true});
      if(expanded("serverObjects")){html+=treeRow({id:"linkedServers",label:"Linked Servers",icon:"🔗",level:2,hasChildren:(state.linkedServers||[]).length>0});if(expanded("linkedServers"))(state.linkedServers||[]).forEach(s=>{html+=treeRow({id:`linked:${s.name}`,label:s.name,icon:"🖥",level:3,meta:s.provider||""});});}
      html += treeRow({id:"replication",label:"Replication",icon:"⇄",level:1,hasChildren:true});
      html += treeRow({id:"alwaysOn",label:"Always On High Availability",icon:"∞",level:1,hasChildren:true});
      html += treeRow({id:"management",label:"Management",icon:"⚙",level:1,hasChildren:true});
      if(expanded("management")){html+=treeRow({id:"activityMonitor",label:"Activity Monitor",icon:"▥",level:2});html+=treeRow({id:"extendedEvents",label:"Extended Events",icon:"◉",level:2});}
      html += treeRow({id:"integration",label:"Integration Services Catalogs",icon:"◫",level:1,hasChildren:true});
      html += treeRow({id:"agent",label:"SQL Server Agent",icon:"▶",level:1,hasChildren:true,meta:state.connected?"Running":"Stopped"});
      if(expanded("agent")){html+=treeRow({id:"agentJobs",label:"Jobs",icon:"📁",level:2,hasChildren:(state.agentJobs||[]).length>0});if(expanded("agentJobs"))(state.agentJobs||[]).forEach(j=>{html+=treeRow({id:`agentjob:${j.name}`,label:j.name,icon:"⚙",level:3,meta:j.status||"Idle"});});html+=treeRow({id:"agentAlerts",label:"Alerts",icon:"📁",level:2,hasChildren:false});html+=treeRow({id:"agentOperators",label:"Operators",icon:"📁",level:2,hasChildren:false});}
    }
    refs.objectTree.innerHTML = html;
  }

  function renderDatabaseNode(db, level) {
    const did=`db:${db.name}`; let html=treeRow({id:did,label:db.name,icon:"🛢",level,hasChildren:true});
    if (expanded(did)) {
      const folders=["Database Diagrams","Tables","Views","External Resources","Synonyms","Programmability","Service Broker","Storage","Security"];
      for (const folder of folders) {
        const fid=`folder:${db.name}:${folder}`; const folderHas=folder==="Tables"||folder==="Views"||folder==="Programmability"||folder==="Security";
        html+=treeRow({id:fid,label:folder,icon:"📁",level:level+1,hasChildren:folderHas});
        if(folder==="Tables" && expanded(fid)){
          const tables=(state.objectExplorerCache && state.objectExplorerCache[db.name]) || db.tables || [];
          for(const t of tables){const label=`${t.schema||"dbo"}.${t.name}`,tid=`table:${db.name}:${label}`;html+=treeRow({id:tid,label,icon:"▦",level:level+2,hasChildren:true,dataAttrs:`data-table="${esc(label)}" data-db="${esc(db.name)}"`});if(expanded(tid)){const cats=["Columns","Keys","Constraints","Triggers","Indexes","Statistics"];for(const c of cats){const list=c==="Columns"?(t.columns||[]):c==="Keys"?(t.keys||[]):c==="Constraints"?(t.constraints||[]):c==="Triggers"?(t.triggers||[]):c==="Indexes"?(t.indexes||[]):c==="Statistics"?(t.statistics||[]):[];const cid=`tablecat:${db.name}:${label}:${c}`;html+=treeRow({id:cid,label:c,icon:"📁",level:level+3,hasChildren:list.length>0});if(list.length&&expanded(cid))list.forEach((x,j)=>{const name=typeof x==="string"?x:(x.name||x.column||`${c} ${j+1}`);const meta=c==="Columns"&&typeof x==="object"?` (${x.type||""}${x.nullable===false?", not null":""})`:"";html+=treeRow({id:`item:${db.name}:${label}:${c}:${name}`,label:name+meta,icon:c==="Columns"?"▤":"◇",level:level+4});});}}}
        } else if(folder==="Views" && expanded(fid)){for(const v of db.views||[])html+=treeRow({id:`view:${db.name}:${v.name||v}`,label:`${v.schema||"dbo"}.${v.name||v}`,icon:"◫",level:level+2});
        } else if(folder==="Programmability" && expanded(fid)){for(const [label,key,icon] of [["Stored Procedures","procedures","⚙"],["Functions","functions","ƒ"]]){const pid=`prog:${db.name}:${key}`;const list=db[key]||[];html+=treeRow({id:pid,label,icon:"📁",level:level+2,hasChildren:list.length>0});if(expanded(pid))for(const o of list)html+=treeRow({id:`${key}:${db.name}:${o.name||o}`,label:`${o.schema||"dbo"}.${o.name||o}`,icon,level:level+3});}
        } else if(folder==="Security" && expanded(fid)){const uid=`users:${db.name}`;html+=treeRow({id:uid,label:"Users",icon:"📁",level:level+2,hasChildren:(db.users||[]).length>0});if(expanded(uid))for(const u of db.users||[])html+=treeRow({id:`user:${db.name}:${u.name||u}`,label:u.name||u,icon:"👤",level:level+3});}
      }
    }
    return html;
  }

  function renderTabs() {
    if (!state.queryTabs.length) { refs.docTabs.innerHTML = `<div class="docTab active"><span class="name">Start Page</span></div>`; return; }
    refs.docTabs.innerHTML = state.queryTabs.map(t=>`<div class="docTab ${t.id===state.activeQueryId?"active":""}" data-tab="${esc(t.id)}"><span class="name">${esc(t.title)}${t.dirty?" *":""}</span><span class="x" data-close-tab="${esc(t.id)}">×</span></div>`).join("");
  }

  function sqlTokens(line) {
    const re = /(--.*$|'(?:''|[^'])*'|\b(?:SELECT|FROM|WHERE|CREATE|TABLE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|DROP|ALTER|USE|GO|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|AND|OR|NOT|NULL|PRIMARY|KEY|IDENTITY|INT|VARCHAR|NVARCHAR|DATETIME|DATE|DECIMAL|TOP|ORDER|BY|GROUP|HAVING|DISTINCT|COUNT|SUM|AVG|MIN|MAX|BEGIN|END|EXEC|EXECUTE|PROCEDURE|VIEW|DATABASE|SCHEMA|CONSTRAINT|INDEX|TRIGGER|MERGE|OUTPUT)\b|\b\d+(?:\.\d+)?\b)/gi;
    let out="", last=0, m;
    while((m=re.exec(line))){
      out+=esc(line.slice(last,m.index)); const tok=m[0]; let cls="ident";
      if(tok.startsWith("--")) cls="com"; else if(tok.startsWith("'")) cls="str"; else if(/^\d/.test(tok)) cls="num"; else cls="kw";
      out+=`<span class="${cls}">${esc(tok)}</span>`; last=m.index+tok.length;
      if(tok.startsWith("--")) break;
    }
    out+=esc(line.slice(last)); return out || "&nbsp;";
  }

  function renderEditors() {
    const tabs=state.queryTabs;
    if(!tabs.length){refs.queryGroups.className="queryGroups single";refs.queryGroups.innerHTML=`<div class="emptyWorkspace"><div class="emptyCard"><b>SQL Server Management Studio</b><p>Connect to a SQL Server, then select <b>New Query</b> to start writing Transact-SQL.</p></div></div>`;return;}
    refs.queryGroups.className=`queryGroups ${state.groupMode||"single"}`;
    let ids=[];
    if(state.groupMode==="single") ids=[state.activeQueryId];
    else {
      const a=state.groups.a.includes(state.activeQueryId)?state.activeQueryId:(state.groups.a[0]||state.activeQueryId);
      const b=state.groups.b.includes(state.activeQueryId)?state.activeQueryId:(state.groups.b[0]||tabs.find(t=>t.id!==a)?.id||a);
      ids=[a,b];
    }
    refs.queryGroups.innerHTML=ids.map((id,idx)=>renderQueryGroup(tabById(id),idx)).join("");
    renderIntelli();
  }

  function renderQueryGroup(tab, idx) {
    if(!tab) return `<div class="emptyWorkspace">No query window</div>`;
    const lineCount=Math.max(1,String(tab.sql||"").split("\n").length);const nums=Array.from({length:lineCount},(_,i)=>i+1).join("\n");
    return `<section class="queryGroup" data-query-group="${idx}"><div class="queryHead"><span class="qhTitle">${esc(tab.title)}</span><span class="qhMeta">${esc(tab.connectionName||state.connection?.serverName||"")} · ${esc(tab.database||state.currentDatabase||"")}</span></div><div class="codeViewport" data-code-viewport="${esc(tab.id)}"><div class="sqlEditorShell" data-editor-shell="${esc(tab.id)}"><pre class="sqlGutter" aria-hidden="true">${nums}</pre><textarea class="sqlTextarea" data-sql-editor="${esc(tab.id)}" spellcheck="false" wrap="off">${esc(tab.sql||"")}</textarea></div></div></section>`;
  }

  function renderResults() {
    const t=activeTab();
    refs.resultsPane.style.display=t?"grid":"none";
    document.querySelectorAll(".resultTab").forEach(b=>b.classList.toggle("active",b.dataset.resulttab===ui.resultTab));
    if(!t){refs.resultBody.innerHTML="";return;}
    if(ui.resultTab==="messages"){refs.resultBody.innerHTML=`<pre class="messages">${esc(t.result?.messages || t.status || "")}</pre>`;return;}
    if(ui.resultTab==="plan"){const plan=t.executionPlan||[];refs.resultBody.innerHTML=plan.length?`<div class="planView">${plan.map(op=>`<div class="planOp"><b>${esc(op.operator||op.name||"Operator")}</b><span class="planCost">Cost ${esc(op.cost??"")} · ${esc(op.object||"")}</span></div>`).join("")}</div>`:`<div class="fileResult smallNote">No execution plan. Use Display Estimated Execution Plan or Include Actual Execution Plan.</div>`;return;}
    if(ui.resultTab==="stats"){const s=t.clientStats||{};refs.resultBody.innerHTML=`<div class="clientStats">${Object.entries(s).map(([k,v])=>`<b>${esc(k)}</b><span>${esc(v)}</span>`).join("")||"No client statistics available."}</div>`;return;}
    const r=t.result||{};
    if(t.resultMode==="text"){
      const text=r.text || makeTextResult(r.columns||[],r.rows||[]);
      refs.resultBody.innerHTML=`<pre class="textResult">${esc(text || "")}</pre>`;
    } else if(t.resultMode==="file") {
      refs.resultBody.innerHTML=`<div class="fileResult"><div class="fileBadge">Results written to file: ${esc(r.file || "Choose a file when Execute runs")}</div></div>`;
    } else {
      const cols=r.columns||[]; const rows=r.rows||[];
      if(!cols.length){refs.resultBody.innerHTML=`<div class="fileResult smallNote">No result set.</div>`;return;}
      refs.resultBody.innerHTML=`<div class="gridWrap"><table class="resultGrid"><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr class="${t.selectedAll?"selected":""}">${cols.map((c,ci)=>`<td>${esc(Array.isArray(row)?row[ci]:row?.[c])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
  }

  function makeTextResult(columns, rows){
    if(!columns.length) return ""; const widths=columns.map((c,i)=>Math.max(String(c).length,...rows.map(r=>String(Array.isArray(r)?r[i]:r?.[c]??"").length)));
    const fmt=r=>columns.map((c,i)=>String(Array.isArray(r)?r[i]:r?.[c]??"").padEnd(widths[i])).join(" | ");
    return fmt(columns)+"\n"+widths.map(w=>"-".repeat(w)).join("-+-")+"\n"+rows.map(fmt).join("\n");
  }

  function renderStatus(){
    refs.statusLeft.textContent=state.statusText|| (state.connected?"Ready":"Disconnected"); refs.statusServer.textContent=state.connected?(state.connection?.serverName||"Connected"):"No server"; refs.statusDb.textContent=state.connected?(activeTab()?.database||state.currentDatabase||"master"):"No database"; refs.statusUser.textContent=state.connected?(state.currentUser||state.connection?.userName||state.connection?.authentication||""):"—";
  }

  function renderTransients(){
    renderMenu(); renderModal(); renderNotification(); renderIntelli();
  }

  function renderMenu(){
    document.querySelectorAll(".menuTop").forEach(b=>b.classList.toggle("active",ui.menu?.name===b.dataset.menu));
    if(!ui.menu){refs.menuPopup.classList.remove("show");return;}
    refs.menuPopup.innerHTML=(ui.menu.items||[]).map(i=>`<div class="menuItem">${esc(typeof i==="string"?i:i.label)}</div>`).join("");
    refs.menuPopup.classList.add("show");
    const btn=[...document.querySelectorAll(".menuTop")].find(b=>b.dataset.menu===ui.menu.name) || document.querySelector(`[data-target="${CSS.escape(ui.menu.target||"")}"]`);
    if(btn){const r=btn.getBoundingClientRect(); refs.menuPopup.style.left=`${Math.max(4,r.left)}px`;refs.menuPopup.style.top=`${r.bottom}px`;}
  }

  function renderModal(){
    let content="";
    if(ui.connectOpen){
      const d=Object.assign({},state.connection||{},ui.connectionDraft||{});
      content=`<div class="modalTitle">Connect to Server</div><div class="modalBody"><div class="connectLogo"><div class="connectMark">SQL</div><div><b>Connect to Server</b><div class="smallNote">Specify the SQL Server connection details.</div></div></div><div class="formGrid"><label>Server type:</label><select id="connServerType"><option>${esc(d.serverType||"Database Engine")}</option></select><label>Server name:</label><input id="connServerName" value="${esc(d.serverName||"")}"><label>Authentication:</label><select id="connAuthentication"><option>${esc(d.authentication||"Windows Authentication")}</option><option>SQL Server Authentication</option></select><label>User name:</label><input id="connUserName" value="${esc(d.userName||"")}"><label>Database:</label><input id="connDatabase" value="${esc(d.database||"master")}"></div></div><div class="modalActions"><button class="dialogBtn">Cancel</button><button class="dialogBtn primary" data-target="connectDialogButton">Connect</button></div>`;
    } else if(ui.featurePanel){
      const f=ui.featurePanel;content=`<div class="modalTitle">${esc(f.title||"SQL Server Management Studio")}</div><div class="modalBody featurePanel">${f.html||`<pre class="messages">${esc(f.text||"")}</pre>`}</div><div class="modalActions"><button class="dialogBtn primary">Close</button></div>`;
    } else if(ui.windowsDialogOpen){
      content=`<div class="modalTitle">Windows</div><div class="modalBody"><div class="smallNote" style="margin-bottom:8px">Open document windows</div><table class="resultGrid"><thead><tr><th>Window</th><th>Server</th><th>Database</th></tr></thead><tbody>${state.queryTabs.map(t=>`<tr data-window-tab="${esc(t.id)}"><td>${esc(t.title)}</td><td>${esc(t.connectionName||state.connection?.serverName||"")}</td><td>${esc(t.database||"")}</td></tr>`).join("")}</tbody></table></div><div class="modalActions"><button class="dialogBtn primary">Activate</button><button class="dialogBtn">Close</button></div>`;
    } else if(ui.propertiesDialog){
      const p=ui.propertiesDialog; content=`<div class="modalTitle">Properties - ${esc(p.title||"Object")}</div><div class="modalBody"><div class="formGrid">${Object.entries(p.properties||{}).map(([k,v])=>`<label>${esc(k)}</label><div>${esc(Array.isArray(v)?v.join(", "):v)}</div>`).join("")}</div></div><div class="modalActions"><button class="dialogBtn primary">OK</button></div>`;
    } else if(ui.exportDialog){
      content=`<div class="modalTitle">Save Results</div><div class="modalBody"><div class="formGrid"><label>File name:</label><input value="${esc(ui.exportDialog.path||"results.rpt")}"><label>Format:</label><div>${esc(ui.exportDialog.format||"RPT")}</div></div></div><div class="modalActions"><button class="dialogBtn">Cancel</button><button class="dialogBtn primary">Save</button></div>`;
    }
    if(content){refs.modal.innerHTML=content;refs.modalBackdrop.classList.add("show");}else{refs.modalBackdrop.classList.remove("show");refs.modal.innerHTML="";}
  }

  function renderNotification(){refs.notification.textContent=ui.notification||"";refs.notification.classList.toggle("show",!!ui.notification);}

  function renderIntelli(){
    if(!ui.intelli){refs.intelli.classList.remove("show");return;}
    refs.intelli.innerHTML=(ui.intelli.items||[]).map((x,i)=>`<div class="intelliItem ${i===(ui.intelli.index||0)?"active":""}"><span>${esc(typeof x==="string"?x:x.label)}</span><span class="intelliKind">${esc(typeof x==="object"?x.kind||"":"")}</span></div>`).join("");
    refs.intelli.classList.add("show");
    const vp=document.querySelector(`[data-code-viewport="${CSS.escape(state.activeQueryId||"")}"]`); if(vp){const r=vp.getBoundingClientRect();refs.intelli.style.left=`${Math.min(r.right-230,r.left+110)}px`;refs.intelli.style.top=`${Math.min(window.innerHeight-210,r.top+55)}px`;}
  }

  function clearTransients(){ui.menu=null;ui.notification="";ui.intelli=null;ui.windowsDialogOpen=false;ui.propertiesDialog=null;ui.exportDialog=null;}
  const CONNECTION_CHAIN = new Set(["openConnectDialog","setConnectionField","connectServer"]);
  function connectionContinuation(step){
    const a=step?.action||"",target=step?.data?.target;
    return CONNECTION_CHAIN.has(a) || ((a==="highlightTarget"||a==="pressButton") && target==="connectDialogButton");
  }
  function prepareReplayStep(step){
    clearBoundary(); const a=step?.action||"";
    if(!connectionContinuation(step)){ui.connectOpen=false;ui.connectionDraft={};}
    const keepIntelli=!!ui.intelli && (a==="acceptIntelliSense" || a==="highlightTarget" || a==="pressButton");
    const previousIntelli=keepIntelli?clone(ui.intelli):null;
    clearTransients();
    if(previousIntelli)ui.intelli=previousIntelli;
  }

  function resolveTarget(target){
    if(!target) return null;
    if(typeof target==="object"){
      if(target.type==="node") return document.querySelector(`[data-node="${CSS.escape(target.id||"")}"]`);
      if(target.type==="tab") return document.querySelector(`[data-tab="${CSS.escape(target.id||"")}"]`);
      if(target.type==="lineRange"){
        const start=document.querySelector(`[data-editor-tab="${CSS.escape(state.activeQueryId||"")}"][data-line="${Number(target.start||1)}"]`);
        const end=document.querySelector(`[data-editor-tab="${CSS.escape(state.activeQueryId||"")}"][data-line="${Number(target.end||target.start||1)}"]`);
        if(start&&end) return {range:[start,end]};
      }
      if(target.type==="table") return document.querySelector(`[data-node="table:${CSS.escape(target.database||state.currentDatabase)}:${CSS.escape(target.name||"")}"]`);
    }
    const map={
      connect:'[data-target="connect"]',newQuery:'[data-target="newQuery"]',open:'[data-target="open"]',save:'[data-target="save"]',execute:'[data-target="execute"]',parse:'[data-target="parse"]',cancel:'[data-target="cancel"]',grid:'[data-target="grid"]',text:'[data-target="text"]',file:'[data-target="file"]',database:'#dbSelect',objectExplorer:'#leftPane',objectTree:'#objectTree',editor:'.sqlEditorShell',results:'#resultsPane',messages:'[data-resulttab="messages"]',refreshObjectExplorer:'[data-target="refreshObjectExplorer"]',statusbar:'#statusbar',toolbar:'#toolbar',menubar:'#menubar',connectDialogButton:'[data-target="connectDialogButton"]'};
    if(map[target]) return document.querySelector(map[target]);
    return document.querySelector(`[data-node="${CSS.escape(String(target))}"]`) || document.querySelector(`[data-target="${CSS.escape(String(target))}"]`);
  }

  function showBoundary(target){if(!allowBoundary)return;clearBoundary();ui.boundaryTarget=clone(target);const el=resolveTarget(target);if(!el)return;if(el.range){for(const x of el.range)x.classList.add("sim-emphasis");}else el.classList?.add("sim-emphasis");}
  function clearBoundary(){ui.boundaryTarget=null;refs.boundary.classList.remove("show");document.querySelectorAll(".sim-emphasis").forEach(n=>n.classList.remove("sim-emphasis"));if(ui.boundaryFrame)cancelAnimationFrame(ui.boundaryFrame);ui.boundaryFrame=0;}
  function positionBoundary(){}

  function setExpanded(id,val=true){const set=new Set(state.expandedNodes);val?set.add(id):set.delete(id);state.expandedNodes=[...set];}
  function nextQueryId(){let n=1;while(tabById(`q${n}`))n++;return `q${n}`;}
  function nextQueryTitle(){let n=1;const titles=new Set(state.queryTabs.map(t=>t.title));while(titles.has(`SQLQuery${n}.sql`))n++;return `SQLQuery${n}.sql`;}
  function addTab(data={}){
    const id=data.id||nextQueryId(); const t=normalizeTab({id,title:data.title||data.fileName||nextQueryTitle(),database:data.database||state.currentDatabase||"master",connectionName:data.connectionName||state.connection?.serverName||"",sql:data.sql||"",savedPath:data.path||"",dirty:!!data.dirty,resultMode:data.resultMode||"grid"},state.queryTabs.length);
    state.queryTabs.push(t);state.activeQueryId=id;if(!state.groups.a.includes(id)&&!state.groups.b.includes(id))state.groups.a.push(id);return t;
  }
  function removeTab(id){state.queryTabs=state.queryTabs.filter(t=>t.id!==id);state.groups.a=state.groups.a.filter(x=>x!==id);state.groups.b=state.groups.b.filter(x=>x!==id);if(state.activeQueryId===id)state.activeQueryId=state.queryTabs[0]?.id||null;if(state.queryTabs.length<2){state.groupMode="single";state.groups.b=[];}}

  function syncObjectExplorerCache(){state.objectExplorerCache={};for(const db of state.databases||[])state.objectExplorerCache[db.name]=clone(db.tables||[]);state.objectExplorerStale=false;}

  function applyEffects(effects){
    for(const ef of effects||[]){
      if(ef.type==="createTable") createTableState(ef);
      else if(ef.type==="dropTable") dropTableState(ef.database||state.currentDatabase,ef.table||ef.name);
      else if(ef.type==="insertRows") insertRowsState(ef);
      else if(ef.type==="updateRows") updateRowsState(ef);
      else if(ef.type==="deleteRows") deleteRowsState(ef);
      else if(ef.type==="status") state.statusText=ef.text||ef.value||state.statusText;
    }
  }
  function createTableState(d){const db=ensureDb(d.database||state.currentDatabase);const schema=d.schema||"dbo",name=d.name||d.table||"NewTable";let t=tableByName(db.name,`${schema}.${name}`);if(!t){t={schema,name,columns:clone(d.columns||[]),rows:clone(d.rows||[]),keys:clone(d.keys||[]),constraints:[],indexes:[],triggers:[],statistics:[]};db.tables.push(t);} else {if(d.columns)t.columns=clone(d.columns);if(d.rows)t.rows=clone(d.rows);}state.objectExplorerStale=true;return t;}
  function insertRowsState(d){const t=tableByName(d.database||state.currentDatabase,d.table||d.name);if(!t)return 0;t.rows=Array.isArray(t.rows)?t.rows:[];const rows=Array.isArray(d.rows)?d.rows:[d.row||{}];t.rows.push(...clone(rows));return rows.length;}
  function matches(row,where){if(!where)return true;return Object.entries(where).every(([k,v])=>String(row?.[k])===String(v));}
  function updateRowsState(d){const t=tableByName(d.database||state.currentDatabase,d.table||d.name);if(!t)return 0;let c=0;for(const r of t.rows||[]){if(matches(r,d.where)){Object.assign(r,clone(d.values||{}));c++;}}return c;}
  function deleteRowsState(d){const t=tableByName(d.database||state.currentDatabase,d.table||d.name);if(!t)return 0;const before=(t.rows||[]).length;t.rows=(t.rows||[]).filter(r=>!matches(r,d.where));return before-t.rows.length;}
  function dropTableState(database,tableName){const db=dbByName(database);if(!db)return false;const before=db.tables.length;db.tables=db.tables.filter(t=>norm(`${t.schema||"dbo"}.${t.name}`)!==norm(tableName)&&norm(t.name)!==norm(tableName));const changed=db.tables.length<before;if(changed)state.objectExplorerStale=true;return changed;}

  function stripIdent(s){return String(s||"").trim().replace(/^\[|\]$/g,"").replace(/^dbo\./i,"").replace(/[\[\]]/g,"")}
  function splitCsv(s){const out=[];let q=false,buf="",depth=0;for(const ch of String(s||"")){if(ch==="'")q=!q;if(!q&&ch==="(")depth++;if(!q&&ch===")")depth--;if(ch===","&&!q&&depth===0){out.push(buf.trim());buf=""}else buf+=ch;}if(buf.trim())out.push(buf.trim());return out}
  function sqlValue(v){v=String(v??"").trim();if(/^null$/i.test(v))return null;if(/^n?'.*'$/is.test(v))return v.replace(/^N?'/i,"").replace(/'$/," ").trimEnd().replace(/''/g,"'");if(/^[-+]?\d+(\.\d+)?$/.test(v))return Number(v);return stripIdent(v)}
  function parseWhere(text){const m=String(text||"").trim().match(/^\[?([\w]+)\]?\s*=\s*(.+)$/i);return m?{[m[1]]:sqlValue(m[2])}:null}
  function estimatePlan(sql,table){const s=String(sql).toLowerCase();const indexed=(table?.indexes||[]).length>0;const plan=[];if(s.includes("join"))plan.push({operator:indexed?"Index Seek":"Table Scan",cost:"18%",object:table?.name||""},{operator:"Nested Loops",cost:"34%",object:"Join"});else plan.push({operator:indexed?"Index Seek":"Clustered Index Scan",cost:indexed?"24%":"72%",object:table?.name||""});if(/order\s+by/i.test(sql))plan.push({operator:"Sort",cost:"18%",object:""});plan.push({operator:"SELECT",cost:"0%",object:""});return plan}
  function executeVirtualSql(tab,sql){
    let db=ensureDb(tab.database||state.currentDatabase||"master"),last={columns:[],rows:[],messages:"Command(s) completed successfully."},affected=0;
    const batches=String(sql||"").split(/^\s*GO\s*$/gim).flatMap(b=>b.split(/;(?=(?:[^']*'[^']*')*[^']*$)/)).map(s=>s.trim()).filter(Boolean);
    for(const stmt0 of batches){let stmt=stmt0.trim();let m;
      if((m=stmt.match(/^USE\s+\[?([\w-]+)\]?/i))){db=ensureDb(m[1]);tab.database=db.name;state.currentDatabase=db.name;last.messages=`Changed database context to '${db.name}'.`;continue;}
      if(/^BEGIN\s+TRAN/i.test(stmt)){if(!state.transactionSnapshot)state.transactionSnapshot=clone(state.databases);last.messages="The transaction has begun.";continue;}
      if(/^COMMIT/i.test(stmt)){state.transactionSnapshot=null;last.messages="The transaction has been committed.";continue;}
      if(/^ROLLBACK/i.test(stmt)){if(state.transactionSnapshot){state.databases=clone(state.transactionSnapshot);state.transactionSnapshot=null;syncObjectExplorerCache();}last.messages="The transaction has been rolled back.";continue;}
      if((m=stmt.match(/^SET\s+STATISTICS\s+IO\s+(ON|OFF)/i))){state.statisticsIo=m[1].toUpperCase()==="ON";continue;}
      if((m=stmt.match(/^SET\s+STATISTICS\s+TIME\s+(ON|OFF)/i))){state.statisticsTime=m[1].toUpperCase()==="ON";continue;}
      if((m=stmt.match(/^CREATE\s+TABLE\s+([\[\]\w.]+)\s*\(([\s\S]+)\)$/i))){const full=stripIdent(m[1]),parts=full.split("."),schema=parts.length>1?parts[0]:"dbo",name=parts.at(-1),defs=splitCsv(m[2]),cols=[],keys=[],constraints=[];for(const def of defs){if(/^CONSTRAINT\b|^PRIMARY\s+KEY/i.test(def)){constraints.push({name:(def.match(/CONSTRAINT\s+\[?([\w-]+)/i)||[])[1]||"PK_"+name,type:/FOREIGN/i.test(def)?"FOREIGN KEY":"PRIMARY KEY"});continue;}const cm=def.match(/^\[?([\w]+)\]?\s+([\w]+(?:\s*\([^)]*\))?)([\s\S]*)$/i);if(cm){cols.push({name:cm[1],type:cm[2].replace(/\s+/g," "),nullable:!/NOT\s+NULL/i.test(cm[3])});if(/PRIMARY\s+KEY/i.test(cm[3]))keys.push({name:`PK_${name}`,column:cm[1]});}}createTableState({database:db.name,schema,name,columns:cols,keys,constraints});affected=0;last.messages="Command(s) completed successfully.";continue;}
      if((m=stmt.match(/^DROP\s+TABLE(?:\s+IF\s+EXISTS)?\s+([\[\]\w.]+)/i))){dropTableState(db.name,stripIdent(m[1]));last.messages="Command(s) completed successfully.";continue;}
      if((m=stmt.match(/^CREATE\s+(?:UNIQUE\s+)?INDEX\s+\[?([\w-]+)\]?\s+ON\s+([\[\]\w.]+)\s*\(([^)]+)\)/i))){const t=tableByName(db.name,stripIdent(m[2]));if(t){t.indexes=t.indexes||[];t.indexes.push({name:m[1],columns:splitCsv(m[3]).map(stripIdent)});state.objectExplorerStale=true;}last.messages="Command(s) completed successfully.";continue;}
      if((m=stmt.match(/^CREATE\s+VIEW\s+([\[\]\w.]+)\s+AS\s+([\s\S]+)/i))){const name=stripIdent(m[1]).split(".").at(-1);db.views.push({schema:"dbo",name,sql:m[2]});last.messages="Command(s) completed successfully.";continue;}
      if((m=stmt.match(/^CREATE\s+(?:OR\s+ALTER\s+)?PROC(?:EDURE)?\s+([\[\]\w.]+)/i))){const name=stripIdent(m[1]).split(".").at(-1);db.procedures.push({schema:"dbo",name,sql:stmt});last.messages="Command(s) completed successfully.";continue;}
      if((m=stmt.match(/^CREATE\s+(?:OR\s+ALTER\s+)?FUNCTION\s+([\[\]\w.]+)/i))){const name=stripIdent(m[1]).split(".").at(-1);db.functions.push({schema:"dbo",name,sql:stmt});last.messages="Command(s) completed successfully.";continue;}
      if((m=stmt.match(/^INSERT\s+INTO\s+([\[\]\w.]+)\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+)/i))){const t=tableByName(db.name,stripIdent(m[1]));if(!t){last.messages=`Invalid object name '${stripIdent(m[1])}'.`;continue;}const cols=splitCsv(m[2]).map(stripIdent),groups=[...m[3].matchAll(/\(([^()]*)\)/g)],rows=groups.map(g=>{const vals=splitCsv(g[1]).map(sqlValue),r={};cols.forEach((c,i)=>r[c]=vals[i]);return r});affected=insertRowsState({database:db.name,table:`${t.schema||"dbo"}.${t.name}`,rows});last.messages=`(${affected} row(s) affected)`;continue;}
      if((m=stmt.match(/^UPDATE\s+([\[\]\w.]+)\s+SET\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+))?$/i))){const t=tableByName(db.name,stripIdent(m[1]));if(!t){last.messages=`Invalid object name '${stripIdent(m[1])}'.`;continue;}const vals={};for(const x of splitCsv(m[2])){const kv=x.split("=");vals[stripIdent(kv[0])]=sqlValue(kv.slice(1).join("="));}affected=updateRowsState({database:db.name,table:`${t.schema||"dbo"}.${t.name}`,values:vals,where:parseWhere(m[3])});last.messages=`(${affected} row(s) affected)`;continue;}
      if((m=stmt.match(/^DELETE\s+FROM\s+([\[\]\w.]+)(?:\s+WHERE\s+([\s\S]+))?$/i))){const t=tableByName(db.name,stripIdent(m[1]));if(!t){last.messages=`Invalid object name '${stripIdent(m[1])}'.`;continue;}affected=deleteRowsState({database:db.name,table:`${t.schema||"dbo"}.${t.name}`,where:parseWhere(m[2])});last.messages=`(${affected} row(s) affected)`;continue;}
      if((m=stmt.match(/^SELECT\s+([\s\S]+?)\s+FROM\s+([\[\]\w.]+)(?:\s+WHERE\s+([^;]+))?/i))){const t=tableByName(db.name,stripIdent(m[2]));if(!t){last={columns:[],rows:[],messages:`Invalid object name '${stripIdent(m[2])}'.`};continue;}let rows=clone(t.rows||[]);const where=parseWhere(m[3]);if(where)rows=rows.filter(r=>matches(r,where));const topm=stmt.match(/^SELECT\s+TOP\s*\(?\s*(\d+)/i);if(topm)rows=rows.slice(0,Number(topm[1]));let colText=m[1].replace(/^TOP\s*\(?\s*\d+\s*\)?\s+/i,"").trim();if(/^COUNT\s*\(\s*\*\s*\)/i.test(colText)){last={columns:["count"],rows:[{count:rows.length}],messages:"(1 row affected)"};}else{const cols=colText==="*"?(t.columns||[]).map(c=>c.name):splitCsv(colText).map(x=>stripIdent(x.split(/\s+AS\s+/i)[0].split(".").at(-1)));last={columns:cols,rows:rows.map(r=>{const o={};cols.forEach(c=>o[c]=r[c]);return o}),messages:`(${rows.length} row(s) affected)`};}tab.executionPlan=estimatePlan(stmt,t);continue;}
      if(/^EXEC(?:UTE)?\b/i.test(stmt)){last.messages="Command(s) completed successfully.";continue;}
      last.messages=`Incorrect syntax near '${stmt.split(/\s+/)[0]||"statement"}'.`;
    }
    syncObjectExplorerCache();tab.clientStats={"Client processing time":"1 ms","Total execution time":"3 ms","Bytes received":String(JSON.stringify(last.rows||[]).length),"Rows returned":String((last.rows||[]).length)};if(state.statisticsIo)last.messages+=`\\nTable scan count 1, logical reads ${Math.max(1,(last.rows||[]).length)}.`;if(state.statisticsTime)last.messages+=`\\nSQL Server Execution Times: CPU time = 0 ms, elapsed time = 1 ms.`;return last;
  }

  function scriptForObject(d){
    const db=d.database||state.currentDatabase, table=tableByName(db,d.table||d.name); if(!table)return d.sql||""; const full=`[${table.schema||"dbo"}].[${table.name}]`;const op=String(d.operation||"select").toLowerCase();const cols=(table.columns||[]).map(c=>`    [${c.name}] ${c.type||"nvarchar(100)"}${c.nullable===false?" NOT NULL":" NULL"}`).join(",\n");
    if(op==="create")return `USE [${db}]\nGO\n\nCREATE TABLE ${full}(\n${cols}\n)\nGO`;
    if(op==="alter")return `USE [${db}]\nGO\n\nALTER TABLE ${full}\nADD [new_column] nvarchar(100) NULL\nGO`;
    if(op==="drop")return `USE [${db}]\nGO\n\nDROP TABLE ${full}\nGO`;
    if(op==="drop and create")return `USE [${db}]\nGO\n\nDROP TABLE IF EXISTS ${full}\nGO\n\nCREATE TABLE ${full}(\n${cols}\n)\nGO`;
    if(op==="insert")return `INSERT INTO ${full} (${(table.columns||[]).map(c=>`[${c.name}]`).join(", ")})\nVALUES (${(table.columns||[]).map(()=>"<value>").join(", ")})`;
    if(op==="update")return `UPDATE ${full}\nSET [column_name] = <value>\nWHERE <Search Conditions,,>`;
    if(op==="delete")return `DELETE FROM ${full}\nWHERE <Search Conditions,,>`;
    return `SELECT ${(table.columns||[]).map(c=>`[${c.name}]`).join(",\n       ")}\nFROM ${full}`;
  }

  async function animateSql(tab,newSql,token){
    const full=String(newSql??""); if(!autoType){tab.sql=full;tab.dirty=true;renderAll();return;}
    ui.typingTab=tab.id;tab.sql=""; const steps=Math.min(full.length,60),chunk=Math.max(1,Math.ceil(full.length/steps)); const delay=Math.min(16,Math.max(4,800/Math.max(1,Math.ceil(full.length/chunk))));
    for(let i=0;i<full.length;i+=chunk){if(token!==seekToken)return;tab.sql=full.slice(0,Math.min(full.length,i+chunk));tab.dirty=true;renderAll();await sleep(delay);}tab.sql=full;ui.typingTab=null;renderAll();
  }

  async function applyStep(step, animate, token) {
    if(token!==seekToken) return;
    const d=step?.data||{}; const action=step?.action||""; let t=activeTab();
    switch(action){
      case "openMenu": ui.menu={name:d.name||d.menu||"File",target:d.target,items:d.items||d.entries||[]}; break;
      case "pressButton": if(d.status)state.statusText=d.status; if(d.target)showBoundary(d.target); break;
      case "highlightTarget": showBoundary(d.target); break;
      case "showNotification": ui.notification=d.text||d.message||d.title||"Notification"; break;
      case "setView": state.activeView=d.view||d.name||"query"; if(d.objectExplorerVisible!==undefined)state.objectExplorerVisible=!!d.objectExplorerVisible; break;

      case "openConnectDialog": ui.connectOpen=true;ui.connectionDraft=Object.assign({},state.connection||{},d.connection||d);break;
      case "setConnectionField": ui.connectOpen=true;ui.connectionDraft=Object.assign({},ui.connectionDraft||{});ui.connectionDraft[d.field]=d.value;break;
      case "connectServer": state.connection=Object.assign({},state.connection||{},ui.connectionDraft||{},d.connection||{},d);state.connected=true;state.currentDatabase=d.database||state.connection.database||state.currentDatabase||"master";state.currentUser=d.userName||d.user||state.connection.userName||state.connection.authentication||"";state.statusText=d.statusText||"Ready";ui.connectOpen=false;ui.connectionDraft={};setExpanded("server",true);if(d.expandDatabases)setExpanded("databases",true);break;
      case "disconnectServer": state.connected=false;state.statusText=d.statusText||"Disconnected";state.selectedObject=null;break;
      case "changeDatabase": state.currentDatabase=d.database||d.name||state.currentDatabase;if(t)t.database=state.currentDatabase;break;

      case "openObjectExplorer": state.objectExplorerVisible=true;if(d.expandServer)setExpanded("server",true);break;
      case "expandNode": setExpanded(d.id||d.node,true);state.selectedObject=d.select?(d.id||d.node):state.selectedObject;break;
      case "collapseNode": setExpanded(d.id||d.node,false);break;
      case "refreshObjectExplorer": syncObjectExplorerCache();state.lastRefresh=d.time||"just now";state.statusText=d.statusText||"Object Explorer refreshed";break;
      case "refreshNode": syncObjectExplorerCache();state.lastRefresh=d.time||"just now";if(d.id||d.node)state.selectedObject=d.id||d.node;state.statusText=d.statusText||"Refresh complete";break;
      case "selectObject": state.selectedObject=d.id||d.node||null;break;
      case "openObject": {
        state.selectedObject=d.id||d.node||state.selectedObject;
        if(d.table){const tb=tableByName(d.database||state.currentDatabase,d.table);const nt=addTab({title:d.title||`SQLQuery${state.queryTabs.length+1}.sql`,database:d.database||state.currentDatabase,sql:d.sql||`SELECT TOP (1000) *\nFROM [${d.database||state.currentDatabase}].[${tb?.schema||"dbo"}].[${tb?.name||d.table}]`}); if(d.execute&&tb){nt.result={columns:(tb.columns||[]).map(c=>c.name),rows:clone(tb.rows||[]),messages:`${(tb.rows||[]).length} row(s)`};}}
        break;
      }
      case "showObjectProperties": ui.propertiesDialog={title:d.title||d.object||state.selectedObject||"Object",properties:d.properties||{Name:d.object||state.selectedObject||"",Database:d.database||state.currentDatabase,Server:state.connection?.serverName||""}};break;

      case "newQuery": addTab(d);break;
      case "switchQueryTab": if(tabById(d.id||d.tab))state.activeQueryId=d.id||d.tab;break;
      case "closeQueryTab": removeTab(d.id||d.tab||state.activeQueryId);break;
      case "closeAllQueries": state.queryTabs=[];state.activeQueryId=null;state.groups={a:[],b:[]};state.groupMode="single";break;
      case "setSql": t=t||addTab(d);t.sql=String(d.sql??d.text??"");t.dirty=d.dirty!==false;t.selection=null;t.syntaxErrors=[];break;
      case "typeSql": t=t||addTab(d);if(animate)await animateSql(t,d.sql??d.text??"",token);else{t.sql=String(d.sql??d.text??"");t.dirty=true;}if(d.boundary){const lines=String(t.sql).split("\n").length;showBoundary({type:"lineRange",start:d.startLine||1,end:d.endLine||lines});}break;
      case "appendSql": t=t||addTab(d);{const app=String(d.sql??d.text??"");const newSql=(t.sql||"")+app;if(animate)await animateSql(t,newSql,token);else{t.sql=newSql;t.dirty=true;}}break;
      case "selectSqlRange": if(t)t.selection={startLine:Number(d.startLine||1),endLine:Number(d.endLine||d.startLine||1)};break;
      case "clearSelection": if(t)t.selection=null;break;
      case "executeQuery": case "executeSqlText": if(t){applyEffects(d.effects);if(d.result||d.columns||d.rows||d.messages!==undefined){if(d.result)t.result=Object.assign({},t.result||{},clone(d.result));else if(d.columns||d.rows)t.result=Object.assign({},t.result||{},{columns:clone(d.columns||[]),rows:clone(d.rows||[])});if(d.messages!==undefined)t.result.messages=String(d.messages);}else t.result=Object.assign(t.result||{},executeVirtualSql(t,d.sql!==undefined?String(d.sql):t.sql));if(t.resultMode==="file"&&d.file)t.result.file=d.file;t.status=d.status||"Query executed";state.statusText=d.statusText||"Query executed successfully";ui.resultTab=d.showTab||((t.result?.columns||[]).length?"results":"messages");}break;
      case "cancelQuery": if(t){t.status="Query cancelled by user";t.result.messages=d.messages||"Query cancelled by user.";}state.statusText="Query cancelled";ui.resultTab="messages";break;
      case "parseQuery": if(t){t.result.messages=d.messages||"Command(s) completed successfully.";t.status=d.success===false?"Parse failed":"Parse successful";if(d.errors)t.syntaxErrors=clone(d.errors);}state.statusText=d.success===false?"Parse failed":"Parse successful";ui.resultTab="messages";break;
      case "changeQueryDatabase": if(t)t.database=d.database||d.name||t.database;state.currentDatabase=d.database||d.name||state.currentDatabase;break;

      case "showResults": ui.resultTab="results";break;
      case "showMessages": ui.resultTab="messages";break;
      case "setResultsMode": if(t)t.resultMode=d.mode||"grid";ui.resultTab="results";break;
      case "exportResults": if(t){t.result.file=d.path||d.file||"results.rpt";ui.exportDialog={path:t.result.file,format:d.format||"RPT"};}break;
      case "selectAllResults": if(t)t.selectedAll=true;break;
      case "copyResults": if(t){ui.copiedText=makeTextResult(t.result?.columns||[],t.result?.rows||[]).split("\n").slice(2).join("\n");state.statusText="Results copied";}break;
      case "copyResultsWithHeaders": if(t){ui.copiedText=makeTextResult(t.result?.columns||[],t.result?.rows||[]);state.statusText="Results copied with headers";}break;
      case "clearResults": if(t){t.result={columns:[],rows:[],text:"",file:"",messages:""};t.selectedAll=false;}break;

      case "showIntelliSense": ui.intelli={items:clone(d.items||state.intellisenseCache||[]),index:Number(d.index||0)};break;
      case "acceptIntelliSense": if(t){const value=d.value||d.text||(ui.intelli?.items?.[ui.intelli.index||0]?.label??ui.intelli?.items?.[ui.intelli.index||0]??"");if(d.replaceSuffix){t.sql=t.sql.replace(new RegExp(`${escapeRegex(d.replaceSuffix)}$`),String(value));}else t.sql+=String(value);t.dirty=true;}ui.intelli=null;break;
      case "refreshIntelliSenseCache": state.intellisenseCache=clone(d.items||state.intellisenseCache||[]);if(d.clearErrors!==false&&t)t.syntaxErrors=[];state.statusText=d.statusText||"IntelliSense local cache refreshed";break;
      case "showSyntaxError": if(t)t.syntaxErrors.push({line:Number(d.line||1),contains:d.contains||"",message:d.message||"Incorrect syntax"});break;
      case "clearSyntaxErrors": if(t)t.syntaxErrors=[];break;

      case "scriptObjectAs": {const sql=d.sql||scriptForObject(d);const nt=addTab({title:d.title||`${String(d.operation||"select").replace(/\s+/g,"_")}_${String(d.table||d.name||"object").replace(/[^a-z0-9_]+/gi,"_")}.sql`,database:d.database||state.currentDatabase,sql});if(d.destination==="file"){nt.savedPath=d.path||nt.title;state.files[nt.savedPath]=sql;}break;}
      case "createTable": createTableState(d);state.statusText=d.statusText||"Command(s) completed successfully.";break;
      case "insertRows": {const c=insertRowsState(d);state.statusText=d.statusText||`${c} row(s) affected`;break;}
      case "updateRows": {const c=updateRowsState(d);state.statusText=d.statusText||`${c} row(s) affected`;break;}
      case "deleteRows": {const c=deleteRowsState(d);state.statusText=d.statusText||`${c} row(s) affected`;break;}
      case "dropTable": dropTableState(d.database||state.currentDatabase,d.table||d.name);state.statusText=d.statusText||"Command(s) completed successfully.";break;


      case "beginTransaction": if(!state.transactionSnapshot)state.transactionSnapshot=clone(state.databases);state.statusText="Transaction started";break;
      case "commitTransaction": state.transactionSnapshot=null;state.statusText="Transaction committed";break;
      case "rollbackTransaction": if(state.transactionSnapshot){state.databases=clone(state.transactionSnapshot);state.transactionSnapshot=null;syncObjectExplorerCache();}state.statusText="Transaction rolled back";break;
      case "createIndex": {const tb=tableByName(d.database||state.currentDatabase,d.table);if(tb){tb.indexes=tb.indexes||[];tb.indexes.push({name:d.name||"IX_New",columns:clone(d.columns||[]),unique:!!d.unique});state.objectExplorerStale=true;}break;}
      case "createView": {const db=ensureDb(d.database||state.currentDatabase);db.views.push({schema:d.schema||"dbo",name:d.name||"NewView",sql:d.sql||""});break;}
      case "createProcedure": {const db=ensureDb(d.database||state.currentDatabase);db.procedures.push({schema:d.schema||"dbo",name:d.name||"NewProcedure",sql:d.sql||""});break;}
      case "createFunction": {const db=ensureDb(d.database||state.currentDatabase);db.functions.push({schema:d.schema||"dbo",name:d.name||"NewFunction",sql:d.sql||""});break;}
      case "createTrigger": {const tb=tableByName(d.database||state.currentDatabase,d.table);if(tb){tb.triggers=tb.triggers||[];tb.triggers.push({name:d.name||"NewTrigger",sql:d.sql||""});}break;}
      case "addConstraint": {const tb=tableByName(d.database||state.currentDatabase,d.table);if(tb){tb.constraints=tb.constraints||[];tb.constraints.push(clone(d.constraint||d));}break;}
      case "showEstimatedExecutionPlan": case "showActualExecutionPlan": if(t){const tb=tableByName(t.database||state.currentDatabase,d.table||((t.sql.match(/FROM\s+([\[\]\w.]+)/i)||[])[1]||""));t.executionPlan=clone(d.plan||estimatePlan(t.sql,tb));ui.resultTab="plan";state.statusText=action==="showActualExecutionPlan"?"Actual execution plan included":"Estimated execution plan displayed";}break;
      case "showClientStatistics": if(t){t.clientStats=Object.assign({"Client processing time":"1 ms","Total execution time":"3 ms","Rows returned":String(t.result?.rows?.length||0)},d.stats||{});ui.resultTab="stats";}break;
      case "setStatisticsIo": state.statisticsIo=d.enabled!==false;break;
      case "setStatisticsTime": state.statisticsTime=d.enabled!==false;break;
      case "openActivityMonitor": ui.featurePanel={title:"Activity Monitor",html:`<table class="featureTable"><thead><tr><th>Session ID</th><th>Login</th><th>Status</th><th>Command</th><th>Database</th></tr></thead><tbody>${(state.sessions||[]).map(s=>`<tr><td>${esc(s.id||s.sessionId)}</td><td>${esc(s.login||s.user||"")}</td><td>${esc(s.status||"")}</td><td>${esc(s.command||"")}</td><td>${esc(s.database||"")}</td></tr>`).join("")}</tbody></table>`};break;
      case "setSessions": state.sessions=clone(d.sessions||[]);break;
      case "killSession": state.sessions=(state.sessions||[]).filter(s=>String(s.id||s.sessionId)!==String(d.id||d.sessionId));state.statusText=`Session ${d.id||d.sessionId} killed`;break;
      case "openBackupDialog": ui.featurePanel={title:"Back Up Database",text:`Database: ${d.database||state.currentDatabase}\nBackup type: ${d.type||"Full"}\nDestination: ${d.path||"Disk"}`};break;
      case "backupDatabase": state.backups.push({database:d.database||state.currentDatabase,type:d.type||"Full",path:d.path||`${d.database||state.currentDatabase}.bak`,time:d.time||"just now"});state.statusText="The backup of database completed successfully.";break;
      case "openRestoreDialog": ui.featurePanel={title:"Restore Database",text:`Source: ${d.path||"backup.bak"}\nDestination: ${d.database||state.currentDatabase}`};break;
      case "restoreDatabase": ensureDb(d.database||state.currentDatabase);state.statusText="Database restored successfully.";break;
      case "openSqlServerAgent": ui.featurePanel={title:"SQL Server Agent",html:`<table class="featureTable"><thead><tr><th>Job</th><th>Status</th><th>Last run</th></tr></thead><tbody>${(state.agentJobs||[]).map(j=>`<tr><td>${esc(j.name)}</td><td>${esc(j.status||"Idle")}</td><td>${esc(j.lastRun||"")}</td></tr>`).join("")}</tbody></table>`};break;
      case "createAgentJob": state.agentJobs.push({name:d.name||"New Job",status:"Idle",steps:clone(d.steps||[]),lastRun:"Never"});break;
      case "runAgentJob": {const j=(state.agentJobs||[]).find(x=>x.name===d.name);if(j){j.status="Succeeded";j.lastRun=d.time||"just now";state.agentJobHistory.push({job:j.name,time:j.lastRun,status:"Succeeded",duration:d.duration||"00:00:01"});}state.statusText="Job completed successfully";break;}
      case "showTableDesigner": ui.featurePanel={title:`Table Designer - ${d.table||"Table"}`,text:d.text||"Columns | Data Type | Allow Nulls\nUse the designer to edit table metadata."};break;
      case "editTopRows": {const tb=tableByName(d.database||state.currentDatabase,d.table);if(tb){const nt=addTab({title:`Edit ${d.top||200} Rows - ${tb.name}`,database:d.database||state.currentDatabase,sql:`SELECT TOP (${d.top||200}) * FROM [${tb.schema||"dbo"}].[${tb.name}]`});nt.result={columns:(tb.columns||[]).map(c=>c.name),rows:clone((tb.rows||[]).slice(0,d.top||200)),messages:`${Math.min((tb.rows||[]).length,d.top||200)} row(s)`};}}break;
      case "generateScripts": ui.featurePanel={title:"Generate Scripts",text:d.text||"Choose objects → Set scripting options → Review summary → Generate"};break;
      case "importData": state.statusText=`Imported ${d.rows||0} row(s)`;break;
      case "exportData": state.statusText=`Export completed: ${d.path||"output.csv"}`;break;
      case "createLogin": state.logins.push({name:d.name||d.login,type:d.type||"SQL Login",roles:clone(d.roles||[])});break;
      case "createUser": {const db=ensureDb(d.database||state.currentDatabase);db.users.push({name:d.name||d.user,login:d.login||d.name});break;}
      case "grantPermission": state.permissions.push(clone(d));state.statusText="Permission granted";break;
      case "schemaCompare": ui.featurePanel={title:"Schema Compare",text:d.text||`Source: ${d.source||"Database A"}\nTarget: ${d.target||"Database B"}\nDifferences: ${d.differences||0}`};break;
      case "showQueryStore": ui.featurePanel={title:"Query Store",text:d.text||"Top Resource Consuming Queries\nRegressed Queries\nQuery Wait Statistics"};break;
      case "showProfiler": ui.featurePanel={title:"SQL Server Profiler",text:d.text||"Trace running: RPC:Completed, SQL:BatchCompleted"};break;
      case "showExtendedEvents": ui.featurePanel={title:"Extended Events",text:d.text||"Session: system_health\nEvents: error_reported, xml_deadlock_report"};break;
      case "createAgentSchedule": {const j=(state.agentJobs||[]).find(x=>x.name===d.job||x.name===d.name);if(j){j.schedules=j.schedules||[];j.schedules.push({name:d.schedule||"Daily",frequency:d.frequency||"Daily",time:d.time||"02:00"});}state.statusText="Job schedule saved";break;}
      case "showAgentJobHistory": ui.featurePanel={title:"Job History",html:`<table class="featureTable"><thead><tr><th>Job</th><th>Run</th><th>Status</th><th>Duration</th></tr></thead><tbody>${(state.agentJobHistory||[]).map(h=>`<tr><td>${esc(h.job)}</td><td>${esc(h.time||"")}</td><td>${esc(h.status||"Succeeded")}</td><td>${esc(h.duration||"00:00:01")}</td></tr>`).join("")}</tbody></table>`};break;
      case "addLinkedServer": state.linkedServers.push({name:d.name||"REMOTE_SQL",provider:d.provider||"SQL Server",dataSource:d.dataSource||d.name||""});state.statusText="Linked server added";break;
      case "openRegisteredServers": ui.featurePanel={title:"Registered Servers",html:`<table class="featureTable"><thead><tr><th>Name</th><th>Server</th><th>Group</th></tr></thead><tbody>${(state.registeredServers||[]).map(s=>`<tr><td>${esc(s.name)}</td><td>${esc(s.server||s.name)}</td><td>${esc(s.group||"Local Server Groups")}</td></tr>`).join("")}</tbody></table>`};break;
      case "showObjectExplorerDetails": ui.featurePanel={title:"Object Explorer Details",text:d.text||`Selected: ${state.selectedObject||"server"}\nDatabase: ${state.currentDatabase}\nObjects: ${(dbByName(state.currentDatabase)?.tables||[]).length} table(s)`};break;
      case "createDatabaseDiagram": ui.featurePanel={title:`Database Diagram - ${d.name||"Java Model"}`,text:d.text||`Tables: ${(d.tables||[]).join(", ")||"dbo.student"}\nRelationships: ${d.relationships||0}`};break;
      case "openOptions": ui.featurePanel={title:"Options",text:`Text Editor > Transact-SQL\nLine numbers: ${state.options.lineNumbers?"On":"Off"}\nWord wrap: ${state.options.wordWrap?"On":"Off"}\nInclude actual execution plan: ${state.options.includeActualPlan?"On":"Off"}`};break;
      case "setEditorOption": if(d.name)state.options[d.name]=d.value;state.statusText="Options updated";break;

      case "saveQuery": if(t){const path=d.path||t.savedPath||t.title;t.savedPath=path;t.title=d.fileName||path.split(/[\\/]/).pop()||t.title;t.dirty=false;state.files[path]=t.sql;state.statusText="Query saved";}break;
      case "saveQueryAs": if(t){const path=d.path||d.file||"query.sql";t.savedPath=path;t.title=d.fileName||path.split(/[\\/]/).pop();t.dirty=false;state.files[path]=t.sql;state.statusText="Query saved";}break;
      case "openSqlFile": {const path=d.path||d.file||"query.sql";const sql=d.sql!==undefined?d.sql:(state.files[path]||"");addTab({id:d.id,title:d.fileName||path.split(/[\\/]/).pop(),path,sql,database:d.database||state.currentDatabase,dirty:false});break;}

      case "createVerticalTabGroup": splitGroup("vertical",d);break;
      case "createHorizontalTabGroup": splitGroup("horizontal",d);break;
      case "moveTabToPreviousGroup": moveToPreviousGroup(d.id||d.tab||state.activeQueryId);break;
      case "moveTabToNextGroup": moveToNextGroup(d.id||d.tab||state.activeQueryId);break;
      case "openWindowsDialog": ui.windowsDialogOpen=true;break;
      case "activateWindow": if(tabById(d.id||d.tab)){state.activeQueryId=d.id||d.tab;}ui.windowsDialogOpen=false;break;
      default: state.statusText=`Unsupported action: ${action}`;break;
    }
    renderAll();
  }

  function escapeRegex(s){return String(s).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");}
  function splitGroup(mode,d){
    state.groupMode=mode; const id=d.id||d.tab||state.activeQueryId; const other=d.otherTab||state.queryTabs.find(t=>t.id!==id)?.id;
    state.groups.a=state.groups.a.filter(x=>x!==id&&x!==other);state.groups.b=state.groups.b.filter(x=>x!==id&&x!==other);
    if(other)state.groups.a.push(other); if(id)state.groups.b.push(id); state.activeQueryId=id||state.activeQueryId;
  }
  function moveToPreviousGroup(id){if(!id)return;state.groups.b=state.groups.b.filter(x=>x!==id);if(!state.groups.a.includes(id))state.groups.a.push(id);if(!state.groups.b.length)state.groupMode="single";}
  function moveToNextGroup(id){if(!id)return;if(state.groupMode==="single")state.groupMode="vertical";state.groups.a=state.groups.a.filter(x=>x!==id);if(!state.groups.b.includes(id))state.groups.b.push(id);}

  async function seek(steps, animateFinal){
    const token=++seekToken; state=normalizeState(baseline||{}); resetUi(); renderAll();
    for(let i=0;i<steps.length;i++){
      const st=steps[i]; if(st?.app && st.app!==APP_ID) continue;
      allowBoundary=i===steps.length-1; prepareReplayStep(st);
      await applyStep(st,!!animateFinal && i===steps.length-1,token); if(token!==seekToken)return;
    }
    allowBoundary=true;
  }

  function manualClear(){clearBoundary();ui.menu=null;ui.notification="";ui.intelli=null;renderTransients();}

  document.addEventListener("input",e=>{const ed=e.target.closest?.("[data-sql-editor]");if(!ed)return;const t=tabById(ed.dataset.sqlEditor);if(!t)return;t.sql=ed.value;t.dirty=true;const gutter=ed.parentElement?.querySelector(".sqlGutter");if(gutter)gutter.textContent=Array.from({length:Math.max(1,ed.value.split("\n").length)},(_,i)=>i+1).join("\n");});
  document.addEventListener("scroll",e=>{const ed=e.target.closest?.("[data-sql-editor]");if(ed){const g=ed.parentElement?.querySelector(".sqlGutter");if(g)g.scrollTop=ed.scrollTop;}},true);
  document.addEventListener("keydown",e=>{const ed=e.target.closest?.("[data-sql-editor]");if(ed){const t=tabById(ed.dataset.sqlEditor);if(!t)return;if(e.key==="Tab"){e.preventDefault();const s=ed.selectionStart,en=ed.selectionEnd;ed.setRangeText("    ",s,en,"end");ed.dispatchEvent(new Event("input",{bubbles:true}));return;}if(e.key==="F5"||(e.ctrlKey&&e.key.toLowerCase()==="e")){e.preventDefault();t.result=Object.assign(t.result||{},executeVirtualSql(t,ed.value));state.statusText="Query executed successfully";ui.resultTab=(t.result?.columns||[]).length?"results":"messages";renderAll();return;}if(e.ctrlKey&&e.key.toLowerCase()==="l"){e.preventDefault();const tb=tableByName(t.database||state.currentDatabase,((t.sql.match(/FROM\s+([\[\]\w.]+)/i)||[])[1]||""));t.executionPlan=estimatePlan(t.sql,tb);ui.resultTab="plan";renderAll();return;}if(e.ctrlKey&&e.key.toLowerCase()==="m"){e.preventDefault();t.includeActualPlan=!t.includeActualPlan;state.statusText=t.includeActualPlan?"Include Actual Execution Plan enabled":"Include Actual Execution Plan disabled";renderStatus();return;}if(e.ctrlKey&&e.key.toLowerCase()==="s"){e.preventDefault();const path=t.savedPath||t.title;t.savedPath=path;t.dirty=false;state.files[path]=t.sql;state.statusText="Query saved";renderTabs();renderStatus();return;}if(e.ctrlKey&&e.code==="Space"){e.preventDefault();ui.intelli={items:clone(state.intellisenseCache||[]),index:0};renderIntelli();return;}return;}if((e.key==="ArrowRight"||e.key==="ArrowLeft")&&!e.ctrlKey&&!e.altKey&&!e.metaKey){parent.postMessage({type:"SIM_NAVIGATE",app:APP_ID,direction:e.key==="ArrowRight"?"next":"prev"},"*");}});

  document.addEventListener("mousedown", e=>{
    if(!e.target.closest(".boundary")) manualClear();
    const menu=e.target.closest(".menuTop"); if(menu){ui.menu={name:menu.dataset.menu,items:defaultMenuItems(menu.dataset.menu)};renderTransients();e.preventDefault();return;}
    const tool=e.target.closest("[data-target]"); if(tool){const target=tool.dataset.target;if(target==="connect"){ui.connectOpen=true;ui.connectionDraft=clone(state.connection||{});}else if(target==="newQuery"){addTab({});}else if(target==="execute"){const t=activeTab();if(t){t.result=Object.assign(t.result||{},executeVirtualSql(t,t.sql));if(t.includeActualPlan){const tb=tableByName(t.database||state.currentDatabase,((t.sql.match(/FROM\s+([\[\]\w.]+)/i)||[])[1]||""));t.executionPlan=estimatePlan(t.sql,tb);}ui.resultTab=(t.result?.columns||[]).length?"results":"messages";state.statusText="Query executed successfully";}}else if(target==="parse"){const t=activeTab();if(t){t.result.messages="Command(s) completed successfully.";ui.resultTab="messages";state.statusText="Parse successful";}}else if(target==="cancel"){state.statusText="Query cancelled";}else if(target==="save"){const t=activeTab();if(t){const p=t.savedPath||t.title;t.savedPath=p;t.dirty=false;state.files[p]=t.sql;state.statusText="Query saved";}}else if(target==="grid"||target==="text"||target==="file"){const t=activeTab();if(t)t.resultMode=target;}else if(target==="refreshObjectExplorer"){state.lastRefresh="manual";state.statusText="Object Explorer refreshed";}renderAll();return;}
    const row=e.target.closest(".treeRow"); if(row){const id=row.dataset.node;state.selectedObject=id;if(row.querySelector(".twisty")?.textContent.trim()){setExpanded(id,!expanded(id));}renderAll();return;}
    const tab=e.target.closest(".docTab[data-tab]"); if(tab&&!e.target.closest("[data-close-tab]")){state.activeQueryId=tab.dataset.tab;renderAll();return;}
    const close=e.target.closest("[data-close-tab]"); if(close){removeTab(close.dataset.closeTab);renderAll();return;}
    const rt=e.target.closest("[data-resulttab]");if(rt){ui.resultTab=rt.dataset.resulttab;renderResults();return;}
  });

  refs.dbSelect.addEventListener("change",()=>{state.currentDatabase=refs.dbSelect.value;const t=activeTab();if(t)t.database=state.currentDatabase;renderAll();});
  window.addEventListener("resize",()=>requestAnimationFrame(positionBoundary));
  document.addEventListener("scroll",()=>requestAnimationFrame(positionBoundary),true);

  function defaultMenuItems(name){
    const map={File:["Connect Object Explorer...","New","Open","Save","Save As...","Exit"],Edit:["Undo","Redo","Cut","Copy","Paste","IntelliSense"],View:["Object Explorer","Registered Servers","Template Explorer","Solution Explorer"],Query:["Execute","Cancel Executing Query","Parse","Display Estimated Execution Plan","Results To"],Project:["Add New Item","Add Existing Item","Properties"],Tools:["Options...","SQL Server Profiler","Database Engine Tuning Advisor"],Window:["New Window","New Vertical Tab Group","New Horizontal Tab Group","Windows..."],Help:["View Help","About SQL Server Management Studio"]};return map[name]||[];
  }


  function showAssistant(m){if(!refs.assistant)return;refs.assistantTitle.textContent=m.title||"Current Step";refs.assistantStage.textContent=m.stage||"Developer guidance";refs.assistantMeta.textContent=`Step ${m.step||""} · ${m.language||"Telugu (Romanized)"}`;refs.assistantText.textContent=m.text||"";refs.assistant.classList.remove("minimized");refs.assistant.classList.add("show")}
  if(refs.assistantClose)refs.assistantClose.onclick=()=>refs.assistant.classList.remove("show");
  if(refs.assistantMin)refs.assistantMin.onclick=()=>refs.assistant.classList.toggle("minimized");
  if(refs.assistantDrag){let drag=null;refs.assistantDrag.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;const r=refs.assistant.getBoundingClientRect();drag={dx:e.clientX-r.left,dy:e.clientY-r.top};refs.assistantDrag.setPointerCapture?.(e.pointerId)});refs.assistantDrag.addEventListener("pointermove",e=>{if(!drag)return;const x=Math.max(4,Math.min(innerWidth-refs.assistant.offsetWidth-4,e.clientX-drag.dx)),y=Math.max(4,Math.min(innerHeight-refs.assistant.offsetHeight-4,e.clientY-drag.dy));Object.assign(refs.assistant.style,{left:x+"px",top:y+"px",right:"auto",bottom:"auto"})});refs.assistantDrag.addEventListener("pointerup",()=>drag=null);}

  window.addEventListener("message", e=>{
    const m=e.data||{};
    if(m.type==="SIM_PACKAGE"){autoType=m.autoType!==false;loadPackage(m.package);if(m.theme)applyTheme(m.theme);}
    else if(m.type==="SIM_SEEK"){autoType=m.autoType!==false;seek(Array.isArray(m.steps)?m.steps:[],!!m.animateFinal);}
    else if(m.type==="SIM_EXPLAIN")showAssistant(m);
    else if(m.type==="SIM_SETTING"){if(m.key==="autoType")autoType=!!m.value;if(m.key==="theme")applyTheme(m.value);}
  });

  state=defaultState();renderAll();
  parent.postMessage({type:"ENGINE_READY",app:APP_ID,actions:SUPPORTED_ACTIONS},"*");
})();
