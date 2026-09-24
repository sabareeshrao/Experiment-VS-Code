(() => {
"use strict";
const APP_ID="intellij_idea";
const SUPPORTED_ACTIONS=["refreshProjectTree","restartApplication","showDesktopAppPreview","openIntegratedTerminal","createMavenProject","openNewMavenProjectWizard","importExistingProject","openImportProjectWizard","showJavaDocumentation","showExternalLibraries","clearRunConsole","runJavaMain","showQuickFixes","showCodeCompletion","showEditorDiagnostics","goToDefinition","enableFeature","disableFeature","setView","openMenu","pressButton","highlightTarget","moveCursor","showNotification","openProject","newProject","openFile","closeFile","createFile","createPackage","renameResource","deleteResource","saveFile","saveAll","setCode","typeCode","replaceCode","formatCode","optimizeImports","splitEditor","unsplitEditor","pinTab","toggleDistractionFree","toggleZenMode","gotoClass","gotoFile","gotoSymbol","gotoDeclaration","gotoImplementation","findUsages","showCallHierarchy","showTypeHierarchy","showFileStructure","searchEverywhere","findInFiles","recentFiles","showCompletion","showParameterInfo","showQuickDocumentation","showIntentionActions","applyQuickFix","runInspection","showProblems","addProblem","suppressInspection","renameSymbol","extractMethod","extractVariable","inlineRefactor","moveClass","changeSignature","safeDelete","generateGetterSetter","generateConstructor","generateToString","generateEqualsHashCode","overrideMethods","openRunConfigurations","createApplicationConfig","createSpringBootConfig","setProgramArguments","setVmOptions","setEnvironmentVariables","setWorkingDirectory","runConfiguration","stopProcess","showRunConsole","debugConfiguration","setBreakpoint","removeBreakpoint","setConditionalBreakpoint","setExceptionBreakpoint","resumeDebug","pauseDebug","stepOver","stepInto","stepOut","runToCursor","evaluateExpression","addWatch","showVariables","runJUnit","runJUnitMethod","runJUnitClass","showTestResults","showFailureTrace","rerunFailedTests","runWithCoverage","showCoverage","mockitoVerifyInteraction","openMavenToolWindow","reloadMavenProject","runMavenGoal","showMavenLifecycle","showMavenDependencies","showMavenDependencyTree","addMavenDependency","removeMavenDependency","setMavenProfile","showEffectivePom","openSpringToolWindow","showSpringBootDashboard","runSpringBootApp","stopSpringBootApp","restartSpringBootApp","setSpringProfile","showSpringBeans","showSpringMappings","navigateToController","showMvcFlow","showValidationFlow","showExceptionHandlers","openApplicationProperties","setSpringProperty","openPersistenceToolWindow","showJpaEntities","showJpaRepositories","showEntityMapping","showRepositoryMethods","generateJpaRepository","runJpql","showHibernateSql","showHibernateStatistics","showHibernateSpatial","openGitToolWindow","showLocalChanges","stageFile","unstageFile","commitChanges","pushGit","pullGit","fetchGit","createBranch","checkoutBranch","mergeBranch","showGitHistory","showGitDiff","showMergeConflict","resolveMergeConflict","openDatabaseToolWindow","addDataSource","testDataSource","openDatabaseConsole","executeSql","showQueryResult","showTableData","openTerminal","typeTerminal","appendTerminal","clearTerminal","openSettings","showProjectStructure","addSdk","setProjectSdk","setLanguageLevel","setModuleSdk","configureCompiler","installPlugin","showSdkTable","showJvmRuntime","setJvmArgument","showClasspath","showModulePath","showMavenPlugins","showMavenProfiles","runMavenWrapper","runMavenTests","showDependencyConflict","resolveMavenDependencyConflict","openGradleToolWindow","reloadGradleProject","showGradleTasks","runGradleTask","showGradleDependencies","setGradleJvm","setGradleOfflineMode","runGradleWrapper","showGradleBuildOutput","showBeanGraph","showDependencyInjection","showComponentScan","showRequestLifecycle","showControllerAdvice","runParameterizedTest","debugJUnit","showTestTree","showAssertionDiff","setTestFilter","mockitoCreateMock","mockitoInjectMocks","mockitoStub","mockitoCaptureArgument","mockitoSpy","mockitoThrow","mockitoReset","showMockitoDetails","showJpaRelationships","setFetchStrategy","reproduceNPlusOne","showTransactionBoundary","showDirtyChecking","showHibernateCaches","showOptimisticLocking","showEntityLifecycle","showPagination","runNativeQuery","openSecurityToolWindow","configureSecurityFilterChain","configureUserDetailsService","configurePasswordEncoder","configureJwtFilter","issueJwt","validateJwt","configureMethodSecurity","setCorsConfig","setCsrfConfig","configureOAuth2Client","showAuthenticationFlow","showAuthorizationFlow","showOAuth2LoginFlow","configureRestTemplate","configureWebClient","configureFeignClient","setClientTimeouts","sendExternalRequest","showClientRequestResponse","showClientErrorHandling","configureCircuitBreaker","configureRetry","configureSpringRetry","configureRateLimiter","configureTimeLimiter","configureBulkhead","setFallbackMethod","simulateResilienceCall","simulateSpringRetry","showResilienceEvents","showCircuitState","openMigrationToolWindow","createFlywayMigration","runFlywayMigrate","showFlywayInfo","repairFlyway","baselineFlyway","createLiquibaseChangelog","runLiquibaseUpdate","showLiquibaseStatus","rollbackLiquibase","showSchemaHistory","openLoggingToolWindow","configureLogging","setLogLevel","addStructuredLogging","setMdc","appendApplicationLog","showApplicationLogs","showRollingPolicy","showTraceCorrelation","showEmbeddedTomcat","configureServerPort","openTomcatRunConfig","deployWar","showTomcatLogs","showServletMappings","showTomcatThreads","importWsdl","generateSoapClient","createSoapRequest","sendSoapRequest","showSoapResponse","configureSoapFaultHandling"];
const $=id=>document.getElementById(id),clone=v=>JSON.parse(JSON.stringify(v??null)),esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const refs={editorPane:$("editorPane"),editorWrap:$("editorWrap"),editorSplitWrap:$("editorSplitWrap"),editorSplitTitle:$("editorSplitTitle"),editorSplitCode:$("editorSplitCode"),editorSplitClose:$("editorSplitClose"),app:$("app"),bottomPanel:$("bottomPanel"),project:$("projectTitle"),branch:$("branchPill"),sdk:$("sdkTitle"),tree:$("tree"),tabs:$("tabs"),gutter:$("gutter"),code:$("code"),completion:$("completion"),intentions:$("intentions"),right:$("rightBody"),bottom:$("bottomBody"),bottomTabs:$("bottomTabs"),menu:$("menu"),menuPopup:$("menuPopup"),runConfig:$("runConfig"),status:$("statusText"),lang:$("languageLevel"),line:$("lineStatus"),notification:$("notification"),boundary:$("targetBoundary"),assistant:$("ideAssistant"),assistantDrag:$("ideAssistantDrag"),assistantTitle:$("ideAssistantTitle"),assistantStage:$("ideAssistantStage"),assistantStep:$("ideAssistantStep"),assistantText:$("ideAssistantText"),assistantMin:$("ideAssistantMin"),assistantClose:$("ideAssistantClose"),modalLayer:$("modalLayer"),modalTitle:$("modalTitle"),modalBody:$("modalBody"),modalFoot:$("modalFoot"),modalClose:$("modalClose"),work:$("work"),splitL:$("splitL"),splitR:$("splitR"),splitH:$("splitH"),newBtn:$("newBtn"),saveBtn:$("saveBtn"),runBtn:$("runBtn"),debugBtn:$("debugBtn"),stopBtn:$("stopBtn"),restartBtn:$("restartBtn"),clearConsoleBtn:$("clearConsoleBtn"),searchBtn:$("searchBtn"),gitBtn:$("gitBtn"),terminalBtn:$("terminalBtn"),fidelity:$("intellijFidelityLayer")};
let baseline=null,state=null,files={},activeFile=null,openTabs=[],activeBottom="run",activeRight="structure",autoType=true,seekToken=0,allowBoundary=true,treeMap=new Map(),focusRange=null,popupKind="",modalKind="",notificationTimer=0,trackedBoundary=null,terminalHighlightText="";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let replayingHistory=false;
function focusFidelityInput(id,select=false){
 if(replayingHistory)return;
 const input=$(id),token=seekToken;
 setTimeout(()=>{if(token!==seekToken||!input?.isConnected)return;input.focus({preventScroll:true});if(select)input.select()},0);
}
function handleIntellijLessonKeydown(event){
 if(event.defaultPrevented||event.isComposing)return;
 if(event.ctrlKey||event.metaKey||event.shiftKey)return;
 const target=event.target;
 const editing=target?.isContentEditable||target?.closest?.('input, textarea, select, [role="textbox"], [role="combobox"], [role="slider"], [role="menu"], [role="listbox"]');
 if(editing&&!event.altKey)return;
 const direction=event.key==="ArrowRight"?"next":event.key==="ArrowLeft"?"prev":"";
 if(direction){
  event.preventDefault();
  event.stopPropagation();
  parent.postMessage({type:"SIM_NAVIGATE",direction},location.origin==="null"?"*":location.origin);
  return;
 }
 if(!event.altKey&&event.key.toLowerCase()==="r"&&!editing){
  event.preventDefault();
  event.stopPropagation();
  parent.postMessage({type:"SIM_NAVIGATE",direction:"replay"},location.origin==="null"?"*":location.origin);
 }
}
document.addEventListener("keydown",handleIntellijLessonKeydown,true);
function theme(v){document.body.classList.toggle("theme-dark",v!=="light")}
function normalize(){
 state=state||{};state.project=state.project||{name:"Project",sdk:"Java 17",languageLevel:"17"};state.tree=state.tree||[];files=clone(state.files||{});
 state.problems=state.problems||[];state.breakpoints=state.breakpoints||[];state.visibleFeatures=state.visibleFeatures||[];state.runConfigurations=state.runConfigurations||[];state.maven=state.maven||{};state.spring=state.spring||{};state.jpa=state.jpa||{};state.git=state.git||{};state.database=state.database||{};state.tests=state.tests||{};state.debug=state.debug||{};state.terminal=state.terminal||"";state.terminalSessions=state.terminalSessions||[{id:"local",name:"Local",shell:"Terminal"}];state.activeTerminalSession=state.activeTerminalSession||state.terminalSessions[0]?.id||"local";if(state.breadcrumbsVisible===undefined)state.breadcrumbsVisible=true;state.editorCaret=state.editorCaret||null;state.editorSelection=state.editorSelection||null;
 activeFile=state.initialFile&&files[state.initialFile]?state.initialFile:Object.keys(files)[0]||null;openTabs=activeFile?[activeFile]:[];activeBottom=state.activeBottom||"run";activeRight="structure";focusRange=null
}
function syntax(line,lang="java"){
 const e=esc(line);if(lang==="xml")return e.replace(/(&lt;\/?[\w:.-]+)/g,'<span class="kw">$1</span>').replace(/([\w:.-]+)=(&quot;.*?&quot;)/g,'<span class="ann">$1</span>=$2');
 if(lang==="properties")return e.replace(/^([^=:#]+)(=|:)/,'<span class="kw">$1</span>$2');
 if(lang==="yaml"||lang==="yml")return e.replace(/^(\s*)([\w.-]+)(:)/,'$1<span class="kw">$2</span>$3');
 if(lang==="sql")return e.replace(/\b(SELECT|FROM|WHERE|JOIN|INSERT|UPDATE|DELETE|CREATE|TABLE|AND|OR|ORDER|BY)\b/gi,'<span class="kw">$1</span>');
 if(lang==="python")return e.replace(/\b(def|class|return|if|else|for|in|import|from|as|True|False|None)\b/g,'<span class="kw">$1</span>');
 let out="",i=0,kws=new Set(["package","import","public","private","protected","class","interface","extends","implements","return","if","else","for","while","new","throw","throws","try","catch","finally","static","final","void","int","long","double","boolean","null","true","false","this","super","enum","record","sealed","permits","non-sealed","switch","case","default","yield","var","instanceof"]);
 while(i<line.length){if(line.startsWith("//",i)){out+='<span class="com">'+esc(line.slice(i))+'</span>';break}if(line[i]==='"'){let j=i+1;while(j<line.length){if(line[j]==="\\"){j+=2;continue}if(line[j]==='"'){j++;break}j++}out+='<span class="str">'+esc(line.slice(i,j))+'</span>';i=j;continue}if(line[i]==="@"){let j=i+1;while(j<line.length&&/[\w.]/.test(line[j]))j++;out+='<span class="ann">'+esc(line.slice(i,j))+'</span>';i=j;continue}if(/[A-Za-z_$]/.test(line[i])){let j=i+1;while(j<line.length&&/[\w$]/.test(line[j]))j++;const w=line.slice(i,j);out+=kws.has(w)?'<span class="kw">'+w+'</span>':(/^[A-Z]/.test(w)?'<span class="type">'+esc(w)+'</span>':esc(w));i=j;continue}if(/\d/.test(line[i])){let j=i+1;while(j<line.length&&/[\d._]/.test(line[j]))j++;out+='<span class="num">'+esc(line.slice(i,j))+'</span>';i=j;continue}out+=esc(line[i]);i++}return out
}
function icon(n){if(n.type==="package")return "◉";if(n.type==="folder")return "";if(n.language==="java")return "C";if(n.language==="xml")return "x";if(n.language==="properties"||n.language==="yaml"||n.language==="yml")return "p";if(n.language==="sql")return "Q";return "·"}
function iconClass(n){if(n.type==="package")return "ico-package";if(n.type==="folder")return "ico-folder";if(n.language==="java")return "ico-java";if(n.language==="xml")return "ico-xml";if(n.language==="properties"||n.language==="yaml"||n.language==="yml")return "ico-props";if(n.language==="sql")return "ico-sql";return "ico-file"}
function renderTreeNodes(nodes,depth=0){for(const n of nodes||[]){const p=n.path||n.name,d=document.createElement("div");const rootKind=n.rootKind||n.kind||"";d.className="treeRow"+(p===activeFile?" active":"")+(rootKind?" tree-"+String(rootKind).replace(/\s+/g,"-").toLowerCase():"")+(n.generated?" tree-generated":"")+(n.excluded?" tree-excluded":"");d.dataset.path=p;d.style.paddingLeft=(depth*14)+"px";d.innerHTML='<span class="twist">'+(n.children?.length?(n.open?"▾":"▸"):"")+'</span><span class="ico '+iconClass(n)+'">'+icon(n)+'</span><span class="nodeText">'+esc(n.name||p)+'</span>'+(rootKind?'<span class="tree-kind-badge">'+esc(rootKind)+'</span>':'');const gm=state.git?.changes?.find?.(x=>x.file===p);if(gm){const s=document.createElement("span");s.className="gitMark "+(gm.status==="A"?"a":gm.status==="D"?"d":"m");s.textContent=gm.status;d.appendChild(s)}d.onclick=()=>{if(n.type==="file"&&files[p])openFile(p);else if(n.children){n.open=!n.open;renderTree()}};d.oncontextmenu=e=>{e.preventDefault();if(n.type==="folder"||n.type==="package")showProjectContextSurface();else fidelityNotice("Context menu: "+(n.name||p))};refs.tree.appendChild(d);treeMap.set(p,d);if(n.children&&n.open!==false)renderTreeNodes(n.children,depth+1)}}
function renderTree(){
 refs.tree.innerHTML="";
 treeMap.clear();
 const root=document.createElement("div");
 root.className="treeRoot";
 root.innerHTML='<span class="twist">▾</span><span class="ico ico-folder"></span><span class="nodeText">'+esc(state.project?.name||"Project")+'</span>';
 refs.tree.appendChild(root);
 renderTreeNodes(state.tree,1);
 const ext=document.createElement("div");ext.className="treeAux";ext.dataset.externalLibraries="1";ext.innerHTML='<span class="twist">'+(state.externalLibrariesOpen?"▾":"▸")+'</span><span class="ico">◫</span><span>External Libraries</span>';ext.onclick=()=>{state.externalLibrariesOpen=!state.externalLibrariesOpen;renderTree()};refs.tree.appendChild(ext);
 if(state.externalLibrariesOpen){const libs=[...(state.maven?.dependencies||[]).map(x=>({name:(x.groupId?x.groupId+":":"")+(x.artifactId||x.name||"dependency"),kind:"Maven"})),{name:"JDK "+String(state.project?.sdk||"17").replace(/^Java\s*/,""),kind:"JDK"},{name:"java.lang",kind:"JDK source"},{name:"java.time",kind:"JDK source"},{name:"org.springframework.boot",kind:"Spring Boot"},{name:"org.apache.catalina",kind:"Embedded Tomcat"}];libs.forEach(x=>{const row=document.createElement("div");row.className="treeAux";row.style.paddingLeft="28px";row.innerHTML='<span class="twist"></span><span class="ico">·</span><span>'+esc(x.name)+'</span><span style="margin-left:8px;color:var(--muted);font-size:8px">'+esc(x.kind)+'</span>';refs.tree.appendChild(row)})}
 const scratch=document.createElement("div");scratch.className="treeAux";scratch.innerHTML='<span class="twist">▸</span><span class="ico">⌘</span><span>Scratches and Consoles</span>';refs.tree.appendChild(scratch)
}
function openFile(p){if(!files[p])return;activeFile=p;if(!openTabs.includes(p))openTabs.push(p);renderAll()}
function renderTabs(){refs.tabs.innerHTML="";for(const p of openTabs){if(!files[p])continue;const t=document.createElement("div");t.className="tab"+(p===activeFile?" active":"");t.dataset.file=p;t.innerHTML='<span>'+esc(p.split("/").pop())+'</span>'+(files[p].pinned?'<span class="tabPin">PIN</span>':'')+'<span class="tabClose">×</span>';t.onclick=e=>{if(!e.target.classList.contains("tabClose")){activeFile=p;renderAll()}};t.querySelector(".tabClose").onclick=e=>{e.stopPropagation();closeFile(p)};refs.tabs.appendChild(t)}}
function closeFile(p){openTabs=openTabs.filter(x=>x!==p);if(activeFile===p)activeFile=openTabs.at(-1)||null;renderAll()}
function renderSplitEditor(){const splitFile=state.editorSplit&&state.splitFile&&files[state.splitFile]?state.splitFile:(state.editorSplit?activeFile:null);const enabled=!!splitFile;refs.editorPane?.classList.toggle("editorSplit",enabled);refs.editorSplitWrap?.classList.toggle("hidden",!enabled);if(!enabled){if(refs.editorSplitCode)refs.editorSplitCode.innerHTML="";return}refs.editorSplitTitle.textContent=splitFile.split("/").pop();const sf=files[splitFile],lines=String(sf?.content??"").split("\n");refs.editorSplitCode.innerHTML=lines.map((line,i)=>'<div class="splitCodeLine"><span class="splitLineNo">'+(i+1)+'</span><span class="splitCodeText">'+syntax(line,sf?.language||"java")+'</span></div>').join("")}
function renderEditor(){refs.gutter.innerHTML="";refs.code.innerHTML="";renderBreadcrumbs();if(!activeFile||!files[activeFile]){if(state.fidelityMode)refs.code.innerHTML='<span class="ij-empty-editor-hints">Search Everywhere  Double Shift\n\nGo to File  Ctrl+Shift+N\n\nRecent Files  Ctrl+E\n\nNavigation Bar  Alt+Home\n\nDrop files here to open them</span>';renderSplitEditor();return}const f=files[activeFile],lines=String(f.content??"").split("\n");lines.forEach((line,i)=>{const no=i+1,g=document.createElement("div");g.className="gline";const has=state.breakpoints.some(b=>b.file===activeFile&&Number(b.line)===no);g.innerHTML='<span class="bp '+(has?"on":"")+'"></span><span class="ij-fold">'+((line.includes("{")&&line.trim())?"−":"")+'</span><span class="gnum">'+no+'</span>';g.onclick=()=>toggleManualBreakpoint(no);refs.gutter.appendChild(g);const p=(state.problems||[]).find(x=>(!x.file||x.file===activeFile)&&Number(x.line||0)===no);const s=document.createElement("span");const current=state.editorCaret&&state.editorCaret.file===activeFile&&Number(state.editorCaret.line)===no;s.className="codeLine"+(current?" current":"")+(focusRange&&focusRange.file===activeFile&&((Array.isArray(focusRange.lines)&&focusRange.lines.includes(no))||(!focusRange.lines&&no>=focusRange.start&&no<=focusRange.end))?" focus":"")+(p?" diag-"+(String(p.severity||"warning").toLowerCase().includes("error")?"error":"warning"):"");s.dataset.line=no;s.title=p?.message||"";s.innerHTML=editorLineMarkup(line,f.language||"java",no);refs.code.appendChild(s)});if(state.editorCaret){refs.line.textContent="Ln "+Number(state.editorCaret.line||1)+", Col "+(Number(state.editorCaret.column||0)+1)}renderSplitEditor()}
function toggleManualBreakpoint(line){const i=state.breakpoints.findIndex(b=>b.file===activeFile&&Number(b.line)===line);if(i>=0)state.breakpoints.splice(i,1);else state.breakpoints.push({file:activeFile,line});renderEditor()}
function renderRight(){
 if(activeRight==="maven"){renderP0MavenTool();return}
 if(activeRight==="database"){const ds=state.database.dataSources||[];refs.right.innerHTML=ds.map(x=>'<div class="structureRow">🗄 '+esc(x.name)+'<br><span style="color:var(--muted)">'+esc(x.url||"")+'</span></div>').join("")||'<div class="structureRow">No data sources</div>';return}
 if(!activeFile){refs.right.innerHTML='<div class="structureRow">No file</div>';return}
 const content=String(files[activeFile]?.content||""),matches=[...content.matchAll(/\b(class|interface|enum)\s+(\w+)|\b(public|private|protected)\s+[\w<>, ?\[\]]+\s+(\w+)\s*\(/g)];
 refs.right.innerHTML=matches.map(m=>'<div class="structureRow">'+esc(m[2]||m[4]||"symbol")+'</div>').join("")||'<div class="structureRow">No symbols</div>'
}
function card(t,v){return '<div class="card"><h3>'+esc(t)+'</h3><div class="metric">'+esc(v??"")+'</div></div>'}
function renderTerminalText(content){
 const lines=String(content||"$ ").split("\n");
 let match=-1;
 if(terminalHighlightText){
  for(let i=0;i<lines.length;i++)if(lines[i].includes(terminalHighlightText))match=i;
 }
 return lines.map((line,i)=>'<span class="terminalLine'+(i===match?' terminalCommandFocus':'')+'">'+(line?esc(line):'&nbsp;')+'</span>').join("");
}
function setBottom(name,content,html=false){
 activeBottom=name;
 document.querySelectorAll(".bottomTab").forEach(t=>t.classList.toggle("active",t.dataset.bottom===name));
 refs.bottom.className="bottomBody"+(name==="terminal"?" terminal":"");
 if(name==="terminal"){
   const sessions=state.terminalSessions||[{id:"local",name:"Local",shell:"Terminal"}];
   refs.bottom.innerHTML='<div class="terminalSessionBar"><div class="ij-terminal-tabs">'+sessions.map(s=>'<button type="button" data-terminal-session="'+esc(s.id)+'" class="'+(s.id===state.activeTerminalSession?'active':'')+'"><span>⌘</span>'+esc(s.name||s.shell||"Terminal")+'</button>').join("")+'</div><span class="terminalGrow"></span>'+(state.terminalExitCode!==undefined?'<span class="ij-exit-code '+(Number(state.terminalExitCode)===0?'ok':'bad')+'">exit '+esc(state.terminalExitCode)+'</span>':'')+'<button class="terminalAction" id="ijTerminalNew">＋</button><button class="terminalAction">⌄</button><button class="terminalAction">⋮</button></div><div class="terminalViewport"><pre class="terminalText">'+renderTerminalText(content||"$ ")+'</pre></div>';
   refs.bottom.querySelectorAll("[data-terminal-session]").forEach(btn=>btn.addEventListener("click",()=>{state.activeTerminalSession=btn.dataset.terminalSession;renderBottom()}));
   refs.bottom.querySelector("#ijTerminalNew")?.addEventListener("click",()=>{const id="terminal-"+((state.terminalSessions||[]).length+1);state.terminalSessions.push({id,name:"Local "+state.terminalSessions.length,shell:"Terminal"});state.activeTerminalSession=id;renderBottom()});
   const v=refs.bottom.querySelector(".terminalViewport");
   const focused=refs.bottom.querySelector(".terminalCommandFocus");
   if(focused)requestAnimationFrame(()=>window.SIM_FOCUS?.follow(focused,{block:"center"}));
   if(v)v.scrollTop=v.scrollHeight;
 }else if(html)refs.bottom.innerHTML=content||"";
 else refs.bottom.textContent=content||""
}
function renderBottom(){
 const b=state.bottomCache?.[activeBottom];if(b){setBottom(activeBottom,b.content,b.html);return}
 if(activeBottom==="debug"){renderP0DebuggerTool();return}
 else if(activeBottom==="tests"){renderP0JUnitTool();return}
 else if(activeBottom==="services"){renderP0ServicesTool();return}
 else if(activeBottom==="terminal")setBottom("terminal",state.terminal||"$ ");
 else if(activeBottom==="problems")setBottom("problems",state.problems.map(p=>`${p.severity||"warning"}  ${p.message||""}  ${p.file||""}:${p.line||""}`).join("\n"));
 else if(activeBottom==="git")setBottom("git",(state.git.changes||[]).map(x=>`${x.status||"M"}  ${x.file}`).join("\n")||"Working tree clean");
 else setBottom(activeBottom,state.console||"")
}

function markGit(file,status="M"){
 state.git=state.git||{};state.git.changes=state.git.changes||[];
 let c=state.git.changes.find(x=>x.file===file);
 if(!c)state.git.changes.push({file,status});
 else if(c.status!=="A")c.status=status
}
function renderFeatureVisibility(){
 const visible=new Set(state.visibleFeatures||[]);
 document.querySelectorAll("[data-feature]").forEach(el=>el.classList.toggle("hidden",!visible.has(el.dataset.feature)));
 const bottomFeatures=[{name:"run",feature:"run"},{name:"debug",feature:"debug"},{name:"tests",feature:"tests"},{name:"terminal",feature:"terminal"},{name:"problems",feature:"problems"},{name:"git",feature:"git"},{name:"services",feature:"spring"}];
 const availableBottom=bottomFeatures.filter(x=>visible.has(x.feature)).map(x=>x.name);
 const anyBottom=availableBottom.length>0;
 if(anyBottom&&!availableBottom.includes(activeBottom))activeBottom=availableBottom[0];
 refs.bottomPanel?.classList.toggle("hidden",!anyBottom);
 refs.splitH?.classList.toggle("hidden",!anyBottom);
 refs.work?.classList.toggle("noBottom",!anyBottom);
 const hasRight=visible.has("maven")||visible.has("database");
 refs.work?.classList.toggle("hasRightTools",hasRight);
 if(anyBottom)renderBottom()
}
function renderAll(){document.body.classList.toggle("ijScreenshotMode",!!state.fidelityMode);refs.project.textContent=state.project.name||"Project";refs.branch.textContent=state.git.branch||"main";refs.sdk.textContent=state.project.sdk||"Project SDK";refs.lang.textContent="Java "+(state.project.languageLevel||"");refs.runConfig.textContent=state.activeRunConfiguration||state.runConfigurations[0]?.name||"Current File";renderTree();renderTabs();renderEditor();renderRight();renderBottom();renderFeatureVisibility()}
function notify(text,type=""){clearTimeout(notificationTimer);refs.notification.textContent=String(text||"");refs.notification.className="notification show"+(type==="error"?" error":"");notificationTimer=setTimeout(()=>refs.notification.classList.remove("show"),2200)}
function showModal(kind,title,html){modalKind=kind;refs.modalTitle.textContent=title;refs.modalBody.innerHTML=html;refs.modalFoot.innerHTML='<button id="modalOk">OK</button>';refs.modalLayer.classList.add("show");$("modalOk").onclick=closeModal}
function closeModal(){modalKind="";refs.modalLayer.classList.remove("show");refs.modalBody.innerHTML="";refs.modalFoot.innerHTML=""}

function hideFidelity(){
 if(!refs.fidelity)return;
 refs.fidelity.className="ijFidelityLayer";
 refs.fidelity.innerHTML="";
}
function fidelityNotice(message,type=""){notify(message,type)}
function fidelityButton(label,attrs=""){return '<button type="button" '+attrs+'>'+label+'</button>'}
function screenshotTree(){
 return [
  {name:".idea",path:".idea",type:"folder",open:false,children:[]},
  {name:"src",path:"src",type:"folder",open:true,children:[]},
  {name:".gitignore",path:".gitignore",type:"file",language:"text"}
 ];
}
function resetScreenshotWorkspace(d={}){
 state.project={name:d.name||"App_1",sdk:d.sdk||"Java 21",languageLevel:String(d.languageLevel||"21")};
 state.fidelityMode=d.fidelityMode!==false;
 state.tree=clone(d.tree||screenshotTree());
 files=clone(d.files||{".gitignore":{language:"text",content:"# IntelliJ project files\n.idea/\nout/\n"}});
 state.files=clone(files);
 state.visibleFeatures=[];
 state.problems=[];
 state.breakpoints=[];
 state.runConfigurations=[];
 state.activeRunConfiguration="";
 state.bottomCache={};
 state.editorSplit=false;
 state.splitFile=null;
 state.breadcrumbsVisible=false;
 state.editorCaret=null;
 state.editorSelection=null;
 state.externalLibrariesOpen=false;
 state.terminal="";
 state.console="";
 state.maven={};
 state.spring={};
 state.jpa={};
 state.database={};
 state.tests={};
 state.git={branch:"main",changes:[],history:[]};
 activeFile=null;
 openTabs=[];
 activeBottom="run";
 activeRight="structure";
 focusRange=null;
 actionStatus("Ready");
 renderAll();
}
function applyScreenshotProject(d={}){resetScreenshotWorkspace(d)}
function closeFidelityToWorkspace(){
 hideFidelity();
 if(state.fidelityMode)renderAll();
}
function bindFidelityClose(selector,onClose){
 const el=refs.fidelity?.querySelector(selector);
 if(el)el.addEventListener("click",onClose||closeFidelityToWorkspace);
}
function showWelcomeSurface(panel="Projects"){
 refs.fidelity.className="ijFidelityLayer show";
 const panels={
  Projects:{title:"Welcome to IntelliJ IDEA",copy:"Create a new project to start from scratch.<br>Open existing project from disk or version control."},
  "Kotlin Notebooks":{title:"Kotlin Notebooks",copy:"Create and open Kotlin notebooks inside IntelliJ IDEA."},
  Customize:{title:"Customize IntelliJ IDEA",copy:"Adjust color theme, accessibility, keymap, and UI settings."},
  Plugins:{title:"Plugins",copy:"Install and manage IntelliJ IDEA plugins."},
  Learn:{title:"Learn IntelliJ IDEA",copy:"Open learning resources and IDE feature tours."}
 };
 const info=panels[panel]||panels.Projects;
 refs.fidelity.innerHTML='<section class="ij-welcome"><aside class="ij-welcome-side"><div class="ij-brand"><span class="ij-shot-logo">IJ</span><div><span class="ij-brand-title">IntelliJ IDEA</span><span class="ij-brand-ver">2025.2.6.2</span></div></div><div class="ij-welcome-nav">'+Object.keys(panels).map(name=>'<button type="button" data-welcome-panel="'+esc(name)+'" class="'+(name===panel?'active':'')+'">'+esc(name)+'</button>').join("")+'</div></aside><main class="ij-welcome-main"><h1>'+info.title+'</h1><p>'+info.copy+'</p><div class="ij-welcome-actions"><button type="button" class="ij-welcome-action primary" id="ijWelcomeNew"><span class="box">＋</span>New Project</button><button type="button" class="ij-welcome-action" id="ijWelcomeOpen"><span class="box">▱</span>Open</button><button type="button" class="ij-welcome-action" id="ijWelcomeClone"><span class="box">⑂</span>Clone Repository</button></div><div class="ij-onboarding"><button type="button" class="ij-onboarding-close" id="ijOnboardingClose" aria-label="Close onboarding">×</button><strong>Take a quick onboarding tour</strong><span>New to IntelliJ IDEA? Get the most out of your IDE.</span></div></main></section>';
 refs.fidelity.querySelectorAll("[data-welcome-panel]").forEach(btn=>btn.addEventListener("click",()=>showWelcomeSurface(btn.dataset.welcomePanel)));
 $("ijWelcomeNew")?.addEventListener("click",()=>showNewProjectSurface({name:"untitled",location:"~\\IdeaProjects",sdk:"Oracle OpenJDK 21.0.11"},false));
 $("ijWelcomeOpen")?.addEventListener("click",()=>fidelityNotice("Open project chooser opened"));
 $("ijWelcomeClone")?.addEventListener("click",()=>fidelityNotice("Clone Repository workflow opened"));
 $("ijOnboardingClose")?.addEventListener("click",e=>{e.currentTarget.closest(".ij-onboarding")?.remove()});
}
function normalizeSdkChoice(value){
 const v=String(value||"");
 if(v==="none"||v.includes("<No JDK>"))return "<No JDK>";
 if(v==="8"||v.includes("1.8"))return "Oracle OpenJDK 1.8.0_351";
 if(v==="17"||v.includes("17"))return "Oracle OpenJDK 17.0.12";
 return "Oracle OpenJDK 21.0.11";
}
function sdkLanguageLevel(value){
 const v=String(value||"");
 if(v.includes("1.8")||v==="8"||v.includes("Java 8"))return "8";
 if(v.includes("17"))return "17";
 return "21";
}
function jdkMenuHtml(selected,scope="wizard"){
 const rows=[
  {label:"◉ <No JDK>",value:"none",bad:true},
  {label:"⇩ Download Oracle OpenJDK 26.0.2",action:"download26"},
  {label:"⇩ Download JDK...",action:"download"},
  {label:"▱ Add JDK from Disk...",action:"disk"},
  {section:"Detected JDKs"},
  {label:"▱ Oracle OpenJDK 21.0.11",path:"C:\\Program Files\\Java\\jdk-21.0.11",value:"21"},
  {label:"▱ Oracle OpenJDK 17.0.12",path:"C:\\Program Files\\Java\\jdk-17",value:"17"},
  {label:"▱ Oracle OpenJDK 1.8.0_351",path:"C:\\Program Files\\Java\\jdk1.8.0_351",value:"8"}
 ];
 return '<div class="ij-jdk-menu" data-jdk-menu="'+scope+'">'+rows.map(row=>{
  if(row.section)return '<div class="ij-jdk-row section">'+row.section+'</div>';
  const normalized=normalizeSdkChoice(row.value||"");
  const active=row.value&&String(selected).includes(normalized.replace("Oracle OpenJDK ","").split(" ")[0]);
  return '<button type="button" class="ij-jdk-row '+(row.bad?'ij-jdk-bad ':'')+(active?'active':'')+'" '+(row.value?'data-sdk-value="'+row.value+'"':'data-sdk-action="'+row.action+'"')+'><span>'+esc(row.label)+'</span>'+(row.path?'<span class="ij-jdk-path">'+esc(row.path)+'</span>':'')+'</button>';
 }).join("")+'</div>';
}
function showNewProjectSurface(d={},jdkOpen=false){
 const draft={
  name:String(d.name??"App_1"),
  location:String(d.location??"~\\Desktop\\Java_Codes"),
  sdk:String(d.sdk??"Oracle OpenJDK 21.0.11"),
  tech:String(d.tech??"Java"),
  build:String(d.build??"IntelliJ"),
  git:d.git===true,
  sample:d.sample!==false,
  advanced:d.advanced===true
 };
 refs.fidelity.className="ijFidelityLayer show";
 const techs=["Java","Kotlin","Groovy","Empty Project"];
 const generators=["Maven Archetype","JavaFX","Spring"];
 refs.fidelity.innerHTML='<div class="ij-screen-dim"><section class="ij-dialog ij-new-project" role="dialog" aria-label="New Project"><header class="ij-dialog-head"><span class="ij-shot-logo sm">IJ</span><span>New Project</span><button type="button" class="ij-dialog-close" id="ijWizardClose" aria-label="Close">×</button></header><div class="ij-new-project-body"><aside class="ij-new-project-left"><button type="button" class="ij-search-ghost" id="ijWizardSearch" aria-label="Search project types">⌕</button><div class="ij-left-label">New Project</div>'+techs.map(x=>'<button type="button" class="ij-tech '+(x===draft.tech?'active':'')+'" data-tech="'+esc(x)+'"><span class="ti">'+(x==="Java"?"▱":x==="Kotlin"?"〈":x==="Groovy"?"G":"▱")+'</span>'+esc(x)+'</button>').join("")+'<div class="ij-left-label" style="margin-top:18px">Generators</div>'+generators.map(x=>'<button type="button" class="ij-tech '+(x==="Spring"?'locked':'')+'" data-generator="'+esc(x)+'"><span class="ti">'+(x==="Maven Archetype"?"m":x==="JavaFX"?"▭":"♨")+'</span>'+esc(x)+'</button>').join("")+'</aside><main class="ij-new-project-main"><div class="ij-form-row"><label for="ijProjectName">Name:</label><input id="ijProjectName" class="ij-field '+(draft.name==="untitled"?'focus':'')+'" value="'+esc(draft.name)+'"></div><div class="ij-form-row"><label for="ijProjectLocation">Location:</label><div class="ij-field-wrap"><input id="ijProjectLocation" class="ij-field" value="'+esc(draft.location)+'"><button type="button" class="ij-field-icon" id="ijLocationBrowse" title="Choose location">▱</button></div></div><div class="ij-muted" id="ijProjectPathPreview">Project will be created in: '+esc(draft.location)+'\\'+esc(draft.name)+'</div><label class="ij-check ij-click-check"><input type="checkbox" id="ijGitCheck" '+(draft.git?'checked':'')+'><span class="check-ui"></span>Create Git repository</label><div class="ij-form-row" style="margin-top:24px"><span>Build system:</span><div class="ij-build">'+["IntelliJ","Maven","Gradle"].map(x=>'<button type="button" data-build="'+x+'" class="'+(x===draft.build?'active':'')+'">'+x+'</button>').join("")+'</div></div><div class="ij-form-row"><span>JDK:</span><button type="button" class="ij-select focus" id="ijWizardJdk">▱ <span id="ijWizardJdkText">'+esc(draft.sdk)+'</span><span style="margin-left:auto">⌄</span></button></div><label class="ij-check ij-click-check"><input type="checkbox" id="ijSampleCheck" '+(draft.sample?'checked':'')+'><span class="check-ui checked">✓</span>Add sample code</label><button type="button" class="ij-advanced" id="ijAdvancedToggle">›&nbsp;&nbsp;Advanced Settings</button><div class="ij-advanced-body '+(draft.advanced?'show':'')+'" id="ijAdvancedBody"><label>Module name <input class="ij-field" id="ijModuleName" value="'+esc(draft.name)+'"></label></div>'+(jdkOpen?jdkMenuHtml(draft.sdk,"wizard"):'')+'<div class="ij-dialog-actions"><button type="button" class="ij-btn primary" id="ijWizardCreate">Create</button><button type="button" class="ij-btn" id="ijWizardCancel">Cancel</button></div></main></div></section></div>';
 const collect=()=>({
  name:$("ijProjectName")?.value||draft.name,
  location:$("ijProjectLocation")?.value||draft.location,
  sdk:$("ijWizardJdkText")?.textContent||draft.sdk,
  tech:refs.fidelity.querySelector(".ij-tech.active")?.dataset.tech||draft.tech,
  build:refs.fidelity.querySelector("[data-build].active")?.dataset.build||draft.build,
  git:!!$("ijGitCheck")?.checked,
  sample:!!$("ijSampleCheck")?.checked,
  advanced:$("ijAdvancedBody")?.classList.contains("show")
 });
 const updatePreview=()=>{const x=collect(),p=$("ijProjectPathPreview");if(p)p.textContent="Project will be created in: "+x.location+"\\"+x.name};
 refs.fidelity.querySelectorAll("[data-tech]").forEach(btn=>btn.addEventListener("click",()=>{refs.fidelity.querySelectorAll("[data-tech]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");fidelityNotice(btn.dataset.tech+" project type selected")}));
 refs.fidelity.querySelectorAll("[data-generator]").forEach(btn=>btn.addEventListener("click",()=>fidelityNotice(btn.dataset.generator+" generator selected")));
 refs.fidelity.querySelectorAll("[data-build]").forEach(btn=>btn.addEventListener("click",()=>{refs.fidelity.querySelectorAll("[data-build]").forEach(x=>x.classList.remove("active"));btn.classList.add("active")}));
 $("ijProjectName")?.addEventListener("input",updatePreview);$("ijProjectLocation")?.addEventListener("input",updatePreview);
 $("ijLocationBrowse")?.addEventListener("click",()=>{const i=$("ijProjectLocation");if(i){i.value="~\\Desktop\\Java_Codes";updatePreview();i.focus()}fidelityNotice("Project location selected")});
 $("ijWizardSearch")?.addEventListener("click",()=>fidelityNotice("Project type search focused"));
 $("ijAdvancedToggle")?.addEventListener("click",()=>{$("ijAdvancedBody")?.classList.toggle("show")});
 $("ijWizardJdk")?.addEventListener("click",()=>showNewProjectSurface(collect(),!jdkOpen));
 refs.fidelity.querySelectorAll("[data-sdk-value]").forEach(btn=>btn.addEventListener("click",()=>showNewProjectSurface({...collect(),sdk:normalizeSdkChoice(btn.dataset.sdkValue)},false)));
 refs.fidelity.querySelectorAll("[data-sdk-action]").forEach(btn=>btn.addEventListener("click",()=>{const a=btn.dataset.sdkAction;if(a==="disk")showNewProjectSurface({...collect(),sdk:"Oracle OpenJDK 1.8.0_351"},false);else fidelityNotice(a==="download26"?"OpenJDK 26 download selected":"JDK download dialog opened")}));
 $("ijWizardCreate")?.addEventListener("click",()=>{const x=collect();resetScreenshotWorkspace({name:x.name||"App_1",sdk:x.sdk==="<No JDK>"?"<No SDK>":("Java "+sdkLanguageLevel(x.sdk)),languageLevel:sdkLanguageLevel(x.sdk),fidelityMode:true});hideFidelity();fidelityNotice((x.name||"App_1")+" created")});
 const cancel=()=>showWelcomeSurface("Projects");$("ijWizardCancel")?.addEventListener("click",cancel);$("ijWizardClose")?.addEventListener("click",cancel);
}
function contextActionLabel(action){
 const labels={cut:"Cut",copy:"Copy",paste:"Paste",findUsages:"Find Usages",findFiles:"Find in Files",replaceFiles:"Replace in Files",analyze:"Analyze",rename:"Rename",refactor:"Refactor",reformat:"Reformat Code",optimize:"Optimize Imports"};
 return labels[action]||action;
}
function showSimpleCreatePopup(kind){
 refs.fidelity.className="ijFidelityLayer show transparent";
 refs.fidelity.innerHTML='<div class="ij-project-menu-wrap"><form class="ij-mini-create" id="ijMiniCreate"><strong>New '+esc(kind)+'</strong><input id="ijMiniCreateName" class="ij-field" value="'+(kind==="Package"?"com.example":"NewFile")+'" autofocus><div><button type="submit" class="ij-btn primary">Create</button><button type="button" class="ij-btn" id="ijMiniCancel">Cancel</button></div></form></div>';
 $("ijMiniCreate")?.addEventListener("submit",e=>{e.preventDefault();const name=$("ijMiniCreateName")?.value.trim();if(!name)return;if(kind==="Package"){const p=name.replace(/\./g,"/");addTreePath("src/"+p+"/.package","java");deleteTreePath(state.tree,"src/"+p+"/.package");renderTree()}else{const path="src/"+(name.includes(".")?name:name+".txt");files[path]={language:"text",content:""};state.files=clone(files);addTreePath(path,"text");openFile(path)}hideFidelity();fidelityNotice(kind+" created")});
 $("ijMiniCancel")?.addEventListener("click",hideFidelity);
 focusFidelityInput("ijMiniCreateName");
}
function showProjectContextSurface(){
 refs.fidelity.className="ijFidelityLayer show transparent";
 refs.fidelity.innerHTML='<div class="ij-project-menu-wrap"><div class="ij-context" role="menu"><div class="ij-context-row active" id="ijNewMenuRow">New <span class="ij-context-short">›</span><div class="ij-submenu"><button type="button" class="ij-context-row" data-new-kind="Java Class"><span class="ij-type-icon">C</span>Java Class</button><button type="button" class="ij-context-row" data-new-kind="Kotlin Class/File">〈 Kotlin Class/File</button><button type="button" class="ij-context-row" data-new-kind="File">☰ File</button><button type="button" class="ij-context-row" data-new-kind="Scratch File">☷ Scratch File <span class="ij-context-short">Ctrl+Alt+Shift+Insert</span></button><button type="button" class="ij-context-row" data-new-kind="Package">▱ Package</button><button type="button" class="ij-context-row" data-new-kind="package-info.java">▱ package-info.java</button><button type="button" class="ij-context-row" data-new-kind="module-info.java">▱ module-info.java</button><button type="button" class="ij-context-row sep" data-new-kind="Kotlin Notebook">⌁ Kotlin Notebook</button><button type="button" class="ij-context-row" data-new-kind="HTML File">&lt;&gt; HTML File</button><button type="button" class="ij-context-row" data-new-kind="EditorConfig File">⚙ EditorConfig File</button><button type="button" class="ij-context-row" data-new-kind="Resource Bundle">⚙ Resource Bundle</button></div></div><button type="button" class="ij-context-row" data-context-action="cut">✂ Cut <span class="ij-context-short">Ctrl+X</span></button><button type="button" class="ij-context-row" data-context-action="copy">▣ Copy <span class="ij-context-short">Ctrl+C</span></button><button type="button" class="ij-context-row" data-context-action="copyPath">Copy Path/Reference...</button><button type="button" class="ij-context-row" data-context-action="paste">▣ Paste <span class="ij-context-short">Ctrl+V</span></button><button type="button" class="ij-context-row sep" data-context-action="findUsages">Find Usages <span class="ij-context-short">Alt+F7</span></button><button type="button" class="ij-context-row" data-context-action="findFiles">Find in Files... <span class="ij-context-short">Ctrl+Shift+F</span></button><button type="button" class="ij-context-row" data-context-action="replaceFiles">Replace in Files... <span class="ij-context-short">Ctrl+Shift+R</span></button><button type="button" class="ij-context-row" data-context-action="analyze">Analyze <span class="ij-context-short">›</span></button><button type="button" class="ij-context-row sep" data-context-action="rename">Rename... <span class="ij-context-short">Shift+F6</span></button><button type="button" class="ij-context-row" data-context-action="refactor">Refactor <span class="ij-context-short">›</span></button><button type="button" class="ij-context-row sep" data-context-action="reformat">Reformat Code <span class="ij-context-short">Ctrl+Alt+L</span></button><button type="button" class="ij-context-row" data-context-action="optimize">Optimize Imports <span class="ij-context-short">Ctrl+Alt+O</span></button></div></div>';
 refs.fidelity.querySelectorAll("[data-new-kind]").forEach(btn=>btn.addEventListener("click",()=>{
  const kind=btn.dataset.newKind;
  if(kind==="Java Class")showNewJavaClassSurface("Test");
  else if(kind==="Package"||kind==="File")showSimpleCreatePopup(kind);
  else fidelityNotice(kind+" creation selected");
 }));
 refs.fidelity.querySelectorAll("[data-context-action]").forEach(btn=>btn.addEventListener("click",()=>{const action=btn.dataset.contextAction;if(action==="reformat"){if(activeFile&&files[activeFile])files[activeFile].content=String(files[activeFile].content||"").split("\n").map(x=>x.replace(/\s+$/,"")).join("\n");renderEditor()}else if(action==="rename")fidelityNotice("Rename dialog opened");else if(action==="findUsages")genericSurface("Find Usages",{scope:"src"});else if(action==="findFiles")genericSurface("Find in Files",{scope:"Project"});else if(action==="replaceFiles")genericSurface("Replace in Files",{scope:"Project"});else fidelityNotice(contextActionLabel(action)+" action executed");hideFidelity()}));
}
function javaSkeletonForType(name,type){
 const safe=name.replace(/[^\w$]/g,"")||"Test";
 if(type==="Interface")return "public interface "+safe+" {\n}\n";
 if(type==="Record")return "public record "+safe+"() {\n}\n";
 if(type==="Enum")return "public enum "+safe+" {\n}\n";
 if(type==="Annotation")return "public @interface "+safe+" {\n}\n";
 if(type==="Exception")return "public class "+safe+" extends Exception {\n}\n";
 return "public class "+safe+" {\n}\n";
}
function showNewJavaClassSurface(name="Test",selectedType="Class"){
 refs.fidelity.className="ijFidelityLayer show transparent";
 const types=[["Class","C"],["Interface","I"],["Record","R"],["Enum","E"],["Annotation","@"],["Exception","⚡"]];
 refs.fidelity.innerHTML='<div class="ij-project-menu-wrap"><form class="ij-class-pop" id="ijClassForm"><h3>New Java Class</h3><label class="ij-class-input"><span class="ij-type-icon">C</span><input id="ijClassName" value="'+esc(name)+'" aria-label="Java class name"></label>'+types.map(([type,ico])=>'<button type="button" class="ij-class-opt '+(type===selectedType?'active':'')+'" data-class-type="'+type+'"><span class="ij-type-icon">'+ico+'</span>'+type+'</button>').join("")+'<div class="ij-class-help">Enter creates the selected type · Esc cancels</div></form></div>';
 const create=()=>{const nm=$("ijClassName")?.value.trim();if(!nm)return;const path="src/"+nm.replace(/\./g,"/")+".java";files[path]={language:"java",content:javaSkeletonForType(nm.split(".").pop(),selectedType)};state.files=clone(files);addTreePath(path,"java");markGit(path,"A");hideFidelity();openFile(path);fidelityNotice(selectedType+" "+nm+" created")};
 refs.fidelity.querySelectorAll("[data-class-type]").forEach(btn=>btn.addEventListener("click",()=>showNewJavaClassSurface($("ijClassName")?.value||name,btn.dataset.classType)));
 $("ijClassForm")?.addEventListener("submit",e=>{e.preventDefault();create()});
 $("ijClassName")?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();create()}if(e.key==="Escape"){e.preventDefault();hideFidelity()}});
 focusFidelityInput("ijClassName",true);
}
function projectStructureBody(page,draft){
 if(page==="Modules")return '<h2>Modules</h2><div class="desc">Configure module sources, dependencies, and SDK inheritance.</div><div class="ij-ps-card"><strong>'+esc(state.project.name||"App_1")+'</strong><span>Sources · Paths · Dependencies</span></div>';
 if(page==="Libraries")return '<h2>Libraries</h2><div class="desc">Project-level libraries available to modules.</div><div class="ij-ps-empty">No project libraries configured.</div>';
 if(page==="Facets")return '<h2>Facets</h2><div class="desc">Framework facets attached to project modules.</div><div class="ij-ps-empty">No facets configured.</div>';
 if(page==="Artifacts")return '<h2>Artifacts</h2><div class="desc">Build output and artifact packaging.</div><button type="button" class="ij-btn" id="ijAddArtifact">＋ Add artifact</button>';
 if(page==="SDKs")return '<h2>SDKs</h2><div class="desc">Platform SDKs detected for this IntelliJ installation.</div><div class="ij-sdk-list"><button type="button" data-ps-sdk="21" class="ij-sdk-list-row">▱ Oracle OpenJDK 21.0.11 <span>C:\\Program Files\\Java\\jdk-21.0.11</span></button><button type="button" data-ps-sdk="17" class="ij-sdk-list-row">▱ Oracle OpenJDK 17.0.12 <span>C:\\Program Files\\Java\\jdk-17</span></button><button type="button" data-ps-sdk="8" class="ij-sdk-list-row">▱ Oracle OpenJDK 1.8.0_351 <span>C:\\Program Files\\Java\\jdk1.8.0_351</span></button></div><button type="button" class="ij-btn" id="ijAddSdk">＋ Add SDK</button>';
 if(page==="Global Libraries")return '<h2>Global Libraries</h2><div class="desc">Libraries shared across projects.</div><div class="ij-ps-empty">No global libraries configured.</div>';
 if(page==="Problems")return '<h2>Problems</h2><div class="desc">Project configuration issues.</div><div class="ij-ps-empty">'+((state.problems||[]).length?esc(state.problems.map(x=>x.message).join("\n")):"No problems detected.")+'</div>';
 return '<h2>Project</h2><div class="desc">Default settings for all modules. Configure these parameters for each module on the module page as needed.</div><div class="ij-ps-row"><label for="ijPsName">Name:</label><input class="ij-field" id="ijPsName" value="'+esc(draft.name)+'"><span></span></div><div class="ij-ps-row"><span>SDK:</span><button type="button" class="ij-select focus" id="ijPsJdk">▱ <span id="ijPsJdkText">'+esc(draft.sdk)+'</span><span style="margin-left:auto">⌄</span></button><button type="button" class="ij-btn" id="ijPsEdit">Edit</button></div><div class="ij-ps-row"><label for="ijPsLanguage">Language level:</label><select class="ij-select" id="ijPsLanguage">'+["8","17","21"].map(x=>'<option '+(String(draft.languageLevel)===x?'selected':'')+' value="'+x+'">'+x+'</option>').join("")+'</select><span></span></div><div class="ij-ps-row"><label for="ijPsOutput">Compiler output:</label><div class="ij-field-wrap"><input class="ij-field" id="ijPsOutput" value="'+esc(draft.compilerOutput)+'"><button type="button" class="ij-field-icon" id="ijPsBrowse">▱</button></div><span></span></div>';
}
function showProjectStructureSurface(d={}){
 const page=d.page||"Project";
 const draft={
  name:String(d.name??state.project.name??"App_1"),
  sdk:String(d.sdk??state.project.sdk??"Java 21"),
  languageLevel:String(d.languageLevel??state.project.languageLevel??"21"),
  compilerOutput:String(d.compilerOutput??state.compiler?.output??""),
  dirty:d.dirty===true
 };
 const open=!!d.jdkOpen;
 refs.fidelity.className="ijFidelityLayer show";
 const items=["Project","Modules","Libraries","Facets","Artifacts","SDKs","Global Libraries","Problems"];
 refs.fidelity.innerHTML='<div class="ij-screen-dim"><section class="ij-dialog ij-ps" role="dialog" aria-label="Project Structure"><header class="ij-dialog-head"><span class="ij-shot-logo sm">IJ</span><span>Project Structure</span><button type="button" class="ij-dialog-close" id="ijPsClose" aria-label="Close">×</button></header><div class="ij-ps-body"><aside class="ij-ps-left"><div class="ij-ps-group">Project Settings</div>'+items.slice(0,5).map(x=>'<button type="button" class="ij-ps-item '+(page===x?'active':'')+'" data-ps-page="'+x+'">'+x+'</button>').join("")+'<div class="ij-ps-group" style="margin-top:7px">Platform Settings</div>'+items.slice(5,7).map(x=>'<button type="button" class="ij-ps-item '+(page===x?'active':'')+'" data-ps-page="'+x+'">'+x+'</button>').join("")+'<button type="button" class="ij-ps-item '+(page==="Problems"?'active':'')+'" style="margin-top:20px" data-ps-page="Problems">Problems</button></aside><main class="ij-ps-main">'+projectStructureBody(page,draft)+(open&&page==="Project"?jdkMenuHtml(draft.sdk,"projectStructure"):'')+'</main></div><footer class="ij-ps-actions"><button type="button" class="ij-btn primary" id="ijPsOk">OK</button><button type="button" class="ij-btn" id="ijPsCancel">Cancel</button><button type="button" class="ij-btn '+(draft.dirty?'':'disabled')+'" id="ijPsApply" '+(draft.dirty?'':'disabled')+'>Apply</button></footer></section></div>';
 const collect=()=>({
  name:$("ijPsName")?.value||draft.name,
  sdk:$("ijPsJdkText")?.textContent||draft.sdk,
  languageLevel:$("ijPsLanguage")?.value||draft.languageLevel,
  compilerOutput:$("ijPsOutput")?.value||draft.compilerOutput,
  dirty:true
 });
 const rerender=(patch={})=>showProjectStructureSurface({...draft,...collect(),page,...patch});
 refs.fidelity.querySelectorAll("[data-ps-page]").forEach(btn=>btn.addEventListener("click",()=>showProjectStructureSurface({...draft,...collect(),page:btn.dataset.psPage,jdkOpen:false})));
 $("ijPsJdk")?.addEventListener("click",()=>rerender({jdkOpen:!open}));
 refs.fidelity.querySelectorAll("[data-sdk-value]").forEach(btn=>btn.addEventListener("click",()=>showProjectStructureSurface({...draft,...collect(),sdk:normalizeSdkChoice(btn.dataset.sdkValue),dirty:true,page:"Project",jdkOpen:false})));
 refs.fidelity.querySelectorAll("[data-sdk-action]").forEach(btn=>btn.addEventListener("click",()=>{if(btn.dataset.sdkAction==="disk")showProjectStructureSurface({...draft,...collect(),sdk:"Oracle OpenJDK 1.8.0_351",dirty:true,page:"Project",jdkOpen:false});else fidelityNotice("JDK download dialog opened")}));
 refs.fidelity.querySelectorAll("[data-ps-sdk]").forEach(btn=>btn.addEventListener("click",()=>showProjectStructureSurface({...draft,...collect(),sdk:normalizeSdkChoice(btn.dataset.psSdk),dirty:true,page:"Project",jdkOpen:false})));
 $("ijPsEdit")?.addEventListener("click",()=>showProjectStructureSurface({...draft,...collect(),page:"SDKs",jdkOpen:false}));
 $("ijAddSdk")?.addEventListener("click",()=>fidelityNotice("Add SDK from disk chooser opened"));
 $("ijAddArtifact")?.addEventListener("click",()=>fidelityNotice("Artifact creation menu opened"));
 $("ijPsBrowse")?.addEventListener("click",()=>{const i=$("ijPsOutput");if(i){i.value="out";i.focus()}fidelityNotice("Compiler output folder selected")});
 ["ijPsName","ijPsLanguage","ijPsOutput"].forEach(id=>$(id)?.addEventListener("input",()=>{$("ijPsApply")?.removeAttribute("disabled");$("ijPsApply")?.classList.remove("disabled")}));
 const apply=()=>{const x=collect();state.project.name=x.name;state.project.sdk=x.sdk;state.project.languageLevel=x.languageLevel;state.compiler={...(state.compiler||{}),output:x.compilerOutput};renderAll();fidelityNotice("Project Structure settings applied")};
 $("ijPsApply")?.addEventListener("click",()=>{apply();showProjectStructureSurface({...collect(),page,jdkOpen:false,dirty:false})});
 $("ijPsOk")?.addEventListener("click",()=>{apply();hideFidelity()});
 const cancel=()=>hideFidelity();$("ijPsCancel")?.addEventListener("click",cancel);$("ijPsClose")?.addEventListener("click",cancel);
}


function ensureFidelityFile(path,content){
 files[path]={language:"java",content:String(content||"")};state.files=clone(files);addTreePath(path,"java");activeFile=path;if(!openTabs.includes(path))openTabs.push(path);renderAll();
}
function showScreenshotCompletion(kind,d={}){
 hideFidelity();
 const file=d.file||activeFile||"src/Test.java";
 if(!files[file])ensureFidelityFile(file,"public class Test {\n    \n}\n");else{activeFile=file;if(!openTabs.includes(file))openTabs.push(file);renderAll()}
 popupKind="completion";
 refs.completion.className="popup completion show ij-completion-shot";
 const mainItems=kind==="main"
  ?[{label:"main",desc:"main() method declaration",insert:"public static void main(String[] args) {\n    \n}"}]
  :[
    {label:"sout",desc:"Prints a string to System.out",insert:'System.out.println("Welcome to java ");'},
    {label:"short",desc:"keyword",insert:"short "},{label:"super",desc:"keyword",insert:"super"},{label:"switch",desc:"keyword",insert:"switch"},{label:"synchronized",desc:"keyword",insert:"synchronized "},
    {label:"args",desc:"String[]",insert:"args"},{label:"serr",desc:"Prints a string to System.err",insert:"System.err.println();"},
    {label:"souf",desc:"Prints a formatted string to System.out",insert:'System.out.printf("");'},
    {label:"soutm",desc:"Prints current class and method names",insert:'System.out.println("Test.main");'},
    {label:"soutp",desc:"Prints method parameter names and values",insert:'System.out.println("args = " + args);'}
  ];
 refs.completion.innerHTML=mainItems.map((it,i)=>'<button type="button" class="popupRow '+(i===0?'active':'')+'" data-completion-index="'+i+'"><strong>'+esc(it.label)+'</strong><span>'+esc(it.desc)+'</span></button>').join("")+'<div class="ij-completion-tip">Press Ctrl+Space to see non-imported classes <span>Next Tip</span> 💡 ⋮</div>';
 refs.completion.querySelectorAll("[data-completion-index]").forEach(btn=>btn.addEventListener("click",()=>{
   const it=mainItems[Number(btn.dataset.completionIndex)]||mainItems[0];
   const current=String(files[file]?.content||"");
   if(kind==="main"){
     files[file].content=current.includes("main(String[]")?current:current.replace(/\n}\s*$/,"\n    "+it.insert.replace(/\n/g,"\n    ")+"\n}\n");
   }else{
     files[file].content=current.includes("System.out.println")?current:current.replace(/\n\s*}\s*\n}\s*$/,'\n        '+it.insert+'\n    }\n}\n');
   }
   state.files=clone(files);markGit(file,"M");refs.completion.classList.remove("show");renderEditor();fidelityNotice(it.label+" inserted");
 }));
}
function showRunConsoleScreenshot(d={}){
 hideFidelity();
 if(!state.visibleFeatures.includes("run"))state.visibleFeatures.push("run");
 activeBottom="run";
 state.activeRunConfiguration=d.name||"Test";
 state.console=String(d.text||"Welcome to java \n\nProcess finished with exit code 0");
 if(!state.tree.some(n=>n.path==="out"))state.tree.splice(Math.min(1,state.tree.length),0,{name:"out",path:"out",type:"folder",open:false,children:[]});
 if(!state.tree.some(n=>n.path==="App_1.iml"))state.tree.push({name:"App_1.iml",path:"App_1.iml",type:"file",language:"text"});
 renderAll();
 setBottom("run",'<div class="processBar"><span class="processName">▣ '+esc(state.activeRunConfiguration)+'</span><span class="grow"></span><button type="button" id="ijRunRerun">↻</button><button type="button" id="ijRunStop">■</button><button type="button" id="ijRunHide">−</button></div><pre class="toolConsole"><span class="ij-console-selection">'+esc(String(d.output||"Welcome to java "))+'</span>\n\nProcess finished with exit code 0</pre>',true);
 refs.bottom.querySelector("#ijRunRerun")?.addEventListener("click",()=>showRunConsoleScreenshot(d));
 refs.bottom.querySelector("#ijRunStop")?.addEventListener("click",()=>fidelityNotice("Process already finished"));
 refs.bottom.querySelector("#ijRunHide")?.addEventListener("click",()=>{state.visibleFeatures=state.visibleFeatures.filter(x=>x!=="run");renderFeatureVisibility()});
}
function showNewPackageSurface(d={}){
 refs.fidelity.className="ijFidelityLayer show transparent";
 refs.fidelity.innerHTML='<div class="ij-project-menu-wrap"><form class="ij-package-pop" id="ijPackageForm"><strong>New Package</strong><input id="ijPackageName" class="ij-field" value="'+esc(d.name||"pkg")+'" aria-label="Package name"></form></div>';
 const create=()=>{const name=$("ijPackageName")?.value.trim();if(!name)return;const p="src/"+name.replace(/\./g,"/");addTreePath(p+"/.package","java");deleteTreePath(state.tree,p+"/.package");renderTree();hideFidelity();fidelityNotice("Package "+name+" created")};
 $("ijPackageForm")?.addEventListener("submit",e=>{e.preventDefault();create()});
 $("ijPackageName")?.addEventListener("keydown",e=>{if(e.key==="Escape"){e.preventDefault();hideFidelity()}});
 focusFidelityInput("ijPackageName",true);
}
function moveOneFile(file,targetPackage){
 if(!files[file])return null;
 const base=file.split("/").pop(),newPath="src/"+targetPackage.replace(/\./g,"/")+"/"+base;
 let content=String(files[file].content||"");
 const pkg="package "+targetPackage+";";
 content=/^\s*package\s+[\w.]+\s*;/m.test(content)?content.replace(/^\s*package\s+[\w.]+\s*;/m,pkg):pkg+"\n\n"+content;
 files[newPath]={...files[file],content};delete files[file];state.files=clone(files);
 deleteTreePath(state.tree,file);addTreePath(newPath,"java");
 openTabs=openTabs.map(x=>x===file?newPath:x);if(activeFile===file)activeFile=newPath;markGit(newPath,"M");
 return newPath;
}
function showMoveRefactorSurface(d={}){
 const selected=(d.files||[d.file||activeFile]).filter(Boolean);
 const target=d.targetPackage||"pkg2";
 refs.fidelity.className="ijFidelityLayer show";
 refs.fidelity.innerHTML='<div class="ij-screen-dim"><section class="ij-dialog ij-move-dialog"><header class="ij-dialog-head"><span class="ij-shot-logo sm">IJ</span><span>Move</span><button type="button" class="ij-dialog-close" id="ijMoveClose">×</button></header><main class="ij-move-main"><div class="ij-move-row"><span>Move:</span><div>'+selected.map(x=>esc(x.split("/").pop().replace(/\.java$/,""))).join("<br>")+'</div></div><div class="ij-move-row"><label for="ijMoveTarget">To directory:</label><div class="ij-field-wrap"><input class="ij-field focus" id="ijMoveTarget" value="'+esc(d.targetPath||("C:\\Users\\User\\Desktop\\Java_Codes\\App_1\\src\\"+target))+'"><button type="button" class="ij-field-icon" id="ijMoveBrowse">▱</button></div></div><div class="ij-move-hint">Use Ctrl+Space for path completion</div><label class="ij-check ij-click-check"><input type="checkbox" checked id="ijMoveComments"><span class="check-ui checked">✓</span>Search in comments and strings</label><label class="ij-check ij-click-check"><input type="checkbox" checked id="ijMoveText"><span class="check-ui checked">✓</span>Search for text occurrences</label><label class="ij-check ij-click-check"><input type="checkbox" id="ijMoveOpen"><span class="check-ui"></span>Open in editor</label><div class="ij-dialog-actions"><button type="button" class="ij-btn primary" id="ijMoveRefactor">Refactor</button><button type="button" class="ij-btn" id="ijMovePreview">Preview</button><button type="button" class="ij-btn" id="ijMoveCancel">Cancel</button></div></main></section></div>';
 const doMove=()=>{const raw=$("ijMoveTarget")?.value||"";const pkg=(raw.split(/[/\\]/).filter(Boolean).pop()||target).replace(/[^\w.]/g,"")||target;let moved=[];selected.forEach(x=>{const n=moveOneFile(x,pkg);if(n)moved.push(n)});hideFidelity();renderAll();fidelityNotice("Moved "+moved.length+" file"+(moved.length===1?"":"s")+" to "+pkg)};
 $("ijMoveRefactor")?.addEventListener("click",doMove);
 $("ijMovePreview")?.addEventListener("click",()=>showRefactoringPreviewSurface({file:selected[0],text:'System.out.println("Welcome to java ");'}));
 $("ijMoveCancel")?.addEventListener("click",hideFidelity);$("ijMoveClose")?.addEventListener("click",hideFidelity);
 $("ijMoveBrowse")?.addEventListener("click",()=>{const i=$("ijMoveTarget");if(i){i.value="C:\\Users\\User\\Desktop\\Java_Codes\\App_1\\src\\pkg2";i.focus()}});
}
function showRefactoringPreviewSurface(d={}){
 hideFidelity();
 refs.fidelity.className="ijFidelityLayer show transparent";
 const text=d.text||'System.out.println("Welcome to java ");';
 refs.fidelity.innerHTML='<section class="ij-refactor-preview"><header><strong>Find</strong><span>Refactoring Preview</span><button type="button" id="ijRefPreviewClose">×</button></header><div class="ij-refactor-grid"><div class="ij-refactor-results"><div class="ij-refactor-title">◉ main(String[]) <span>1 result</span></div><button type="button" class="ij-refactor-result active">4 '+esc(text)+'</button><div class="ij-refactor-actions"><button type="button" class="ij-btn" id="ijPreviewRefactor">Refactor</button><button type="button" class="ij-btn" id="ijPreviewCancel">Cancel</button></div></div><pre class="ij-refactor-code">3    public static void main(String[] args) {\n4        '+esc(text)+'\n5    }</pre></div></section>';
 const close=()=>hideFidelity();$("ijRefPreviewClose")?.addEventListener("click",close);$("ijPreviewCancel")?.addEventListener("click",close);$("ijPreviewRefactor")?.addEventListener("click",()=>{close();fidelityNotice("Refactoring applied")});
}
function showTabContextSurface(d={}){
 refs.fidelity.className="ijFidelityLayer show transparent";
 const file=d.file||activeFile||openTabs[0];
 const items=[
  ["close","Close","Ctrl+F4"],["closeOthers","Close Other Tabs",""],["closeAll","Close All Tabs",""],["closeLeft","Close Tabs to the Left",""],["closeRight","Close Tabs to the Right",""],
  ["copyPath","Copy Path/Reference...",""],["splitRight","▣ Split Right",""],["splitMoveRight","Split and Move Right",""],["splitDown","▤ Split Down",""],["splitMoveDown","Split and Move Down",""],
  ["pin","Pin Tab",""],["newWindow","Open Tab in New Window","Shift+F4"],["configure","Configure Editor Tabs...",""],["reopen","Reopen Closed Tab",""],["bookmarks","Bookmarks","›"],["override","Override File Type",""]
 ];
 refs.fidelity.innerHTML='<div class="ij-project-menu-wrap"><div class="ij-tab-context">'+items.map((it,i)=>'<button type="button" data-tab-action="'+it[0]+'" class="'+(i===1?'active':'')+'"><span>'+it[1]+'</span><small>'+it[2]+'</small></button>').join("")+'</div></div>';
 const idx=openTabs.indexOf(file);
 refs.fidelity.querySelectorAll("[data-tab-action]").forEach(btn=>btn.addEventListener("click",()=>{
  const a=btn.dataset.tabAction;hideFidelity();
  if(a==="close")closeFile(file);
  else if(a==="closeOthers"){openTabs=[file];activeFile=file;renderAll()}
  else if(a==="closeAll"){openTabs=[];activeFile=null;renderAll()}
  else if(a==="closeLeft"){openTabs=openTabs.slice(Math.max(0,idx));renderAll()}
  else if(a==="closeRight"){openTabs=openTabs.slice(0,idx+1);renderAll()}
  else if(a==="splitRight"||a==="splitDown"||a==="splitMoveRight"||a==="splitMoveDown"){state.editorSplit=true;state.splitFile=file;renderAll();fidelityNotice(a.includes("Down")?"Editor split down":"Editor split right")}
  else if(a==="pin"){if(files[file])files[file].pinned=true;renderTabs()}
  else if(a==="copyPath")fidelityNotice(file)
  else fidelityNotice(btn.querySelector("span")?.textContent+" selected");
 }));
}
function showSymbolInfoSurface(d={}){
 refs.fidelity.className="ijFidelityLayer show transparent";
 refs.fidelity.innerHTML='<div class="ij-project-menu-wrap"><section class="ij-symbol-card"><div>▱ <a href="#" id="ijSymbolPkg">'+esc(d.package||"pkg1")+'</a></div><div class="ij-symbol-decl">public class <strong>'+esc(d.className||"Hello1")+'</strong></div><div class="ij-symbol-project">▱ '+esc(state.project.name||"App_1")+'<button type="button" id="ijSymbolEdit">✎</button><button type="button" id="ijSymbolMore">⋮</button></div></section></div>';
 $("ijSymbolPkg")?.addEventListener("click",e=>{e.preventDefault();fidelityNotice("Package "+(d.package||"pkg1")+" selected")});$("ijSymbolEdit")?.addEventListener("click",()=>fidelityNotice("Edit source action opened"));$("ijSymbolMore")?.addEventListener("click",()=>fidelityNotice("More symbol actions opened"));
}
function showPopup(kind,items){popupKind=kind;const el=kind==="completion"?refs.completion:refs.intentions;el.innerHTML=(items||[]).map((x,i)=>'<div class="popupRow '+(i===0?"active":"")+'">'+esc(typeof x==="string"?x:(x.label||x.text||JSON.stringify(x)))+'</div>').join("");el.classList.add("show")}
function clearTransient(action){clearTimeout(notificationTimer);refs.notification.classList.remove("show");refs.menuPopup.classList.remove("show");refs.completion.classList.remove("show");refs.intentions.classList.remove("show");hideFidelity();popupKind="";const continueModal=["setProgramArguments","setVmOptions","setEnvironmentVariables","setWorkingDirectory","addSdk","setProjectSdk","setLanguageLevel","setModuleSdk","configureCompiler","installPlugin"];if(modalKind&&!continueModal.includes(action))closeModal()}
function markerReplace(src,marker,code,position="replace"){const s=String(src),m=String(marker||"");const idx=s.indexOf(m);if(idx<0)return null;const ins=String(code||"");if(position==="before")return s.slice(0,idx)+ins+s.slice(idx);if(position==="after")return s.slice(0,idx+m.length)+ins+s.slice(idx+m.length);return s.slice(0,idx)+ins+s.slice(idx+m.length)}
async function typeText(final,apply,animate,token){if(!animate||!autoType){apply(final);return}const n=Math.min(55,Math.max(1,final.length));for(let i=1;i<=n;i++){if(token!==seekToken)return;apply(final.slice(0,Math.floor(final.length*i/n)));await sleep(Math.min(1000,Math.max(250,final.length*5))/n)}}
function addTreePath(path,language="java"){const parts=path.split("/");let nodes=state.tree,acc="";parts.forEach((part,i)=>{acc=acc?acc+"/"+part:part;let n=nodes.find(x=>(x.path||x.name)===acc);if(!n){n={name:part,path:acc,type:i===parts.length-1?"file":"folder",language:i===parts.length-1?language:undefined,open:true,children:i===parts.length-1?undefined:[]};nodes.push(n)}if(i<parts.length-1){n.children=n.children||[];nodes=n.children}})}
function ensureMavenArtifacts(goal){if(!/(compile|test|package|verify|install|deploy)/.test(String(goal||"")))return;Object.keys(files).filter(p=>p.endsWith(".java")).slice(0,6).forEach(p=>{const cls="target/classes/"+p.split("/").pop().replace(/\.java$/,".class");if(!files[cls]){files[cls]={language:"text",content:"compiled bytecode artifact"};addTreePath(cls,"text")}});if(/(package|verify|install|deploy)/.test(String(goal||""))){const jar="target/"+String(state.project?.name||"application").replace(/\s+/g,"-").toLowerCase()+".jar";files[jar]={language:"text",content:"Java archive"};addTreePath(jar,"text")}state.files=clone(files);renderTree()}
function renameTreePath(nodes,oldp,newp){for(const n of nodes||[]){if(n.path===oldp){n.path=newp;n.name=newp.split("/").pop()}if(n.children)renameTreePath(n.children,oldp,newp)}}
function deleteTreePath(nodes,p){for(let i=nodes.length-1;i>=0;i--){if(nodes[i].path===p)nodes.splice(i,1);else if(nodes[i].children)deleteTreePath(nodes[i].children,p)}}
function addProblem(d){state.problems.push({severity:d.severity||"warning",message:d.message||"Inspection problem",file:d.file||activeFile,line:d.line||1})}
function resultTable(cols,rows){return '<table class="dataTable"><tr>'+cols.map(c=>'<th>'+esc(c)+'</th>').join("")+'</tr>'+rows.map(r=>'<tr>'+cols.map(c=>'<td>'+esc(Array.isArray(r)?r[cols.indexOf(c)]:r[c])+'</td>').join("")+'</tr>').join("")+'</table>'}

