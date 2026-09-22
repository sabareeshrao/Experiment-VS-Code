(() => {
"use strict";

const $=id=>document.getElementById(id);
const clone=v=>JSON.parse(JSON.stringify(v??null));
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

const APP_ID="postman";
const SUPPORTED_ACTIONS=["openRequest","setEnvironment","setMethod","setUrl","typeUrl","setBody","typeBody","setHeaders","setTests","selectRequestTab","selectResponseTab","pressSend","sendRequest","sendLiveRequest","setLiveNetwork","showResponse","createRequest","highlightTarget","moveCursor","saveRequest","renameRequest","duplicateRequest","deleteRequest","createCollection","renameCollection","deleteCollection","createFolder","collapseCollection","setQueryParams","addQueryParam","toggleQueryParam","setAuth","setAuthType","setAuthField","setBearerToken","setBasicAuth","setApiKey","setOAuth2","setJwtBearer","setAwsSignature","inheritAuth","setBodyMode","setFormData","setUrlEncoded","setGraphqlBody","setPreRequestScript","setPostResponseScript","runPreRequestScript","runPostResponseTests","setTestResults","showTestResults","setRequestSetting","openRequestSettings","createEnvironment","setEnvironmentVariable","deleteEnvironmentVariable","showEnvironmentEditor","setCollectionVariable","setGlobalVariable","setLocalVariable","setVariableMetadata","resolveVariables","showVariableInspector","showCookies","setCookie","setCookieAdvanced","deleteCookie","showConsole","appendConsole","appendNetworkLog","clearConsole","saveExample","selectExample","showExamples","showHistory","addHistoryEntry","clearHistory","openRunner","configureRunner","setRunnerData","runCollection","setRunnerProgress","showRunnerResults","runPerformanceTest","showPerformanceResults","scheduleCollectionRun","showScheduledRuns","openCli","runPostmanCli","runNewman","openNew","openImport","importCurl","importCollection","importOpenApi","importHar","exportCollection","generateCodeSnippet","openMockServer","createMockServer","setMockResponse","configureMockMatching","addMockLog","showMockLogs","openMonitor","createMonitor","configureMonitor","runMonitor","showMonitorHistory","openGraphQL","setGraphqlQuery","setGraphqlVariables","loadGraphqlSchema","showGraphqlSchema","sendGraphql","openWebSocket","configureWebSocket","setWebSocketProtocol","connectWebSocket","sendWebSocketMessage","receiveWebSocketMessage","disconnectWebSocket","openGrpc","loadProto","setGrpcReflection","selectGrpcService","setGrpcMetadata","setGrpcMessage","invokeGrpc","startGrpcStream","receiveGrpcMessage","endGrpcStream","openDocumentation","openVault","setVaultSecret","deleteVaultSecret","revealVaultSecret","openPackages","addPackage","removePackage","usePackage","openVisualizer","setVisualizerTemplate","renderVisualizer","openWorkspaces","createWorkspace","switchWorkspace","shareCollection","addComment","openCollaboration","forkCollection","openPullRequest","mergePullRequest","openSpecHub","createSpec","updateSpec","validateAgainstSpec","generateCollectionFromSpec","openFlows","createFlow","addFlowBlock","connectFlowBlocks","runFlow","openCertificates","addCertificate","removeCertificate","openProxy","configureProxy","openGitIntegration","connectGitIntegration","syncGitIntegration","openReports","addReportMetric","openAgent","runAgentAction","openApiHub","createApi","showNotification","toggleSidebar"];

const refs={
  app:$("app"),main:$("main"),workspace:$("workspaceName"),env:$("envName"),collections:$("collections"),tabs:$("tabs"),
  method:$("methodBox"),url:$("urlBox"),send:$("sendBtn"),body:$("requestBody"),resp:$("responseBody"),
  status:$("status"),metrics:$("metrics"),splitV:$("splitV"),splitH:$("splitH"),boundary:$("targetBoundary"),
  reqTabs:$("reqTabs"),respTabs:$("respTabs"),requestArea:$("requestArea"),
  toolNew:$("toolNew"),toolImport:$("toolImport"),toolRunner:$("toolRunner"),toolConsole:$("toolConsole"),toolHistory:$("toolHistory"),toolDocs:$("toolDocs"),toolVariables:$("toolVariables"),
  toolApis:$("toolApis"),toolFlows:$("toolFlows"),toolMocks:$("toolMocks"),toolMonitors:$("toolMonitors"),toolReports:$("toolReports"),toolAgent:$("toolAgent"),toolMore:$("toolMore"),saveBtn:$("saveBtn"),
  sideHeadTitle:$("sideHeadTitle"),topSearch:$("topSearch"),
  utilityShade:$("utilityShade"),utilityPanel:$("utilityPanel"),utilityTitle:$("utilityTitle"),utilityBody:$("utilityBody"),utilityClose:$("utilityClose"),
  notification:$("notification"),statusConsole:$("statusConsole"),statusCookies:$("statusCookies"),statusHistory:$("statusHistory"),statusVault:$("statusVault"),statusCertificates:$("statusCertificates"),
  assistant:$("postmanAssistant"),assistantHead:$("assistantHead"),assistantTitle:$("assistantTitle"),assistantMeta:$("assistantMeta"),assistantText:$("assistantText"),assistantMin:$("assistantMin"),assistantClose:$("assistantClose")
};

let packageData=null,baseline=null,state=null,autoType=true,seekToken=0,allowBoundary=true;
let requests={},currentRequest=null,openTabs=[],activeEnv="",response=null,reqView="body",respView="pretty";
let dirtyRequests=new Set(),utilityKind="",trackedBoundary=null,boundaryFrame=0;

function applyTheme(theme){document.body.classList.toggle("theme-dark",theme!=="light")}

function normalizeState(){
  state=state||{};
  state.workspaceName=state.workspaceName||"Workspace";
  state.collections=Array.isArray(state.collections)?state.collections:[];
  state.environments=normalizeNamedVariables(state.environments);
  state.globals=state.globals||{};
  state.history=Array.isArray(state.history)?state.history:[];
  state.console=Array.isArray(state.console)?state.console:[];
  state.cookies=Array.isArray(state.cookies)?state.cookies:[];
  state.mocks=Array.isArray(state.mocks)?state.mocks:[];
  state.monitors=Array.isArray(state.monitors)?state.monitors:[];
  state.runner=state.runner||{};
  state.websocket=state.websocket||{};
  state.grpc=state.grpc||{};
  state.documentation=state.documentation||{};
  state.workspaces=Array.isArray(state.workspaces)?state.workspaces:[{name:state.workspaceName||"Workspace",type:"Personal",members:["You"]}];
  state.vault=state.vault||{};state.vaultRevealed=state.vaultRevealed||{};
  state.packages=Array.isArray(state.packages)?state.packages:[];state.visualizer=state.visualizer||{};
  state.specs=Array.isArray(state.specs)?state.specs:[];state.apis=Array.isArray(state.apis)?state.apis:[];
  state.flows=Array.isArray(state.flows)?state.flows:[];state.certificates=Array.isArray(state.certificates)?state.certificates:[];
  state.proxy=state.proxy||{enabled:false,type:"system",host:"",port:""};state.scheduledRuns=Array.isArray(state.scheduledRuns)?state.scheduledRuns:[];
  state.performance=state.performance||{};state.cli=state.cli||{history:[]};state.comments=Array.isArray(state.comments)?state.comments:[];
  state.pullRequests=Array.isArray(state.pullRequests)?state.pullRequests:[];state.gitIntegrations=Array.isArray(state.gitIntegrations)?state.gitIntegrations:[];
  state.reports=state.reports||{metrics:[]};state.agent=state.agent||{history:[]};state.variableMeta=state.variableMeta||{};
  state.liveNetwork=state.liveNetwork===true;state.graphql=state.graphql||{};state.grpc.stream=state.grpc.stream||[];
  activeEnv=state.activeEnvironment||Object.keys(state.environments)[0]||"";
}
function normalizeNamedVariables(input){
  if(Array.isArray(input)){
    const out={};
    input.forEach(x=>{if(x&&x.name)out[x.name]=clone(x.variables||x.values||{})});
    return out;
  }
  return input&&typeof input==="object"?clone(input):{};
}
function eachCollectionRequest(collection,fn){
  (collection.requests||[]).forEach(r=>fn(r,collection,null));
  (collection.folders||[]).forEach(f=>(f.requests||[]).forEach(r=>fn(r,collection,f)));
}
function indexRequests(){
  requests={};
  state.collections.forEach(c=>eachCollectionRequest(c,(r,col,folder)=>{
    if(!r.id)r.id="req_"+Math.random().toString(36).slice(2,8);
    r.collection=col.name;
    if(folder)r.folder=folder.name;
    r.params=Array.isArray(r.params)?r.params:[];
    r.headers=r.headers||{};
    r.auth=r.auth||{type:"No Auth",fields:{}};
    r.bodyMode=r.bodyMode||"raw";
    r.formData=Array.isArray(r.formData)?r.formData:[];
    r.urlencoded=Array.isArray(r.urlencoded)?r.urlencoded:[];
    r.settings=r.settings||{};
    r.examples=Array.isArray(r.examples)?r.examples:[];
    r.localVariables=r.localVariables||{};
    requests[r.id]=r;
  }));
}
function requestById(id){return requests[id]||null}
function collectionByName(name){return state.collections.find(c=>c.name===name)||null}
function currentCollection(){
  const r=requestById(currentRequest);
  return r?collectionByName(r.collection):null;
}
function pretty(v){
  if(v===undefined||v===null)return "";
  if(typeof v==="string")return v;
  try{return JSON.stringify(v,null,2)}catch{return String(v)}
}
function statusTextFor(code){
  const map={200:"OK",201:"Created",202:"Accepted",204:"No Content",301:"Moved Permanently",302:"Found",304:"Not Modified",
    400:"Bad Request",401:"Unauthorized",403:"Forbidden",404:"Not Found",409:"Conflict",422:"Unprocessable Entity",
    429:"Too Many Requests",500:"Internal Server Error",502:"Bad Gateway",503:"Service Unavailable"};
  return map[Number(code)]||"";
}
function variableMap(){
  const r=requestById(currentRequest)||{};
  const c=currentCollection()||{};
  return {...(state.globals||{}),...(state.environments[activeEnv]||{}),...(c.variables||{}),...(r.localVariables||{})};
}
function resolveString(value){
  const vars=variableMap();
  return String(value??"").replace(/\{\{\s*([^}]+?)\s*\}\}/g,(m,k)=>Object.prototype.hasOwnProperty.call(vars,k)?String(vars[k]):m);
}
function resolveObject(obj){
  if(typeof obj==="string")return resolveString(obj);
  if(Array.isArray(obj))return obj.map(resolveObject);
  if(obj&&typeof obj==="object"){const out={};Object.entries(obj).forEach(([k,v])=>out[k]=resolveObject(v));return out}
  return obj;
}
function markDirty(){
  if(currentRequest)dirtyRequests.add(currentRequest);
  renderTabs();
}
function showNotification(text){
  refs.notification.textContent=String(text??"");
  refs.notification.classList.add("show");
}
function hideNotification(){refs.notification.classList.remove("show")}
function closeUtility(){refs.utilityShade.classList.remove("show");refs.utilityBody.innerHTML="";utilityKind=""}
function showUtility(kind,title,content,asHtml=false){
  utilityKind=kind;
  refs.utilityPanel.classList.toggle("wide",["flows","specs","apis","reports","collaboration","performance"].includes(kind));
  refs.utilityTitle.textContent=title||"Postman";
  if(asHtml)refs.utilityBody.innerHTML=content||"";
  else refs.utilityBody.textContent=content||"";
  refs.utilityShade.classList.add("show");
}
function utilityContinuation(action){
  const groups={
    environment:["showEnvironmentEditor","createEnvironment","setEnvironmentVariable","deleteEnvironmentVariable","setEnvironment","showVariableInspector","setGlobalVariable","setCollectionVariable","setLocalVariable","resolveVariables"],
    variables:["showVariableInspector","setGlobalVariable","setCollectionVariable","setLocalVariable","setEnvironmentVariable","resolveVariables"],
    cookies:["showCookies","setCookie","deleteCookie"],
    console:["showConsole","appendConsole","clearConsole"],
    history:["showHistory","addHistoryEntry","clearHistory"],
    runner:["openRunner","configureRunner","runCollection","setRunnerProgress","showRunnerResults"],
    new:["openNew","createRequest","createCollection","createFolder"],
    import:["openImport","importCurl","importCollection","exportCollection","generateCodeSnippet"],
    code:["generateCodeSnippet"],
    mock:["openMockServer","createMockServer","setMockResponse"],
    monitor:["openMonitor","createMonitor","runMonitor"],
    graphql:["openGraphQL","setGraphqlQuery","setGraphqlVariables","sendGraphql","setGraphqlBody"],
    websocket:["openWebSocket","connectWebSocket","sendWebSocketMessage","receiveWebSocketMessage","disconnectWebSocket"],
    grpc:["openGrpc","loadProto","setGrpcReflection","selectGrpcService","setGrpcMetadata","setGrpcMessage","invokeGrpc","startGrpcStream","receiveGrpcMessage","endGrpcStream"],
    docs:["openDocumentation"],
    vault:["openVault","setVaultSecret","deleteVaultSecret","revealVaultSecret"],packages:["openPackages","addPackage","removePackage","usePackage"],visualizer:["openVisualizer","setVisualizerTemplate","renderVisualizer"],workspaces:["openWorkspaces","createWorkspace","switchWorkspace"],
    collaboration:["openCollaboration","shareCollection","addComment","forkCollection","openPullRequest","mergePullRequest"],specs:["openSpecHub","createSpec","updateSpec","validateAgainstSpec","generateCollectionFromSpec","importOpenApi"],flows:["openFlows","createFlow","addFlowBlock","connectFlowBlocks","runFlow"],
    certificates:["openCertificates","addCertificate","removeCertificate"],proxy:["openProxy","configureProxy"],schedules:["showScheduledRuns","scheduleCollectionRun"],performance:["runPerformanceTest","showPerformanceResults"],cli:["openCli","runPostmanCli","runNewman"],git:["openGitIntegration","connectGitIntegration","syncGitIntegration"],reports:["openReports","addReportMetric"],agent:["openAgent","runAgentAction"],apis:["openApiHub","createApi"],examples:["showExamples","saveExample","selectExample"],tests:["showTestResults","setTestResults","runPostResponseTests"],settings:["openRequestSettings","setRequestSetting"]
  };
  return groups[utilityKind]?.includes(action)===true;
}
function clearTransientBeforeStep(action){
  hideNotification();
  if(utilityKind&&!utilityContinuation(action))closeUtility();
}

function renderCollections(){
  refs.collections.innerHTML="";
  state.collections.forEach(c=>{
    const box=document.createElement("div");box.className="collection";
    const h=document.createElement("div");h.className="collectionName";
    const total=(c.requests||[]).length+(c.folders||[]).reduce((n,f)=>n+(f.requests||[]).length,0);
    h.innerHTML='<span class="arrow">'+(c.collapsed?"▶":"▼")+'</span><span>'+esc(c.name||"Collection")+'</span><span class="count">'+total+'</span>';
    h.onclick=()=>{c.collapsed=!c.collapsed;renderCollections()};
    box.appendChild(h);
    if(!c.collapsed){
      const renderReq=(r,indent=0)=>{
        const row=document.createElement("div");
        row.className="requestRow"+(r.id===currentRequest?" active":"");
        row.style.paddingLeft=(7+indent)+"px";
        row.dataset.id=r.id;
        const m=document.createElement("span");m.className="method "+String(r.method||"GET").toUpperCase();m.textContent=String(r.method||"GET").toUpperCase();
        const n=document.createElement("span");n.textContent=r.name||r.id;
        if(dirtyRequests.has(r.id)){const d=document.createElement("span");d.className="dirty";d.textContent="●";n.appendChild(d)}
        row.append(m,n);row.onclick=()=>openRequest(r.id);box.appendChild(row);
      };
      (c.requests||[]).forEach(r=>renderReq(r,0));
      (c.folders||[]).forEach(f=>{
        const fh=document.createElement("div");fh.className="collectionName";fh.style.paddingLeft="17px";fh.textContent="▾ "+f.name;box.appendChild(fh);
        (f.requests||[]).forEach(r=>renderReq(r,14));
      });
    }
    refs.collections.appendChild(box);
  });
}
function renderTabs(){
  refs.tabs.innerHTML="";
  openTabs.forEach(id=>{
    const r=requestById(id);if(!r)return;
    const t=document.createElement("div");t.className="tab"+(id===currentRequest?" active":"");t.dataset.id=id;
    const m=document.createElement("span");m.className="method "+String(r.method||"GET").toUpperCase();m.textContent=String(r.method||"GET").toUpperCase();
    const n=document.createElement("span");n.textContent=(r.name||id)+(dirtyRequests.has(id)?" ●":"");
    const x=document.createElement("span");x.className="tabClose";x.textContent="×";
    x.onclick=e=>{e.stopPropagation();closeTab(id)};
    t.onclick=()=>openRequest(id);
    t.append(m,n,x);refs.tabs.appendChild(t);
  });
}
function closeTab(id){
  const i=openTabs.indexOf(id);if(i<0)return;
  const was=id===currentRequest;openTabs.splice(i,1);
  if(was)currentRequest=openTabs[i]||openTabs[i-1]||null;
  loadCurrentResponse();renderAll();
}
function loadCurrentResponse(){
  const r=requestById(currentRequest);
  response=r?clone(r.lastResponse??r.response??null):null;
}
function openRequest(id){
  if(!requests[id])return;
  currentRequest=id;
  if(!openTabs.includes(id))openTabs.push(id);
  loadCurrentResponse();
  reqView="body";respView="pretty";
  renderAll();
}
function requestBodyDisplay(r){
  if(r.bodyMode==="form-data")return pretty(r.formData||[]);
  if(r.bodyMode==="x-www-form-urlencoded")return pretty(r.urlencoded||[]);
  if(r.bodyMode==="graphql")return pretty({query:r.graphqlQuery||"",variables:r.graphqlVariables||{}});
  return pretty(r.body??"");
}
function renderRequestView(){
  document.querySelectorAll("[data-reqtab]").forEach(x=>x.classList.toggle("active",x.dataset.reqtab===reqView));
  const r=requestById(currentRequest)||{};
  if(reqView==="params"){
    const rows=(r.params||[]).map(p=>`<tr><td>${p.enabled===false?"☐":"☑"}</td><td>${esc(p.key||"")}</td><td>${esc(p.value||"")}</td><td>${esc(p.description||"")}</td></tr>`).join("");
    refs.body.innerHTML='<table class="kvTable"><tr><th></th><th>Key</th><th>Value</th><th>Description</th></tr>'+rows+'</table>';
  }else if(reqView==="authorization"){
    refs.body.innerHTML='<div class="authCard"><div class="authType">'+esc(r.auth?.type||"No Auth")+'</div><pre>'+esc(pretty(r.auth?.fields||{}))+'</pre></div>';
  }else if(reqView==="headers"){
    refs.body.textContent=pretty(r.headers||{});
  }else if(reqView==="prerequest"){
    refs.body.innerHTML='<div class="scriptCard"><b>Pre-request Script</b><pre>'+esc(String(r.preRequestScript||""))+'</pre></div>';
  }else if(reqView==="tests"){
    refs.body.innerHTML='<div class="scriptCard"><b>Post-response / Tests</b><pre>'+esc(String(r.tests||r.postResponseScript||""))+'</pre></div>';
  }else if(reqView==="settings"){
    refs.body.innerHTML='<div class="settingsCard"><b>Request Settings</b><pre>'+esc(pretty(r.settings||{}))+'</pre></div>';
  }else{
    refs.body.innerHTML='<div class="bodyMode">Body type: <b>'+esc(r.bodyMode||"raw")+'</b></div><pre>'+esc(requestBodyDisplay(r))+'</pre>';
  }
}
function renderResponse(){
  document.querySelectorAll("[data-resptab]").forEach(x=>x.classList.toggle("active",x.dataset.resptab===respView));
  if(!response){
    refs.status.textContent="No response";refs.status.style.color="";refs.metrics.textContent="";refs.resp.textContent="";return;
  }
  const code=Number(response.status??200);
  refs.status.textContent=code+" "+(response.statusText||statusTextFor(code));
  refs.status.style.color=code>=500?"#d93025":code>=400?"#c63c35":code>=300?"#d88b00":"#168a5b";
  refs.metrics.textContent=[response.time!==undefined?response.time+" ms":"",response.size||""].filter(Boolean).join("   ");
  if(respView==="headers")refs.resp.textContent=pretty(response.headers||{});
  else if(respView==="cookies")refs.resp.textContent=pretty(response.cookies||[]);
  else if(respView==="tests")refs.resp.textContent=pretty(response.tests??response.testResults??"");
  else if(respView==="raw")refs.resp.textContent=typeof response.body==="string"?response.body:JSON.stringify(response.body??response.text??"");
  else if(respView==="preview"){
    const v=response.preview??response.body??response.text??"";
    refs.resp.textContent=typeof v==="string"?v:pretty(v);
  }else refs.resp.textContent=pretty(response.body??response.text??"");
}
function renderAll(){
  refs.workspace.textContent=state.workspaceName||"Workspace";
  refs.env.textContent=activeEnv||"No Environment";
  renderCollections();renderTabs();
  const r=requestById(currentRequest)||{};
  const method=String(r.method||"GET").toUpperCase();
  refs.method.textContent=method;refs.method.className="methodBox method "+method;
  refs.url.textContent=r.url||"";
  renderRequestView();renderResponse();
}
function reset(){
  if(!baseline)return;
  state=clone(baseline);normalizeState();indexRequests();
  openTabs=[];currentRequest=null;response=null;reqView="body";respView="pretty";dirtyRequests=new Set();
  refs.app.classList.toggle("sidebar-hidden",state.sidebarHidden===true);
  closeUtility();hideNotification();clearBoundary();
  const initial=state.initialRequest||Object.keys(requests)[0];
  if(initial)openRequest(initial);else renderAll();
}
function loadPackage(p){
  packageData=clone(p);
  baseline=clone(packageData.apps?.postman||{});
  reset();
}
async function typeField(kind,text,animate,token){
  const r=requestById(currentRequest);if(!r)return;
  const final=String(text??"");
  const focus=()=>kind==="url"?$("urlBox"):$("requestBody");
  const assign=v=>{if(kind==="url")r.url=v;else r.body=v;markDirty();renderAll();requestAnimationFrame(()=>window.SIM_FOCUS?.follow(focus(),{block:"center"}))};
  if(!animate||!autoType){assign(final);return}
  const steps=Math.min(60,Math.max(1,final.length)),dur=Math.min(1000,Math.max(220,final.length*12));
  for(let i=1;i<=steps;i++){if(token!==seekToken)return;assign(final.slice(0,Math.floor(final.length*i/steps)));await sleep(dur/steps)}
}
function storeResponse(resp){
  const r=requestById(currentRequest);
  response=clone(resp);
  if(r)r.lastResponse=clone(resp);
}
function appendHistory(entry){
  state.history.unshift({...entry,time:entry.time||"Now"});
  if(state.history.length>100)state.history.length=100;
}
function appendConsoleLine(line){
  state.console.push(typeof line==="string"?{text:line}:{...line});
}
function performSend(respData={}){
  const r=requestById(currentRequest);if(!r)return;
  const resolvedUrl=resolveString(r.url||"");
  const code=Number(respData.status??200);
  const resp={
    status:code,statusText:respData.statusText||statusTextFor(code),
    time:respData.time??42,size:respData.size||"0 B",
    headers:clone(respData.headers||{}),cookies:clone(respData.cookies||[]),
    tests:clone(respData.tests??respData.testResults??[]),
    body:clone(respData.body??respData.response??{})
  };
  storeResponse(resp);
  appendHistory({method:r.method||"GET",url:resolvedUrl,status:code,request:r.name||r.id});
  appendConsoleLine({text:`${r.method||"GET"} ${resolvedUrl} → ${code} ${resp.statusText}`,type:"network"});
  return resp;
}
function renderConsole(){
  const html=(state.console||[]).map(x=>'<div class="consoleLine">'+esc(typeof x==="string"?x:(x.text||pretty(x)))+'</div>').join("")||'<div class="infoCard">Console is empty.</div>';
  showUtility("console","Postman Console",html,true);
}
function renderEnvironmentEditor(){
  const envs=Object.entries(state.environments||{}).map(([name,vars])=>'<div class="utilityCard"><h3>'+esc(name)+(name===activeEnv?' <span class="badge">active</span>':'')+'</h3><pre>'+esc(pretty(vars))+'</pre></div>').join("");
  showUtility("environment","Environments",'<div class="utilityGrid">'+envs+'</div>',true);
}
function renderVariableInspector(){
  const html='<div class="utilityGrid">'+
    '<div class="utilityCard"><h3>Globals</h3><pre>'+esc(pretty(state.globals||{}))+'</pre></div>'+
    '<div class="utilityCard"><h3>Environment: '+esc(activeEnv||"None")+'</h3><pre>'+esc(pretty(state.environments[activeEnv]||{}))+'</pre></div>'+
    '<div class="utilityCard"><h3>Collection</h3><pre>'+esc(pretty(currentCollection()?.variables||{}))+'</pre></div>'+
    '<div class="utilityCard"><h3>Local</h3><pre>'+esc(pretty(requestById(currentRequest)?.localVariables||{}))+'</pre></div>'+
    '</div>';
  showUtility("variables","Variable Inspector",html,true);
}
function renderCookies(){
  const html=(state.cookies||[]).map(c=>'<div class="utilityCard"><b>'+esc(c.name||"cookie")+'</b> = '+esc(c.value||"")+'<br><span>'+esc(c.domain||"")+' '+esc(c.path||"")+'</span></div>').join("")||"No cookies";
  showUtility("cookies","Cookies",html,true);
}
function renderHistory(){
  const html=(state.history||[]).map(h=>'<div class="consoleLine"><b>'+esc(h.method||"GET")+'</b> '+esc(h.url||"")+' '+esc(h.status||"")+' <span>'+esc(h.time||"")+'</span></div>').join("")||"No request history";
  showUtility("history","History",html,true);
}
function renderRunner(){
  const rr=state.runner||{};
  const pct=Math.max(0,Math.min(100,Number(rr.progress||0)));
  const html='<div class="infoCard"><b>Collection:</b> '+esc(rr.collection||"Not selected")+
    '<br><b>Environment:</b> '+esc(rr.environment||activeEnv||"None")+
    '<br><b>Iterations:</b> '+esc(rr.iterations??1)+
    '<div class="runnerBar"><div class="runnerFill" style="width:'+pct+'%"></div></div>'+
    '<pre>'+esc(pretty(rr.results||[]))+'</pre></div>';
  showUtility("runner","Collection Runner",html,true);
}
function renderMocks(){
  showUtility("mock","Mock Servers",'<div class="utilityGrid">'+(state.mocks||[]).map(m=>'<div class="utilityCard"><h3>'+esc(m.name||"Mock")+'</h3><pre>'+esc(pretty(m))+'</pre></div>').join("")+'</div>',true);
}
function renderMonitors(){
  showUtility("monitor","Monitors",'<div class="utilityGrid">'+(state.monitors||[]).map(m=>'<div class="utilityCard"><h3>'+esc(m.name||"Monitor")+'</h3><pre>'+esc(pretty(m))+'</pre></div>').join("")+'</div>',true);
}
function authHeaders(r){
  const a=r?.auth||{},t=String(a.type||"").toLowerCase(),f=a.fields||{},h={};
  if(t.includes("bearer")||t.includes("oauth")){const token=resolveString(f.token||f.accessToken||f.jwt||"");if(token)h.Authorization="Bearer "+token}
  else if(t.includes("basic")){const raw=String(f.username||"")+":"+String(f.password||"");try{h.Authorization="Basic "+btoa(raw)}catch{}}
  else if(t.includes("api key")||t==="apikey"){const key=f.key||"X-API-Key",val=resolveString(f.value||f.token||"");if((f.addTo||f.in||"header").toLowerCase()!=="query"&&val)h[key]=val}
  else if(t.includes("aws")){h.Authorization="AWS4-HMAC-SHA256 Credential="+(f.accessKey||"AKIA…")+"/simulated-signature"}
  return h;
}
function resolvedRequest(r=requestById(currentRequest)){
  if(!r)return null;let url=resolveString(r.url||"");
  const enabled=(r.params||[]).filter(x=>x.enabled!==false&&x.key);
  if(enabled.length){const q=enabled.map(x=>encodeURIComponent(resolveString(x.key))+"="+encodeURIComponent(resolveString(x.value))).join("&");url+=(url.includes("?")?"&":"?")+q}
  const a=r.auth||{},f=a.fields||{},t=String(a.type||"").toLowerCase();
  if((t.includes("api key")||t==="apikey")&&(f.addTo||f.in||"header").toLowerCase()==="query"&&f.key){url+=(url.includes("?")?"&":"?")+encodeURIComponent(f.key)+"="+encodeURIComponent(resolveString(f.value||f.token||""))}
  const headers={...resolveObject(r.headers||{}),...authHeaders(r)};let body;
  if(["GET","HEAD"].includes(String(r.method||"GET").toUpperCase()))body=undefined;
  else if(r.bodyMode==="graphql")body=JSON.stringify({query:resolveString(r.graphqlQuery||""),variables:resolveObject(r.graphqlVariables||{})});
  else if(r.bodyMode==="x-www-form-urlencoded")body=(r.urlencoded||[]).filter(x=>x.enabled!==false).map(x=>encodeURIComponent(resolveString(x.key))+"="+encodeURIComponent(resolveString(x.value))).join("&");
  else if(typeof r.body==="string")body=resolveString(r.body);else if(r.body!==undefined)body=JSON.stringify(resolveObject(r.body));
  return {method:String(r.method||"GET").toUpperCase(),url,headers,body};
}
async function performLiveSend(){
  const r=requestById(currentRequest),q=resolvedRequest(r);if(!r||!q)return null;
  const started=performance.now();appendConsoleLine({text:`${q.method} ${q.url}  [live]`,type:"network"});
  try{
    const res=await fetch(q.url,{method:q.method,headers:q.headers,body:q.body,credentials:"omit",redirect:"follow"});
    const text=await res.text();let body=text;try{body=JSON.parse(text)}catch{}
    const headers={};res.headers.forEach((v,k)=>headers[k]=v);const elapsed=Math.max(1,Math.round(performance.now()-started));
    const out={status:res.status,statusText:res.statusText||statusTextFor(res.status),time:elapsed,size:(new Blob([text]).size)+" B",headers,body,tests:[]};
    storeResponse(out);appendHistory({method:q.method,url:q.url,status:res.status,request:r.name,time:"Now"});appendConsoleLine({text:`${q.method} ${q.url} → ${res.status} ${res.statusText} (${elapsed} ms)`,type:"network"});renderResponse();return out;
  }catch(err){const out={status:0,statusText:"Network Error",time:Math.max(1,Math.round(performance.now()-started)),size:"0 B",headers:{},body:{error:String(err?.message||err)},tests:[]};storeResponse(out);appendConsoleLine({text:`Network error: ${err?.message||err}`,type:"error"});renderResponse();return out}
}
function deepGet(obj,path){return String(path||"").split(".").filter(Boolean).reduce((a,k)=>a==null?undefined:a[k],obj)}
function runScriptSimulation(script,phase="post"){
  const text=String(script||""),logs=[],results=[];
  const setters=[["environment",/pm\.environment\.set\(\s*["']([^"']+)["']\s*,\s*["']([^"']*)["']\s*\)/g],["collection",/pm\.collectionVariables\.set\(\s*["']([^"']+)["']\s*,\s*["']([^"']*)["']\s*\)/g],["global",/pm\.globals\.set\(\s*["']([^"']+)["']\s*,\s*["']([^"']*)["']\s*\)/g],["local",/pm\.variables\.set\(\s*["']([^"']+)["']\s*,\s*["']([^"']*)["']\s*\)/g]];
  setters.forEach(([scope,re])=>{for(const m of text.matchAll(re)){if(scope==="environment"){state.environments[activeEnv]=state.environments[activeEnv]||{};state.environments[activeEnv][m[1]]=m[2]}else if(scope==="collection"){const c=currentCollection();if(c){c.variables=c.variables||{};c.variables[m[1]]=m[2]}}else if(scope==="global")state.globals[m[1]]=m[2];else{const rr=requestById(currentRequest);if(rr)rr.localVariables[m[1]]=m[2]}logs.push(`pm.${scope}.set ${m[1]} = ${m[2]}`)}});
  for(const m of text.matchAll(/console\.log\(\s*["']([^"']*)["']\s*\)/g))logs.push(m[1]);
  if(phase==="post"){
    for(const m of text.matchAll(/pm\.test\(\s*["']([^"']+)["'][\s\S]*?pm\.(?:response\.to\.have\.status\(|expect\(pm\.response\.code\)\.to\.(?:eql|equal)\()\s*(\d{3})/g)){const exp=Number(m[2]),act=Number(response?.status||0);results.push({name:m[1],passed:act===exp,expected:exp,actual:act})}
    for(const m of text.matchAll(/pm\.test\(\s*["']([^"']+)["'][\s\S]*?pm\.expect\(pm\.response\.json\(\)\.([\w.]+)\)\.to\.(?:eql|equal)\(\s*["']([^"']*)["']\s*\)/g)){const act=deepGet(response?.body,m[2]),exp=m[3];results.push({name:m[1],passed:String(act)===exp,expected:exp,actual:act})}
    if(!results.length&&text.trim())results.push({name:"Post-response script",passed:true,note:"Simulated common pm.* APIs"});
    if(response)response.tests=results;
  }
  logs.forEach(x=>appendConsoleLine({text:x,type:"script"}));return {logs,results};
}
function renderTestResults(){const tests=response?.tests||response?.testResults||[];const arr=Array.isArray(tests)?tests:[];const html=arr.length?arr.map(t=>'<div class="consoleLine '+(t.passed===false?'testFail':'testPass')+'">'+(t.passed===false?'✕ ':'✓ ')+esc(t.name||t.test||String(t))+(t.message?' — '+esc(t.message):'')+'</div>').join(""):'<div class="infoCard">No tests have run yet.</div>';showUtility("tests","Test Results",html,true)}
function renderExamples(){const r=requestById(currentRequest);const html=(r?.examples||[]).map((x,i)=>'<div class="utilityCard"><h3>'+esc(x.name||('Example '+(i+1)))+'</h3><b>Request</b><pre>'+esc(pretty(x.request||{}))+'</pre><b>Response</b><pre>'+esc(pretty(x.response||{}))+'</pre></div>').join("")||'<div class="infoCard">No examples saved.</div>';showUtility("examples","Examples",'<div class="utilityGrid">'+html+'</div>',true)}
function renderRequestSettings(){const r=requestById(currentRequest)||{};const settings={followRedirects:true,sslVerification:true,timeoutMs:0,sendCookies:true,storeCookies:true,encodeUrl:true,...(r.settings||{})};showUtility("settings","Request Settings",'<div class="utilityGrid">'+Object.entries(settings).map(([k,v])=>'<div class="utilityCard"><h3>'+esc(k)+'</h3>'+esc(String(v))+'</div>').join("")+'</div>',true)}
function renderVault(){const rows=Object.entries(state.vault||{}).map(([k,v])=>'<div class="utilityCard"><h3>'+esc(k)+'</h3><span class="secretValue '+(state.vaultRevealed[k]?'revealed':'')+'">'+esc(String(v))+'</span><br><span class="badge">local secret</span></div>').join("")||'<div class="infoCard">Vault is empty.</div>';showUtility("vault","Postman Vault",'<div class="utilityGrid">'+rows+'</div>',true)}
function renderPackages(){const html=(state.packages||[]).map(p=>'<div class="utilityCard"><h3>'+esc(p.name||"package")+' <span class="badge">'+esc(p.version||"1.0.0")+'</span></h3><div>'+esc(p.description||"Reusable script package")+'</div><pre>'+esc(String(p.code||""))+'</pre></div>').join("")||'<div class="infoCard">No packages installed.</div>';showUtility("packages","Package Library",'<div class="utilityGrid">'+html+'</div>',true)}
function renderVisualizer(){const v=state.visualizer||{};showUtility("visualizer","Visualizer",'<div class="utilityCard"><h3>Template</h3><pre>'+esc(String(v.template||""))+'</pre></div><div class="utilityCard"><h3>Rendered preview</h3><div>'+String(v.rendered||"No visualization rendered.")+'</div></div>',true)}
function renderWorkspaces(){const html=(state.workspaces||[]).map(w=>'<div class="wsCard"><div class="wsAvatar">'+esc((w.name||"W").slice(0,2).toUpperCase())+'</div><div><b>'+esc(w.name||"Workspace")+'</b><br><span>'+esc(w.type||"Personal")+' · '+esc((w.members||[]).length)+' member(s)</span></div>'+(w.name===state.workspaceName?'<span class="badge">active</span>':'')+'</div>').join("");showUtility("workspaces","Workspaces",html,true)}
function renderCollaboration(){const comments=(state.comments||[]).map(c=>'<div class="commentRow"><b>'+esc(c.author||"Developer")+'</b> · '+esc(c.time||"Now")+'<br>'+esc(c.text||"")+'</div>').join("")||'<div class="infoCard">No comments.</div>';const prs=(state.pullRequests||[]).map(p=>'<div class="utilityCard"><h3>'+esc(p.title||"Pull request")+' <span class="badge">'+esc(p.status||"Open")+'</span></h3>'+esc(p.source||"")+' → '+esc(p.target||"")+'</div>').join("");showUtility("collaboration","Collaboration",'<div class="utilityGrid"><div class="utilityCard"><h3>Comments</h3>'+comments+'</div><div class="utilityCard"><h3>Forks & Pull Requests</h3>'+prs+'</div></div>',true)}
function renderSpecs(){const html=(state.specs||[]).map(sp=>'<div class="utilityCard"><h3>'+esc(sp.name||"API Spec")+' <span class="badge">'+esc(sp.format||"OpenAPI")+'</span></h3><div>'+esc(sp.version||"")+'</div><div class="specCode">'+esc(typeof sp.document==="string"?sp.document:pretty(sp.document||{}))+'</div></div>').join("")||'<div class="infoCard">No specifications.</div>';showUtility("specs","Spec Hub",html,true)}
function renderFlows(){const f=(state.flows||[]).find(x=>x.name===state.activeFlow)||(state.flows||[])[0];const blocks=(f?.blocks||[]).map(b=>'<div class="flowBlock"><b>'+esc(b.type||"Block")+'</b>'+esc(b.label||b.name||b.id||"")+'</div>').join("");showUtility("flows","Postman Flows",'<div class="infoCard"><b>'+esc(f?.name||"No flow selected")+'</b> · '+esc((f?.connections||[]).length||0)+' connection(s)</div><div class="flowCanvas">'+blocks+'</div>',true)}
function renderCertificates(){const html=(state.certificates||[]).map(c=>'<div class="utilityCard"><h3>'+esc(c.host||c.name||"Certificate")+'</h3><div>CRT: '+esc(c.crt||c.cert||"client.crt")+'</div><div>KEY: '+esc(c.key||"client.key")+'</div><div>Passphrase: '+(c.passphrase?'••••••':'—')+'</div></div>').join("")||'<div class="infoCard">No client certificates configured.</div>';showUtility("certificates","Certificates",'<div class="utilityGrid">'+html+'</div>',true)}
function renderProxy(){showUtility("proxy","Proxy",'<div class="utilityCard"><h3>'+(state.proxy.enabled?'Proxy enabled':'Proxy disabled')+'</h3><pre>'+esc(pretty(state.proxy))+'</pre></div>',true)}
function renderSchedules(){const html=(state.scheduledRuns||[]).map(x=>'<div class="utilityCard"><h3>'+esc(x.name||x.collection||"Scheduled run")+'</h3>'+esc(x.schedule||x.cron||"")+'<br>'+esc(x.environment||"")+'<br><span class="badge">'+esc(x.status||"Active")+'</span></div>').join("")||'<div class="infoCard">No scheduled collection runs.</div>';showUtility("schedules","Scheduled Runs",'<div class="utilityGrid">'+html+'</div>',true)}
function renderPerformance(){const p=state.performance||{},samples=p.samples||[];const bars=samples.slice(-40).map(x=>'<span style="height:'+Math.max(3,Math.min(100,Number(x.value??x.latency??x)))+'%"></span>').join("");const html='<div class="metricGrid"><div class="metricCard">Virtual users<b>'+esc(p.virtualUsers??0)+'</b></div><div class="metricCard">Avg latency<b>'+esc(p.avgLatency??0)+' ms</b></div><div class="metricCard">Throughput<b>'+esc(p.throughput??0)+' rps</b></div><div class="metricCard">Error rate<b>'+esc(p.errorRate??0)+'%</b></div></div><div class="timeline">'+bars+'</div><pre>'+esc(pretty(p.results||[]))+'</pre>';showUtility("performance","Performance Test",html,true)}
function renderCli(){const h=(state.cli?.history||[]).map(x=>'<div class="consoleLine">$ '+esc(x.command||"")+'\n'+esc(x.output||"")+'</div>').join("")||'<div class="infoCard">No CLI runs yet.</div>';showUtility("cli","Postman CLI / Newman",h,true)}
function renderGitIntegrations(){const html=(state.gitIntegrations||[]).map(g=>'<div class="utilityCard"><h3>'+esc(g.provider||"GitHub")+'</h3><span class="gitBranch">'+esc(g.repository||"")+' @ '+esc(g.branch||"main")+'</span><br><span class="badge">'+esc(g.status||"Connected")+'</span></div>').join("")||'<div class="infoCard">No Git integrations.</div>';showUtility("git","Git Integrations",'<div class="utilityGrid">'+html+'</div>',true)}
function renderReports(){const metrics=state.reports.metrics||[];const cards=metrics.map(m=>'<div class="metricCard">'+esc(m.name||"Metric")+'<b>'+esc(m.value??0)+'</b><span>'+esc(m.note||"")+'</span></div>').join("");showUtility("reports","Reports & Analytics",'<div class="metricGrid">'+cards+'</div><pre>'+esc(pretty(state.reports.runs||[]))+'</pre>',true)}
function renderAgent(){const h=(state.agent.history||[]).map(x=>'<div class="commentRow"><b>'+esc(x.role||"Agent")+'</b><br>'+esc(x.text||"")+'</div>').join("")||'<div class="infoCard">Agent is ready to help with API work.</div>';showUtility("agent","Postman Agent",h,true)}
function renderPlatformTools(){showUtility("platform","Platform Tools",'<div class="utilityGrid">'+[["workspaces","Workspaces"],["specs","Spec Hub"],["vault","Vault"],["packages","Packages"],["visualizer","Visualizer"],["performance","Performance"],["schedules","Scheduled Runs"],["cli","CLI / Newman"],["certificates","Certificates"],["proxy","Proxy"],["git","Git Integrations"],["collaboration","Collaboration"]].map(x=>'<button class="utilityCard uBtn" data-platform-tool="'+x[0]+'"><h3>'+x[1]+'</h3>Open '+x[1]+'</button>').join('')+'</div>',true)}
function renderApiHub(){const html=(state.apis||[]).map(a=>'<div class="utilityCard"><h3>'+esc(a.name||"API")+' <span class="badge">'+esc(a.version||"v1")+'</span></h3>'+esc(a.description||"")+'<pre>'+esc(pretty(a.links||{}))+'</pre></div>').join("")||'<div class="infoCard">No APIs in this workspace.</div>';showUtility("apis","APIs",'<div class="utilityGrid">'+html+'</div>',true)}
function renderMockLogs(m){m=m||state.mocks[0];const logs=m?.logs||[];showUtility("mock","Mock Server Logs",logs.map(x=>'<div class="consoleLine"><b>'+esc(x.method||"GET")+'</b> '+esc(x.path||"")+' → '+esc(x.status||200)+' '+esc(x.time||"Now")+'</div>').join("")||'No mock calls.',true)}
function renderMonitorHistory(m){m=m||state.monitors[0];const runs=m?.runs||[];showUtility("monitor","Monitor History",runs.map(x=>'<div class="utilityCard"><h3>'+esc(x.time||"Run")+' <span class="statusChip '+(String(x.status).toLowerCase().includes("pass")?'ok':'bad')+'">'+esc(x.status||"")+'</span></h3><pre>'+esc(pretty(x))+'</pre></div>').join("")||'No monitor runs.',true)}
function renderGraphqlSchema(){const g=state.graphql||{};const types=g.schema?.types||g.types||[];showUtility("graphql","GraphQL Schema",'<div class="apiTree"><div class="apiTreeSide">'+types.map(t=>'<div class="schemaRow">'+esc(t.name||t)+'</div>').join('')+'</div><div class="apiTreeMain"><pre>'+esc(pretty(g.schema||{}))+'</pre></div></div>',true)}
function renderGrpc(){showUtility("grpc","gRPC",'<div class="utilityGrid"><div class="utilityCard"><h3>Service</h3>'+esc(state.grpc.service||"—")+' / '+esc(state.grpc.method||"—")+'<pre>'+esc(pretty(state.grpc.metadata||{}))+'</pre></div><div class="utilityCard"><h3>Stream</h3><pre>'+esc(pretty(state.grpc.stream||[]))+'</pre></div></div>',true)}
function renderWebSocket(){showUtility("websocket","WebSocket",'<div class="utilityCard"><h3>'+esc(state.websocket.url||"WebSocket")+' <span class="statusChip '+(state.websocket.connected?'ok':'warn')+'">'+(state.websocket.connected?'Connected':'Disconnected')+'</span></h3><div>Protocol: '+esc(state.websocket.protocol||"default")+'</div><pre>'+esc(pretty(state.websocket.messages||[]))+'</pre></div>',true)}
function renderExplanation(d){refs.assistantTitle.textContent=d.title||d.stepTitle||"Current Step";refs.assistantMeta.textContent=(d.stage||d.lesson||"")+(d.stage||d.lesson?" · ":"")+(d.language||"Telugu (Romanized)");refs.assistantText.textContent=d.text||d.why||d.explanation||"";refs.assistant.classList.add("show");refs.assistant.classList.remove("minimized")}
function basicSpecValidation(spec,r){const doc=spec?.document;if(!doc||typeof doc!=="object"||!doc.paths)return {valid:true,warnings:["Spec content is not structured; simulation cannot inspect paths."]};let path="/";try{path=new URL(resolveString(r.url||""),"https://example.test").pathname}catch{}const node=doc.paths[path],method=String(r.method||"GET").toLowerCase();return node&&node[method]?{valid:true,path,method}:{valid:false,path,method,errors:[`No ${method.toUpperCase()} operation found for ${path}`]}}
function collectionFromSpec(spec,name){const doc=spec?.document||{},reqs=[];Object.entries(doc.paths||{}).forEach(([path,ops])=>Object.entries(ops||{}).forEach(([method,op])=>{if(!["get","post","put","patch","delete","head","options"].includes(method.toLowerCase()))return;reqs.push({id:"spec_"+reqs.length,name:op.summary||op.operationId||method.toUpperCase()+" "+path,method:method.toUpperCase(),url:"{{baseUrl}}"+path,headers:{"Content-Type":"application/json"},body:""})}));return {name:name||spec.name||"Generated Collection",variables:{baseUrl:"https://api.example.com"},requests:reqs,folders:[]}}

function parseCurl(curl){
  const text=String(curl||"").trim();
  const method=(text.match(/(?:-X|--request)\s+([A-Z]+)/i)||[])[1]||(/--data|-d\s/.test(text)?"POST":"GET");
  const url=(text.match(/https?:\/\/[^\s'"]+/)||[])[0]||"";
  const headers={};
  for(const m of text.matchAll(/(?:-H|--header)\s+['"]([^:'"]+):\s*([^'"]+)['"]/g))headers[m[1]]=m[2];
  const body=(text.match(/(?:-d|--data(?:-raw)?)\s+['"]([\s\S]*?)['"](?:\s|$)/)||[])[1]||"";
  return {method:method.toUpperCase(),url,headers,body};
}
function addRequestToCollection(collectionName,request,folderName){
  let c=collectionByName(collectionName);
  if(!c){c={name:collectionName||"Imported",requests:[],folders:[],variables:{}};state.collections.push(c)}
  request={id:request.id||("req_"+Date.now()+"_"+Math.random().toString(36).slice(2,5)),name:request.name||"Request",method:request.method||"GET",url:request.url||"",headers:request.headers||{},body:request.body||"",tests:request.tests||"",...request};
  if(folderName){
    c.folders=c.folders||[];let f=c.folders.find(x=>x.name===folderName);if(!f){f={name:folderName,requests:[]};c.folders.push(f)}f.requests.push(request);
  }else{c.requests=c.requests||[];c.requests.push(request)}
  indexRequests();return request;
}
function codeSnippet(language,r){
  const method=String(r.method||"GET").toUpperCase(),url=resolveString(r.url||"");
  if(language==="java")return `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${url}"))
    .method("${method}", HttpRequest.BodyPublishers.noBody())
    .build();`;
  if(language==="javascript"||language==="fetch")return `fetch("${url}", { method: "${method}" })
  .then(r => r.json())
  .then(console.log);`;
  if(language==="python")return `import requests
response = requests.request("${method}", "${url}")
print(response.json())`;
  if(language==="csharp")return `using var client = new HttpClient();
var request = new HttpRequestMessage(new HttpMethod("${method}"), "${url}");
var response = await client.SendAsync(request);`;
  if(language==="go")return `req, _ := http.NewRequest("${method}", "${url}", nil)
resp, _ := http.DefaultClient.Do(req)`;
  if(language==="node"||language==="axios")return `const response = await axios({ method: "${method.toLowerCase()}", url: "${url}" });`;
  return `curl --request ${method} '${url}'`;
}

/* ---------- boundary ---------- */
function clearBoundary(){
  cancelAnimationFrame(boundaryFrame);boundaryFrame=0;trackedBoundary=null;refs.boundary.classList.remove("show");
}
function targetElement(target){
  if(!target)return null;
  if(typeof target==="string"){
    const map={send:refs.send,url:refs.url,body:refs.body,method:refs.method,environment:refs.env,sidebar:refs.collections,
      new:refs.toolNew,import:refs.toolImport,runner:refs.toolRunner,console:refs.toolConsole,history:refs.toolHistory,docs:refs.toolDocs,
      variables:refs.toolVariables,apis:refs.toolApis,flows:refs.toolFlows,mocks:refs.toolMocks,monitors:refs.toolMonitors,reports:refs.toolReports,agent:refs.toolAgent,save:refs.saveBtn,
      requestTabs:refs.reqTabs,responseTabs:refs.respTabs};
    if(map[target])return map[target];
  }
  if(target?.type==="request")return refs.collections.querySelector('[data-id="'+CSS.escape(target.id)+'"]');
  if(target?.type==="tab")return refs.tabs.querySelector('[data-id="'+CSS.escape(target.id)+'"]');
  return null;
}
function syncBoundary(){
  cancelAnimationFrame(boundaryFrame);
  boundaryFrame=requestAnimationFrame(()=>{
    const el=trackedBoundary;if(!el||!el.isConnected||!allowBoundary){clearBoundary();return}
    const r=el.getBoundingClientRect(),ar=refs.app.getBoundingClientRect();
    if(r.width<=0||r.height<=0||r.right<=0||r.bottom<=0||r.left>=innerWidth||r.top>=innerHeight){clearBoundary();return}
    const pad=4;refs.boundary.classList.add("show");
    refs.boundary.style.left=(r.left-ar.left-pad)+"px";refs.boundary.style.top=(r.top-ar.top-pad)+"px";
    refs.boundary.style.width=(r.width+pad*2)+"px";refs.boundary.style.height=(r.height+pad*2)+"px";
  });
}
async function highlightTarget(target,token){
  if(!allowBoundary)return;
  const el=targetElement(target);if(!el)return;
  clearBoundary();trackedBoundary=el;syncBoundary();await sleep(100);if(token!==seekToken)return;
}
async function moveCursor(target,token){return highlightTarget(target,token)}

/* ---------- action application ---------- */
async function apply(st,animate,token){
  if(token!==seekToken)return;
  clearTransientBeforeStep(st.action);
  const d=st.data||{},r=requestById(currentRequest);
  switch(st.action){
    case "openRequest":openRequest(d.id);break;
    case "setEnvironment":activeEnv=String(d.name??"");state.activeEnvironment=activeEnv;renderAll();break;
    case "setMethod":if(r){r.method=String(d.method||"GET").toUpperCase();markDirty();renderAll()}break;
    case "setUrl":if(r){r.url=String(d.url??"");markDirty();renderAll()}break;
    case "typeUrl":if(d.boundary!==false)await highlightTarget("url",token);await typeField("url",d.url,animate,token);break;
    case "setBody":if(r){r.body=d.body??"";r.bodyMode=d.mode||r.bodyMode||"raw";markDirty();renderAll()}break;
    case "typeBody":await typeField("body",typeof d.body==="string"?d.body:pretty(d.body),animate,token);if(d.boundary!==false)await highlightTarget("body",token);break;
    case "setHeaders":if(r){r.headers=clone(d.headers||{});reqView="headers";markDirty();renderAll()}break;
    case "setTests":if(r){r.tests=String(d.tests??"");reqView="tests";markDirty();renderAll()}break;
    case "selectRequestTab":reqView=d.tab||"body";renderRequestView();break;
    case "selectResponseTab":respView=(d.tab==="body"?"pretty":(d.tab||"pretty"));renderResponse();break;
    case "pressSend":{
      if(d.boundary||d.cursor)await highlightTarget("send",token);refs.send.classList.add("pressed");if(animate)await sleep(220);refs.send.classList.remove("pressed");
      if(d.response)performSend(d.response);else if(r?.response)storeResponse(clone(r.response));renderResponse();break}
    case "sendRequest":{
      if(d.boundary||d.cursor)await highlightTarget("send",token);refs.send.classList.add("pressed");if(animate)await sleep(220);refs.send.classList.remove("pressed");
      performSend(d);renderResponse();break}
    case "sendLiveRequest":{if(d.boundary||d.cursor)await highlightTarget("send",token);refs.send.classList.add("pressed");if(animate)await sleep(180);refs.send.classList.remove("pressed");await performLiveSend();break}
    case "setLiveNetwork":state.liveNetwork=d.enabled!==false;showNotification("Live network "+(state.liveNetwork?"enabled":"disabled")+" (CORS rules still apply)");break;
    case "showResponse":storeResponse({...clone(d),statusText:d.statusText||statusTextFor(d.status??200)});renderResponse();break;
    case "createRequest":{
      const nr=addRequestToCollection(d.collection||state.collections[0]?.name||"Collection",
        {id:d.id,name:d.name||d.id,method:d.method||"GET",url:d.url||"",headers:d.headers||{},body:d.body||"",tests:d.tests||"",bodyMode:d.bodyMode||"raw"},
        d.folder);
      openRequest(nr.id);markDirty();break}
    case "saveRequest":if(currentRequest){dirtyRequests.delete(currentRequest);renderTabs();showNotification("Request saved")}break;
    case "renameRequest":{const q=requestById(d.id||currentRequest);if(q){q.name=d.name||q.name;dirtyRequests.add(q.id);renderAll()}}break;
    case "duplicateRequest":{const q=requestById(d.id||currentRequest);if(q){const copy=clone(q);copy.id=d.newId||q.id+"_copy";copy.name=d.name||q.name+" Copy";delete copy.lastResponse;const nr=addRequestToCollection(d.collection||q.collection,copy,d.folder||q.folder);openRequest(nr.id);dirtyRequests.add(nr.id);renderAll()}}break;
    case "deleteRequest":{
      const id=d.id||currentRequest;
      state.collections.forEach(c=>{c.requests=(c.requests||[]).filter(x=>x.id!==id);(c.folders||[]).forEach(f=>f.requests=(f.requests||[]).filter(x=>x.id!==id))});
      openTabs=openTabs.filter(x=>x!==id);dirtyRequests.delete(id);indexRequests();currentRequest=openTabs[0]||Object.keys(requests)[0]||null;loadCurrentResponse();renderAll();break}
    case "createCollection":state.collections.push({name:d.name||"New Collection",requests:[],folders:[],variables:clone(d.variables||{})});renderCollections();break;
    case "renameCollection":{const c=collectionByName(d.name||d.oldName);if(c){const old=c.name;c.name=d.newName||c.name;indexRequests();Object.values(requests).forEach(q=>{if(q.collection===old)q.collection=c.name});renderAll()}}break;
    case "deleteCollection":state.collections=state.collections.filter(c=>c.name!==d.name);indexRequests();if(currentRequest&&!requests[currentRequest])currentRequest=Object.keys(requests)[0]||null;loadCurrentResponse();renderAll();break;
    case "createFolder":{const c=collectionByName(d.collection)||state.collections[0];if(c){c.folders=c.folders||[];c.folders.push({name:d.name||"Folder",requests:[]});renderCollections()}}break;
    case "collapseCollection":{const c=collectionByName(d.name);if(c){c.collapsed=d.collapsed!==false;renderCollections()}}break;
    case "setQueryParams":if(r){r.params=clone(d.params||[]);markDirty();reqView="params";renderAll()}break;
    case "addQueryParam":if(r){r.params.push({key:d.key||"",value:d.value||"",enabled:d.enabled!==false,description:d.description||""});markDirty();reqView="params";renderAll()}break;
    case "toggleQueryParam":if(r){const p=r.params.find(x=>x.key===d.key);if(p)p.enabled=d.enabled!==false;markDirty();renderRequestView()}break;
    case "setAuth":if(r){r.auth={type:d.type||"No Auth",fields:clone(d.fields||{})};markDirty();reqView="authorization";renderAll()}break;
    case "setAuthType":if(r){r.auth=r.auth||{fields:{}};r.auth.type=d.type||"No Auth";markDirty();reqView="authorization";renderAll()}break;
    case "setAuthField":if(r){r.auth=r.auth||{type:"No Auth",fields:{}};r.auth.fields=r.auth.fields||{};r.auth.fields[d.key]=d.value;markDirty();reqView="authorization";renderAll()}break;
    case "setBearerToken":if(r){r.auth={type:"Bearer Token",fields:{token:d.token||d.value||""}};markDirty();reqView="authorization";renderAll()}break;
    case "setBasicAuth":if(r){r.auth={type:"Basic Auth",fields:{username:d.username||"",password:d.password||""}};markDirty();reqView="authorization";renderAll()}break;
    case "setApiKey":if(r){r.auth={type:"API Key",fields:{key:d.key||"X-API-Key",value:d.value||"",addTo:d.addTo||"Header"}};markDirty();reqView="authorization";renderAll()}break;
    case "setOAuth2":if(r){r.auth={type:"OAuth 2.0",fields:{accessToken:d.accessToken||d.token||"",tokenType:d.tokenType||"Bearer",grantType:d.grantType||"Authorization Code",authUrl:d.authUrl||"",accessTokenUrl:d.accessTokenUrl||"",clientId:d.clientId||"",scope:d.scope||""}};markDirty();reqView="authorization";renderAll()}break;
    case "setJwtBearer":if(r){r.auth={type:"JWT Bearer",fields:{jwt:d.jwt||d.token||"",algorithm:d.algorithm||"RS256"}};markDirty();reqView="authorization";renderAll()}break;
    case "setAwsSignature":if(r){r.auth={type:"AWS Signature",fields:{accessKey:d.accessKey||"",secretKey:d.secretKey||"",region:d.region||"us-east-1",service:d.service||"execute-api"}};markDirty();reqView="authorization";renderAll()}break;
    case "inheritAuth":if(r){r.auth={type:"Inherit auth from parent",fields:{}};markDirty();reqView="authorization";renderAll()}break;
    case "setBodyMode":if(r){r.bodyMode=d.mode||"raw";markDirty();reqView="body";renderAll()}break;
    case "setFormData":if(r){r.bodyMode="form-data";r.formData=clone(d.items||d.formData||[]);markDirty();reqView="body";renderAll()}break;
    case "setUrlEncoded":if(r){r.bodyMode="x-www-form-urlencoded";r.urlencoded=clone(d.items||d.urlencoded||[]);markDirty();reqView="body";renderAll()}break;
    case "setGraphqlBody":if(r){r.bodyMode="graphql";r.graphqlQuery=d.query||"";r.graphqlVariables=clone(d.variables||{});markDirty();reqView="body";renderAll()}break;
    case "setPreRequestScript":if(r){r.preRequestScript=String(d.script??d.text??"");markDirty();reqView="prerequest";renderAll()}break;
    case "setPostResponseScript":if(r){r.postResponseScript=String(d.script??d.text??"");r.tests=r.postResponseScript;markDirty();reqView="tests";renderAll()}break;
    case "runPreRequestScript":if(r){const out=runScriptSimulation(d.script??r.preRequestScript??"","pre");showUtility("console","Pre-request Script",pretty(out));renderAll()}break;
    case "runPostResponseTests":if(r){runScriptSimulation(d.script??r.postResponseScript??r.tests??"","post");renderResponse();renderTestResults()}break;
    case "setTestResults":if(response){response.tests=clone(d.results||d.tests||[]);renderResponse()}break;
    case "showTestResults":renderTestResults();break;
    case "setRequestSetting":if(r){r.settings[d.key]=d.value;markDirty();reqView="settings";renderAll()}break;
    case "openRequestSettings":renderRequestSettings();break;
    case "createEnvironment":state.environments[d.name||"Environment"]=clone(d.variables||{});if(d.activate!==false){activeEnv=d.name;state.activeEnvironment=activeEnv}renderEnvironmentEditor();renderAll();break;
    case "setEnvironmentVariable":{const name=d.environment||activeEnv;if(!state.environments[name])state.environments[name]={};state.environments[name][d.key]=d.value;renderEnvironmentEditor();renderAll();break}
    case "deleteEnvironmentVariable":{const name=d.environment||activeEnv;if(state.environments[name])delete state.environments[name][d.key];renderEnvironmentEditor();renderAll();break}
    case "showEnvironmentEditor":renderEnvironmentEditor();break;
    case "setCollectionVariable":{const c=collectionByName(d.collection)||currentCollection();if(c){c.variables=c.variables||{};c.variables[d.key]=d.value}renderVariableInspector();break}
    case "setGlobalVariable":state.globals[d.key]=d.value;renderVariableInspector();break;
    case "setLocalVariable":if(r){r.localVariables[d.key]=d.value;renderVariableInspector()}break;
    case "setVariableMetadata":state.variableMeta[d.scope||"environment"]={...(state.variableMeta[d.scope||"environment"]||{}),[d.key]:{secret:!!d.secret,shared:d.shared!==false,type:d.type||"default"}};renderVariableInspector();break;
    case "resolveVariables":{
      const q=requestById(d.id||currentRequest);if(q){const resolved={url:resolveString(q.url),headers:resolveObject(q.headers),body:resolveObject(q.body)};if(d.apply){q.url=resolved.url;q.headers=resolved.headers;q.body=resolved.body;markDirty();renderAll()}showUtility("variables","Resolved Variables",pretty(resolved))}}break;
    case "showVariableInspector":renderVariableInspector();break;
    case "showCookies":renderCookies();break;
    case "setCookie":{const i=state.cookies.findIndex(x=>x.name===d.name&&x.domain===d.domain);const c={name:d.name,value:d.value,domain:d.domain||"",path:d.path||"/"};if(i>=0)state.cookies[i]=c;else state.cookies.push(c);renderCookies();break}
    case "setCookieAdvanced":{const i=state.cookies.findIndex(x=>x.name===d.name&&x.domain===d.domain);const c={name:d.name||"cookie",value:d.value||"",domain:d.domain||"",path:d.path||"/",expires:d.expires||"Session",secure:d.secure!==false,httpOnly:!!d.httpOnly,sameSite:d.sameSite||"Lax"};if(i>=0)state.cookies[i]=c;else state.cookies.push(c);renderCookies();break}
    case "deleteCookie":state.cookies=state.cookies.filter(x=>!(x.name===d.name&&(!d.domain||x.domain===d.domain)));renderCookies();break;
    case "showConsole":renderConsole();break;
    case "appendConsole":appendConsoleLine(d.text??d.entry??"");renderConsole();break;
    case "clearConsole":state.console=[];renderConsole();break;
    case "appendNetworkLog":appendConsoleLine({text:d.text||`${d.method||"GET"} ${d.url||""} → ${d.status||200} (${d.time||0} ms)`,type:"network",headers:clone(d.headers||{})});renderConsole();break;
    case "saveExample":if(r){r.examples.push({name:d.name||"Example",request:clone(d.request||{method:r.method,url:r.url,headers:r.headers,body:r.body}),response:clone(d.response||response||{})});showNotification("Example saved")}break;
    case "selectExample":if(r){const ex=r.examples.find(x=>x.name===d.name)||r.examples[Number(d.index)||0];if(ex?.response){storeResponse(ex.response);renderResponse()}if(ex?.request&&d.applyRequest){Object.assign(r,clone(ex.request));markDirty();renderAll()}}break;
    case "showExamples":renderExamples();break;
    case "showHistory":renderHistory();break;
    case "addHistoryEntry":appendHistory(d);renderHistory();break;
    case "clearHistory":state.history=[];renderHistory();break;
    case "openRunner":renderRunner();break;
    case "configureRunner":Object.assign(state.runner,clone(d));renderRunner();break;
    case "runCollection":{
      state.runner.collection=d.collection||state.runner.collection||state.collections[0]?.name;
      state.runner.environment=d.environment||state.runner.environment||activeEnv;state.runner.iterations=d.iterations??state.runner.iterations??1;
      state.runner.progress=d.progress??100;state.runner.results=clone(d.results||[{iteration:1,passed:1,failed:0}]);renderRunner();break}
    case "setRunnerProgress":state.runner.progress=d.percent??d.progress??0;renderRunner();break;
    case "showRunnerResults":state.runner.results=clone(d.results||state.runner.results||[]);state.runner.progress=d.progress??100;renderRunner();break;
    case "setRunnerData":state.runner.data=clone(d.data||d.rows||[]);state.runner.dataFile=d.file||d.name||"data.json";renderRunner();break;
    case "runPerformanceTest":{const vus=Number(d.virtualUsers??d.users??10),duration=Number(d.durationSeconds??d.duration??30),avg=Number(d.avgLatency??75),throughput=Number(d.throughput??Math.max(1,Math.round(vus*1000/Math.max(avg,1)))),err=Number(d.errorRate??0);const samples=clone(d.samples||Array.from({length:24},(_,i)=>({second:i,value:Math.max(8,Math.min(95,Math.round(avg/2+(i%7)*5)))})));state.performance={virtualUsers:vus,durationSeconds:duration,avgLatency:avg,throughput,errorRate:err,samples,results:clone(d.results||[]),profile:d.profile||"Fixed load"};renderPerformance();break}
    case "showPerformanceResults":if(d.results)Object.assign(state.performance,clone(d));renderPerformance();break;
    case "scheduleCollectionRun":state.scheduledRuns.push({name:d.name||d.collection||"Scheduled run",collection:d.collection||currentCollection()?.name,environment:d.environment||activeEnv,schedule:d.schedule||d.cron||"Daily at 09:00",status:d.status||"Active",nextRun:d.nextRun||"Next scheduled run"});renderSchedules();break;
    case "showScheduledRuns":renderSchedules();break;
    case "openCli":renderCli();break;
    case "runPostmanCli":case "runNewman":{const cmd=d.command||((st.action==="runNewman"?"newman run ":"postman collection run ")+(d.collection||currentCollection()?.name||"collection"));state.cli.history.push({command:cmd,output:d.output||`Running ${d.collection||currentCollection()?.name||"collection"}
${d.status||"PASS"}`});renderCli();break}
    case "openNew":showUtility("new","Create New",'<div class="utilityGrid"><div class="utilityCard"><h3>HTTP Request</h3>Create and save a REST request.</div><div class="utilityCard"><h3>Collection</h3>Group requests and variables.</div><div class="utilityCard"><h3>Environment</h3>Manage scoped variables.</div><div class="utilityCard"><h3>Mock / Monitor</h3>API simulation and scheduled tests.</div></div>',true);break;
    case "openImport":showUtility("import","Import","Import cURL, Postman Collection, or OpenAPI definitions.");break;
    case "importCurl":{const q=parseCurl(d.curl);const nr=addRequestToCollection(d.collection||"Imported",{id:d.id,name:d.name||"Imported cURL",...q});openRequest(nr.id);showUtility("import","Imported cURL",pretty(q));break}
    case "importCollection":{
      const c=clone(d.collection||{name:d.name||"Imported Collection",requests:d.requests||[]});c.requests=c.requests||[];c.folders=c.folders||[];c.variables=c.variables||{};
      state.collections.push(c);indexRequests();renderAll();showUtility("import","Collection Imported",c.name);break}
    case "importOpenApi":{const spec={name:d.name||d.document?.info?.title||"Imported OpenAPI",format:"OpenAPI",version:d.document?.info?.version||d.version||"3.x",document:clone(d.document||d.spec||{})};state.specs.push(spec);if(d.generateCollection){const c=collectionFromSpec(spec,d.collectionName);state.collections.push(c);indexRequests();renderAll()}renderSpecs();break}
    case "importHar":{const entries=d.entries||d.har?.log?.entries||[];const c={name:d.name||"Imported HAR",variables:{},folders:[],requests:entries.map((e,i)=>({id:"har_"+i,name:e.request?.url?.split('/').pop()||("Request "+(i+1)),method:e.request?.method||"GET",url:e.request?.url||"",headers:Object.fromEntries((e.request?.headers||[]).map(h=>[h.name,h.value])),body:e.request?.postData?.text||""}))};state.collections.push(c);indexRequests();renderAll();showUtility("import","HAR Imported",c.name);break}
    case "exportCollection":{const c=collectionByName(d.name)||currentCollection();showUtility("import","Export Collection",pretty(c||{}));break}
    case "generateCodeSnippet":{const q=requestById(d.id||currentRequest);if(q)showUtility("code","Code Snippet: "+(d.language||"curl"),codeSnippet((d.language||"curl").toLowerCase(),q));break}
    case "openMockServer":renderMocks();break;
    case "createMockServer":state.mocks.push({name:d.name||"Mock Server",url:d.url||"https://mock.example.test",collection:d.collection||currentCollection()?.name,responses:clone(d.responses||[])});renderMocks();break;
    case "setMockResponse":{const m=state.mocks.find(x=>x.name===d.name)||state.mocks[0];if(m){m.responses=m.responses||[];m.responses.push(clone(d.response||d))}renderMocks();break}
    case "configureMockMatching":{const m=state.mocks.find(x=>x.name===d.name)||state.mocks[0];if(m)m.matching={mode:d.mode||"method-and-path",headers:clone(d.headers||[]),query:clone(d.query||[]),body:d.body||false};renderMocks();break}
    case "addMockLog":{const m=state.mocks.find(x=>x.name===d.name)||state.mocks[0];if(m){m.logs=m.logs||[];m.logs.unshift({method:d.method||"GET",path:d.path||"/",status:d.status||200,time:d.time||"Now"})}renderMockLogs(m);break}
    case "showMockLogs":renderMockLogs(state.mocks.find(x=>x.name===d.name)||state.mocks[0]);break;
    case "openMonitor":renderMonitors();break;
    case "createMonitor":state.monitors.push({name:d.name||"Monitor",collection:d.collection||currentCollection()?.name,schedule:d.schedule||"Every hour",environment:d.environment||activeEnv,runs:[]});renderMonitors();break;
    case "runMonitor":{const m=state.monitors.find(x=>x.name===d.name)||state.monitors[0];if(m){m.runs=m.runs||[];m.runs.unshift({time:d.time||"Now",status:d.status||"Passed",tests:d.tests||{passed:1,failed:0},duration:d.duration||"1.2 s",region:d.region||m.region||"US East"})}renderMonitors();break}
    case "configureMonitor":{const m=state.monitors.find(x=>x.name===d.name)||state.monitors[0];if(m)Object.assign(m,{schedule:d.schedule||m.schedule,region:d.region||m.region||"US East",notifications:clone(d.notifications||m.notifications||[]),retry:d.retry??m.retry});renderMonitors();break}
    case "showMonitorHistory":renderMonitorHistory(state.monitors.find(x=>x.name===d.name)||state.monitors[0]);break;
    case "openGraphQL":if(r){r.bodyMode="graphql";reqView="body";renderAll()}showUtility("graphql","GraphQL","GraphQL Query + Variables");break;
    case "setGraphqlQuery":if(r){r.bodyMode="graphql";r.graphqlQuery=String(d.query||"");markDirty();renderAll();showUtility("graphql","GraphQL Query",r.graphqlQuery)}break;
    case "setGraphqlVariables":if(r){r.bodyMode="graphql";r.graphqlVariables=clone(d.variables||{});markDirty();renderAll();showUtility("graphql","GraphQL Variables",pretty(r.graphqlVariables))}break;
    case "loadGraphqlSchema":state.graphql.schema=clone(d.schema||d.introspection||{});state.graphql.endpoint=d.endpoint||requestById(currentRequest)?.url||"";renderGraphqlSchema();break;
    case "showGraphqlSchema":renderGraphqlSchema();break;
    case "sendGraphql":if(r){const resp={status:d.status??200,statusText:d.statusText||"OK",time:d.time??55,size:d.size||"420 B",headers:d.headers||{"content-type":"application/json"},body:d.body||{data:{ok:true}},tests:d.tests||[]};performSend(resp);renderResponse();showUtility("graphql","GraphQL Response",pretty(resp.body))}break;
    case "openWebSocket":state.websocket.url=d.url||state.websocket.url||"wss://echo.example.test";state.websocket.messages=state.websocket.messages||[];renderWebSocket();break;
    case "configureWebSocket":Object.assign(state.websocket,{url:d.url||state.websocket.url,headers:clone(d.headers||state.websocket.headers||{}),params:clone(d.params||state.websocket.params||[]),protocol:d.protocol||state.websocket.protocol||""});renderWebSocket();break;
    case "setWebSocketProtocol":state.websocket.protocol=d.protocol||"";renderWebSocket();break;
    case "connectWebSocket":state.websocket.connected=true;state.websocket.url=d.url||state.websocket.url;state.websocket.messages=state.websocket.messages||[];state.websocket.messages.push({direction:"system",text:"Connected"});renderWebSocket();break;
    case "sendWebSocketMessage":state.websocket.messages=state.websocket.messages||[];state.websocket.messages.push({direction:"out",text:String(d.text??d.message??"")});renderWebSocket();break;
    case "receiveWebSocketMessage":state.websocket.messages=state.websocket.messages||[];state.websocket.messages.push({direction:"in",text:String(d.text??d.message??"")});renderWebSocket();break;
    case "disconnectWebSocket":state.websocket.connected=false;state.websocket.messages=state.websocket.messages||[];state.websocket.messages.push({direction:"system",text:"Disconnected"});renderWebSocket();break;
    case "openGrpc":state.grpc=state.grpc||{};renderGrpc();break;
    case "loadProto":state.grpc.proto=d.proto||d.text||"";state.grpc.services=clone(d.services||[]);renderGrpc();break;
    case "setGrpcReflection":state.grpc.reflection=d.enabled!==false;state.grpc.endpoint=d.endpoint||state.grpc.endpoint||"";renderGrpc();break;
    case "selectGrpcService":state.grpc.service=d.service||"";state.grpc.method=d.method||"";renderGrpc();break;
    case "setGrpcMetadata":state.grpc.metadata=clone(d.metadata||{});renderGrpc();break;
    case "setGrpcMessage":state.grpc.message=clone(d.message??{});renderGrpc();break;
    case "invokeGrpc":state.grpc.response=clone(d.response||{message:"OK"});state.grpc.status=d.status||"OK";renderGrpc();break;
    case "startGrpcStream":state.grpc.streaming=true;state.grpc.stream=clone(d.messages||[]);state.grpc.status="Streaming";renderGrpc();break;
    case "receiveGrpcMessage":state.grpc.stream=state.grpc.stream||[];state.grpc.stream.push({direction:d.direction||"in",message:clone(d.message??d.data??{})});renderGrpc();break;
    case "endGrpcStream":state.grpc.streaming=false;state.grpc.status=d.status||"OK";renderGrpc();break;
    case "openVault":renderVault();break;
    case "setVaultSecret":state.vault[d.key]=d.value;state.vaultRevealed[d.key]=false;renderVault();break;
    case "deleteVaultSecret":delete state.vault[d.key];delete state.vaultRevealed[d.key];renderVault();break;
    case "revealVaultSecret":state.vaultRevealed[d.key]=d.reveal!==false;renderVault();break;
    case "openPackages":renderPackages();break;
    case "addPackage":{const i=state.packages.findIndex(x=>x.name===d.name);const pkg={name:d.name||"package",version:d.version||"1.0.0",description:d.description||"",code:d.code||""};if(i>=0)state.packages[i]=pkg;else state.packages.push(pkg);renderPackages();break}
    case "removePackage":state.packages=state.packages.filter(x=>x.name!==d.name);renderPackages();break;
    case "usePackage":appendConsoleLine({text:`Loaded package ${d.name}${d.member?"."+d.member:""}`,type:"script"});renderPackages();break;
    case "openVisualizer":renderVisualizer();break;
    case "setVisualizerTemplate":state.visualizer.template=String(d.template||"");state.visualizer.data=clone(d.data||response?.body||{});renderVisualizer();break;
    case "renderVisualizer":{let out=String(d.template||state.visualizer.template||"");const data=d.data||state.visualizer.data||response?.body||{};out=out.replace(/\{\{\s*([\w.]+)\s*\}\}/g,(m,k)=>esc(deepGet(data,k)??m));state.visualizer.rendered=out;renderVisualizer();break}
    case "openWorkspaces":renderWorkspaces();break;
    case "createWorkspace":state.workspaces.push({name:d.name||"Workspace",type:d.type||"Team",members:clone(d.members||["You"])});if(d.activate){state.workspaceName=d.name;refs.workspace.textContent=state.workspaceName}renderWorkspaces();break;
    case "switchWorkspace":state.workspaceName=d.name||state.workspaceName;renderAll();renderWorkspaces();break;
    case "shareCollection":{const c=collectionByName(d.collection)||currentCollection();if(c){c.sharedWith=clone(d.members||d.people||[]);c.permission=d.permission||"Editor"}renderCollaboration();break}
    case "addComment":state.comments.push({author:d.author||"Developer",text:d.text||d.comment||"",time:d.time||"Now",target:d.target||currentRequest});renderCollaboration();break;
    case "openCollaboration":renderCollaboration();break;
    case "forkCollection":{const c=collectionByName(d.collection)||currentCollection();if(c){const fork=clone(c);fork.name=d.name||c.name+" - Fork";fork.forkOf=c.name;state.collections.push(fork);indexRequests()}renderCollaboration();break}
    case "openPullRequest":state.pullRequests.push({title:d.title||"Update collection",source:d.source||"fork",target:d.target||"main",status:"Open",changes:clone(d.changes||[])});renderCollaboration();break;
    case "mergePullRequest":{const pr=state.pullRequests.find(x=>x.title===d.title)||state.pullRequests[Number(d.index)||0];if(pr)pr.status="Merged";renderCollaboration();break}
    case "openSpecHub":renderSpecs();break;
    case "createSpec":state.specs.push({name:d.name||"API Spec",format:d.format||"OpenAPI",version:d.version||"3.1",document:clone(d.document||{})});renderSpecs();break;
    case "updateSpec":{const sp=state.specs.find(x=>x.name===d.name)||state.specs[0];if(sp){if(d.document!==undefined)sp.document=clone(d.document);if(d.version)sp.version=d.version}renderSpecs();break}
    case "validateAgainstSpec":{const sp=state.specs.find(x=>x.name===d.name)||state.specs[0],q=requestById(d.request||currentRequest),result=d.result||basicSpecValidation(sp,q||{});showUtility("specs","Schema Validation",'<div class="infoCard"><span class="statusChip '+(result.valid?'ok':'bad')+'">'+(result.valid?'Valid':'Invalid')+'</span><pre>'+esc(pretty(result))+'</pre></div>',true);break}
    case "generateCollectionFromSpec":{const sp=state.specs.find(x=>x.name===d.name)||state.specs[0];if(sp){const c=collectionFromSpec(sp,d.collectionName);state.collections.push(c);indexRequests();renderAll();showUtility("specs","Collection Generated",c.name)}break}
    case "openFlows":renderFlows();break;
    case "createFlow":state.flows.push({name:d.name||"Flow",blocks:clone(d.blocks||[]),connections:clone(d.connections||[]),runs:[]});state.activeFlow=d.name||"Flow";renderFlows();break;
    case "addFlowBlock":{const f=state.flows.find(x=>x.name===(d.flow||state.activeFlow))||state.flows[0];if(f){f.blocks=f.blocks||[];f.blocks.push({id:d.id||"block_"+(f.blocks.length+1),type:d.type||"Request",label:d.label||d.name||"Block",config:clone(d.config||{})})}renderFlows();break}
    case "connectFlowBlocks":{const f=state.flows.find(x=>x.name===(d.flow||state.activeFlow))||state.flows[0];if(f){f.connections=f.connections||[];f.connections.push({from:d.from,to:d.to,label:d.label||""})}renderFlows();break}
    case "runFlow":{const f=state.flows.find(x=>x.name===(d.flow||state.activeFlow))||state.flows[0];if(f){f.runs=f.runs||[];f.runs.unshift({time:d.time||"Now",status:d.status||"Completed",output:clone(d.output||{})})}renderFlows();break}
    case "openCertificates":renderCertificates();break;
    case "addCertificate":state.certificates.push({host:d.host||d.name||"api.example.com",crt:d.crt||"client.crt",key:d.key||"client.key",pfx:d.pfx||"",passphrase:d.passphrase||""});renderCertificates();break;
    case "removeCertificate":state.certificates=state.certificates.filter(x=>(x.host||x.name)!==(d.host||d.name));renderCertificates();break;
    case "openProxy":renderProxy();break;
    case "configureProxy":state.proxy={...state.proxy,...clone(d)};renderProxy();break;
    case "openGitIntegration":renderGitIntegrations();break;
    case "connectGitIntegration":state.gitIntegrations.push({provider:d.provider||"GitHub",repository:d.repository||"org/repo",branch:d.branch||"main",status:"Connected",lastSync:d.lastSync||"Now"});renderGitIntegrations();break;
    case "syncGitIntegration":{const g=state.gitIntegrations.find(x=>x.repository===d.repository)||state.gitIntegrations[0];if(g){g.lastSync=d.time||"Now";g.status=d.status||"Synced"}renderGitIntegrations();break}
    case "openReports":renderReports();break;
    case "addReportMetric":state.reports.metrics.push({name:d.name||"Metric",value:d.value??0,note:d.note||""});renderReports();break;
    case "openAgent":renderAgent();break;
    case "runAgentAction":state.agent.history.push({role:"You",text:d.prompt||d.input||""},{role:"Agent",text:d.output||d.response||"Suggested API workflow generated."});renderAgent();break;
    case "openApiHub":renderApiHub();break;
    case "createApi":state.apis.push({name:d.name||"API",version:d.version||"v1",description:d.description||"",links:clone(d.links||{}),spec:d.spec||""});renderApiHub();break;
    case "openDocumentation":{
      const c=collectionByName(d.collection)||currentCollection();const docs=d.text||state.documentation[c?.name]||c?.description||"Collection documentation";
      showUtility("docs","Documentation: "+(c?.name||"Workspace"),docs);break}
    case "showNotification":showNotification(d.text||d.message||"Postman notification");break;
    case "toggleSidebar":state.sidebarHidden=d.hidden!==undefined?!!d.hidden:!state.sidebarHidden;refs.app.classList.toggle("sidebar-hidden",state.sidebarHidden);break;
    case "highlightTarget":await highlightTarget(d.target,token);break;
    case "moveCursor":await moveCursor(d.target,token);break;
    default:showNotification("Unsupported Postman action: "+st.action);break;
  }
}

async function seek(steps,animateFinal){
  const token=++seekToken;clearBoundary();reset();
  for(let i=0;i<steps.length;i++){
    allowBoundary=i===steps.length-1;
    await apply(steps[i],animateFinal&&i===steps.length-1,token);
    if(token!==seekToken)return;
  }
  allowBoundary=true;
}

/* ---------- manual interactions ---------- */
function drag(el,onMove){let on=false;el.onpointerdown=e=>{on=true;el.setPointerCapture(e.pointerId)};el.onpointermove=e=>{if(on)onMove(e)};el.onpointerup=()=>on=false}
drag(refs.splitV,e=>{if(innerWidth<620)return;const r=refs.main.getBoundingClientRect(),w=Math.max(125,Math.min(430,e.clientX-r.left));refs.main.style.setProperty("--sideW",w+"px")});
drag(refs.splitH,e=>{const r=refs.requestArea.getBoundingClientRect(),h=Math.max(95,Math.min(Math.max(110,r.height-120),r.bottom-e.clientY));document.documentElement.style.setProperty("--respH",h+"px")});

document.querySelectorAll("[data-reqtab]").forEach(x=>x.addEventListener("click",()=>{reqView=x.dataset.reqtab;renderRequestView()}));
document.querySelectorAll("[data-resptab]").forEach(x=>x.addEventListener("click",()=>{respView=x.dataset.resptab;renderResponse()}));
refs.send.addEventListener("click",async()=>{const r=requestById(currentRequest);if(!r)return;if(state.liveNetwork)await performLiveSend();else{if(r.preRequestScript)runScriptSimulation(r.preRequestScript,"pre");performSend(r.response||{status:200,statusText:"OK",time:42,size:"128 B",body:{ok:true}});if(r.postResponseScript||r.tests)runScriptSimulation(r.postResponseScript||r.tests,"post");renderResponse()}});
refs.saveBtn?.addEventListener("click",()=>{if(currentRequest){dirtyRequests.delete(currentRequest);renderTabs();showNotification("Request saved")}});
refs.env.addEventListener("click",renderEnvironmentEditor);
refs.toolNew.addEventListener("click",()=>showUtility("new","Create New","HTTP Request\nCollection\nEnvironment\nMock Server\nMonitor"));
refs.toolImport.addEventListener("click",()=>showUtility("import","Import","Paste cURL or import a collection."));
refs.toolRunner.addEventListener("click",renderRunner);
refs.toolConsole.addEventListener("click",renderConsole);
refs.toolHistory.addEventListener("click",renderHistory);
refs.toolDocs.addEventListener("click",()=>{const c=currentCollection();showUtility("docs","Documentation",c?.description||"Collection documentation")});
refs.toolVariables.addEventListener("click",renderVariableInspector);
refs.toolApis?.addEventListener("click",renderApiHub);
refs.toolFlows?.addEventListener("click",renderFlows);
refs.toolMocks?.addEventListener("click",renderMocks);
refs.toolMonitors?.addEventListener("click",renderMonitors);
refs.toolReports?.addEventListener("click",renderReports);
refs.toolAgent?.addEventListener("click",renderAgent);
refs.toolMore?.addEventListener("click",renderPlatformTools);
refs.statusConsole?.addEventListener("click",renderConsole);
refs.statusCookies?.addEventListener("click",renderCookies);
refs.statusHistory?.addEventListener("click",renderHistory);
refs.statusVault?.addEventListener("click",renderVault);
refs.statusCertificates?.addEventListener("click",renderCertificates);
refs.utilityClose.addEventListener("click",closeUtility);
refs.utilityShade.addEventListener("pointerdown",e=>{if(e.target===refs.utilityShade)closeUtility()});
refs.utilityBody.addEventListener("click",e=>{const b=e.target.closest?.("[data-platform-tool]");if(!b)return;const v=b.dataset.platformTool;({workspaces:renderWorkspaces,specs:renderSpecs,vault:renderVault,packages:renderPackages,visualizer:renderVisualizer,performance:renderPerformance,schedules:renderSchedules,cli:renderCli,certificates:renderCertificates,proxy:renderProxy,git:renderGitIntegrations,collaboration:renderCollaboration}[v]||(()=>{}))()});
document.querySelectorAll("[data-side]").forEach(tab=>tab.addEventListener("click",()=>{document.querySelectorAll("[data-side]").forEach(x=>x.classList.toggle("active",x===tab));const v=tab.dataset.side;if(v==="collections"){refs.sideHeadTitle.textContent="Collections";renderCollections()}else if(v==="apis"){refs.sideHeadTitle.textContent="APIs";refs.collections.innerHTML=(state.apis||[]).map(a=>'<div class="folderRow">◆ '+esc(a.name||"API")+'</div>').join("")||'<div class="folderRow">No APIs</div>'}else{refs.sideHeadTitle.textContent="History";refs.collections.innerHTML=(state.history||[]).slice(0,40).map(h=>'<div class="requestRow"><span class="method '+esc(h.method||"GET")+'">'+esc(h.method||"GET")+'</span><span>'+esc(h.url||"")+'</span></div>').join("")||'<div class="folderRow">No history</div>'}}));
refs.topSearch?.addEventListener("input",e=>{const q=e.target.value.toLowerCase();refs.collections.querySelectorAll(".requestRow,.collectionName,.folderRow").forEach(x=>x.classList.toggle("hidden",q&&!x.textContent.toLowerCase().includes(q)))});
refs.assistantMin?.addEventListener("click",e=>{e.stopPropagation();refs.assistant.classList.toggle("minimized")});
refs.assistantClose?.addEventListener("click",e=>{e.stopPropagation();refs.assistant.classList.remove("show")});
(function enableAssistantDrag(){let dragOn=false,dx=0,dy=0;refs.assistantHead?.addEventListener("pointerdown",e=>{if(e.target.tagName==="BUTTON")return;dragOn=true;const rr=refs.assistant.getBoundingClientRect();dx=e.clientX-rr.left;dy=e.clientY-rr.top;refs.assistantHead.setPointerCapture?.(e.pointerId)});refs.assistantHead?.addEventListener("pointermove",e=>{if(!dragOn)return;const ar=refs.app.getBoundingClientRect(),w=refs.assistant.offsetWidth,h=refs.assistant.offsetHeight;refs.assistant.style.left=Math.max(4,Math.min(ar.width-w-4,e.clientX-ar.left-dx))+"px";refs.assistant.style.top=Math.max(4,Math.min(ar.height-h-4,e.clientY-ar.top-dy))+"px";refs.assistant.style.right="auto";refs.assistant.style.bottom="auto"});refs.assistantHead?.addEventListener("pointerup",()=>dragOn=false)})();

document.addEventListener("pointerdown",e=>{if(e.isTrusted&&refs.boundary.classList.contains("show"))clearBoundary()},true);
document.addEventListener("keydown",e=>{if(e.isTrusted&&refs.boundary.classList.contains("show"))clearBoundary()},true);
document.addEventListener("scroll",syncBoundary,true);
window.addEventListener("resize",syncBoundary);

window.addEventListener("message",e=>{
  const m=e.data;
  if(m?.type==="SIM_PACKAGE"){autoType=!!m.autoType;applyTheme(m.theme||"dark");loadPackage(m.package)}
  if(m?.type==="SIM_SETTING"&&m.key==="autoType")autoType=!!m.value;
  if(m?.type==="SIM_SETTING"&&m.key==="theme")applyTheme(m.value);
  if(m?.type==="SIM_SEEK"){autoType=!!m.autoType;seek(Array.isArray(m.steps)?m.steps:[],!!m.animateFinal)}
  if(m?.type==="SIM_EXPLAIN")renderExplanation(m.data||m)
});

refs.collections.innerHTML='<div style="padding:10px;font-size:10px;color:#777">Waiting for Postman package...</div>';
parent.postMessage({type:"ENGINE_READY",app:APP_ID,actions:SUPPORTED_ACTIONS},"*");
})();
