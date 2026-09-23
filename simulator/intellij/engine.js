(() => {
"use strict";
const APP_ID="intellij_idea";
const SUPPORTED_ACTIONS=["refreshProjectTree","restartApplication","showDesktopAppPreview","openIntegratedTerminal","createMavenProject","openNewMavenProjectWizard","importExistingProject","openImportProjectWizard","showJavaDocumentation","showExternalLibraries","clearRunConsole","runJavaMain","showQuickFixes","showCodeCompletion","showEditorDiagnostics","goToDefinition","enableFeature","disableFeature","setView","openMenu","pressButton","highlightTarget","moveCursor","showNotification","openProject","newProject","openFile","closeFile","createFile","createPackage","renameResource","deleteResource","saveFile","saveAll","setCode","typeCode","replaceCode","formatCode","optimizeImports","splitEditor","unsplitEditor","pinTab","toggleDistractionFree","toggleZenMode","gotoClass","gotoFile","gotoSymbol","gotoDeclaration","gotoImplementation","findUsages","showCallHierarchy","showTypeHierarchy","showFileStructure","searchEverywhere","findInFiles","recentFiles","showCompletion","showParameterInfo","showQuickDocumentation","showIntentionActions","applyQuickFix","runInspection","showProblems","addProblem","suppressInspection","renameSymbol","extractMethod","extractVariable","inlineRefactor","moveClass","changeSignature","safeDelete","generateGetterSetter","generateConstructor","generateToString","generateEqualsHashCode","overrideMethods","openRunConfigurations","createApplicationConfig","createSpringBootConfig","setProgramArguments","setVmOptions","setEnvironmentVariables","setWorkingDirectory","runConfiguration","stopProcess","showRunConsole","debugConfiguration","setBreakpoint","removeBreakpoint","setConditionalBreakpoint","setExceptionBreakpoint","resumeDebug","pauseDebug","stepOver","stepInto","stepOut","runToCursor","evaluateExpression","addWatch","showVariables","runJUnit","runJUnitMethod","runJUnitClass","showTestResults","showFailureTrace","rerunFailedTests","runWithCoverage","showCoverage","mockitoVerifyInteraction","openMavenToolWindow","reloadMavenProject","runMavenGoal","showMavenLifecycle","showMavenDependencies","showMavenDependencyTree","addMavenDependency","removeMavenDependency","setMavenProfile","showEffectivePom","openSpringToolWindow","showSpringBootDashboard","runSpringBootApp","stopSpringBootApp","restartSpringBootApp","setSpringProfile","showSpringBeans","showSpringMappings","navigateToController","showMvcFlow","showValidationFlow","showExceptionHandlers","openApplicationProperties","setSpringProperty","openPersistenceToolWindow","showJpaEntities","showJpaRepositories","showEntityMapping","showRepositoryMethods","generateJpaRepository","runJpql","showHibernateSql","showHibernateStatistics","showHibernateSpatial","openGitToolWindow","showLocalChanges","stageFile","unstageFile","commitChanges","pushGit","pullGit","fetchGit","createBranch","checkoutBranch","mergeBranch","showGitHistory","showGitDiff","showMergeConflict","resolveMergeConflict","openDatabaseToolWindow","addDataSource","testDataSource","openDatabaseConsole","executeSql","showQueryResult","showTableData","openTerminal","typeTerminal","appendTerminal","clearTerminal","openSettings","showProjectStructure","addSdk","setProjectSdk","setLanguageLevel","setModuleSdk","configureCompiler","installPlugin","showSdkTable","showJvmRuntime","setJvmArgument","showClasspath","showModulePath","showMavenPlugins","showMavenProfiles","runMavenWrapper","runMavenTests","showDependencyConflict","resolveMavenDependencyConflict","openGradleToolWindow","reloadGradleProject","showGradleTasks","runGradleTask","showGradleDependencies","setGradleJvm","setGradleOfflineMode","runGradleWrapper","showGradleBuildOutput","showBeanGraph","showDependencyInjection","showComponentScan","showRequestLifecycle","showControllerAdvice","runParameterizedTest","debugJUnit","showTestTree","showAssertionDiff","setTestFilter","mockitoCreateMock","mockitoInjectMocks","mockitoStub","mockitoCaptureArgument","mockitoSpy","mockitoThrow","mockitoReset","showMockitoDetails","showJpaRelationships","setFetchStrategy","reproduceNPlusOne","showTransactionBoundary","showDirtyChecking","showHibernateCaches","showOptimisticLocking","showEntityLifecycle","showPagination","runNativeQuery","openSecurityToolWindow","configureSecurityFilterChain","configureUserDetailsService","configurePasswordEncoder","configureJwtFilter","issueJwt","validateJwt","configureMethodSecurity","setCorsConfig","setCsrfConfig","configureOAuth2Client","showAuthenticationFlow","showAuthorizationFlow","showOAuth2LoginFlow","configureRestTemplate","configureWebClient","configureFeignClient","setClientTimeouts","sendExternalRequest","showClientRequestResponse","showClientErrorHandling","configureCircuitBreaker","configureRetry","configureSpringRetry","configureRateLimiter","configureTimeLimiter","configureBulkhead","setFallbackMethod","simulateResilienceCall","simulateSpringRetry","showResilienceEvents","showCircuitState","openMigrationToolWindow","createFlywayMigration","runFlywayMigrate","showFlywayInfo","repairFlyway","baselineFlyway","createLiquibaseChangelog","runLiquibaseUpdate","showLiquibaseStatus","rollbackLiquibase","showSchemaHistory","openLoggingToolWindow","configureLogging","setLogLevel","addStructuredLogging","setMdc","appendApplicationLog","showApplicationLogs","showRollingPolicy","showTraceCorrelation","showEmbeddedTomcat","configureServerPort","openTomcatRunConfig","deployWar","showTomcatLogs","showServletMappings","showTomcatThreads","importWsdl","generateSoapClient","createSoapRequest","sendSoapRequest","showSoapResponse","configureSoapFaultHandling"];
const $=id=>document.getElementById(id),clone=v=>JSON.parse(JSON.stringify(v??null)),esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const refs={app:$("app"),bottomPanel:$("bottomPanel"),project:$("projectTitle"),branch:$("branchPill"),sdk:$("sdkTitle"),tree:$("tree"),tabs:$("tabs"),gutter:$("gutter"),code:$("code"),completion:$("completion"),intentions:$("intentions"),right:$("rightBody"),bottom:$("bottomBody"),bottomTabs:$("bottomTabs"),menu:$("menu"),menuPopup:$("menuPopup"),runConfig:$("runConfig"),status:$("statusText"),lang:$("languageLevel"),line:$("lineStatus"),notification:$("notification"),boundary:$("targetBoundary"),assistant:$("ideAssistant"),assistantDrag:$("ideAssistantDrag"),assistantTitle:$("ideAssistantTitle"),assistantStage:$("ideAssistantStage"),assistantStep:$("ideAssistantStep"),assistantText:$("ideAssistantText"),assistantMin:$("ideAssistantMin"),assistantClose:$("ideAssistantClose"),modalLayer:$("modalLayer"),modalTitle:$("modalTitle"),modalBody:$("modalBody"),modalFoot:$("modalFoot"),modalClose:$("modalClose"),work:$("work"),splitL:$("splitL"),splitR:$("splitR"),splitH:$("splitH"),newBtn:$("newBtn"),saveBtn:$("saveBtn"),runBtn:$("runBtn"),debugBtn:$("debugBtn"),stopBtn:$("stopBtn"),restartBtn:$("restartBtn"),clearConsoleBtn:$("clearConsoleBtn"),searchBtn:$("searchBtn"),gitBtn:$("gitBtn"),terminalBtn:$("terminalBtn")};
let baseline=null,state=null,files={},activeFile=null,openTabs=[],activeBottom="run",activeRight="structure",autoType=true,seekToken=0,allowBoundary=true,treeMap=new Map(),focusRange=null,popupKind="",modalKind="",notificationTimer=0,trackedBoundary=null;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function theme(v){document.body.classList.toggle("theme-dark",v!=="light")}
function normalize(){
 state=state||{};state.project=state.project||{name:"Project",sdk:"Java 17",languageLevel:"17"};state.tree=state.tree||[];files=clone(state.files||{});
 state.problems=state.problems||[];state.breakpoints=state.breakpoints||[];state.visibleFeatures=state.visibleFeatures||[];state.runConfigurations=state.runConfigurations||[];state.maven=state.maven||{};state.spring=state.spring||{};state.jpa=state.jpa||{};state.git=state.git||{};state.database=state.database||{};state.tests=state.tests||{};state.terminal=state.terminal||"";
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
function icon(n){if(n.type==="folder"||n.type==="package")return "";if(n.language==="java")return "C";if(n.language==="xml")return "x";if(n.language==="properties")return "p";return "·"}
function iconClass(n){if(n.type==="folder"||n.type==="package")return "ico-folder";if(n.language==="java")return "ico-java";if(n.language==="xml")return "ico-xml";if(n.language==="properties")return "ico-props";return "ico-file"}
function renderTreeNodes(nodes,depth=0){for(const n of nodes||[]){const p=n.path||n.name,d=document.createElement("div");d.className="treeRow"+(p===activeFile?" active":"");d.dataset.path=p;d.style.paddingLeft=(depth*14)+"px";d.innerHTML='<span class="twist">'+(n.children?.length?(n.open?"▾":"▸"):"")+'</span><span class="ico '+iconClass(n)+'">'+icon(n)+'</span><span class="nodeText">'+esc(n.name||p)+'</span>';const gm=state.git?.changes?.find?.(x=>x.file===p);if(gm){const s=document.createElement("span");s.className="gitMark "+(gm.status==="A"?"a":"m");s.textContent=gm.status;d.appendChild(s)}d.onclick=()=>{if(n.type==="file"&&files[p])openFile(p);else if(n.children){n.open=!n.open;renderTree()}};refs.tree.appendChild(d);treeMap.set(p,d);if(n.children&&n.open!==false)renderTreeNodes(n.children,depth+1)}}
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
function renderEditor(){
 refs.gutter.innerHTML="";refs.code.innerHTML="";if(!activeFile||!files[activeFile])return;const f=files[activeFile],lines=String(f.content??"").split("\n");
 lines.forEach((line,i)=>{const no=i+1,g=document.createElement("div");g.className="gline";const has=state.breakpoints.some(b=>b.file===activeFile&&Number(b.line)===no);g.innerHTML='<span class="bp '+(has?"on":"")+'"></span><span></span><span class="gnum">'+no+'</span>';g.onclick=()=>toggleManualBreakpoint(no);refs.gutter.appendChild(g);const p=(state.problems||[]).find(x=>(!x.file||x.file===activeFile)&&Number(x.line||0)===no);const s=document.createElement("span");s.className="codeLine"+(focusRange&&focusRange.file===activeFile&&((Array.isArray(focusRange.lines)&&focusRange.lines.includes(no))||(!focusRange.lines&&no>=focusRange.start&&no<=focusRange.end))?" focus":"")+(p?" diag-"+(String(p.severity||"warning").toLowerCase().includes("error")?"error":"warning"):"");s.dataset.line=no;s.title=p?.message||"";s.innerHTML=syntax(line,f.language||"java");refs.code.appendChild(s)})
}
function toggleManualBreakpoint(line){const i=state.breakpoints.findIndex(b=>b.file===activeFile&&Number(b.line)===line);if(i>=0)state.breakpoints.splice(i,1);else state.breakpoints.push({file:activeFile,line});renderEditor()}
function renderRight(){
 if(activeRight==="maven"){const m=state.maven;refs.right.innerHTML='<div class="cards">'+card("Project",m.project||state.project.name)+card("Profile",m.profile||"default")+card("Last Goal",m.lastGoal||"—")+card("Status",m.status||"Ready")+'</div><div class="head">Lifecycle</div>'+["clean","validate","compile","test","package","verify","install","deploy"].map(g=>'<div class="mavenGoal" data-maven-goal="'+g+'">▶ '+g+'</div>').join("")+'<div class="head">Dependencies</div><div class="mavenGoal" data-maven-goal="dependency:tree">dependencies</div>';refs.right.querySelectorAll("[data-maven-goal]").forEach(row=>row.onclick=()=>{state.maven.lastGoal=row.dataset.mavenGoal;state.maven.status="BUILD SUCCESS";ensureMavenArtifacts(row.dataset.mavenGoal);activeBottom="run";setBottom("run","[INFO] --- "+row.dataset.mavenGoal+"\n[INFO] BUILD SUCCESS");renderRight()});return}
 if(activeRight==="database"){const ds=state.database.dataSources||[];refs.right.innerHTML=ds.map(x=>'<div class="structureRow">🗄 '+esc(x.name)+'<br><span style="color:var(--muted)">'+esc(x.url||"")+'</span></div>').join("")||'<div class="structureRow">No data sources</div>';return}
 if(!activeFile){refs.right.innerHTML='<div class="structureRow">No file</div>';return}
 const content=String(files[activeFile]?.content||""),matches=[...content.matchAll(/\b(class|interface|enum)\s+(\w+)|\b(public|private|protected)\s+[\w<>, ?\[\]]+\s+(\w+)\s*\(/g)];
 refs.right.innerHTML=matches.map(m=>'<div class="structureRow">'+esc(m[2]||m[4]||"symbol")+'</div>').join("")||'<div class="structureRow">No symbols</div>'
}
function card(t,v){return '<div class="card"><h3>'+esc(t)+'</h3><div class="metric">'+esc(v??"")+'</div></div>'}
function setBottom(name,content,html=false){
 activeBottom=name;
 document.querySelectorAll(".bottomTab").forEach(t=>t.classList.toggle("active",t.dataset.bottom===name));
 refs.bottom.className="bottomBody"+(name==="terminal"?" terminal":"");
 if(name==="terminal"){
   refs.bottom.innerHTML='<div class="terminalSessionBar"><span class="activeSession">Local</span><span class="terminalGrow"></span><span class="terminalAction">＋</span><span class="terminalAction">⌄</span><span class="terminalAction">⋮</span></div><div class="terminalViewport"><pre>'+esc(content||"$ ")+'</pre></div>';
   const v=refs.bottom.querySelector(".terminalViewport"); if(v)v.scrollTop=v.scrollHeight;
 }else if(html)refs.bottom.innerHTML=content||"";
 else refs.bottom.textContent=content||""
}
function renderBottom(){
 const b=state.bottomCache?.[activeBottom];if(b){setBottom(activeBottom,b.content,b.html);return}
 if(activeBottom==="terminal")setBottom("terminal",state.terminal||"$ ");
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
 const bottomFeatures=["run","debug","tests","terminal","problems","git","spring"];
 const availableBottom=bottomFeatures.filter(x=>visible.has(x));
 const anyBottom=availableBottom.length>0;
 if(anyBottom&&!visible.has(activeBottom))activeBottom=availableBottom[0];
 refs.bottomPanel?.classList.toggle("hidden",!anyBottom);
 refs.splitH?.classList.toggle("hidden",!anyBottom);
 refs.work?.classList.toggle("noBottom",!anyBottom);
 const hasRight=visible.has("maven")||visible.has("database");
 refs.work?.classList.toggle("hasRightTools",hasRight);
 if(anyBottom)renderBottom()
}
function renderAll(){refs.project.textContent=state.project.name||"Project";refs.branch.textContent=state.git.branch||"main";refs.sdk.textContent=state.project.sdk||"Project SDK";refs.lang.textContent="Java "+(state.project.languageLevel||"");refs.runConfig.textContent=state.activeRunConfiguration||state.runConfigurations[0]?.name||"Current File";renderTree();renderTabs();renderEditor();renderRight();renderBottom();renderFeatureVisibility()}
function notify(text,type=""){clearTimeout(notificationTimer);refs.notification.textContent=String(text||"");refs.notification.className="notification show"+(type==="error"?" error":"");notificationTimer=setTimeout(()=>refs.notification.classList.remove("show"),2200)}
function showModal(kind,title,html){modalKind=kind;refs.modalTitle.textContent=title;refs.modalBody.innerHTML=html;refs.modalFoot.innerHTML='<button id="modalOk">OK</button>';refs.modalLayer.classList.add("show");$("modalOk").onclick=closeModal}
function closeModal(){modalKind="";refs.modalLayer.classList.remove("show");refs.modalBody.innerHTML="";refs.modalFoot.innerHTML=""}
function showPopup(kind,items){popupKind=kind;const el=kind==="completion"?refs.completion:refs.intentions;el.innerHTML=(items||[]).map((x,i)=>'<div class="popupRow '+(i===0?"active":"")+'">'+esc(typeof x==="string"?x:(x.label||x.text||JSON.stringify(x)))+'</div>').join("");el.classList.add("show")}
function clearTransient(action){clearTimeout(notificationTimer);refs.notification.classList.remove("show");refs.menuPopup.classList.remove("show");refs.completion.classList.remove("show");refs.intentions.classList.remove("show");popupKind="";const continueModal=["setProgramArguments","setVmOptions","setEnvironmentVariables","setWorkingDirectory","addSdk","setProjectSdk","setLanguageLevel","setModuleSdk","configureCompiler","installPlugin"];if(modalKind&&!continueModal.includes(action))closeModal()}
function markerReplace(src,marker,code,position="replace"){const s=String(src),m=String(marker||"");const idx=s.indexOf(m);if(idx<0)return null;const ins=String(code||"");if(position==="before")return s.slice(0,idx)+ins+s.slice(idx);if(position==="after")return s.slice(0,idx+m.length)+ins+s.slice(idx+m.length);return s.slice(0,idx)+ins+s.slice(idx+m.length)}
async function typeText(final,apply,animate,token){if(!animate||!autoType){apply(final);return}const n=Math.min(55,Math.max(1,final.length));for(let i=1;i<=n;i++){if(token!==seekToken)return;apply(final.slice(0,Math.floor(final.length*i/n)));await sleep(Math.min(1000,Math.max(250,final.length*5))/n)}}
function addTreePath(path,language="java"){const parts=path.split("/");let nodes=state.tree,acc="";parts.forEach((part,i)=>{acc=acc?acc+"/"+part:part;let n=nodes.find(x=>(x.path||x.name)===acc);if(!n){n={name:part,path:acc,type:i===parts.length-1?"file":"folder",language:i===parts.length-1?language:undefined,open:true,children:i===parts.length-1?undefined:[]};nodes.push(n)}if(i<parts.length-1){n.children=n.children||[];nodes=n.children}})}
function ensureMavenArtifacts(goal){if(!/(compile|test|package|verify|install|deploy)/.test(String(goal||"")))return;Object.keys(files).filter(p=>p.endsWith(".java")).slice(0,6).forEach(p=>{const cls="target/classes/"+p.split("/").pop().replace(/\.java$/,".class");if(!files[cls]){files[cls]={language:"text",content:"compiled bytecode artifact"};addTreePath(cls,"text")}});if(/(package|verify|install|deploy)/.test(String(goal||""))){const jar="target/"+String(state.project?.name||"application").replace(/\s+/g,"-").toLowerCase()+".jar";files[jar]={language:"text",content:"Java archive"};addTreePath(jar,"text")}state.files=clone(files);renderTree()}
function renameTreePath(nodes,oldp,newp){for(const n of nodes||[]){if(n.path===oldp){n.path=newp;n.name=newp.split("/").pop()}if(n.children)renameTreePath(n.children,oldp,newp)}}
function deleteTreePath(nodes,p){for(let i=nodes.length-1;i>=0;i--){if(nodes[i].path===p)nodes.splice(i,1);else if(nodes[i].children)deleteTreePath(nodes[i].children,p)}}
function addProblem(d){state.problems.push({severity:d.severity||"warning",message:d.message||"Inspection problem",file:d.file||activeFile,line:d.line||1})}
function resultTable(cols,rows){return '<table class="dataTable"><tr>'+cols.map(c=>'<th>'+esc(c)+'</th>').join("")+'</tr>'+rows.map(r=>'<tr>'+cols.map(c=>'<td>'+esc(Array.isArray(r)?r[cols.indexOf(c)]:r[c])+'</td>').join("")+'</tr>').join("")+'</table>'}
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
function reset(){state=clone(baseline||{});normalize();clearTransient("");trackedBoundary=null;refs.boundary.classList.remove("show");refs.app.classList.remove("distraction");document.body.classList.remove("zen");renderAll()}
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
  case"newProject":state.project={name:d.name||"New Project",sdk:d.sdk||state.project.sdk,languageLevel:d.languageLevel||state.project.languageLevel};if(!d.preserveFiles){state.tree=[];files={};state.files={};activeFile=null;openTabs=[]}renderAll();break;
  case"openFile":openFile(d.file);break;
  case"closeFile":closeFile(d.file||activeFile);break;
  case"createFile":files[d.path]={language:d.language||"java",content:String(d.content||"")};state.files=clone(files);addTreePath(d.path,d.language||"java");markGit(d.path,"A");openFile(d.path);break;
  case"createPackage":{const p=(d.path||d.name||"package").replace(/\./g,"/");addTreePath(p+"/.package","java");delete files[p+"/.package"];deleteTreePath(state.tree,p+"/.package");actionStatus("Package created: "+(d.name||p));renderAll();break}
  case"renameResource":{const old=d.path||d.oldPath,nw=d.newPath||d.name;if(files[old]){files[nw]=files[old];delete files[old];state.files=clone(files);openTabs=openTabs.map(x=>x===old?nw:x);if(activeFile===old)activeFile=nw}renameTreePath(state.tree,old,nw);renderAll();break}
  case"deleteResource":{const p=d.path;delete files[p];state.files=clone(files);openTabs=openTabs.filter(x=>x!==p);if(activeFile===p)activeFile=openTabs.at(-1)||null;deleteTreePath(state.tree,p);renderAll();break}
  case"saveFile":if(f())f().dirty=false;actionStatus("Saved "+(d.file||activeFile||"file"));renderTabs();break;
  case"saveAll":Object.values(files).forEach(x=>x.dirty=false);actionStatus("All files saved");renderTabs();break;
  case"setCode":if(f()){f().content=String(d.code??d.content??"");f().dirty=true;markGit(d.file||activeFile,"M");renderEditor()}break;
  case"typeCode":{const file=d.file||activeFile;if(!files[file])break;const old=String(files[file].content||""),pos=d.position||"replace",snippet=String(d.code||"");const make=part=>pos==="end"?old+part:(pos==="start"?part+old:markerReplace(old,d.marker||"",part,pos));const final=make(snippet);if(final===null){notify("Code marker not found","error");break}activeFile=file;if(!openTabs.includes(file))openTabs.push(file);const markerIndex=pos==="end"?old.length:(pos==="start"?0:old.indexOf(d.marker||""));const before=old.slice(0,Math.max(0,markerIndex)).split("\n").length;const snippetLines=snippet.split("\n");const focusLines=snippetLines.map((line,idx)=>line.trim()?before+idx:null).filter(Boolean);if(!focusLines.length)focusLines.push(before);focusRange={file,lines:focusLines};await typeText(snippet,part=>{files[file].content=make(part)??old;renderEditor();requestAnimationFrame(()=>{const lines=[...refs.code.querySelectorAll(".codeLine.focus")];const target=lines[lines.length-1]||refs.code.querySelector('[data-line="'+focusLines[0]+'"]');window.SIM_FOCUS?.follow(target,{block:"center"})})},animate,token);files[file].content=final;files[file].dirty=true;markGit(file,"M");focusRange={file,lines:focusLines};renderAll();window.SIM_FOCUS?.follow(refs.code.querySelector('[data-line="'+focusLines.at(-1)+'"]'),{block:"center"});if(d.boundary!==false)await highlight({type:"line",file,line:focusLines[0]},token);break}
  case"replaceCode":if(f()){f().content=String(f().content).replace(String(d.find||""),String(d.replace||""));f().dirty=true;markGit(d.file||activeFile,"M");renderEditor()}break;
  case"formatCode":case"reformatFile":if(f()){f().content=String(f().content).split("\n").map(x=>x.replace(/\s+$/,"")).join("\n");renderEditor();actionStatus("Code reformatted")}break;
  case"optimizeImports":actionStatus("Imports optimized");break;
  case"splitEditor":state.editorSplit=true;actionStatus("Editor split");break;
  case"unsplitEditor":state.editorSplit=false;actionStatus("Editor unsplit");break;
  case"pinTab":if(f()){f().pinned=d.pinned!==false;renderTabs()}break;
  case"toggleDistractionFree":refs.app.classList.toggle("distraction",d.enabled!==false);break;
  case"toggleZenMode":document.body.classList.toggle("zen",d.enabled!==false);break;

  case"gotoClass":case"gotoFile":case"gotoSymbol":case"searchEverywhere":case"findInFiles":case"recentFiles":genericSurface(st.action,d);break;
  case"goToDefinition":case"gotoDeclaration":case"gotoImplementation":case"findUsages":case"showCallHierarchy":case"showTypeHierarchy":genericSurface(st.action,d);if(d.file)openFile(d.file);break;
  case"showFileStructure":showFileStructure(d.file||activeFile);break;

  case"showCodeCompletion":case"showCompletion":showPopup("completion",d.items||["sorted()","filter(...)","distinct()","findFirst()","map(...)","collect(...)"]);break;
  case"showParameterInfo":showPopup("completion",d.items||["saveSurvey(SurveyRecord survey)"]);break;
  case"showJavaDocumentation":case"showQuickDocumentation":genericSurface("JDK Documentation",d);break;
  case"showQuickFixes":case"showIntentionActions":showPopup("intentions",d.items||["Add exception to method signature","Import class","Replace with modern API","Refactor expression"]);break;
  case"applyQuickFix":if(d.file&&d.find!==undefined&&files[d.file])files[d.file].content=String(files[d.file].content).replace(String(d.find),String(d.replace||""));actionStatus("Quick fix applied");renderAll();break;
  case"showEditorDiagnostics":case"runInspection":if(d.problems)state.problems=clone(d.problems);else if(!state.problems.length)state.problems=[{severity:"error",message:"Cannot resolve method",file:activeFile,line:1},{severity:"warning",message:"Type or declaration should be reviewed",file:activeFile,line:2}];activeBottom="problems";renderEditor();setBottom("problems",state.problems.map(p=>p.severity+": "+p.message).join("\n"));break;
  case"showProblems":activeBottom="problems";renderBottom();break;
  case"addProblem":addProblem(d);activeBottom="problems";renderBottom();break;
  case"suppressInspection":state.problems=state.problems.filter(p=>p.message!==d.message);renderBottom();break;

  case"renameSymbol":case"extractMethod":case"extractVariable":case"inlineRefactor":case"moveClass":case"changeSignature":case"safeDelete":case"generateGetterSetter":case"generateConstructor":case"generateToString":case"generateEqualsHashCode":case"overrideMethods":
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
  case"showRunConsole":activeBottom="run";if(d.text!==undefined)state.console=String(d.text);renderBottom();break;case"clearRunConsole":state.console="";activeBottom="run";renderBottom();break;case"restartApplication":state.console=d.console||("Restarting "+(state.activeRunConfiguration||"Application")+"\nApplication started");activeBottom="run";renderBottom();break;

  case"debugConfiguration":state.debug={...state.debug,running:true,config:d.name||state.activeRunConfiguration,frames:clone(d.frames||[]),variables:clone(d.variables||[])};activeBottom="debug";setBottom("debug",d.console||"Debugger attached");break;
  case"setBreakpoint":if(!state.breakpoints.some(b=>b.file===d.file&&Number(b.line)===Number(d.line)))state.breakpoints.push({file:d.file,line:Number(d.line),condition:d.condition||""});renderEditor();break;
  case"removeBreakpoint":state.breakpoints=state.breakpoints.filter(b=>!(b.file===d.file&&Number(b.line)===Number(d.line)));renderEditor();break;
  case"setConditionalBreakpoint":{let b=state.breakpoints.find(x=>x.file===d.file&&Number(x.line)===Number(d.line));if(!b){b={file:d.file,line:Number(d.line)};state.breakpoints.push(b)}b.condition=d.condition||"true";renderEditor();break}
  case"setExceptionBreakpoint":state.exceptionBreakpoint=d.exception||"Exception";actionStatus("Exception breakpoint: "+state.exceptionBreakpoint);break;
  case"resumeDebug":case"pauseDebug":case"stepOver":case"stepInto":case"stepOut":case"runToCursor":actionStatus(st.action);activeBottom="debug";renderBottom();break;
  case"evaluateExpression":activeBottom="debug";setBottom("debug",(state.bottomCache?.debug?.content||"")+"\nEvaluate: "+(d.expression||"")+" = "+(d.result??""));break;
  case"addWatch":state.debug=state.debug||{};state.debug.watches=state.debug.watches||[];state.debug.watches.push({expression:d.expression,result:d.result});activeBottom="debug";setBottom("debug",state.debug.watches.map(x=>`${x.expression} = ${x.result}`).join("\n"));break;
  case"showVariables":activeBottom="debug";setBottom("debug",(d.variables||state.debug?.variables||[]).map(x=>`${x.name} = ${x.value}`).join("\n"));break;

  case"runJUnit":case"runJUnitMethod":case"runJUnitClass":state.tests={...state.tests,total:d.total??d.tests?.length??1,passed:d.passed??1,failed:d.failed??0,results:clone(d.tests||[])};activeBottom="tests";setBottom("tests",`Tests: ${state.tests.total}, Passed: ${state.tests.passed}, Failed: ${state.tests.failed}\n`+(state.tests.results||[]).map(x=>`${x.status||"PASS"} ${x.name}`).join("\n"));break;
  case"showTestResults":activeBottom="tests";renderBottom();break;
  case"showFailureTrace":activeBottom="tests";setBottom("tests",d.trace||"AssertionError");break;
  case"rerunFailedTests":activeBottom="tests";setBottom("tests",d.console||"Rerun failed tests: PASS");break;
  case"runWithCoverage":state.tests.coverage=d.coverage||{};activeBottom="tests";setBottom("tests","Run with Coverage\n"+JSON.stringify(state.tests.coverage,null,2));break;
  case"showCoverage":genericSurface("Code Coverage",d.coverage||state.tests.coverage||{});break;
  case"mockitoVerifyInteraction":activeBottom="tests";setBottom("tests",d.text||"Mockito verify(repository).save(entity)  PASS");break;

  case"openMavenToolWindow":activeRight="maven";renderRight();break;
  case"reloadMavenProject":state.maven.status="Reloaded";activeRight="maven";renderRight();break;
  case"runMavenGoal":state.maven.lastGoal=d.goal||"test";state.maven.status=d.status||"BUILD SUCCESS";ensureMavenArtifacts(state.maven.lastGoal);activeBottom="run";setBottom("run",d.console||`[INFO] --- ${state.maven.lastGoal}\n[INFO] BUILD SUCCESS`);renderRight();break;
  case"showMavenLifecycle":case"showMavenDependencies":case"showMavenDependencyTree":case"showEffectivePom":genericSurface(st.action,d);break;
  case"addMavenDependency":state.maven.dependencies=state.maven.dependencies||[];state.maven.dependencies.push(clone(d.dependency||d));renderRight();break;
  case"removeMavenDependency":state.maven.dependencies=(state.maven.dependencies||[]).filter(x=>(x.artifactId||x.name)!==(d.artifactId||d.name));renderRight();break;
  case"setMavenProfile":state.maven.profile=d.profile||"default";renderRight();break;

  case"openSpringToolWindow":case"showSpringBootDashboard":genericSurface("Spring",state.spring);break;
  case"runSpringBootApp":{const app=(state.spring.apps||[]).find(x=>x.name===d.name)||(state.spring.apps||[])[0];if(app){app.status="Running";app.profile=d.profile||app.profile;app.port=d.port||app.port}state.console=d.console||"Started Spring Boot application";activeBottom="services";setBottom("services",state.console);break}
  case"stopSpringBootApp":{const app=(state.spring.apps||[]).find(x=>x.name===d.name)||(state.spring.apps||[])[0];if(app)app.status="Stopped";activeBottom="services";setBottom("services","Spring Boot application stopped");break}
  case"restartSpringBootApp":{const app=(state.spring.apps||[]).find(x=>x.name===d.name)||(state.spring.apps||[])[0];if(app)app.status="Running";activeBottom="services";setBottom("services","Spring Boot application restarted");break}
  case"setSpringProfile":state.spring.activeProfile=d.profile||"dev";break;
  case"showSpringBeans":genericSurface("Spring Beans",{beans:state.spring.beans||d.beans||[]});break;
  case"showSpringMappings":genericSurface("Spring MVC Mappings",{mappings:state.spring.mappings||d.mappings||[]});break;
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

  case"openIntegratedTerminal":case"openTerminal":activeBottom="terminal";renderBottom();break;
  case"typeTerminal":{const cmd=String(d.command||d.text||"");const prefix=state.terminal?(state.terminal+"\n"):"";await typeText(cmd,part=>setBottom("terminal",prefix+"$ "+part),animate,token);state.terminal=prefix+"$ "+cmd+(d.output!==undefined?"\n"+d.output:"");renderBottom();break}
  case"appendTerminal":state.terminal+=(state.terminal?"\n":"")+String(d.text||"");activeBottom="terminal";renderBottom();break;
  case"clearTerminal":state.terminal="";activeBottom="terminal";renderBottom();break;

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
  case"showProjectStructure":showModal("settings","Project Structure",'<div class="kv"><span>Project SDK</span><input value="'+esc(state.project.sdk||"")+'"><span>Language level</span><input value="'+esc(state.project.languageLevel||"")+'"><span>Modules</span><span>'+esc((state.modules||["main"]).join(", "))+'</span></div>');break;
  case"addSdk":state.sdks=state.sdks||[];state.sdks.push({name:d.name||d.sdk,path:d.path||"",version:d.version||""});showProjectStructureModal();break;
  case"setProjectSdk":state.project.sdk=d.name||d.sdk;renderAll();break;
  case"setLanguageLevel":state.project.languageLevel=String(d.level||d.value||"17");renderAll();break;
  case"setModuleSdk":state.moduleSdk=state.moduleSdk||{};state.moduleSdk[d.module||"main"]=d.sdk||d.name;break;
  case"configureCompiler":state.compiler={...state.compiler,...clone(d)};genericSurface("Java Compiler",state.compiler);break;
  case"installPlugin":state.plugins=state.plugins||[];if(!state.plugins.includes(d.name))state.plugins.push(d.name);genericSurface("Plugins",{installed:state.plugins});break;
  default:if(!window.INTELLIJ_ENTERPRISE_ACTIONS?.includes(st.action))notify("Unsupported IntelliJ action: "+st.action,"error")
 }
}
function showProjectStructureModal(){showModal("settings","Project Structure",'<div class="cards">'+(state.sdks||[]).map(x=>card(x.name,x.path||x.version)).join("")+'</div>')}
async function seek(steps,animateFinal){const token=++seekToken;reset();for(let i=0;i<steps.length;i++){allowBoundary=i===steps.length-1;await applyStep(steps[i],animateFinal&&i===steps.length-1,token);if(token!==seekToken)return}allowBoundary=true}
function loadPackage(p){baseline=clone(p.apps?.[APP_ID]||{});assistantUserPlaced=false;reset()}
refs.modalClose.onclick=closeModal;refs.modalLayer.onclick=e=>{if(e.target===refs.modalLayer)closeModal()};
document.querySelectorAll(".menuItem").forEach(m=>m.onclick=()=>openMenu(m.dataset.menu));
document.querySelectorAll(".bottomTab").forEach(t=>t.onclick=()=>{activeBottom=t.dataset.bottom;renderBottom()});
document.querySelectorAll(".twTab").forEach(t=>t.onclick=()=>{activeRight=t.dataset.right;document.querySelectorAll(".twTab").forEach(x=>x.classList.toggle("active",x===t));renderRight()});
refs.newBtn.onclick=()=>{const p="src/main/java/NewClass.java";files[p]={language:"java",content:"public class NewClass {\\n}\\n"};state.files=clone(files);addTreePath(p,"java");openFile(p)};
refs.saveBtn.onclick=()=>{if(activeFile)files[activeFile].dirty=false;actionStatus("Saved")};
refs.runBtn.onclick=()=>{state.console="Running "+(state.activeRunConfiguration||"Current File")+"\nProcess finished with exit code 0";activeBottom="run";renderBottom()};
refs.debugBtn.onclick=()=>{activeBottom="debug";setBottom("debug","Debugger attached")};refs.stopBtn.onclick=()=>{state.console+=(state.console?"\n":"")+"Process terminated";activeBottom="run";renderBottom()};refs.restartBtn.onclick=()=>{state.console="Restarting "+(state.activeRunConfiguration||"Application")+"\nApplication started";activeBottom="run";renderBottom()};refs.clearConsoleBtn.onclick=()=>{state.console="";activeBottom="run";renderBottom()};
refs.searchBtn.onclick=()=>genericSurface("Search Everywhere",{query:""});refs.gitBtn.onclick=()=>{activeBottom="git";renderBottom()};refs.terminalBtn.onclick=()=>{activeBottom="terminal";renderBottom()};
let dl=false,dr=false,dh=false;refs.splitL.onpointerdown=e=>{dl=true;refs.splitL.setPointerCapture(e.pointerId)};refs.splitL.onpointermove=e=>{if(!dl||innerWidth<650)return;const r=refs.work.getBoundingClientRect(),w=Math.max(150,Math.min(420,e.clientX-r.left-30));document.documentElement.style.setProperty("--leftW",w+"px")};refs.splitL.onpointerup=()=>dl=false;
refs.splitR.onpointerdown=e=>{dr=true;refs.splitR.setPointerCapture(e.pointerId)};refs.splitR.onpointermove=e=>{if(!dr||innerWidth<950)return;const r=refs.work.getBoundingClientRect(),w=Math.max(170,Math.min(420,r.right-e.clientX-30));document.documentElement.style.setProperty("--rightW",w+"px")};refs.splitR.onpointerup=()=>dr=false;
refs.splitH.onpointerdown=e=>{dh=true;refs.splitH.setPointerCapture(e.pointerId)};refs.splitH.onpointermove=e=>{if(!dh)return;const r=refs.work.getBoundingClientRect(),h=Math.max(90,Math.min(400,r.bottom-e.clientY));document.documentElement.style.setProperty("--bottomH",h+"px")};refs.splitH.onpointerup=()=>dh=false;
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