function p0KindIcon(kind){
 const k=String(kind||"").toLowerCase();
 if(k.includes("class"))return "C";
 if(k.includes("method")||k.includes("symbol"))return "m";
 if(k.includes("action"))return "⚡";
 if(k.includes("file"))return "▤";
 return "•";
}
function p0EnsureResultFile(item){
 const path=item?.path||item?.file;
 if(!path)return null;
 if(!files[path]){
  const line=Math.max(1,Number(item.line||1));
  const preview=String(item.preview||item.snippet||("// "+(item.name||"Search result")));
  files[path]={language:path.endsWith(".java")?"java":path.endsWith(".xml")?"xml":"text",content:Array(Math.max(0,line-1)).fill("").concat([preview,""]).join("\n")};
  state.files=clone(files);addTreePath(path,files[path].language);
 }
 return path;
}
function p0OpenResult(item){
 const path=p0EnsureResultFile(item);
 if(!path)return;
 hideFidelity();
 openFile(path);
 const line=Math.max(1,Number(item.line||1));
 focusRange={file:path,lines:[line]};
 state.editorCaret={file:path,line,column:Number(item.column||0)};
 renderEditor();
 const el=refs.code.querySelector('[data-line="'+line+'"]');
 window.SIM_FOCUS?.follow(el,{block:"center"});
 actionStatus((item.name||path)+" · line "+line);
}
function p0DefaultSearchResults(kind){
 const entries=Object.keys(files).slice(0,12).map(path=>({kind:"File",name:path.split("/").pop(),path,line:1,detail:path}));
 if(entries.length)return entries;
 return [
  {kind:"Class",name:"ProjectService",path:"src/main/java/com/aerotopo/service/ProjectService.java",line:8,detail:"com.aerotopo.service"},
  {kind:"File",name:"ProjectController.java",path:"src/main/java/com/aerotopo/api/ProjectController.java",line:1,detail:"src/main/java/com/aerotopo/api"},
  {kind:"Symbol",name:"findProjectById()",path:"src/main/java/com/aerotopo/service/ProjectService.java",line:24,detail:"ProjectService"},
  {kind:"Action",name:"Reformat Code",detail:"Ctrl+Alt+L"}
 ];
}
function showP0SearchSurface(kind,d={}){
 const titles={searchEverywhere:"Search Everywhere",gotoFile:"Go to File",gotoClass:"Go to Class",gotoSymbol:"Go to Symbol"};
 const title=titles[kind]||"Search Everywhere";
 const results=clone(d.results||p0DefaultSearchResults(kind));
 const tabs=kind==="searchEverywhere"?["All","Classes","Files","Symbols","Actions"]:[title.replace("Go to ","")+"s"];
 refs.fidelity.className="ijFidelityLayer show transparent";
 refs.fidelity.innerHTML='<div class="ij-p0-center ij-search-popup" role="dialog" aria-label="'+esc(title)+'">'+
  '<div class="ij-p0-search-head"><span class="ij-p0-search-icon">⌕</span><input id="ijP0SearchInput" value="'+esc(d.query||"")+'" placeholder="'+esc(title)+'"><kbd>'+esc(kind==="searchEverywhere"?"Double Shift":"Ctrl+N")+'</kbd><button type="button" id="ijP0SearchClose">×</button></div>'+
  '<div class="ij-p0-tabs">'+tabs.map((t,i)=>'<button type="button" data-search-tab="'+esc(t)+'" class="'+(i===0?"active":"")+'">'+esc(t)+'</button>').join("")+'</div>'+
  '<div class="ij-p0-results" id="ijP0SearchResults">'+results.map((r,i)=>'<button type="button" class="ij-p0-result '+(i===0?"selected":"")+'" data-result-index="'+i+'" data-result-kind="'+esc(r.kind||"File")+'"><span class="ij-p0-kind">'+esc(p0KindIcon(r.kind))+'</span><span><strong>'+esc(r.name||r.path||"Result")+'</strong><small>'+esc(r.detail||r.path||"")+'</small></span><em>'+esc(r.shortcut||((r.path||r.file)?(":"+Number(r.line||1)):""))+'</em></button>').join("")+'</div>'+
  '<div class="ij-p0-foot"><span id="ijP0SearchCount">'+results.length+' results</span><span>↑↓ select · Enter open · Esc close</span></div></div>';
 const input=$("ijP0SearchInput"),rows=()=>[...refs.fidelity.querySelectorAll(".ij-p0-result:not(.filtered)")];
 let cursor=0;
 const select=n=>{const list=rows();if(!list.length)return;cursor=(n+list.length)%list.length;list.forEach((x,i)=>x.classList.toggle("selected",i===cursor));list[cursor].scrollIntoView({block:"nearest"})};
 const filter=()=>{
  const q=String(input?.value||"").trim().toLowerCase();
  const activeTab=refs.fidelity.querySelector("[data-search-tab].active")?.dataset.searchTab||"All";
  refs.fidelity.querySelectorAll(".ij-p0-result").forEach(row=>{
   const r=results[Number(row.dataset.resultIndex)]||{};
   const text=(r.name+" "+(r.detail||"")+" "+(r.path||"")).toLowerCase();
   const kindLabel=String(r.kind||"").toLowerCase();
   const normalizedTab=activeTab==="Classes"?"class":activeTab.toLowerCase().replace(/s$/,"");const tabOk=activeTab==="All"||kindLabel.startsWith(normalizedTab);
   row.classList.toggle("filtered",!(tabOk&&(!q||text.includes(q))));
  });
  cursor=0;select(0);const n=rows().length;if($("ijP0SearchCount"))$("ijP0SearchCount").textContent=n+" result"+(n===1?"":"s");
 };
 refs.fidelity.querySelectorAll("[data-search-tab]").forEach(btn=>btn.addEventListener("click",()=>{refs.fidelity.querySelectorAll("[data-search-tab]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");filter()}));
 refs.fidelity.querySelectorAll(".ij-p0-result").forEach(row=>row.addEventListener("click",()=>p0OpenResult(results[Number(row.dataset.resultIndex)])));
 input?.addEventListener("input",filter);
 input?.addEventListener("keydown",e=>{if(e.key==="ArrowDown"){e.preventDefault();select(cursor+1)}else if(e.key==="ArrowUp"){e.preventDefault();select(cursor-1)}else if(e.key==="Enter"){e.preventDefault();const list=rows();if(list[cursor])p0OpenResult(results[Number(list[cursor].dataset.resultIndex)])}else if(e.key==="Escape"){e.preventDefault();hideFidelity()}});
 $("ijP0SearchClose")?.addEventListener("click",hideFidelity);
 filter();focusFidelityInput("ijP0SearchInput",true);
}
function showP0FindSurface(d={}){
 const results=clone(d.results||[
  {file:"src/main/java/com/aerotopo/service/ProjectService.java",line:24,preview:"return repository.findById(id).orElseThrow();"},
  {file:"src/main/java/com/aerotopo/api/ProjectController.java",line:31,preview:"return service.findById(id);"}
 ]);
 const replaceMode=d.replace!==undefined||d.uiState==="replace";
 refs.fidelity.className="ijFidelityLayer show transparent";
 refs.fidelity.innerHTML='<div class="ij-p0-center ij-find-popup"><div class="ij-find-title"><strong>'+(replaceMode?"Replace in Files":"Find in Files")+'</strong><button id="ijFindClose">×</button></div>'+
  '<div class="ij-find-fields"><div><span>⌕</span><input id="ijFindQuery" value="'+esc(d.query||d.text||"findById")+'"></div>'+
  (replaceMode?'<div><span>↳</span><input id="ijReplaceQuery" value="'+esc(d.replace||"findProjectById")+'"></div>':"")+'</div>'+
  '<div class="ij-find-tools"><button data-find-toggle="case">Aa</button><button data-find-toggle="word">W</button><button data-find-toggle="regex">.*</button><label>Scope <select id="ijFindScope"><option>Project</option><option>Module</option><option>Directory</option></select></label><span class="grow"></span>'+(replaceMode?'<button class="ij-primary" id="ijReplaceAll">Replace All</button>':'')+'</div>'+
  '<div class="ij-find-results">'+results.map((r,i)=>'<button type="button" class="ij-find-result" data-find-index="'+i+'"><span class="ij-find-path">'+esc(r.file||r.path||"")+' : '+Number(r.line||1)+'</span><span>'+esc(r.preview||r.snippet||"")+'</span></button>').join("")+'</div>'+
  '<div class="ij-p0-foot"><span>'+results.length+' matches in '+new Set(results.map(r=>r.file||r.path)).size+' files</span><span>Click a result to open source</span></div></div>';
 refs.fidelity.querySelectorAll("[data-find-toggle]").forEach(b=>b.addEventListener("click",()=>b.classList.toggle("active")));
 refs.fidelity.querySelectorAll("[data-find-index]").forEach(row=>row.addEventListener("click",()=>p0OpenResult(results[Number(row.dataset.findIndex)])));
 $("ijFindClose")?.addEventListener("click",hideFidelity);
 $("ijFindQuery")?.addEventListener("input",e=>{const q=e.target.value.toLowerCase();refs.fidelity.querySelectorAll("[data-find-index]").forEach(row=>row.classList.toggle("filtered",!row.textContent.toLowerCase().includes(q)))});
 $("ijReplaceAll")?.addEventListener("click",()=>{
  const q=String($("ijFindQuery")?.value||""),rep=String($("ijReplaceQuery")?.value||"");let changed=0;
  Object.keys(files).forEach(path=>{const old=String(files[path].content||"");if(q&&old.includes(q)){files[path].content=old.split(q).join(rep);files[path].dirty=true;markGit(path,"M");changed++}});
  state.files=clone(files);renderAll();fidelityNotice("Replaced in "+changed+" file"+(changed===1?"":"s"));hideFidelity();
 });
 focusFidelityInput("ijFindQuery",true);
}
function showP0FindUsagesSurface(d={}){
 const symbol=d.symbol||d.name||"findById";
 const results=clone(d.results||[
  {file:"src/main/java/com/aerotopo/api/ProjectController.java",line:31,preview:"service.findById(id)"},
  {file:"src/test/java/com/aerotopo/service/ProjectServiceTest.java",line:44,preview:"service.findById(42L)"}
 ]);
 refs.fidelity.className="ijFidelityLayer show transparent";
 refs.fidelity.innerHTML='<section class="ij-p0-bottom"><header><strong>Find</strong><span class="active">Usages of '+esc(symbol)+'</span><div class="grow"></div><button id="ijUsagesRerun">↻</button><button id="ijUsagesClose">×</button></header><div class="ij-usages-grid"><div class="ij-usages-tree"><div class="ij-usages-summary">▾ Project Files <em>'+results.length+' usages</em></div>'+results.map((r,i)=>'<button type="button" data-usage-index="'+i+'"><span>▤ '+esc((r.file||"").split("/").pop())+'</span><small>'+esc(r.file||"")+' : '+Number(r.line||1)+'</small><code>'+esc(r.preview||"")+'</code></button>').join("")+'</div><pre class="ij-usages-preview" id="ijUsagesPreview">'+esc(results[0]?.preview||"No usages")+'</pre></div></section>';
 const show=i=>{const r=results[i];if(!r)return;$("ijUsagesPreview").textContent=(r.file||"")+" : "+(r.line||1)+"\n\n"+(r.preview||"")};
 refs.fidelity.querySelectorAll("[data-usage-index]").forEach(row=>{row.addEventListener("click",()=>show(Number(row.dataset.usageIndex)));row.addEventListener("dblclick",()=>p0OpenResult(results[Number(row.dataset.usageIndex)]))});
 $("ijUsagesRerun")?.addEventListener("click",()=>fidelityNotice("Find Usages refreshed"));
 $("ijUsagesClose")?.addEventListener("click",hideFidelity);
}
function applyP0Rename(oldName,newName){
 if(!oldName||!newName)return 0;let changed=0;
 Object.keys(files).forEach(path=>{const src=String(files[path].content||"");const next=src.split(oldName).join(newName);if(next!==src){files[path].content=next;files[path].dirty=true;markGit(path,"M");changed++}});
 state.files=clone(files);renderAll();return changed;
}
function showP0RefactorSurface(kind,d={}){
 const symbol=d.symbol||d.oldName||"findById",suggested=d.newName||"findProjectById";
 const usages=clone(d.usages||d.results||[{file:d.file||activeFile||"src/main/java/com/aerotopo/service/ProjectService.java",line:d.line||24,preview:symbol+"(...)"}]);
 refs.fidelity.className="ijFidelityLayer show";
 refs.fidelity.innerHTML='<div class="ij-screen-dim"><section class="ij-dialog ij-refactor-dialog"><header class="ij-dialog-head"><span class="ij-shot-logo sm">IJ</span><span>'+esc(kind==="safeDelete"?"Safe Delete":"Rename")+'</span><button class="ij-dialog-close" id="ijRefactorClose">×</button></header><main><label>Rename <strong>'+esc(symbol)+'</strong> to:</label><input class="ij-field focus" id="ijRefactorName" value="'+esc(suggested)+'"><label class="ij-check ij-click-check"><input type="checkbox" checked><span class="check-ui checked">✓</span>Search in comments and strings</label><label class="ij-check ij-click-check"><input type="checkbox" checked><span class="check-ui checked">✓</span>Search for text occurrences</label><div class="ij-refactor-impact"><strong>'+usages.length+' usages will be affected</strong>'+usages.slice(0,4).map(r=>'<span>'+esc(r.file||"")+' : '+Number(r.line||1)+'</span>').join("")+'</div></main><footer><button class="ij-btn primary" id="ijRefactorApply">Refactor</button><button class="ij-btn" id="ijRefactorPreviewBtn">Preview</button><button class="ij-btn" id="ijRefactorCancel">Cancel</button></footer></section></div>';
 const close=()=>hideFidelity();
 $("ijRefactorClose")?.addEventListener("click",close);$("ijRefactorCancel")?.addEventListener("click",close);
 $("ijRefactorPreviewBtn")?.addEventListener("click",()=>showRefactoringPreviewSurface({file:usages[0]?.file,text:usages[0]?.preview||symbol,results:usages}));
 $("ijRefactorApply")?.addEventListener("click",()=>{const next=$("ijRefactorName")?.value.trim()||suggested;const count=applyP0Rename(symbol,next);hideFidelity();fidelityNotice("Refactored "+count+" file"+(count===1?"":"s"))});
 focusFidelityInput("ijRefactorName",true);
}
function renderP0DebuggerTool(){
 const dbg=state.debug||{},frames=dbg.frames||[],vars=dbg.variables||[],watches=dbg.watches||[];
 setBottom("debug",'<div class="ij-debug-tool"><div class="ij-debug-toolbar"><button data-debug-cmd="resume" title="Resume">▶</button><button data-debug-cmd="pause" title="Pause">Ⅱ</button><button data-debug-cmd="stepOver" title="Step Over">↷</button><button data-debug-cmd="stepInto" title="Step Into">↓</button><button data-debug-cmd="stepOut" title="Step Out">↑</button><button data-debug-cmd="stop" title="Stop">■</button><span class="ij-debug-state">'+esc(dbg.running===false?"Stopped":"Paused at breakpoint")+'</span></div><div class="ij-debug-grid"><section><h4>Frames</h4>'+frames.map((f,i)=>'<button data-debug-frame="'+i+'" class="'+(i===Number(dbg.frameIndex||0)?"selected":"")+'"><strong>'+esc(f.name||f.method||"frame")+'</strong><small>'+esc(f.file||"")+' : '+Number(f.line||1)+'</small></button>').join("")+'</section><section><h4>Variables</h4>'+vars.map(v=>'<div class="ij-debug-var"><span>▸ '+esc(v.name||"value")+'</span><code>'+esc(v.value??"null")+'</code><em>'+esc(v.type||"")+'</em></div>').join("")+'<h4>Watches</h4>'+watches.map(w=>'<div class="ij-debug-var"><span>◉ '+esc(w.expression||"")+'</span><code>'+esc(w.result??"")+'</code></div>').join("")+'<div class="ij-watch-add"><input id="ijWatchInput" placeholder="Add watch"><button id="ijWatchAdd">＋</button></div></section><section class="ij-debug-console"><h4>Console</h4><pre>'+esc(dbg.console||state.console||"Debugger attached")+'</pre></section></div></div>',true);
 refs.bottom.querySelectorAll("[data-debug-cmd]").forEach(btn=>btn.addEventListener("click",()=>{
  const cmd=btn.dataset.debugCmd;
  if(cmd==="stop"){state.debug.running=false;state.debug.console=(state.debug.console||"")+"\nDisconnected from target VM"}
  else if(cmd==="resume"){state.debug.running=true;state.debug.console=(state.debug.console||"")+"\nResumed"}
  else{state.debug.running=false;const frame=frames[Number(state.debug.frameIndex||0)]||frames[0];if(frame){frame.line=Number(frame.line||1)+1;state.debug.currentFile=frame.file;state.debug.currentLine=frame.line;if(frame.file&&files[frame.file]){activeFile=frame.file;focusRange={file:frame.file,lines:[frame.line]};renderEditor()}}}
  actionStatus(cmd);renderP0DebuggerTool();
 }));
 refs.bottom.querySelectorAll("[data-debug-frame]").forEach(btn=>btn.addEventListener("click",()=>{state.debug.frameIndex=Number(btn.dataset.debugFrame);const f=frames[state.debug.frameIndex];if(f?.file){p0OpenResult(f)}renderP0DebuggerTool()}));
 refs.bottom.querySelector("#ijWatchAdd")?.addEventListener("click",()=>{const expression=refs.bottom.querySelector("#ijWatchInput")?.value.trim();if(!expression)return;state.debug.watches=state.debug.watches||[];state.debug.watches.push({expression,result:"<not evaluated>"});renderP0DebuggerTool()});
}
function renderP0JUnitTool(){
 const t=state.tests||{},results=t.results||[],selected=results[Number(t.selectedIndex||0)]||results[0];
 setBottom("tests",'<div class="ij-tests-tool"><div class="ij-tests-toolbar"><button id="ijTestsRerun">↻ Rerun</button><button id="ijTestsFailed">↻ Failed</button><span class="ij-test-summary '+(Number(t.failed||0)?"fail":"pass")+'">'+Number(t.passed||0)+' passed · '+Number(t.failed||0)+' failed · '+esc(t.duration||"0.42 s")+'</span></div><div class="ij-tests-grid"><section><div class="ij-test-suite">▾ '+esc(t.suite||"ProjectServiceTest")+'</div>'+results.map((x,i)=>'<button data-test-index="'+i+'" class="'+(i===Number(t.selectedIndex||0)?"selected":"")+'"><span class="'+(String(x.status||"PASS").toUpperCase()==="PASS"?"pass":"fail")+'">'+(String(x.status||"PASS").toUpperCase()==="PASS"?"✓":"✕")+'</span><strong>'+esc(x.name||"test")+'</strong><small>'+esc(x.duration||"")+'</small></button>').join("")+'</section><section class="ij-test-detail"><h4>'+esc(selected?.name||"Test Results")+'</h4>'+(String(selected?.status||"PASS").toUpperCase()==="PASS"?'<div class="ij-test-ok">Test passed</div>':'<div class="ij-test-failure"><strong>Assertion failed</strong><div><span>Expected</span><code>'+esc(selected?.expected??"200")+'</code></div><div><span>Actual</span><code>'+esc(selected?.actual??"404")+'</code></div><pre>'+esc(selected?.trace||"AssertionError")+'</pre></div>')+'</section></div></div>',true);
 refs.bottom.querySelectorAll("[data-test-index]").forEach(btn=>btn.addEventListener("click",()=>{state.tests.selectedIndex=Number(btn.dataset.testIndex);renderP0JUnitTool()}));
 refs.bottom.querySelector("#ijTestsRerun")?.addEventListener("click",()=>fidelityNotice("All tests rerun"));
 refs.bottom.querySelector("#ijTestsFailed")?.addEventListener("click",()=>{(state.tests.results||[]).forEach(x=>{if(String(x.status).toUpperCase()!=="PASS")x.status="PASS"});state.tests.passed=(state.tests.results||[]).length;state.tests.failed=0;renderP0JUnitTool()});
}
function renderP0MavenTool(){
 const m=state.maven||{},sections=m.sections||{Lifecycle:true,Plugins:true,Dependencies:true,Profiles:true};
 const deps=m.dependencies||[{groupId:"org.springframework.boot",artifactId:"spring-boot-starter-web",version:"3.5.6"},{groupId:"org.springframework.boot",artifactId:"spring-boot-starter-validation",version:"3.5.6"}];
 const plugins=m.plugins||["spring-boot","compiler","surefire"];
 const goals=["clean","validate","compile","test","package","verify","install","deploy"];
 refs.right.innerHTML='<div class="ij-maven-head"><strong>m '+esc(m.project||state.project.name||"Project")+'</strong><button id="ijMavenReload" title="Reload All Maven Projects">↻</button><button title="Execute Maven Goal">▶</button></div>'+
  '<div class="ij-maven-section"><button data-maven-section="Lifecycle">▾ Lifecycle</button><div>'+goals.map(g=>'<button class="ij-maven-row" data-maven-goal="'+g+'"><span>○</span>'+g+(m.lastGoal===g?'<em>'+esc(m.status||"Running")+'</em>':'')+'</button>').join("")+'</div></div>'+
  '<div class="ij-maven-section"><button data-maven-section="Plugins">▾ Plugins</button><div>'+plugins.map(p=>'<div class="ij-maven-row"><span>◇</span>'+esc(p)+'</div>').join("")+'</div></div>'+
  '<div class="ij-maven-section"><button data-maven-section="Dependencies">▾ Dependencies</button><div>'+deps.map(x=>'<div class="ij-maven-row"><span>▱</span><span>'+esc((x.groupId?x.groupId+":":"")+(x.artifactId||x.name||"dependency"))+'</span><em>'+esc(x.version||"")+'</em></div>').join("")+'</div></div>'+
  '<div class="ij-maven-section"><button data-maven-section="Profiles">▾ Profiles</button><div>'+((m.profiles||["dev","test","prod"]).map(p=>'<label class="ij-maven-row"><input type="radio" name="ijMavenProfile" value="'+esc(p)+'" '+((m.profile||"dev")===p?"checked":"")+'><span>'+esc(p)+'</span></label>').join(""))+'</div></div>';
 refs.right.querySelector("#ijMavenReload")?.addEventListener("click",()=>{state.maven.status="Reloaded";fidelityNotice("Maven projects reloaded");renderP0MavenTool()});
 refs.right.querySelectorAll("[data-maven-section]").forEach(btn=>btn.addEventListener("click",()=>{const body=btn.nextElementSibling;body.hidden=!body.hidden;btn.textContent=(body.hidden?"▸ ":"▾ ")+btn.dataset.mavenSection}));
 refs.right.querySelectorAll("[data-maven-goal]").forEach(btn=>btn.addEventListener("click",()=>{state.maven.lastGoal=btn.dataset.mavenGoal;state.maven.status="BUILD SUCCESS";ensureMavenArtifacts(btn.dataset.mavenGoal);if(!state.visibleFeatures.includes("run"))state.visibleFeatures.push("run");activeBottom="run";state.console="[INFO] --- "+btn.dataset.mavenGoal+"\n[INFO] BUILD SUCCESS";renderFeatureVisibility();renderBottom();renderP0MavenTool()}));
 refs.right.querySelectorAll('input[name="ijMavenProfile"]').forEach(r=>r.addEventListener("change",()=>{state.maven.profile=r.value;actionStatus("Maven profile: "+r.value)}));
}
function renderP0ServicesTool(){
 const apps=state.spring?.apps||[{name:"AeroTopoApplication",status:"Running",port:8080,profile:"dev"}];
 setBottom("services",'<div class="ij-services-tool"><div class="ij-services-head"><strong>Services</strong><button id="ijServicesExpand">▾</button><span class="grow"></span><button id="ijServicesAdd">＋</button></div><div class="ij-services-body">'+apps.map((a,i)=>'<div class="ij-service-card"><span class="ij-service-dot '+(a.status==="Running"?"run":"stop")+'"></span><div><strong>'+esc(a.name)+'</strong><small>'+esc(a.status||"Stopped")+' · localhost:'+esc(a.port||8080)+' · '+esc(a.profile||state.spring.activeProfile||"default")+'</small></div><div class="ij-service-actions"><button type="button" data-service-action="run" data-service-index="'+i+'">▶</button><button type="button" data-service-action="debug" data-service-index="'+i+'">🐞</button><button type="button" data-service-action="restart" data-service-index="'+i+'">↻</button><button type="button" data-service-action="stop" data-service-index="'+i+'">■</button><button type="button" data-service-action="console" data-service-index="'+i+'">▤</button></div></div>').join("")+'<pre class="ij-service-console">'+esc(state.spring.console||"Started "+(apps[0]?.name||"Spring Boot application")+"\nTomcat initialized on port "+(apps[0]?.port||8080))+'</pre></div></div>',true);
 refs.bottom.querySelectorAll("[data-service-action]").forEach(btn=>btn.addEventListener("click",()=>{const a=apps[Number(btn.dataset.serviceIndex)],cmd=btn.dataset.serviceAction;if(!a)return;if(cmd==="stop")a.status="Stopped";if(cmd==="run"||cmd==="restart"||cmd==="debug")a.status="Running";if(cmd==="debug")state.spring.console=(state.spring.console||"")+"\nDebugger attached";if(cmd==="restart")state.spring.console=(state.spring.console||"")+"\nApplication restarted";if(cmd==="console")fidelityNotice("Service console selected");renderP0ServicesTool()}));
}
function showP0SpringView(tab,d={}){
 state.spring={...state.spring,...clone(d)};
 const beans=state.spring.beans||[];
 const mappings=state.spring.mappings||[];
 refs.fidelity.className="ijFidelityLayer show transparent";
 refs.fidelity.innerHTML='<div class="ij-p0-center ij-spring-popup"><div class="ij-spring-head"><strong>Spring</strong><div><button data-spring-tab="beans" class="'+(tab==="beans"?"active":"")+'">Beans</button><button data-spring-tab="mappings" class="'+(tab==="mappings"?"active":"")+'">MVC Mappings</button></div><span class="grow"></span><input id="ijSpringFilter" placeholder="Search"><button id="ijSpringClose">×</button></div><div id="ijSpringBody">'+(tab==="beans"?'<div class="ij-beans-list">'+beans.map((b,i)=>'<button data-spring-source="'+i+'"><span class="ij-bean-icon">B</span><span><strong>'+esc(b.name||"bean")+'</strong><small>'+esc(b.className||b.type||"")+'</small></span><em>'+esc(b.scope||"singleton")+'</em></button>').join("")+'</div>':'<table class="ij-mapping-table"><thead><tr><th>Method</th><th>Path</th><th>Controller</th><th>Handler</th></tr></thead><tbody>'+mappings.map((m,i)=>'<tr data-spring-source="'+i+'"><td><span class="ij-http '+esc(String(m.method||"GET").toLowerCase())+'">'+esc(m.method||"GET")+'</span></td><td>'+esc(m.path||"/")+'</td><td>'+esc(m.controller||"Controller")+'</td><td>'+esc(m.handler||"method()")+'</td></tr>').join("")+'</tbody></table>')+'</div></div>';
 refs.fidelity.querySelectorAll("[data-spring-tab]").forEach(btn=>btn.addEventListener("click",()=>showP0SpringView(btn.dataset.springTab,d)));
 $("ijSpringClose")?.addEventListener("click",hideFidelity);
 $("ijSpringFilter")?.addEventListener("input",e=>{const q=e.target.value.toLowerCase();refs.fidelity.querySelectorAll("[data-spring-source]").forEach(row=>row.classList.toggle("filtered",!row.textContent.toLowerCase().includes(q)))});
 refs.fidelity.querySelectorAll("[data-spring-source]").forEach(row=>row.addEventListener("click",()=>{const src=(tab==="beans"?beans:mappings)[Number(row.dataset.springSource)];if(src?.file)p0OpenResult(src);else fidelityNotice((src?.name||src?.path||"Spring item")+" selected")}));
}
function renderBreadcrumbs(){
 let bar=refs.editorWrap?.querySelector(".ij-breadcrumbs");
 if(!bar&&refs.editorWrap){bar=document.createElement("div");bar.className="ij-breadcrumbs";refs.editorWrap.appendChild(bar)}
 const show=!!activeFile&&state.breadcrumbsVisible!==false&&!state.fidelityMode;
 refs.editorWrap?.classList.toggle("hasBreadcrumbs",show);
 if(!bar)return;
 bar.classList.toggle("hidden",!show);
 if(!show){bar.innerHTML="";return}
 const parts=activeFile.split("/").filter(Boolean);
 const content=String(files[activeFile]?.content||"");
 const cls=content.match(/\b(class|interface|record|enum)\s+(\w+)/)?.[2];
 const method=content.match(/\b(?:public|private|protected)\s+[\w<>, ?\[\].]+\s+(\w+)\s*\(/)?.[1];
 const crumbs=[state.project.name||"Project",...parts];
 if(cls)crumbs.push(cls);if(method)crumbs.push(method+"()");
 bar.innerHTML=crumbs.map((c,i)=>'<button type="button" data-crumb-index="'+i+'">'+esc(c)+'</button>').join('<span>›</span>');
 bar.querySelectorAll("[data-crumb-index]").forEach(btn=>btn.addEventListener("click",()=>fidelityNotice("Navigate to "+btn.textContent)));
}
function editorLineMarkup(line,language,no){
 const caret=state.editorCaret&&state.editorCaret.file===activeFile&&Number(state.editorCaret.line)===no?state.editorCaret:null;
 const selection=state.editorSelection&&state.editorSelection.file===activeFile&&Number(state.editorSelection.line)===no?state.editorSelection:null;
 let from=0,to=0;
 if(selection?.text&&line.includes(selection.text)){from=line.indexOf(selection.text);to=from+selection.text.length}
 else if(selection&&Number.isFinite(Number(selection.start))){from=Math.max(0,Number(selection.start));to=Math.max(from,Math.min(line.length,Number(selection.end??from+1)))}
 const caretCol=caret?Math.max(0,Math.min(line.length,Number(caret.column??line.length))):-1;
 const points=[0,line.length];if(to>from)points.push(from,to);if(caretCol>=0)points.push(caretCol);
 const uniq=[...new Set(points)].sort((a,b)=>a-b);let html="";
 for(let i=0;i<uniq.length-1;i++){const a=uniq[i],b=uniq[i+1],seg=line.slice(a,b);const selected=to>from&&a>=from&&b<=to;html+=(selected?'<span class="ij-editor-selection">':'')+syntax(seg,language)+(selected?'</span>':'');if(caretCol===b)html+='<span class="ij-editor-caret"></span>'}
 if(caretCol===0)html='<span class="ij-editor-caret"></span>'+html;
 if(line.length===0&&caretCol===0)html='<span class="ij-editor-caret"></span>';
 return html;
}

function genericSurface(title,d){showModal("surface",title,'<div class="cards">'+Object.entries(d||{}).slice(0,12).map(([k,v])=>card(k,typeof v==="object"?JSON.stringify(v):v)).join("")+'</div>')}
function javaStructureEntries(path){
 const content=String(files[path]?.content||"");
 const entries=[];
 content.split("\n").forEach((raw,index)=>{
  const line=raw.trim();
  if(!line||line.startsWith("//")||line.startsWith("*")||line.startsWith("@"))return;
  let m=line.match(/\b(class|interface|enum|record)\s+(\w+)/);
  if(m){entries.push({kind:"class",icon:"C",name:m[2],detail:m[1],line:index+1});return}
  m=line.match(/^(?:(?:public|protected|private|static|final|synchronized|abstract|native|default)\s+)*[\w<>, ?\[\].]+\s+(\w+)\s*\(([^)]*)\)\s*(?:\{|throws\b|$)/);
  if(m){entries.push({kind:"method",icon:"m",name:m[1]+"("+m[2].trim()+")",detail:"method",line:index+1});return}
  m=line.match(/^(?:(?:public|protected|private|static|final|transient|volatile)\s+)*([\w<>, ?\[\].]+)\s+(\w+)\s*(?:=[^;]*)?;/);
  if(m){entries.push({kind:"field",icon:"f",name:m[2],detail:m[1].trim(),line:index+1})}
 });
 return entries;
}
function showFileStructure(path){
 const file=path&&files[path]?path:activeFile;
 if(!file||!files[file]){notify("No file selected","error");return}
 openFile(file);
 const entries=javaStructureEntries(file);
 const rows=entries.map(x=>
  '<div class="structureRow" data-structure-line="'+x.line+'" style="display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:7px;align-items:center">'+
   '<span style="width:18px;height:18px;border-radius:4px;display:grid;place-items:center;background:var(--surface3);color:var(--blue);font-weight:700">'+esc(x.icon)+'</span>'+
   '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(x.name)+'</span>'+
   '<span style="color:var(--muted);font-size:9px">'+esc(x.detail)+' · line '+x.line+'</span>'+
  '</div>'
 ).join("");
 showModal(
  "fileStructure",
  "File Structure — "+file.split("/").pop(),
  '<div style="margin:-4px -4px 7px;color:var(--muted)">Navigate symbols in '+esc(file)+'</div>'+
  '<div style="border:1px solid var(--line);border-radius:4px;overflow:hidden">'+
   (rows||'<div class="structureRow">No symbols found</div>')+
  '</div>'
 );
 refs.modalBody.querySelectorAll("[data-structure-line]").forEach(row=>{
  row.onclick=()=>{
   const line=Number(row.dataset.structureLine);
   closeModal();
   focusRange={file,lines:[line]};
   renderEditor();
   const el=refs.code.querySelector('[data-line="'+line+'"]');
   window.SIM_FOCUS?.follow(el,{block:"center"});
  };
 });
}
function findRun(name){return state.runConfigurations.find(x=>x.name===name)||state.runConfigurations[0]}
function actionStatus(msg){refs.status.textContent=msg}
function reset(){state=clone(baseline||{});normalize();terminalHighlightText="";clearTransient("");trackedBoundary=null;refs.boundary.classList.remove("show");refs.app.classList.remove("distraction");document.body.classList.remove("zen");renderAll()}
function targetEl(t){if(!t)return null;if(typeof t==="string"){const map={project:refs.tree,editor:refs.code,run:refs.runBtn,debug:refs.debugBtn,save:refs.saveBtn,git:refs.gitBtn,terminal:refs.terminalBtn,search:refs.searchBtn,runConfig:refs.runConfig,problems:refs.bottomTabs.querySelector('[data-bottom="problems"]')};if(map[t])return map[t];if(treeMap.has(t))return treeMap.get(t);const tab=refs.tabs.querySelector('[data-file="'+CSS.escape(t)+'"]');if(tab)return tab}if(t.type==="file")return treeMap.get(t.path)||refs.tabs.querySelector('[data-file="'+CSS.escape(t.path)+'"]');if(t.type==="line"){if(t.file&&files[t.file]){activeFile=t.file;if(!openTabs.includes(t.file))openTabs.push(t.file);renderAll()}return refs.code.querySelector('[data-line="'+Number(t.line)+'"]')}return null}
function clearBoundary(){if(trackedBoundary?.classList)trackedBoundary.classList.remove("sim-emphasis");trackedBoundary=null;refs.boundary.classList.remove("show")}
function syncBoundary(){}
function avoidAssistantOverlap(el){
 if(assistantUserPlaced||refs.assistant.classList.contains("hidden")||!el)return;
 const ar=refs.assistant.getBoundingClientRect(),er=el.getBoundingClientRect(),app=refs.app.getBoundingClientRect();
 const overlap=!(ar.right<er.left-12||ar.left>er.right+12||ar.bottom<er.top-12||ar.top>er.bottom+12);
 if(!overlap)return;
 const rightX=app.width-ar.width-12,leftX=12;
 const bottomY=app.height-ar.height-34,topY=104;
 const candidates=[
  {left:rightX,top:bottomY},{left:rightX,top:topY},
  {left:leftX,top:bottomY},{left:leftX,top:topY}
 ];
 const score=p=>{
  const pr={left:app.left+p.left,top:app.top+p.top,right:app.left+p.left+ar.width,bottom:app.top+p.top+ar.height};
  const ov=!(pr.right<er.left-12||pr.left>er.right+12||pr.bottom<er.top-12||pr.top>er.bottom+12);
  return ov?1:0;
 };
 candidates.sort((a,b)=>score(a)-score(b));
 placeAssistant(candidates[0].left,candidates[0].top,false);
}
async function highlight(t,token){if(!allowBoundary)return;const el=targetEl(t);if(!el)return;clearBoundary();trackedBoundary=el;el.classList.add("sim-emphasis");avoidAssistantOverlap(el);await sleep(260);if(token!==seekToken)return}
function openMenu(name){const maps={File:["New","Open","Project Structure","Settings"],Edit:["Undo","Redo","Find","Replace"],View:["Tool Windows","Appearance","Distraction Free Mode"],Navigate:["Class","File","Symbol","Declaration","Implementation"],Code:["Completion","Reformat Code","Optimize Imports","Generate"],Refactor:["Rename","Extract","Inline","Move","Safe Delete"],Build:["Build Project","Rebuild Project"],Run:["Run","Debug","Edit Configurations"],Tools:["Terminal","Database","Maven"],VCS:["Commit","Push","Pull","Git"]};refs.menuPopup.innerHTML=(maps[name]||["Action"]).map(x=>"<div>"+x+"</div>").join("");refs.menuPopup.classList.add("show")}
async function applyStep(st,animate,token){
 if(token!==seekToken)return;clearBoundary();clearTransient(st.action);const d=st.data||{},f=()=>files[d.file||activeFile];
 switch(st.action){
  case"enableFeature":{const name=d.feature||d.name;if(name&&!state.visibleFeatures.includes(name))state.visibleFeatures.push(name);renderAll();break}
  case"disableFeature":{const name=d.feature||d.name;state.visibleFeatures=(state.visibleFeatures||[]).filter(x=>x!==name);renderAll();break}
  case"setView":activeBottom=d.bottom||activeBottom;activeRight=d.right||activeRight;renderAll();break;
  case"openMenu":openMenu(d.menu||"File");break;
  case"pressButton":if(d.target)await highlight(d.target,token);actionStatus("Pressed "+(d.target||"button"));break;
  case"highlightTarget":await highlight(d.target,token);break;
  case"moveCursor":await highlight(d.target,token);break;
  case"showNotification":notify(d.text||d.message||"IntelliJ IDEA");break;
  case"openProject":state.project={...state.project,...clone(d.project||d)};renderAll();break;
  case"newProject":if(d.uiState==="welcome"){showWelcomeSurface();break}if(d.uiState==="wizard"||d.uiState==="jdkDropdown"){showNewProjectSurface(d,d.uiState==="jdkDropdown");break}if(d.fidelityMode){resetScreenshotWorkspace(d);break}state.project={name:d.name||"New Project",sdk:d.sdk||state.project.sdk,languageLevel:String(d.languageLevel||state.project.languageLevel)};state.fidelityMode=d.fidelityMode??state.fidelityMode;if(d.maven)state.maven={...state.maven,...clone(d.maven)};if(d.git)state.git={...state.git,...clone(d.git)};if(d.spring)state.spring={...state.spring,...clone(d.spring)};if(!d.preserveFiles){state.tree=clone(d.tree||[]);files=clone(d.files||{});state.files=clone(files);activeFile=null;openTabs=[]}renderAll();break;
  case"openFile":openFile(d.file);break;
  case"closeFile":closeFile(d.file||activeFile);break;
  case"createFile":if(d.uiState==="projectContextMenu"){showProjectContextSurface();break}if(d.uiState==="newJavaClass"){showNewJavaClassSurface(d.name||"Test");break}files[d.path]={language:d.language||"java",content:String(d.content||"")};state.files=clone(files);addTreePath(d.path,d.language||"java");markGit(d.path,"A");openFile(d.path);break;
  case"createPackage":if(d.uiState==="newPackage"){showNewPackageSurface(d);break}{const p=(d.path||d.name||"package").replace(/\./g,"/");addTreePath(p+"/.package","java");delete files[p+"/.package"];deleteTreePath(state.tree,p+"/.package");actionStatus("Package created: "+(d.name||p));renderAll();break}
  case"renameResource":{const old=d.path||d.oldPath,nw=d.newPath||d.name;if(files[old]){files[nw]=files[old];delete files[old];state.files=clone(files);openTabs=openTabs.map(x=>x===old?nw:x);if(activeFile===old)activeFile=nw}renameTreePath(state.tree,old,nw);renderAll();break}
  case"deleteResource":{const p=d.path;delete files[p];state.files=clone(files);openTabs=openTabs.filter(x=>x!==p);if(activeFile===p)activeFile=openTabs.at(-1)||null;deleteTreePath(state.tree,p);renderAll();break}
  case"saveFile":if(f())f().dirty=false;actionStatus("Saved "+(d.file||activeFile||"file"));renderTabs();break;
  case"saveAll":Object.values(files).forEach(x=>x.dirty=false);actionStatus("All files saved");renderTabs();break;
  case"setCode":{const file=d.file||activeFile;if(files[file]){activeFile=file;if(!openTabs.includes(file))openTabs.push(file);files[file].content=String(d.code??d.content??"");files[file].dirty=true;markGit(file,"M");focusRange=null;if(d.caretLine)state.editorCaret={file,line:Number(d.caretLine),column:Number(d.caretColumn||0)};if(d.selectionText||d.selection)state.editorSelection={file,line:Number(d.selectionLine||d.caretLine||1),text:d.selectionText||d.selection,start:d.selectionStart,end:d.selectionEnd};if(d.breadcrumbs!==undefined)state.breadcrumbsVisible=d.breadcrumbs!==false;renderAll()}break}
  case"typeCode":{const file=d.file||activeFile;if(!files[file])break;const old=String(files[file].content||""),pos=d.position||"replace",snippet=String(d.code||"");const make=part=>pos==="end"?old+part:(pos==="start"?part+old:markerReplace(old,d.marker||"",part,pos));const final=make(snippet);if(final===null){notify("Code marker not found","error");break}activeFile=file;if(!openTabs.includes(file))openTabs.push(file);const markerIndex=pos==="end"?old.length:(pos==="start"?0:old.indexOf(d.marker||""));const before=old.slice(0,Math.max(0,markerIndex)).split("\n").length;const snippetLines=snippet.split("\n");const focusLines=snippetLines.map((line,idx)=>line.trim()?before+idx:null).filter(Boolean);if(!focusLines.length)focusLines.push(before);focusRange={file,lines:focusLines};await typeText(snippet,part=>{files[file].content=make(part)??old;renderEditor();requestAnimationFrame(()=>{const lines=[...refs.code.querySelectorAll(".codeLine.focus")];const target=lines[lines.length-1]||refs.code.querySelector('[data-line="'+focusLines[0]+'"]');window.SIM_FOCUS?.follow(target,{block:"center"})})},animate,token);files[file].content=final;files[file].dirty=true;markGit(file,"M");focusRange={file,lines:focusLines};renderAll();window.SIM_FOCUS?.follow(refs.code.querySelector('[data-line="'+focusLines.at(-1)+'"]'),{block:"center"});if(d.boundary!==false)await highlight({type:"line",file,line:focusLines[0]},token);break}
  case"replaceCode":if(f()){f().content=String(f().content).replace(String(d.find||""),String(d.replace||""));f().dirty=true;markGit(d.file||activeFile,"M");renderEditor()}break;
  case"formatCode":case"reformatFile":if(f()){f().content=String(f().content).split("\n").map(x=>x.replace(/\s+$/,"")).join("\n");renderEditor();actionStatus("Code reformatted")}break;
  case"optimizeImports":actionStatus("Imports optimized");break;
  case"splitEditor":if(d.uiState==="tabContextMenu"){showTabContextSurface(d);break}{state.editorSplit=true;state.splitFile=(d.file&&files[d.file]?d.file:(openTabs.find(x=>x!==activeFile&&files[x])||activeFile));if(state.splitFile&&!openTabs.includes(state.splitFile))openTabs.push(state.splitFile);renderAll();actionStatus("Editor split");break}
  case"unsplitEditor":state.editorSplit=false;state.splitFile=null;renderAll();actionStatus("Editor unsplit");break;
  case"pinTab":if(f()){f().pinned=d.pinned!==false;renderTabs()}break;
  case"toggleDistractionFree":refs.app.classList.toggle("distraction",d.enabled!==false);break;
  case"toggleZenMode":document.body.classList.toggle("zen",d.enabled!==false);break;

  case"gotoClass":case"gotoFile":case"gotoSymbol":case"searchEverywhere":showP0SearchSurface(st.action,d);break;
  case"findInFiles":showP0FindSurface(d);break;
  case"recentFiles":showP0SearchSurface("gotoFile",{...d,query:d.query||"",results:d.results||openTabs.slice().reverse().map(path=>({kind:"File",name:path.split("/").pop(),path,line:1,detail:path}))});break;
  case"findUsages":if(d.uiState==="refactoringPreview"){showRefactoringPreviewSurface(d);break}showP0FindUsagesSurface(d);break;
  case"goToDefinition":case"gotoDeclaration":case"gotoImplementation":case"showCallHierarchy":case"showTypeHierarchy":genericSurface(st.action,d);if(d.file)openFile(d.file);break;
  case"showFileStructure":showFileStructure(d.file||activeFile);break;

  case"showCodeCompletion":case"showCompletion":if(d.uiState==="mainTemplate"){showScreenshotCompletion("main",d);break}if(d.uiState==="soutTemplate"){showScreenshotCompletion("sout",d);break}showPopup("completion",d.items||["sorted()","filter(...)","distinct()","findFirst()","map(...)","collect(...)"]);break;
  case"showParameterInfo":showPopup("completion",d.items||["saveSurvey(SurveyRecord survey)"]);break;
  case"showJavaDocumentation":case"showQuickDocumentation":if(d.uiState==="symbolCard"){showSymbolInfoSurface(d);break}genericSurface("JDK Documentation",d);break;
  case"showQuickFixes":case"showIntentionActions":showPopup("intentions",d.items||["Add exception to method signature","Import class","Replace with modern API","Refactor expression"]);break;
  case"applyQuickFix":if(d.file&&d.find!==undefined&&files[d.file])files[d.file].content=String(files[d.file].content).replace(String(d.find),String(d.replace||""));actionStatus("Quick fix applied");renderAll();break;
  case"showEditorDiagnostics":case"runInspection":if(d.problems)state.problems=clone(d.problems);else if(!state.problems.length)state.problems=[{severity:"error",message:"Cannot resolve method",file:activeFile,line:1},{severity:"warning",message:"Type or declaration should be reviewed",file:activeFile,line:2}];activeBottom="problems";renderEditor();setBottom("problems",state.problems.map(p=>p.severity+": "+p.message).join("\n"));break;
  case"showProblems":activeBottom="problems";renderBottom();break;
  case"addProblem":addProblem(d);activeBottom="problems";renderBottom();break;
  case"suppressInspection":state.problems=state.problems.filter(p=>p.message!==d.message);renderBottom();break;

  case"moveClass":if(d.uiState==="moveDialog"){showMoveRefactorSurface(d);break}if(d.file&&files[d.file]&&d.content!==undefined){files[d.file].content=String(d.content);files[d.file].dirty=true;openFile(d.file)}else genericSurface(st.action,d);break;
  case"renameSymbol":case"changeSignature":case"safeDelete":
    if(d.uiState==="dialog"||d.uiState==="preview"||d.symbol){showP0RefactorSurface(st.action,d);break}
    if(d.file&&files[d.file]&&d.content!==undefined){files[d.file].content=String(d.content);files[d.file].dirty=true;openFile(d.file)}else genericSurface(st.action,d);break;
  case"extractMethod":case"extractVariable":case"inlineRefactor":case"generateGetterSetter":case"generateConstructor":case"generateToString":case"generateEqualsHashCode":case"overrideMethods":
    if(d.file&&files[d.file]&&d.content!==undefined){files[d.file].content=String(d.content);files[d.file].dirty=true;openFile(d.file)}else genericSurface(st.action,d);break;

  case"openRunConfigurations":showModal("runConfig","Run/Debug Configurations",'<div class="kv"><span>Name</span><input value="'+esc(state.activeRunConfiguration||"Application")+'"><span>Main class</span><input value="'+esc(findRun()?.mainClass||"")+'"><span>Program arguments</span><input value="'+esc(findRun()?.programArguments||"")+'"><span>VM options</span><input value="'+esc(findRun()?.vmOptions||"")+'"></div>');break;
  case"createApplicationConfig":state.runConfigurations.push({name:d.name||"Application",type:"Application",mainClass:d.mainClass||"",programArguments:"",vmOptions:"",env:{}});state.activeRunConfiguration=d.name||"Application";renderAll();break;
  case"createSpringBootConfig":state.runConfigurations.push({name:d.name||"Spring Boot",type:"Spring Boot",mainClass:d.mainClass||"",profile:d.profile||"dev",env:{}});state.activeRunConfiguration=d.name||"Spring Boot";renderAll();break;
  case"setProgramArguments":{const r=findRun(d.name);if(r)r.programArguments=d.value||d.arguments||"";break}
  case"setVmOptions":{const r=findRun(d.name);if(r)r.vmOptions=d.value||d.options||"";break}
  case"setEnvironmentVariables":{const r=findRun(d.name);if(r)r.env=clone(d.variables||d.env||{});break}
  case"setWorkingDirectory":{const r=findRun(d.name);if(r)r.workingDirectory=d.path||"";break}
  case"runJavaMain":case"runConfiguration":state.activeRunConfiguration=d.name||d.mainClass||state.activeRunConfiguration;state.console=d.console||("Running "+state.activeRunConfiguration+"\nProcess finished with exit code 0");activeBottom="run";renderAll();break;
  case"stopProcess":state.console+=(state.console?"\n":"")+"Process terminated";activeBottom="run";renderBottom();break;
  case"showRunConsole":if(d.uiState==="screenshot"){showRunConsoleScreenshot(d);break}activeBottom="run";if(d.text!==undefined)state.console=String(d.text);renderBottom();break;case"clearRunConsole":state.console="";activeBottom="run";renderBottom();break;case"restartApplication":state.console=d.console||("Restarting "+(state.activeRunConfiguration||"Application")+"\nApplication started");activeBottom="run";renderBottom();break;

  case"debugConfiguration":state.debug={...state.debug,...clone(d),running:d.running!==false,config:d.name||state.activeRunConfiguration,frames:clone(d.frames||[]),variables:clone(d.variables||[]),watches:clone(d.watches||state.debug?.watches||[]),console:d.console||"Debugger attached",currentFile:d.file||d.currentFile,currentLine:Number(d.line||d.currentLine||1)};if(!state.visibleFeatures.includes("debug"))state.visibleFeatures.push("debug");activeBottom="debug";if(state.debug.currentFile&&files[state.debug.currentFile]){activeFile=state.debug.currentFile;if(!openTabs.includes(activeFile))openTabs.push(activeFile);focusRange={file:activeFile,lines:[state.debug.currentLine]}}renderAll();break;
  case"setBreakpoint":if(!state.breakpoints.some(b=>b.file===d.file&&Number(b.line)===Number(d.line)))state.breakpoints.push({file:d.file,line:Number(d.line),condition:d.condition||""});renderEditor();break;
  case"removeBreakpoint":state.breakpoints=state.breakpoints.filter(b=>!(b.file===d.file&&Number(b.line)===Number(d.line)));renderEditor();break;
  case"setConditionalBreakpoint":{let b=state.breakpoints.find(x=>x.file===d.file&&Number(x.line)===Number(d.line));if(!b){b={file:d.file,line:Number(d.line)};state.breakpoints.push(b)}b.condition=d.condition||"true";renderEditor();break}
  case"setExceptionBreakpoint":state.exceptionBreakpoint=d.exception||"Exception";actionStatus("Exception breakpoint: "+state.exceptionBreakpoint);break;
  case"resumeDebug":case"pauseDebug":case"stepOver":case"stepInto":case"stepOut":case"runToCursor":if(!state.visibleFeatures.includes("debug"))state.visibleFeatures.push("debug");activeBottom="debug";actionStatus(st.action);if(st.action==="resumeDebug")state.debug.running=true;if(st.action==="pauseDebug")state.debug.running=false;renderFeatureVisibility();renderBottom();break;
  case"evaluateExpression":activeBottom="debug";setBottom("debug",(state.bottomCache?.debug?.content||"")+"\nEvaluate: "+(d.expression||"")+" = "+(d.result??""));break;
  case"addWatch":state.debug=state.debug||{};state.debug.watches=state.debug.watches||[];state.debug.watches.push({expression:d.expression,result:d.result});activeBottom="debug";setBottom("debug",state.debug.watches.map(x=>`${x.expression} = ${x.result}`).join("\n"));break;
  case"showVariables":activeBottom="debug";setBottom("debug",(d.variables||state.debug?.variables||[]).map(x=>`${x.name} = ${x.value}`).join("\n"));break;

  case"runJUnit":case"runJUnitMethod":case"runJUnitClass":state.tests={...state.tests,...clone(d),total:d.total??d.tests?.length??1,passed:d.passed??(d.tests||[]).filter(x=>String(x.status||"PASS").toUpperCase()==="PASS").length??1,failed:d.failed??(d.tests||[]).filter(x=>String(x.status||"PASS").toUpperCase()!=="PASS").length??0,results:clone(d.tests||[]),selectedIndex:0};if(!state.visibleFeatures.includes("tests"))state.visibleFeatures.push("tests");activeBottom="tests";renderFeatureVisibility();renderP0JUnitTool();break;
  case"showTestResults":activeBottom="tests";renderBottom();break;
  case"showFailureTrace":activeBottom="tests";setBottom("tests",d.trace||"AssertionError");break;
  case"rerunFailedTests":activeBottom="tests";setBottom("tests",d.console||"Rerun failed tests: PASS");break;
  case"runWithCoverage":state.tests.coverage=d.coverage||{};activeBottom="tests";setBottom("tests","Run with Coverage\n"+JSON.stringify(state.tests.coverage,null,2));break;
  case"showCoverage":genericSurface("Code Coverage",d.coverage||state.tests.coverage||{});break;
  case"mockitoVerifyInteraction":activeBottom="tests";setBottom("tests",d.text||"Mockito verify(repository).save(entity)  PASS");break;

  case"openMavenToolWindow":state.maven={...state.maven,...clone(d)};if(!state.visibleFeatures.includes("maven"))state.visibleFeatures.push("maven");activeRight="maven";renderAll();break;
  case"reloadMavenProject":state.maven.status="Reloaded";activeRight="maven";renderRight();break;
  case"runMavenGoal":state.maven.lastGoal=d.goal||"test";state.maven.status=d.status||"BUILD SUCCESS";ensureMavenArtifacts(state.maven.lastGoal);activeBottom="run";setBottom("run",d.console||`[INFO] --- ${state.maven.lastGoal}\n[INFO] BUILD SUCCESS`);renderRight();break;
  case"showMavenLifecycle":case"showMavenDependencies":case"showMavenDependencyTree":case"showEffectivePom":genericSurface(st.action,d);break;
  case"addMavenDependency":state.maven.dependencies=state.maven.dependencies||[];state.maven.dependencies.push(clone(d.dependency||d));renderRight();break;
  case"removeMavenDependency":state.maven.dependencies=(state.maven.dependencies||[]).filter(x=>(x.artifactId||x.name)!==(d.artifactId||d.name));renderRight();break;
  case"setMavenProfile":state.maven.profile=d.profile||"default";renderRight();break;

  case"openSpringToolWindow":case"showSpringBootDashboard":state.spring={...state.spring,...clone(d)};if(!state.visibleFeatures.includes("spring"))state.visibleFeatures.push("spring");activeBottom="services";renderAll();break;
  case"runSpringBootApp":{const app=(state.spring.apps||[]).find(x=>x.name===d.name)||(state.spring.apps||[])[0];if(app){app.status="Running";app.profile=d.profile||app.profile;app.port=d.port||app.port}state.console=d.console||"Started Spring Boot application";activeBottom="services";setBottom("services",state.console);break}
  case"stopSpringBootApp":{const app=(state.spring.apps||[]).find(x=>x.name===d.name)||(state.spring.apps||[])[0];if(app)app.status="Stopped";activeBottom="services";setBottom("services","Spring Boot application stopped");break}
  case"restartSpringBootApp":{const app=(state.spring.apps||[]).find(x=>x.name===d.name)||(state.spring.apps||[])[0];if(app)app.status="Running";activeBottom="services";setBottom("services","Spring Boot application restarted");break}
  case"setSpringProfile":state.spring.activeProfile=d.profile||"dev";break;
  case"showSpringBeans":showP0SpringView("beans",d);break;
  case"showSpringMappings":showP0SpringView("mappings",d);break;
  case"navigateToController":if(d.file)openFile(d.file);break;
  case"showMvcFlow":case"showValidationFlow":case"showExceptionHandlers":genericSurface(st.action,d);break;
  case"openApplicationProperties":if(d.file)openFile(d.file);else genericSurface("application.properties",state.spring.properties||{});break;
  case"setSpringProperty":state.spring.properties=state.spring.properties||{};state.spring.properties[d.key]=d.value;actionStatus(d.key+"="+d.value);break;

  case"openPersistenceToolWindow":genericSurface("Persistence",state.jpa);break;
  case"showJpaEntities":genericSurface("JPA Entities",{entities:state.jpa.entities||[]});break;
  case"showJpaRepositories":genericSurface("Spring Data Repositories",{repositories:state.jpa.repositories||[]});break;
  case"showEntityMapping":case"showRepositoryMethods":genericSurface(st.action,d);break;
  case"generateJpaRepository":if(d.path){files[d.path]={language:"java",content:d.content||`public interface ${d.name||"Repository"} extends JpaRepository<Entity, Long> {}`};state.files=clone(files);addTreePath(d.path,"java");openFile(d.path)}break;
  case"runJpql":activeBottom="run";setBottom("run",d.console||("JPQL: "+(d.query||"")+"\n"+JSON.stringify(d.rows||[],null,2)));break;
  case"showHibernateSql":activeBottom="run";setBottom("run",d.sql||"Hibernate: select ...");break;
  case"showHibernateStatistics":genericSurface("Hibernate Statistics",d.statistics||d);break;
  case"showHibernateSpatial":genericSurface("Hibernate Spatial",d);break;

  case"openGitToolWindow":activeBottom="git";renderBottom();break;
  case"showLocalChanges":activeBottom="git";renderBottom();break;
  case"stageFile":{const c=(state.git.changes||[]).find(x=>x.file===d.file);if(c)c.staged=true;renderTree();renderBottom();break}
  case"unstageFile":{const c=(state.git.changes||[]).find(x=>x.file===d.file);if(c)c.staged=false;renderBottom();break}
  case"commitChanges":state.git.history=state.git.history||[];state.git.history.unshift({hash:d.hash||"abc1234",message:d.message||"Commit",author:d.author||"Developer"});state.git.changes=(state.git.changes||[]).filter(x=>!x.staged);activeBottom="git";setBottom("git","Committed: "+(d.message||"Commit"));renderTree();break;
  case"pushGit":case"pullGit":case"fetchGit":activeBottom="git";setBottom("git",d.console||st.action+" completed");break;
  case"createBranch":state.git.branches=state.git.branches||[];if(!state.git.branches.includes(d.name))state.git.branches.push(d.name);break;
  case"checkoutBranch":state.git.branch=d.name||state.git.branch;renderAll();break;
  case"mergeBranch":activeBottom="git";setBottom("git",d.console||("Merged "+(d.name||"branch")));break;
  case"showGitHistory":genericSurface("Git Log",{history:state.git.history||[]});break;
  case"showGitDiff":genericSurface("Git Diff",d);break;
  case"showMergeConflict":state.git.conflicts=clone(d.conflicts||[]);activeBottom="git";setBottom("git","Merge conflicts:\n"+state.git.conflicts.map(x=>x.file).join("\n"));break;
  case"resolveMergeConflict":state.git.conflicts=(state.git.conflicts||[]).filter(x=>x.file!==d.file);activeBottom="git";setBottom("git","Resolved "+(d.file||"conflict"));break;

  case"openDatabaseToolWindow":activeRight="database";renderRight();break;
  case"addDataSource":state.database.dataSources=state.database.dataSources||[];state.database.dataSources.push(clone(d));activeRight="database";renderRight();break;
  case"testDataSource":notify(d.success===false?"Connection failed":"Connection successful",d.success===false?"error":"");break;
  case"openDatabaseConsole":activeBottom="run";setBottom("run",d.text||"Database Console");break;
  case"executeSql":activeBottom="run";setBottom("run",d.sql||"SELECT 1;");if(d.rows)state.database.lastResult={columns:d.columns||Object.keys(d.rows[0]||{}),rows:clone(d.rows)};break;
  case"showQueryResult":{const r=d.result||state.database.lastResult||{columns:[],rows:[]};activeBottom="run";setBottom("run",resultTable(r.columns||[],r.rows||[]),true);break}
  case"showTableData":{const r={columns:d.columns||Object.keys(d.rows?.[0]||{}),rows:d.rows||[]};activeBottom="run";setBottom("run",resultTable(r.columns,r.rows),true);break}

  case"openIntegratedTerminal":case"openTerminal":if(!state.visibleFeatures.includes("terminal"))state.visibleFeatures.push("terminal");activeBottom="terminal";renderAll();break;
  case"typeTerminal":{if(!state.visibleFeatures.includes("terminal"))state.visibleFeatures.push("terminal");activeBottom="terminal";state.terminalSessions=state.terminalSessions||[];const sessionId=d.sessionId||"local";let session=state.terminalSessions.find(x=>x.id===sessionId);if(!session){session={id:sessionId,name:d.session||d.shell||"Local",shell:d.shell||"Terminal"};state.terminalSessions.push(session)}session.name=d.session||session.name;session.shell=d.shell||session.shell;state.activeTerminalSession=sessionId;state.terminalExitCode=d.exitCode;renderFeatureVisibility();const cmd=String(d.command||d.text||"");const prefix=state.terminal?(state.terminal+"\n"):"";const emphasize=!replayingHistory&&!!cmd;terminalHighlightText=emphasize?cmd:"";await typeText(cmd,part=>{if(emphasize)terminalHighlightText=part;setBottom("terminal",prefix+"$ "+part)},animate,token);terminalHighlightText=emphasize?cmd:"";state.terminal=prefix+"$ "+cmd+(d.output!==undefined?"\n"+d.output:"");renderBottom();break}
  case"appendTerminal":state.terminal+=(state.terminal?"\n":"")+String(d.text||"");activeBottom="terminal";renderBottom();break;
  case"clearTerminal":state.terminal="";terminalHighlightText="";activeBottom="terminal";renderBottom();break;

  case"showExternalLibraries":state.externalLibrariesOpen=true;renderTree();break;
  case"openImportProjectWizard":showModal("importProject","New Project from Existing Sources",'<div class="kv"><span>Project folder</span><input value="'+esc(d.path||"C:/projects/demo")+'"><span>Detected build</span><span>Maven pom.xml</span><span>Open in</span><span>Current window</span></div>');break;
  case"importExistingProject":{
    state.project={...state.project,name:d.name||d.artifact||"Imported Spring Project",sdk:d.sdk||state.project.sdk};
    if(d.files){files=clone(d.files);state.files=clone(files)}
    if(d.tree)state.tree=clone(d.tree);
    if(!Object.keys(files).length){
      files["pom.xml"]={language:"xml",content:"<project>\n</project>"};
      files["src/main/java/Application.java"]={language:"java",content:"public class Application {\n    public static void main(String[] args) {}\n}"};
      files["src/main/resources/application.properties"]={language:"properties",content:"spring.application.name="+(d.name||"demo")};
      state.files=clone(files);state.tree=[];Object.entries(files).forEach(entry=>addTreePath(entry[0],entry[1].language||"text"));
    }
    openFile(d.openFile||"pom.xml");renderAll();break
  }
  case"openNewMavenProjectWizard":showModal("newMavenProject","New Project",'<div class="kv"><span>Generator</span><span>Maven Archetype</span><span>Project name</span><input value="'+esc(d.name||"demo")+'"><span>JDK</span><span>'+esc(d.sdk||state.project.sdk||"Java 17")+'</span></div>');break;
  case"createMavenProject":{
    const name=d.name||"demo";
    state.project={name:name,sdk:d.sdk||"Java 17",languageLevel:String(d.languageLevel||17)};
    files={};state.tree=[];
    files["pom.xml"]={language:"xml",content:"<project>\n    <modelVersion>4.0.0</modelVersion>\n    <groupId>"+(d.groupId||"com.example")+"</groupId>\n    <artifactId>"+(d.artifactId||name)+"</artifactId>\n</project>"};
    files["src/main/java/App.java"]={language:"java",content:"public class App {\n    public static void main(String[] args) {}\n}"};
    files["src/test/java/AppTest.java"]={language:"java",content:"class AppTest {\n}"};
    files["src/main/resources/application.properties"]={language:"properties",content:""};
    state.files=clone(files);Object.entries(files).forEach(entry=>addTreePath(entry[0],entry[1].language));openTabs=[];openFile("pom.xml");renderAll();break
  }
  case"showDesktopAppPreview":
    showModal("desktopPreview",d.title||"Java Desktop Application",'<div class="awtPreview"><div class="awtTitle">'+esc(d.windowTitle||"AWT Demo")+'</div><div class="awtBody"><button class="awtButton" id="awtPreviewButton">'+esc(d.buttonLabel||"Hover me")+'</button></div><div class="awtStatus" id="awtPreviewStatus">Mouse outside button</div></div>');
    setTimeout(()=>{const b=$("awtPreviewButton"),out=$("awtPreviewStatus");if(b&&out){b.onmouseenter=()=>out.textContent=d.enterText||"Mouse entered button";b.onmouseleave=()=>out.textContent=d.exitText||"Mouse exited button";b.onclick=()=>out.textContent=d.clickText||"Button clicked"}},0);break;
  case"refreshProjectTree":renderTree();actionStatus("Project tree refreshed");break;
  case"openSettings":showModal("settings","Settings",'<div class="kv"><span>Editor</span><span>Code Style, Inspections, File Types</span><span>Build Tools</span><span>Maven, Compiler</span><span>Plugins</span><span>Installed Plugins</span></div>');break;
  case"showProjectStructure":showProjectStructureSurface(d);break;
  case"addSdk":state.sdks=state.sdks||[];state.sdks.push({name:d.name||d.sdk,path:d.path||"",version:d.version||""});showProjectStructureModal();break;
  case"setProjectSdk":state.project.sdk=d.name||d.sdk;renderAll();break;
  case"setLanguageLevel":state.project.languageLevel=String(d.level||d.value||"17");renderAll();break;
  case"setModuleSdk":state.moduleSdk=state.moduleSdk||{};state.moduleSdk[d.module||"main"]=d.sdk||d.name;break;
  case"configureCompiler":state.compiler={...state.compiler,...clone(d)};genericSurface("Java Compiler",state.compiler);break;
  case"installPlugin":state.plugins=state.plugins||[];if(!state.plugins.includes(d.name))state.plugins.push(d.name);genericSurface("Plugins",{installed:state.plugins});break;
  default:if(!window.INTELLIJ_ENTERPRISE_ACTIONS?.includes(st.action))notify("Unsupported IntelliJ action: "+st.action,"error")
 }
}
function showProjectStructureModal(){showProjectStructureSurface({sdk:state.project.sdk,jdkOpen:false})}
async function seek(steps,animateFinal){
 const token=++seekToken;
 try{
  replayingHistory=true;
  reset();
  for(let i=0;i<steps.length;i++){
   allowBoundary=i===steps.length-1;
   replayingHistory=!allowBoundary;
   await applyStep(steps[i],animateFinal&&allowBoundary,token);
   if(token!==seekToken)return;
  }
  await new Promise(requestAnimationFrame);
  if(token===seekToken)parent.postMessage({type:"SIM_SEEK_DONE",app:APP_ID},location.origin==="null"?"*":location.origin);
 }finally{
  if(token===seekToken){replayingHistory=false;allowBoundary=true}
 }
}
function loadPackage(p){baseline=clone(p.apps?.[APP_ID]||{});assistantUserPlaced=false;reset()}
refs.modalClose.onclick=closeModal;refs.modalLayer.onclick=e=>{if(e.target===refs.modalLayer)closeModal()};
document.querySelectorAll(".menuItem").forEach(m=>m.onclick=()=>openMenu(m.dataset.menu));
document.querySelectorAll(".bottomTab").forEach(t=>t.onclick=()=>{activeBottom=t.dataset.bottom;renderBottom()});
document.querySelectorAll(".twTab").forEach(t=>t.onclick=()=>{activeRight=t.dataset.right;document.querySelectorAll(".twTab").forEach(x=>x.classList.toggle("active",x===t));renderRight()});

document.querySelectorAll(".projectHeadTool").forEach(btn=>{
 btn.addEventListener("click",()=>{
  const title=btn.getAttribute("title")||"";
  if(title==="New"){showProjectContextSurface();return}
  if(title==="Collapse All"){const walk=nodes=>(nodes||[]).forEach(n=>{if(n.children){n.open=false;walk(n.children)}});walk(state.tree);renderTree();return}
  if(title==="Expand All"){const walk=nodes=>(nodes||[]).forEach(n=>{if(n.children){n.open=true;walk(n.children)}});walk(state.tree);renderTree();return}
  if(title==="Autoscroll"){btn.classList.toggle("active");fidelityNotice("Autoscroll "+(btn.classList.contains("active")?"enabled":"disabled"));return}
  if(title==="More"){genericSurface("Project View Options",{view:"Project",flattenPackages:false,showExcluded:false});return}
 });
});
document.querySelectorAll(".leftRail .rail").forEach(btn=>{
 btn.addEventListener("click",()=>{
  const title=btn.getAttribute("title")||"";
  document.querySelectorAll(".leftRail .rail").forEach(x=>x.classList.toggle("active",x===btn));
  if(title==="Project"){refs.leftPanel?.classList?.remove("hidden");return}
  if(title==="Run"){if(!state.visibleFeatures.includes("run"))state.visibleFeatures.push("run");activeBottom="run";renderFeatureVisibility();return}
  if(title==="Terminal"){if(!state.visibleFeatures.includes("terminal"))state.visibleFeatures.push("terminal");activeBottom="terminal";renderFeatureVisibility();return}
  if(title==="Commit"){if(!state.visibleFeatures.includes("git"))state.visibleFeatures.push("git");activeBottom="git";renderFeatureVisibility();return}
 });
});
document.querySelectorAll(".rightRail .rail").forEach(btn=>{
 btn.addEventListener("click",()=>{
  const title=btn.getAttribute("title")||"";
  if(title==="Notifications"){fidelityNotice("No new notifications");return}
  if(title==="Database"){if(!state.visibleFeatures.includes("database"))state.visibleFeatures.push("database");activeRight="database";renderAll();return}
  if(title==="Maven"){if(!state.visibleFeatures.includes("maven"))state.visibleFeatures.push("maven");activeRight="maven";renderAll();return}
 });
});
document.querySelector(".hamburger")?.addEventListener("click",()=>openMenu("File"));
refs.project?.addEventListener("click",()=>fidelityNotice("Project switcher opened"));
refs.branch?.addEventListener("click",()=>genericSurface("Git Branches",{current:state.git?.branch||"main"}));

refs.newBtn.onclick=()=>{const p="src/main/java/NewClass.java";files[p]={language:"java",content:"public class NewClass {\\n}\\n"};state.files=clone(files);addTreePath(p,"java");openFile(p)};
refs.saveBtn.onclick=()=>{if(activeFile)files[activeFile].dirty=false;actionStatus("Saved")};
refs.runBtn.onclick=()=>{state.console="Running "+(state.activeRunConfiguration||"Current File")+"\nProcess finished with exit code 0";activeBottom="run";renderBottom()};
refs.debugBtn.onclick=()=>{activeBottom="debug";setBottom("debug","Debugger attached")};refs.stopBtn.onclick=()=>{state.console+=(state.console?"\n":"")+"Process terminated";activeBottom="run";renderBottom()};refs.restartBtn.onclick=()=>{state.console="Restarting "+(state.activeRunConfiguration||"Application")+"\nApplication started";activeBottom="run";renderBottom()};refs.clearConsoleBtn.onclick=()=>{state.console="";activeBottom="run";renderBottom()};
refs.editorSplitClose.onclick=()=>{state.editorSplit=false;state.splitFile=null;renderAll()};refs.searchBtn.onclick=()=>genericSurface("Search Everywhere",{query:""});refs.gitBtn.onclick=()=>{activeBottom="git";renderBottom()};refs.terminalBtn.onclick=()=>{activeBottom="terminal";renderBottom()};
// IntelliJ owns its native splitters. Shared layout-resize only restores/persists their sizes.
let dl=false,dr=false,dh=false;
const projectResizeHit=document.createElement("div");
projectResizeHit.id="intellijProjectResizeHit";
projectResizeHit.setAttribute("aria-hidden","true");
Object.assign(projectResizeHit.style,{
  position:"absolute",
  top:"0",
  bottom:"0",
  left:"-10px",
  right:"-10px",
  zIndex:"80",
  cursor:"col-resize",
  touchAction:"none",
  background:"transparent"
});
refs.splitL.appendChild(projectResizeHit);
let projectResizePointer=null;
let projectResizeWidth=null;
projectResizeHit.addEventListener("pointerdown",e=>{
  if(e.button!==0)return;
  projectResizePointer=e.pointerId;
  dl=true;
  document.documentElement.classList.add("sim-layout-dragging");
  try{projectResizeHit.setPointerCapture(e.pointerId)}catch(_){}
  e.preventDefault();
  e.stopPropagation();
},{capture:true});
document.addEventListener("pointermove",e=>{
  if(!dl||e.pointerId!==projectResizePointer)return;
  const r=refs.work.getBoundingClientRect();
  const max=Math.max(220,Math.min(560,r.width-260));
  projectResizeWidth=Math.max(120,Math.min(max,e.clientX-r.left-30));
  document.documentElement.style.setProperty("--leftW",projectResizeWidth+"px");
  e.preventDefault();
},{capture:true,passive:false});
const finishProjectResize=e=>{
  if(!dl||e.pointerId!==projectResizePointer)return;
  dl=false;
  projectResizePointer=null;
  document.documentElement.classList.remove("sim-layout-dragging");
  if(Number.isFinite(projectResizeWidth)){
    window.SIM_UI_STATE?.set?.("leftW",projectResizeWidth);
  }
  try{if(projectResizeHit.hasPointerCapture?.(e.pointerId))projectResizeHit.releasePointerCapture(e.pointerId)}catch(_){}
  e.preventDefault();
};
document.addEventListener("pointerup",finishProjectResize,{capture:true,passive:false});
document.addEventListener("pointercancel",finishProjectResize,{capture:true,passive:false});
refs.splitR.onpointerdown=e=>{if(e.button!==0)return;dr=true;refs.splitR.setPointerCapture?.(e.pointerId);e.preventDefault()};
refs.splitR.onpointermove=e=>{if(!dr||innerWidth<950)return;const r=refs.work.getBoundingClientRect(),w=Math.max(170,Math.min(420,r.right-e.clientX-30));document.documentElement.style.setProperty("--rightW",w+"px");e.preventDefault()};
refs.splitR.onpointerup=refs.splitR.onpointercancel=()=>{dr=false};
refs.splitH.onpointerdown=e=>{if(e.button!==0)return;dh=true;refs.splitH.setPointerCapture?.(e.pointerId);e.preventDefault()};
refs.splitH.onpointermove=e=>{if(!dh)return;const r=refs.work.getBoundingClientRect(),h=Math.max(90,Math.min(400,r.bottom-e.clientY));document.documentElement.style.setProperty("--bottomH",h+"px");e.preventDefault()};
refs.splitH.onpointerup=refs.splitH.onpointercancel=()=>{dh=false};
document.addEventListener("pointerdown",e=>{if(e.isTrusted)clearBoundary()},true);document.addEventListener("keydown",e=>{if(e.isTrusted)clearBoundary()},true);document.addEventListener("scroll",syncBoundary,true);window.addEventListener("resize",syncBoundary);
function showAssistant(m){
 refs.assistantTitle.textContent=m.title||"Step explanation";
 refs.assistantStage.textContent=m.stage||"Developer guidance";
 refs.assistantStep.textContent="Step "+(m.step||"");
 refs.assistantText.textContent=m.text||"";
 refs.assistant.classList.remove("hidden");
 if(!assistantUserPlaced){
  refs.assistant.style.left="auto";refs.assistant.style.top="auto";
  refs.assistant.style.right="16px";refs.assistant.style.bottom="34px";
 }
}
let assistantDrag=null,assistantUserPlaced=false;
function clampAssistant(left,top){
 const a=refs.app.getBoundingClientRect(),r=refs.assistant.getBoundingClientRect(),pad=6;
 return {
  left:Math.max(pad,Math.min(a.width-r.width-pad,left)),
  top:Math.max(pad,Math.min(a.height-r.height-pad,top))
 };
}
function placeAssistant(left,top,userPlaced=false){
 const p=clampAssistant(left,top);
 refs.assistant.style.left=p.left+"px";
 refs.assistant.style.top=p.top+"px";
 refs.assistant.style.right="auto";
 refs.assistant.style.bottom="auto";
 if(userPlaced)assistantUserPlaced=true;
}
refs.assistant.addEventListener("pointerdown",e=>{
 if(e.target.closest("button"))return;
 const r=refs.assistant.getBoundingClientRect(),a=refs.app.getBoundingClientRect();
 assistantDrag={pointerId:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top};
 refs.assistant.classList.add("dragging");
 refs.assistant.setPointerCapture?.(e.pointerId);
 e.preventDefault();
});
document.addEventListener("pointermove",e=>{
 if(!assistantDrag||e.pointerId!==assistantDrag.pointerId)return;
 const a=refs.app.getBoundingClientRect();
 placeAssistant(e.clientX-a.left-assistantDrag.dx,e.clientY-a.top-assistantDrag.dy,true);
 e.preventDefault();
},{passive:false});
document.addEventListener("pointerup",e=>{
 if(!assistantDrag||e.pointerId!==assistantDrag.pointerId)return;
 assistantDrag=null;
 refs.assistant.classList.remove("dragging");
});
refs.assistantMin.onclick=()=>refs.assistant.classList.toggle("minimized");
refs.assistantClose.onclick=()=>refs.assistant.classList.add("hidden");
window.addEventListener("message",e=>{const m=e.data||{};if(m.type==="SIM_PACKAGE"){autoType=m.autoType!==false;theme(m.theme||"dark");loadPackage(m.package)}if(m.type==="SIM_SEEK"){autoType=m.autoType!==false;seek(Array.isArray(m.steps)?m.steps:[],!!m.animateFinal)}if(m.type==="SIM_SETTING"){if(m.key==="autoType")autoType=!!m.value;if(m.key==="theme")theme(m.value)}if(m.type==="SIM_EXPLAIN")showAssistant(m)}); 
refs.tree.innerHTML='<div style="padding:10px;color:var(--muted);font-size:10px">Waiting for IntelliJ IDEA package...</div>';
parent.postMessage({type:"ENGINE_READY",app:APP_ID,actions:SUPPORTED_ACTIONS},"*");
})();