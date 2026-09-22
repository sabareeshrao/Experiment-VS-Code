(() => {
"use strict";
const $=id=>document.getElementById(id);
const refs={
  app:$("app"),user:$("user"),clock:$("clock"),
  termDock:$("termDock"),filesDock:$("filesDock"),monitorDock:$("monitorDock"),servicesDock:$("servicesDock"),packagesDock:$("packagesDock"),networkDock:$("networkDock"),logsDock:$("logsDock"),disksDock:$("disksDock"),
  terminalWin:$("terminalWin"),terminal:$("terminal"),cwdStatus:$("cwdStatus"),exitStatus:$("exitStatus"),processStatus:$("processStatus"),
  filesWin:$("filesWin"),path:$("path"),fileList:$("fileList"),backFile:$("backFile"),newFolderBtn:$("newFolderBtn"),newFileBtn:$("newFileBtn"),editorWin:$("editorWin"),editorTitle:$("editorTitle"),editor:$("editor"),
  monitorWin:$("monitorWin"),processes:$("processes"),serviceWin:$("serviceWin"),services:$("services"),packagesWin:$("packagesWin"),packages:$("packages"),networkWin:$("networkWin"),network:$("network"),logsWin:$("logsWin"),logFilter:$("logFilter"),logRows:$("logRows"),disksWin:$("disksWin"),disks:$("disks"),notification:$("notification"),boundary:$("targetBoundary"),
  assistant:$("linuxAssistant"),assistantHead:$("assistantHead"),assistantTitle:$("assistantTitle"),assistantMeta:$("assistantMeta"),assistantText:$("assistantText"),assistantMin:$("assistantMin"),assistantClose:$("assistantClose")
};
const windows={terminal:refs.terminalWin,files:refs.filesWin,editor:refs.editorWin,monitor:refs.monitorWin,services:refs.serviceWin,packages:refs.packagesWin,network:refs.networkWin,logs:refs.logsWin,disks:refs.disksWin};
const docks={terminal:refs.termDock,files:refs.filesDock,monitor:refs.monitorDock,services:refs.servicesDock,packages:refs.packagesDock,network:refs.networkDock,logs:refs.logsDock,disks:refs.disksDock};
const APP_ID="linux";
const SUPPORTED_ACTIONS=["openTerminal","typeCommand","runCommand","executeCommand","appendTerminal","clearTerminal","setTerminalPrompt","openFiles","openFile","setFileContent","createFile","createDirectory","setFilePermissions","setFileOwner","renamePath","deletePath","openProcesses","setProcesses","updateProcess","removeProcess","highlightProcess","openServices","setService","removeService","highlightService","openPackages","setPackages","installPackage","removePackage","updatePackage","highlightPackage","openNetwork","setNetwork","setNetworkInterfaces","setSockets","highlightInterface","openLogs","setLogs","appendLog","filterLogs","highlightLog","openDisks","setDisks","highlightDisk","setCwd","setHostname","setUser","setClock","setEnv","unsetEnv","startProcess","stopProcess","pressButton","highlightTarget","moveCursor","showNotification"];
let baseline=null,state=null,currentWindow="terminal",currentPath="/home/user",previousPath="/home/user",currentFile=null,autoType=true,seekToken=0,allowBoundary=true,logFilterText="",inputDraft="",historyIndex=0,lastExit=0,activeProcess=null,remoteStack=[],assistantDrag=null;
const clone=v=>JSON.parse(JSON.stringify(v??null));
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function applyTheme(t){document.body.classList.toggle("theme-dark",t!=="light")}
function nowTime(){return new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
function normalizePath(raw,base=currentPath){
  let s=String(raw??"").trim();const home=state?.home||("/home/"+(state?.user||"user"));if(!s)s=base;if(s==="~")s=home;else if(s.startsWith("~/"))s=home+s.slice(1);if(!s.startsWith("/"))s=(base.endsWith("/")?base:base+"/")+s;
  const parts=[];for(const p of s.split("/")){if(!p||p===".")continue;if(p==="..")parts.pop();else parts.push(p)}return "/"+parts.join("/");
}
function parentPath(path){const p=normalizePath(path);if(p==="/")return "/";const i=p.lastIndexOf("/");return i<=0?"/":p.slice(0,i)}
function baseName(path){const p=normalizePath(path);return p==="/"?"/":p.slice(p.lastIndexOf("/")+1)}
function ensureDir(path,owner=state?.user||"user"){
  const p=normalizePath(path);if(p!=="/"&&!state.files[p])state.files[p]={type:"dir",owner,permissions:"drwxr-xr-x",size:"4.0 KB"};if(p!=="/")ensureDir(parentPath(p),owner);return p;
}
function putFile(path,content="",owner=state?.user||"user"){
  const p=normalizePath(path);ensureDir(parentPath(p),owner);const old=state.files[p]||{};state.files[p]={type:"file",owner:old.owner||owner,permissions:old.permissions||"-rw-r--r--",size:String(new Blob([String(content)]).size)+" B",...old,content:String(content)};return p;
}
function nodeAt(path){return state.files[normalizePath(path)]||null}
function exists(path){const p=normalizePath(path);return p==="/"||!!state.files[p]}
function isDir(path){const p=normalizePath(path);return p==="/"||state.files[p]?.type==="dir"}
function children(path,includeHidden=true){const p=normalizePath(path);return Object.entries(state.files).filter(([fp])=>parentPath(fp)===p&&(includeHidden||!baseName(fp).startsWith("."))).map(([fp,v])=>({path:fp,name:baseName(fp),...v})).sort((a,b)=>(a.type==="dir"?0:1)-(b.type==="dir"?0:1)||a.name.localeCompare(b.name))}
function deletePath(path){const p=normalizePath(path),prefix=p+"/";for(const fp of Object.keys(state.files))if(fp===p||fp.startsWith(prefix))delete state.files[fp];if(currentFile===p||currentFile?.startsWith(prefix))currentFile=null;if(currentPath===p||currentPath.startsWith(prefix))currentPath=state.home}
function renamePath(from,to){const f=normalizePath(from),t=normalizePath(to);if(!state.files[f])return false;ensureDir(parentPath(t));const moving=Object.keys(state.files).filter(p=>p===f||p.startsWith(f+"/")).sort((a,b)=>a.length-b.length);for(const old of moving){const v=state.files[old];delete state.files[old];state.files[t+old.slice(f.length)]=v}if(currentFile===f)currentFile=t;if(currentPath===f)currentPath=t;return true}
function copyPath(from,to){const f=normalizePath(from),src=nodeAt(f);if(!src)return false;let t=normalizePath(to);if(isDir(t))t=normalizePath(t+"/"+baseName(f));if(src.type==="file"){putFile(t,src.content||"",src.owner);Object.assign(state.files[t],clone(src));return true}ensureDir(t,src.owner);const prefix=f+"/";for(const p of Object.keys(state.files).filter(x=>x.startsWith(prefix))){const dest=t+p.slice(f.length);const n=state.files[p];if(n.type==="dir")ensureDir(dest,n.owner);else{putFile(dest,n.content||"",n.owner);Object.assign(state.files[dest],clone(n))}}return true}
function normalize(){
  state=state||{};state.user=state.user||"developer";state.hostname=state.hostname||"linux-dev";state.home=state.home||("/home/"+state.user);state.files=state.files||{};state.processes=state.processes||[];state.services=state.services||[];state.packages=state.packages||[];state.network=state.network||{};state.network.interfaces=state.network.interfaces||[];state.network.sockets=state.network.sockets||[];state.network.routes=state.network.routes||[{destination:"default",gateway:"192.168.1.1",dev:"eth0"}];state.logs=state.logs||[];state.disks=state.disks||[];state.terminal=state.terminal||{};state.terminal.history=state.terminal.history||[];state.terminal.commandHistory=state.terminal.commandHistory||[];state.terminal.env={HOME:state.home,USER:state.user,LOGNAME:state.user,SHELL:"/bin/bash",PWD:state.currentPath||state.home,OLDPWD:state.home,PATH:"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",JAVA_HOME:"/usr/lib/jvm/java-21-openjdk-amd64",MAVEN_HOME:"/opt/apache-maven-3.9.9",...state.terminal.env};state.terminal.aliases=state.terminal.aliases||{ll:"ls -alF",la:"ls -A",l:"ls -CF"};
  currentWindow=state.activeWindow||"terminal";currentPath=normalizePath(state.currentPath||state.home,"/");previousPath=state.terminal.env.OLDPWD||state.home;currentFile=state.currentFile||null;logFilterText=state.logFilter||"";historyIndex=state.terminal.commandHistory.length;lastExit=Number(state.terminal.lastExit||0);activeProcess=null;inputDraft="";
  ensureDir(state.home);ensureDir(currentPath);ensureDir("/tmp");ensureDir("/var/log","root");ensureDir("/etc","root");ensureDir("/usr/local/bin","root");ensureDir("/opt","root");state.terminal.env.PWD=currentPath;
}
function displayPath(p){const home=state.home;return p===home?"~":p.startsWith(home+"/")?"~"+p.slice(home.length):p}
function prompt(){return state.terminal.prompt||((state.user||"user")+"@"+(state.hostname||"linux")+":"+displayPath(currentPath)+(state.user==="root"?"# ":"$ "))}
function setCwd(path){const p=normalizePath(path);if(!isDir(p))return false;previousPath=currentPath;currentPath=p;state.terminal.env.OLDPWD=previousPath;state.terminal.env.PWD=currentPath;return true}
function showWindow(name){currentWindow=windows[name]?name:"terminal";Object.entries(windows).forEach(([n,e])=>e.classList.toggle("show",n===currentWindow));Object.entries(docks).forEach(([n,e])=>e?.classList.toggle("active",n===currentWindow));if(currentWindow==="terminal")setTimeout(focusInput,0)}
function terminalEntry(command,output,code=0,promptText=prompt()){state.terminal.history.push({prompt:promptText,command:String(command??""),output:String(output??""),code});lastExit=code;state.terminal.lastExit=code}
function renderTerminal(){
  const hadFocus=document.activeElement?.id==="cmdInput",sel=hadFocus?[$("cmdInput")?.selectionStart,$("cmdInput")?.selectionEnd]:null;refs.terminal.innerHTML="";
  for(const [index,h] of state.terminal.history.entries()){
    const d=document.createElement("div"),command=document.createElement("span");d.className="terminalHistoryRow";command.className="historyCommand sim-command-text";command.dataset.history=index;command.textContent=(h.prompt??prompt())+(h.command||"");d.appendChild(command);if(h.output!==undefined&&h.output!==""){const out=document.createElement("div");out.className=h.code?"terminalError":"terminalOutput";out.textContent=h.output;d.appendChild(out)}refs.terminal.appendChild(d)
  }
  const line=document.createElement("div");line.className="promptLine";const p=document.createElement("span");p.className="prompt";p.textContent=prompt();const input=document.createElement("input");input.id="cmdInput";input.className="cmdInput sim-command-text";input.autocomplete="off";input.spellcheck=false;input.value=inputDraft;line.append(p,input);refs.terminal.appendChild(line);wireInput(input);refs.terminal.scrollTop=refs.terminal.scrollHeight;refs.cwdStatus.textContent=currentPath;refs.exitStatus.textContent="exit "+lastExit;refs.processStatus.textContent=activeProcess?("Running: "+activeProcess.name):"Ready";
  if(hadFocus){input.focus();if(sel&&sel[0]!=null)try{input.setSelectionRange(sel[0],sel[1])}catch{}}
}
function focusInput(){const i=$("cmdInput");if(i)i.focus()}
function filesInPath(path){return children(path,true)}
function renderFiles(){refs.path.textContent=currentPath;refs.fileList.innerHTML="";for(const f of filesInPath(currentPath)){const d=document.createElement("div");d.className="fileRow"+(f.path===currentFile?" active":"");d.dataset.file=f.path;d.innerHTML='<span>'+(f.type==="dir"?"▣":f.type==="link"?"↗":"▤")+'</span><span class="fileName">'+esc(f.name)+'</span><span>'+esc(f.permissions||f.mode||"")+'</span><span>'+esc(f.owner||"")+'</span><span>'+esc(f.size||"")+'</span>';d.ondblclick=()=>{__clearTargetBoundary();if(f.type==="dir"){setCwd(f.path);renderFiles();renderTerminal()}else{currentFile=f.path;renderEditor();showWindow("editor")}};refs.fileList.appendChild(d)}}
function renderEditor(){const f=state.files[currentFile];refs.editorTitle.textContent=(currentFile?baseName(currentFile):"Text Editor");refs.editor.textContent=f?.content||""}
function renderProcesses(){refs.processes.innerHTML='<div class="proc head"><span>PID</span><span>Process</span><span>User</span><span>CPU %</span><span>Memory</span></div>'+state.processes.map(p=>'<div class="proc" data-pid="'+esc(p.pid)+'"><span>'+esc(p.pid)+'</span><span>'+esc(p.name)+'</span><span>'+esc(p.user||"")+'</span><span>'+esc(p.cpu??"")+'</span><span>'+esc(p.memory||"")+'</span></div>').join("")}
function renderServices(){refs.services.innerHTML=state.services.map(s=>'<div class="serviceRow" data-service="'+esc(s.name)+'"><b>'+esc(s.name)+'</b><span class="'+(s.status==="active"?"activeService":s.status==="failed"?"failedService":"")+'">'+esc(s.status||"")+'</span><span>'+esc(s.enabled??"")+'</span></div>').join("")}
function renderPackages(){refs.packages.innerHTML='<div class="packageRow head"><span>Package</span><span>Version</span><span>Status</span><span>Repository</span></div>'+state.packages.map(p=>'<div class="packageRow" data-package="'+esc(p.name)+'"><b>'+esc(p.name)+'</b><span>'+esc(p.version||"")+'</span><span class="'+(p.status==="installed"?"installedPkg":p.status==="removed"?"removedPkg":"")+'">'+esc(p.status||"")+'</span><span>'+esc(p.repository||p.source||"")+'</span></div>').join("")}
function renderNetwork(){const ifaces='<div class="netSectionTitle">Interfaces</div><div class="netRow head"><span>Interface</span><span>State</span><span>Address</span><span>Gateway</span></div>'+state.network.interfaces.map(n=>'<div class="netRow" data-interface="'+esc(n.name)+'"><b>'+esc(n.name)+'</b><span class="'+((n.state||n.status)==="up"?"linkUp":"linkDown")+'">'+esc(n.state||n.status||"")+'</span><span>'+esc(n.address||n.ip||"")+'</span><span>'+esc(n.gateway||"")+'</span></div>').join("");const sockets='<div class="netSectionTitle">Sockets</div>'+state.network.sockets.map(s=>'<div class="socketRow" data-socket="'+esc(s.id||s.local||"")+'"><span>'+esc(s.protocol||s.proto||"")+'</span><span>'+esc(s.local||"")+'</span><span>'+esc(s.remote||"")+'</span><span>'+esc(s.state||"")+'</span></div>').join("");refs.network.innerHTML=ifaces+sockets}
function filteredLogs(){const q=logFilterText.trim().toLowerCase();if(!q)return state.logs;return state.logs.filter(l=>[l.time,l.level,l.unit,l.message,l.text].some(v=>String(v??"").toLowerCase().includes(q)))}
function renderLogs(){refs.logFilter.value=logFilterText;refs.logRows.innerHTML=filteredLogs().map((l,i)=>'<div class="logRow '+((l.level||"").toLowerCase()==="error"?"logError":(l.level||"").toLowerCase()==="warning"?"logWarn":"")+'" data-log="'+esc(l.id??i)+'"><span>'+esc(l.time||"")+'</span><span>'+esc(l.level||"")+'</span><span>'+esc(l.unit||l.source||"")+'</span><span>'+esc(l.message||l.text||"")+'</span></div>').join("")}
function renderDisks(){refs.disks.innerHTML='<div class="diskRow head"><span>Device</span><span>FS</span><span>Size</span><span>Used</span><span>Use %</span><span>Mount</span></div>'+state.disks.map(d=>'<div class="diskRow" data-disk="'+esc(d.device)+'"><b>'+esc(d.device)+'</b><span>'+esc(d.fs||d.type||"")+'</span><span>'+esc(d.size||"")+'</span><span>'+esc(d.used||"")+'</span><span class="'+(Number(String(d.percent??d.usePercent??0).replace("%",""))>=90?"diskWarning":"diskHealthy")+'">'+esc(String(d.percent??d.usePercent??"")+(String(d.percent??d.usePercent??"").includes("%")||d.percent===undefined&&d.usePercent===undefined?"":"%"))+'</span><span>'+esc(d.mount||d.mountPoint||"")+'</span></div>').join("")}
function renderAll(){refs.user.textContent=state.user;refs.clock.textContent=state.clock||state.distro||"Linux";renderTerminal();renderFiles();renderEditor();renderProcesses();renderServices();renderPackages();renderNetwork();renderLogs();renderDisks();showWindow(currentWindow)}
function reset(){state=clone(baseline)||{};normalize();refs.notification.classList.remove("show");refs.boundary.classList.remove("show");document.querySelectorAll(".window.maximized").forEach(e=>e.classList.remove("maximized"));renderAll()}
function expandVars(s){return String(s??"").replace(/\$\?/g,String(lastExit)).replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g,(m,a,b)=>String(state.terminal.env[a||b]??""))}
function tokenize(s){const out=[];let buf="",q=null,escp=false;for(const ch of String(s)){if(escp){buf+=ch;escp=false;continue}if(ch==="\\"&&q!=="'"){escp=true;continue}if(q){if(ch===q)q=null;else buf+=ch;continue}if(ch==='"'||ch==="'"){q=ch;continue}if(/\s/.test(ch)){if(buf){out.push(buf);buf=""}}else buf+=ch}if(buf)out.push(buf);return out}
function splitOutside(s,sep){let out=[],buf="",q=null,escp=false;for(let i=0;i<s.length;i++){const ch=s[i];if(escp){buf+=ch;escp=false;continue}if(ch==="\\"&&q!=="'"){buf+=ch;escp=true;continue}if(q){if(ch===q)q=null;buf+=ch;continue}if(ch==='"'||ch==="'"){q=ch;buf+=ch;continue}if(s.startsWith(sep,i)){out.push(buf);buf="";i+=sep.length-1}else buf+=ch}out.push(buf);return out}
function splitChain(s){let out=[],buf="",q=null;for(let i=0;i<s.length;i++){const ch=s[i];if(q){if(ch===q)q=null;buf+=ch;continue}if(ch==='"'||ch==="'"){q=ch;buf+=ch;continue}let op=null;if(s.startsWith("&&",i))op="&&";else if(s.startsWith("||",i))op="||";else if(ch===";")op=";";if(op){out.push({text:buf,op});buf="";i+=op.length-1}else buf+=ch}out.push({text:buf,op:null});return out}
function parseRedirection(s){let q=null;for(let i=0;i<s.length;i++){const ch=s[i];if(q){if(ch===q)q=null;continue}if(ch==='"'||ch==="'"){q=ch;continue}if(s.startsWith(">>",i))return {cmd:s.slice(0,i).trim(),mode:"append",file:s.slice(i+2).trim()};if(ch===">")return {cmd:s.slice(0,i).trim(),mode:"write",file:s.slice(i+1).trim()};if(ch==="<")return {cmd:s.slice(0,i).trim(),mode:"input",file:s.slice(i+1).trim()}}return {cmd:s.trim(),mode:null,file:null}}
function globToRegex(pat){return new RegExp("^"+String(pat).replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".")+"$")}
function shellFormatLs(items,long=false,all=false){const arr=items.filter(x=>all||!x.name.startsWith("."));if(!long)return arr.map(x=>x.name+(x.type==="dir"?"/":"")).join("  ");return arr.map(x=>`${x.permissions|| (x.type==="dir"?"drwxr-xr-x":"-rw-r--r--")} 1 ${x.owner||state.user} ${x.owner||state.user} ${(x.size||"0 B").padStart(7," ")} Sep 22 11:00 ${x.name}`).join("\n")}
function knownExecutable(name){const map={java:(state.terminal.env.JAVA_HOME||"")+"/bin/java",javac:(state.terminal.env.JAVA_HOME||"")+"/bin/javac",mvn:(state.terminal.env.MAVEN_HOME||"")+"/bin/mvn",git:"/usr/bin/git",docker:"/usr/bin/docker",kubectl:"/usr/local/bin/kubectl",bash:"/usr/bin/bash",sh:"/usr/bin/sh",curl:"/usr/bin/curl",grep:"/usr/bin/grep"};return map[name]||null}
function processOutput(){return state.processes.map(p=>`${String(p.pid).padStart(6)} ${(p.user||state.user).padEnd(10)} ${String(p.cpu??0).padStart(4)} ${String(p.memory||"0M").padStart(8)} ${p.name}`).join("\n")}
function serviceByName(n){return state.services.find(s=>s.name===n)}function packageByName(n){return state.packages.find(p=>p.name===n)}function processByPid(pid){return state.processes.find(p=>String(p.pid)===String(pid))}
function addLog(unit,message,level="info"){state.logs.push({id:"log-"+(state.logs.length+1),time:nowTime(),level,unit,message})}
function startProcess(name,command){activeProcess={name,command};renderTerminal()}
function stopProcess(message="^C"){if(activeProcess){terminalEntry("",message,130,"");activeProcess=null;lastExit=130;renderTerminal()}}
function executeScript(path){const n=nodeAt(path);if(!n||n.type!=="file")return {code:127,out:`bash: ${path}: No such file or directory`};if(!(n.permissions||"").includes("x"))return {code:126,out:`bash: ${path}: Permission denied`};let outputs=[],code=0;for(const line of String(n.content||"").split(/\r?\n/)){const s=line.trim();if(!s||s.startsWith("#"))continue;const r=executeLine(s,true);code=r.code;if(r.out)outputs.push(r.out);if(code!==0)break}return {code,out:outputs.join("\n")}}
function executeSingle(raw,stdin=""){
  let s=String(raw||"").trim();if(!s)return {code:0,out:""};
  const aliasName=(s.match(/^([^\s]+)/)||[])[1];if(aliasName&&state.terminal.aliases[aliasName])s=state.terminal.aliases[aliasName]+s.slice(aliasName.length);
  s=expandVars(s);if(s.startsWith("~"))s=state.home+s.slice(1);
  const red=parseRedirection(s);s=red.cmd;let args=tokenize(s);let cmd=args.shift()||"";let stdinData=stdin;
  if(red.mode==="input"){const n=nodeAt(red.file);stdinData=n?.content||""}
  if(cmd==="sudo"){if(args[0]==="-u"){args.shift();args.shift()}cmd=args.shift()||""}
  if(/^[A-Za-z_][A-Za-z0-9_]*=.*/.test(cmd)&&!args.length){const i=cmd.indexOf("=");state.terminal.env[cmd.slice(0,i)]=cmd.slice(i+1);return {code:0,out:""}}
  let result={code:0,out:""};
  if(cmd==="cd"){let target=args[0]||state.home;if(target==="-"){target=previousPath;result.out=target}if(!setCwd(target))result={code:1,out:`bash: cd: ${target}: No such file or directory`}}
  else if(cmd==="pwd")result={code:0,out:currentPath};
  else if(cmd==="ls"){const long=args.some(a=>a.includes("l")),all=args.some(a=>a.includes("a"));const paths=args.filter(a=>!a.startsWith("-"));const target=normalizePath(paths[0]||currentPath);if(!isDir(target))result={code:2,out:`ls: cannot access '${paths[0]||target}': No such file or directory`};else result={code:0,out:shellFormatLs(children(target,true),long,all)}}
  else if(cmd==="tree"){const root=normalizePath(args.find(a=>!a.startsWith("-"))||currentPath),lines=[root];const walk=(p,prefix,depth)=>{if(depth>4)return;const kids=children(p,true);kids.forEach((n,i)=>{const last=i===kids.length-1;lines.push(prefix+(last?"└── ":"├── ")+n.name);if(n.type==="dir")walk(n.path,prefix+(last?"    ":"│   "),depth+1)})};if(isDir(root))walk(root,"",0);else return {code:1,out:`tree: ${root}: No such directory`};result={code:0,out:lines.join("\n")}}
  else if(cmd==="mkdir"){const vals=args.filter(a=>!a.startsWith("-"));if(!vals.length)result={code:1,out:"mkdir: missing operand"};else vals.forEach(p=>ensureDir(p))}
  else if(cmd==="touch"){const vals=args.filter(a=>!a.startsWith("-"));if(!vals.length)result={code:1,out:"touch: missing file operand"};else vals.forEach(p=>{const n=nodeAt(p);if(!n)putFile(p,"")})}
  else if(cmd==="cp"){const vals=args.filter(a=>!a.startsWith("-"));if(vals.length<2)result={code:1,out:"cp: missing file operand"};else if(!copyPath(vals[0],vals[1]))result={code:1,out:`cp: cannot stat '${vals[0]}': No such file or directory`}}
  else if(cmd==="mv"){const vals=args.filter(a=>!a.startsWith("-"));if(vals.length<2)result={code:1,out:"mv: missing file operand"};else if(!renamePath(vals[0],isDir(vals[1])?normalizePath(vals[1]+"/"+baseName(vals[0])):vals[1]))result={code:1,out:`mv: cannot stat '${vals[0]}': No such file or directory`}}
  else if(cmd==="rm"){const vals=args.filter(a=>!a.startsWith("-"));const recursive=args.some(a=>a.includes("r")||a.includes("R"));for(const p of vals){const n=nodeAt(p);if(!n){if(!args.some(a=>a.includes("f")))result={code:1,out:`rm: cannot remove '${p}': No such file or directory`}}else if(n.type==="dir"&&!recursive)result={code:1,out:`rm: cannot remove '${p}': Is a directory`};else deletePath(p)}}
  else if(cmd==="cat"){const vals=args.filter(a=>!a.startsWith("-"));if(!vals.length)result={code:0,out:stdinData};else{const outs=[];for(const p of vals){const n=nodeAt(p);if(!n||n.type!=="file")return {code:1,out:`cat: ${p}: No such file or directory`};outs.push(n.content||"")}result={code:0,out:outs.join("\n")}}}
  else if(cmd==="head"||cmd==="tail"){const nIdx=args.indexOf("-n"),count=nIdx>=0?Number(args[nIdx+1]||10):10,file=args.filter((a,i)=>!a.startsWith("-")&&i!==nIdx+1).at(-1);const src=file?(nodeAt(file)?.content):stdinData;if(src===undefined)result={code:1,out:`${cmd}: cannot open '${file}'`};else{const lines=String(src).split(/\r?\n/);result={code:0,out:(cmd==="head"?lines.slice(0,count):lines.slice(-count)).join("\n")};if(cmd==="tail"&&args.includes("-f")){startProcess("tail -f",s);result.out+=(result.out?"\n":"")+"-- following file; Ctrl+C to stop --"}}}
  else if(cmd==="grep"){const insensitive=args.includes("-i"),numbered=args.includes("-n"),vals=args.filter(a=>!a.startsWith("-")),pattern=vals.shift()||"",file=vals.shift(),src=file?(nodeAt(file)?.content??""):stdinData;const re=new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),insensitive?"i":"");const lines=String(src).split(/\r?\n/);const hits=lines.map((x,i)=>({x,i})).filter(o=>re.test(o.x));result={code:hits.length?0:1,out:hits.map(o=>(numbered?(o.i+1)+":":"")+o.x).join("\n")}}
  else if(cmd==="find"){const root=normalizePath(args[0]&&!args[0].startsWith("-")?args[0]:currentPath),ni=args.indexOf("-name"),pat=ni>=0?args[ni+1]:"*",re=globToRegex(pat||"*");result={code:0,out:Object.keys(state.files).filter(p=>(p===root||p.startsWith(root+"/"))&&re.test(baseName(p))).join("\n")}}
  else if(cmd==="echo"){const noNewline=args[0]==="-n";if(noNewline)args.shift();result={code:0,out:args.join(" ")}}
  else if(cmd==="printf")result={code:0,out:(args.shift()||"").replace(/\\n/g,"\n").replace(/%s/g,()=>String(args.shift()??""))};
  else if(cmd==="clear")result={code:0,out:"",clear:true};
  else if(cmd==="history")result={code:0,out:state.terminal.commandHistory.map((x,i)=>`${String(i+1).padStart(4)}  ${x}`).join("\n")};
  else if(cmd==="whoami")result={code:0,out:state.user};
  else if(cmd==="id")result={code:0,out:`uid=${state.user==="root"?0:1000}(${state.user}) gid=${state.user==="root"?0:1000}(${state.user}) groups=${state.user==="root"?0:1000}(${state.user}),27(sudo),999(docker)`};
  else if(cmd==="hostname"){if(args.length)state.hostname=args[0];result={code:0,out:args.length?"":state.hostname}}
  else if(cmd==="uname")result={code:0,out:args.includes("-a")?`Linux ${state.hostname} 6.8.0-85-generic #85-Ubuntu SMP x86_64 GNU/Linux`:"Linux"};
  else if(cmd==="date")result={code:0,out:"Tue Sep 22 11:00:00 CDT 2026"};
  else if(cmd==="env"||cmd==="printenv")result={code:0,out:Object.entries(state.terminal.env).sort().map(([k,v])=>`${k}=${v}`).join("\n")};
  else if(cmd==="export"){for(const a of args){const i=a.indexOf("=");if(i>0)state.terminal.env[a.slice(0,i)]=a.slice(i+1)}result={code:0,out:""}}
  else if(cmd==="unset"){args.forEach(k=>delete state.terminal.env[k]);result={code:0,out:""}}
  else if(cmd==="alias"){if(!args.length)result={code:0,out:Object.entries(state.terminal.aliases).map(([k,v])=>`alias ${k}='${v}'`).join("\n")};else{const joined=args.join(" "),i=joined.indexOf("=");if(i>0)state.terminal.aliases[joined.slice(0,i)]=joined.slice(i+1).replace(/^['\"]|['\"]$/g,"");result={code:0,out:""}}}
  else if(cmd==="chmod"){const mode=args[0],p=normalizePath(args[1]||"");const n=nodeAt(p);if(!n)result={code:1,out:`chmod: cannot access '${args[1]||""}': No such file or directory`};else{if(/^\+x$/.test(mode))n.permissions=(n.permissions||"-rw-r--r--").replace(/^(.{3})/,m=>m.slice(0,3)+"x").slice(0,10);else if(/^\d{3,4}$/.test(mode)){const oct=mode.slice(-3),map={0:"---",1:"--x",2:"-w-",3:"-wx",4:"r--",5:"r-x",6:"rw-",7:"rwx"};n.permissions=(n.type==="dir"?"d":"-")+oct.split("").map(x=>map[x]||"---").join("")}result={code:0,out:""}}}
  else if(cmd==="chown"){const owner=args[0],p=normalizePath(args[1]||"");const n=nodeAt(p);if(!n)result={code:1,out:`chown: cannot access '${args[1]||""}': No such file or directory`};else{n.owner=owner.split(":")[0];result={code:0,out:""}}}
  else if(cmd==="ln"&&args.includes("-s")){const vals=args.filter(a=>a!=="-s");if(vals.length<2)result={code:1,out:"ln: missing file operand"};else{const p=normalizePath(vals[1]);ensureDir(parentPath(p));state.files[p]={type:"link",target:normalizePath(vals[0]),owner:state.user,permissions:"lrwxrwxrwx",size:"0 B"}}}
  else if(cmd==="which"||(cmd==="command"&&args[0]==="-v")){const name=cmd==="which"?args[0]:args[1],p=knownExecutable(name);result=p?{code:0,out:p}:{code:1,out:""}}
  else if(cmd==="ps"){result={code:0,out:(args.includes("aux")?"USER       PID %CPU   MEM COMMAND\n":"  PID TTY          TIME CMD\n")+processOutput()}}
  else if(cmd==="top"||cmd==="htop")result={code:0,out:`top - 11:00:00 up 2 days,  1 user,  load average: 0.12, 0.18, 0.20\nTasks: ${state.processes.length} total, 1 running\n%Cpu(s):  2.1 us,  0.7 sy, 97.2 id\nMiB Mem :  15920 total,  4830 used,  7800 free\n\n${processOutput()}`};
  else if(cmd==="kill"){const pid=args.filter(a=>!a.startsWith("-"))[0],before=state.processes.length;state.processes=state.processes.filter(p=>String(p.pid)!==String(pid));result={code:before===state.processes.length?1:0,out:before===state.processes.length?`bash: kill: (${pid}) - No such process`:""}}
  else if(cmd==="jobs")result={code:0,out:activeProcess?`[1]+  Running                 ${activeProcess.command} &`:""};
  else if(cmd==="fg"||cmd==="bg")result={code:activeProcess?0:1,out:activeProcess?activeProcess.command:`bash: ${cmd}: current: no such job`};
  else if(cmd==="systemctl"){const action=args[0]||"status",name=args[1]||"",unit=serviceByName(name)||serviceByName(name.replace(/\.service$/,""));if(action==="status"){if(!unit)result={code:4,out:`Unit ${name}.service could not be found.`};else result={code:unit.status==="active"?0:3,out:`● ${unit.name} - ${unit.description||unit.name}\n   Loaded: loaded (/etc/systemd/system/${unit.name}; ${unit.enabled?"enabled":"disabled"})\n   Active: ${unit.status||"inactive"} since Tue 2026-09-22 10:00:00 CDT`}}else if(["start","stop","restart"].includes(action)){let u=unit;if(!u){u={name,description:name,status:"inactive",enabled:false};state.services.push(u)}u.status=action==="stop"?"inactive":"active";addLog(name,`Service ${action} requested`,"info");result={code:0,out:""}}else if(action==="enable"||action==="disable"){let u=unit;if(!u){u={name,description:name,status:"inactive"};state.services.push(u)}u.enabled=action==="enable";result={code:0,out:action==="enable"?`Created symlink /etc/systemd/system/multi-user.target.wants/${name}.service → /etc/systemd/system/${name}.service.`:"Removed symlink."}}}
  else if(cmd==="journalctl"){const ui=args.indexOf("-u"),unit=ui>=0?args[ui+1]:null,nIdx=args.indexOf("-n"),count=nIdx>=0?Number(args[nIdx+1]||10):20;let logs=state.logs.filter(l=>!unit||l.unit===unit||l.unit===unit?.replace(/\.service$/,""));logs=logs.slice(-count);result={code:0,out:logs.map(l=>`${l.time||"Sep 22 11:00:00"} ${state.hostname} ${l.unit||"system"}: ${l.message||l.text||""}`).join("\n")};if(args.includes("-f")){startProcess("journalctl -f",s);result.out+=(result.out?"\n":"")+"-- Logs begin at Tue 2026-09-22; following --"}}
  else if(cmd==="apt"||cmd==="apt-get"){const action=args[0]||"";if(action==="update")result={code:0,out:"Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease\nGet:2 http://security.ubuntu.com/ubuntu noble-security InRelease\nReading package lists... Done\nBuilding dependency tree... Done"};else if(action==="install"){const names=args.slice(1).filter(a=>!a.startsWith("-"));names.forEach(name=>{let p=packageByName(name);if(!p){p={name,version:"1.0",repository:"ubuntu"};state.packages.push(p)}p.status="installed"});result={code:0,out:`Reading package lists... Done\nSetting up ${names.join(" ")} ...\nProcessing triggers ...`}}else if(action==="remove"){const names=args.slice(1).filter(a=>!a.startsWith("-"));names.forEach(name=>{let p=packageByName(name);if(p)p.status="removed"});result={code:0,out:`Removing ${names.join(" ")} ...`}}else if(action==="upgrade")result={code:0,out:"Calculating upgrade... Done\n0 upgraded, 0 newly installed, 0 to remove."};else result={code:0,out:"apt 2.7.14 (amd64)"}}
  else if(cmd==="dpkg"&&args.includes("-l"))result={code:0,out:state.packages.filter(p=>p.status==="installed").map(p=>`ii  ${p.name.padEnd(22)} ${p.version||"1.0"} amd64`).join("\n")};
  else if(cmd==="df"){result={code:0,out:"Filesystem      Size  Used Avail Use% Mounted on\n"+state.disks.map(d=>`${String(d.device).padEnd(15)} ${String(d.size||"80G").padStart(5)} ${String(d.used||"22G").padStart(5)} ${String(d.available||"54G").padStart(5)} ${String(d.percent||d.usePercent||"28%").padStart(4)} ${d.mount||d.mountPoint||"/"}`).join("\n")}}
  else if(cmd==="du"){const p=normalizePath(args.filter(a=>!a.startsWith("-"))[0]||currentPath);const count=Object.keys(state.files).filter(x=>x===p||x.startsWith(p+"/")).length;result={code:0,out:`${Math.max(4,count*4)}K\t${p}`}}
  else if(cmd==="free")result={code:0,out:"               total        used        free      shared  buff/cache   available\nMem:            15Gi       4.7Gi       7.6Gi       512Mi       2.7Gi        10Gi\nSwap:          2.0Gi          0B       2.0Gi"};
  else if(cmd==="ip"){if(args[0]==="addr"||args[0]==="a")result={code:0,out:state.network.interfaces.map((n,i)=>`${i+1}: ${n.name}: <BROADCAST,MULTICAST,UP> state ${(n.state||"up").toUpperCase()}\n    inet ${n.address||n.ip||"192.168.1.20/24"}`).join("\n")};else if(args[0]==="route"||args[0]==="r")result={code:0,out:state.network.routes.map(r=>`${r.destination||"default"} via ${r.gateway||"192.168.1.1"} dev ${r.dev||"eth0"}`).join("\n")}}
  else if(cmd==="ss"||cmd==="netstat")result={code:0,out:"Netid State  Local Address:Port  Peer Address:Port  Process\n"+state.network.sockets.map(s=>`${(s.protocol||s.proto||"tcp").padEnd(5)} ${(s.state||"LISTEN").padEnd(6)} ${(s.local||"0.0.0.0:8080").padEnd(22)} ${(s.remote||"0.0.0.0:*").padEnd(20)} ${s.process||""}`).join("\n")};
  else if(cmd==="ping"){const host=args.filter(a=>!a.startsWith("-"))[0]||"localhost",ci=args.indexOf("-c"),count=ci>=0?Number(args[ci+1]||4):4;result={code:0,out:`PING ${host} (${host==="localhost"?"127.0.0.1":"142.250.72.14"}) 56(84) bytes of data.\n`+Array.from({length:Math.min(count,6)},(_,i)=>`64 bytes from ${host}: icmp_seq=${i+1} ttl=117 time=${(12.1+i/10).toFixed(1)} ms`).join("\n")+`\n--- ${host} ping statistics ---\n${count} packets transmitted, ${count} received, 0% packet loss`};if(ci<0)startProcess("ping "+host,s)}
  else if(cmd==="curl"){const url=args.find(a=>/^https?:\/\//.test(a))||"http://localhost:8080";result={code:0,out:url.includes("localhost:8080")?'{"status":"UP","application":"java-practice"}':"HTTP/2 200\ncontent-type: application/json\n\n{\"ok\":true}"}}
  else if(cmd==="wget"){const url=args.find(a=>/^https?:\/\//.test(a));if(!url)result={code:1,out:"wget: missing URL"};else{const name=url.split("/").pop()||"index.html";putFile(name,"Downloaded from "+url);result={code:0,out:`--2026-09-22--  ${url}\nSaving to: '${name}'\n${name} 100%[==================>] 1.2K --.-KB/s in 0s`}}}
  else if(cmd==="ssh"){const target=args.find(a=>!a.startsWith("-"));if(!target)result={code:255,out:"usage: ssh user@hostname"};else{remoteStack.push({user:state.user,hostname:state.hostname,home:state.home,path:currentPath});const [u,h]=target.includes("@")?target.split("@"): [state.user,target];state.user=u;state.hostname=h;state.home="/home/"+u;ensureDir(state.home,u);setCwd(state.home);result={code:0,out:`Welcome to Ubuntu 24.04 LTS (${h})`}}}
  else if(cmd==="scp"){result={code:0,out:"100%  1.2KB  1.2MB/s   00:00"}}
  else if(cmd==="exit"){if(remoteStack.length){const r=remoteStack.pop();state.user=r.user;state.hostname=r.hostname;state.home=r.home;setCwd(r.path);result={code:0,out:"Connection closed."}}else result={code:0,out:"logout"}}
  else if(cmd==="java"&&args.includes("-version"))result={code:0,out:'openjdk version "21.0.5" 2026-10-15 LTS\nOpenJDK Runtime Environment (build 21.0.5+11-LTS)\nOpenJDK 64-Bit Server VM (build 21.0.5+11-LTS, mixed mode, sharing)'};
  else if(cmd==="javac"&&args.includes("-version"))result={code:0,out:"javac 21.0.5"};
  else if(cmd==="mvn"||cmd==="mvnw"||cmd==="./mvnw"){if(args.includes("-v")||args.includes("--version"))result={code:0,out:`Apache Maven 3.9.9\nMaven home: ${state.terminal.env.MAVEN_HOME}\nJava version: 21.0.5`};else if(args.some(a=>a.includes("spring-boot:run"))){startProcess("Spring Boot :8080",s);state.processes.push({pid:4821,name:"java -jar java-practice",user:state.user,cpu:2.4,memory:"286M"});state.network.sockets.push({protocol:"tcp",state:"LISTEN",local:"0.0.0.0:8080",remote:"0.0.0.0:*",process:"java/4821"});addLog("java-practice.service","Started JavaPracticeApplication");result={code:0,out:"[INFO] Scanning for projects...\n[INFO] --- spring-boot:run ---\nStarted JavaPracticeApplication in 2.341 seconds\nTomcat started on port 8080 (http)"}}else result={code:0,out:`[INFO] Scanning for projects...\n[INFO] --- ${args.join(" ")||"package"} ---\n[INFO] BUILD SUCCESS\n[INFO] Total time:  1.842 s`}}
  else if(cmd==="gradle"||cmd==="./gradlew")result={code:0,out:"> Task :compileJava\n> Task :test\nBUILD SUCCESSFUL in 2s"};
  else if(cmd==="git"){if(args[0]==="status")result={code:0,out:"On branch main\nnothing to commit, working tree clean"};else if(args[0]==="branch"&&args.includes("--show-current"))result={code:0,out:"main"};else if(args[0]==="log")result={code:0,out:"a1b2c3d (HEAD -> main) Java Practice updates\n7f8e9d0 Initial commit"};else if(args[0]==="diff")result={code:0,out:""};else result={code:0,out:args[0]==="commit"?'[main a1b2c3d] Update Java Practice':args[0]==="push"?"Everything up-to-date":""}}
  else if(cmd==="docker"){if(args.includes("--version"))result={code:0,out:"Docker version 28.4.0, build simulated"};else if(args[0]==="ps")result={code:0,out:"CONTAINER ID   IMAGE         STATUS         PORTS\n6ba1c12f9a21   postgres:17   Up 2 minutes   0.0.0.0:5432->5432/tcp"};else result={code:0,out:"Docker command completed successfully."}}
  else if(cmd==="kubectl"){if(args[0]==="get"&&args[1]==="pods")result={code:0,out:"NAME                              READY   STATUS    RESTARTS   AGE\njava-practice-7d9d6f4b8c-zp7x2    1/1     Running   0          5m"};else if(args[0]==="get"&&args[1]==="svc")result={code:0,out:"NAME            TYPE        CLUSTER-IP      PORT(S)\njava-practice   ClusterIP   10.96.120.10    8080/TCP"};else result={code:0,out:"kubectl command simulated successfully"}}
  else if((cmd.startsWith("./")||cmd.endsWith(".sh"))&&nodeAt(cmd)){result=executeScript(cmd)}
  else result={code:127,out:`bash: ${cmd}: command not found`};
  if(red.mode==="write"||red.mode==="append"){const p=normalizePath(red.file),old=nodeAt(p)?.content||"",text=result.out||"";putFile(p,red.mode==="append"?old+(old?"\n":"")+text:text);result={...result,out:""}}
  return result;
}
function executePipeline(segment){const parts=splitOutside(segment,"|").map(x=>x.trim()).filter(Boolean);let stdin="",last={code:0,out:""};for(const p of parts){last=executeSingle(p,stdin);stdin=last.out||""}return last}
function executeLine(line,scriptMode=false){const chain=splitChain(line);let last={code:0,out:""},previousOp=null,outs=[];for(const part of chain){const text=part.text.trim();if(text){const should=previousOp==="&&"?last.code===0:previousOp==="||"?last.code!==0:true;if(should){last=executePipeline(text);if(last.clear){if(!scriptMode)state.terminal.history=[]}if(last.out)outs.push(last.out)}}previousOp=part.op}return {code:last.code,out:outs.join("\n"),clear:last.clear}}
async function executeManual(command){const cmd=String(command||"");const p=prompt();if(cmd.trim()){state.terminal.commandHistory.push(cmd);historyIndex=state.terminal.commandHistory.length}const result=executeLine(cmd);if(result.clear)state.terminal.history=[];terminalEntry(cmd,result.out,result.code,p);inputDraft="";renderAll();showWindow("terminal");focusInput()}
function wireInput(input){
  input.oninput=()=>inputDraft=input.value;
  input.onkeydown=e=>{
    if(e.key==="Enter"){e.preventDefault();executeManual(input.value);return}
    if(e.key==="ArrowUp"){e.preventDefault();const h=state.terminal.commandHistory;if(h.length){historyIndex=Math.max(0,historyIndex-1);input.value=h[historyIndex]||"";inputDraft=input.value;queueMicrotask(()=>input.setSelectionRange(input.value.length,input.value.length))}return}
    if(e.key==="ArrowDown"){e.preventDefault();const h=state.terminal.commandHistory;if(h.length){historyIndex=Math.min(h.length,historyIndex+1);input.value=historyIndex===h.length?"":h[historyIndex]||"";inputDraft=input.value;queueMicrotask(()=>input.setSelectionRange(input.value.length,input.value.length))}return}
    if((e.key==="ArrowLeft"||e.key==="ArrowRight")&&!input.value){e.preventDefault();parent.postMessage({type:"SIM_NAVIGATE",app:APP_ID,direction:e.key==="ArrowRight"?"next":"prev"},"*");return}
    if(e.key==="Tab"){e.preventDefault();autocomplete(input);return}
    if(e.ctrlKey&&e.key.toLowerCase()==="c"){e.preventDefault();if(activeProcess)stopProcess("^C");else{terminalEntry("","^C",130,"");inputDraft="";renderTerminal();focusInput()}return}
    if(e.ctrlKey&&e.key.toLowerCase()==="l"){e.preventDefault();state.terminal.history=[];inputDraft="";renderTerminal();focusInput();return}
    if(e.ctrlKey&&e.key.toLowerCase()==="z"&&activeProcess){e.preventDefault();terminalEntry("",`[1]+  Stopped                 ${activeProcess.command}`,148,"");activeProcess.stopped=true;renderTerminal();return}
  }
}
function autocomplete(input){const pos=input.selectionStart??input.value.length,before=input.value.slice(0,pos),m=before.match(/(?:^|\s)([^\s]*)$/);if(!m)return;let token=m[1]||"",dir=currentPath,prefix=token;if(token.includes("/")){const idx=token.lastIndexOf("/");dir=normalizePath(token.slice(0,idx)||"/");prefix=token.slice(idx+1)}const hits=children(dir,true).filter(n=>n.name.startsWith(prefix));if(!hits.length)return;const replacement=(token.includes("/")?token.slice(0,token.lastIndexOf("/")+1):"")+hits[0].name+(hits[0].type==="dir"?"/":"");input.value=before.slice(0,before.length-token.length)+replacement+input.value.slice(pos);inputDraft=input.value;const n=before.length-token.length+replacement.length;input.setSelectionRange(n,n)}
function targetEl(t){if(!t)return null;if(typeof t==="string"){const ids={terminal:refs.terminalWin,files:refs.filesWin,editor:refs.editorWin,monitor:refs.monitorWin,services:refs.serviceWin,packages:refs.packagesWin,network:refs.networkWin,logs:refs.logsWin,disks:refs.disksWin,terminalDock:refs.termDock,filesDock:refs.filesDock,monitorDock:refs.monitorDock,servicesDock:refs.servicesDock,packagesDock:refs.packagesDock,networkDock:refs.networkDock,logsDock:refs.logsDock,disksDock:refs.disksDock,command:"cmdInput"};if(t==="latestCommand"){const commands=refs.terminal.querySelectorAll(".historyCommand[data-history]");return commands[commands.length-1]?.closest(".terminalHistoryRow")||commands[commands.length-1]||null}if(ids[t])return typeof ids[t]==="string"?$(ids[t]):ids[t];const f=refs.fileList.querySelector('[data-file="'+CSS.escape(t)+'"]');if(f)return f}if(t.type==="file")return refs.fileList.querySelector('[data-file="'+CSS.escape(t.path)+'"]');if(t.type==="service")return refs.services.querySelector('[data-service="'+CSS.escape(t.name)+'"]');if(t.type==="process")return refs.processes.querySelector('[data-pid="'+CSS.escape(String(t.pid))+'"]');if(t.type==="package")return refs.packages.querySelector('[data-package="'+CSS.escape(t.name)+'"]');if(t.type==="interface")return refs.network.querySelector('[data-interface="'+CSS.escape(t.name)+'"]');if(t.type==="disk")return refs.disks.querySelector('[data-disk="'+CSS.escape(t.device)+'"]');if(t.type==="log")return refs.logRows.querySelector('[data-log="'+CSS.escape(String(t.id))+'"]');return null}
async function highlightTarget(t,token){if(!allowBoundary)return;const el=targetEl(t);if(!el)return;document.querySelectorAll(".sim-emphasis").forEach(n=>n.classList.remove("sim-emphasis"));el.classList.add("sim-emphasis");await sleep(260);if(token!==seekToken)return}
async function typeCommand(text,animate,token){showWindow("terminal");inputDraft="";renderTerminal();const el=$("cmdInput");if(!el)return;if(!animate){el.value=text;inputDraft=text;return}const chars=String(text),steps=Math.min(chars.length,70),duration=Math.min(1000,Math.max(220,chars.length*28));for(let i=1;i<=steps;i++){if(token!==seekToken)return;el.value=chars.slice(0,Math.floor(chars.length*i/steps));inputDraft=el.value;await sleep(duration/steps)}}
function showAssistant(m){refs.assistantTitle.textContent=m.title||"Current Step";refs.assistantMeta.textContent=`Step ${m.step||""} · ${m.stage||""} · ${m.language||"Telugu (Romanized)"}`;refs.assistantText.textContent=m.text||"";refs.assistant.classList.remove("minimized");refs.assistant.classList.add("show")}
async function apply(st,animate,token){if(token!==seekToken)return;refs.notification.classList.remove("show");const d=st.data||{};switch(st.action){
  case "openTerminal":showWindow("terminal");renderTerminal();if(d.boundary||d.cursor)await highlightTarget("terminal",token);break;
  case "typeCommand":await typeCommand(String(d.command??d.text??""),animate&&autoType,token);if(d.boundary!==false)await highlightTarget("command",token);break;
  case "runCommand":case "executeCommand":{const cmd=String(d.command??"");if(cmd)await typeCommand(cmd,animate&&autoType,token);const p=prompt();let result;if(d.output!==undefined&&st.action==="runCommand")result={code:Number(d.errorLevel??(d.error?1:0)),out:String(d.output??"")};else result=executeLine(cmd);if(result.clear)state.terminal.history=[];terminalEntry(cmd,result.out,result.code,p);inputDraft="";renderAll();showWindow("terminal");if(d.boundary!==false)await highlightTarget("latestCommand",token);break}
  case "appendTerminal":terminalEntry("",String(d.text??""),0,"");showWindow("terminal");renderTerminal();break;
  case "clearTerminal":state.terminal.history=[];showWindow("terminal");renderTerminal();break;
  case "setTerminalPrompt":state.terminal.prompt=String(d.prompt??"");renderTerminal();break;
  case "openFiles":if(d.path&&isDir(d.path))setCwd(d.path);showWindow("files");renderFiles();if(d.boundary||d.cursor)await highlightTarget("files",token);break;
  case "openFile":currentFile=normalizePath(d.path);if(state.files[currentFile]){renderEditor();showWindow("editor")}break;
  case "setFileContent":putFile(d.path,String(d.content??""));currentFile=normalizePath(d.path);renderFiles();renderEditor();break;
  case "createFile":putFile(d.path,String(d.content??""),d.owner||state.user);Object.assign(state.files[normalizePath(d.path)],{permissions:d.permissions||d.mode||"-rw-r--r--",size:d.size||state.files[normalizePath(d.path)].size});currentPath=parentPath(d.path);renderFiles();if(d.open){currentFile=normalizePath(d.path);renderEditor();showWindow("editor")}break;
  case "createDirectory":ensureDir(d.path,d.owner||state.user);if(state.files[normalizePath(d.path)])Object.assign(state.files[normalizePath(d.path)],{permissions:d.permissions||d.mode||"drwxr-xr-x",size:d.size||"4.0 KB"});renderFiles();break;
  case "setFilePermissions":if(nodeAt(d.path))nodeAt(d.path).permissions=d.permissions||d.mode||"";renderFiles();break;
  case "setFileOwner":if(nodeAt(d.path))nodeAt(d.path).owner=d.owner||"";renderFiles();break;
  case "renamePath":renamePath(d.from||d.path,d.to||d.newPath);renderFiles();renderEditor();break;
  case "deletePath":deletePath(d.path);renderFiles();renderEditor();break;
  case "openProcesses":showWindow("monitor");renderProcesses();if(d.boundary||d.cursor)await highlightTarget("monitor",token);break;
  case "setProcesses":state.processes=clone(d.processes||[]);showWindow("monitor");renderProcesses();break;
  case "updateProcess":{let p=processByPid(d.pid);if(!p){p={pid:d.pid,name:d.name||"process"};state.processes.push(p)}Object.assign(p,clone(d.changes||d.process||d));renderProcesses();break}
  case "removeProcess":state.processes=state.processes.filter(p=>String(p.pid)!==String(d.pid));renderProcesses();break;
  case "highlightProcess":showWindow("monitor");renderProcesses();await highlightTarget({type:"process",pid:d.pid},token);break;
  case "openServices":showWindow("services");renderServices();if(d.boundary||d.cursor)await highlightTarget("services",token);break;
  case "setService":{let s=serviceByName(d.name);if(!s){s={name:d.name};state.services.push(s)}if(d.status!==undefined)s.status=d.status;if(d.enabled!==undefined)s.enabled=d.enabled;if(d.description!==undefined)s.description=d.description;showWindow("services");renderServices();break}
  case "removeService":state.services=state.services.filter(s=>s.name!==d.name);renderServices();break;
  case "highlightService":showWindow("services");renderServices();await highlightTarget({type:"service",name:d.name},token);break;
  case "openPackages":showWindow("packages");renderPackages();if(d.boundary||d.cursor)await highlightTarget("packages",token);break;
  case "setPackages":state.packages=clone(d.packages||[]);showWindow("packages");renderPackages();break;
  case "installPackage":{let p=packageByName(d.name);if(!p){p={name:d.name};state.packages.push(p)}Object.assign(p,{version:d.version??p.version,status:"installed",repository:d.repository??p.repository});showWindow("packages");renderPackages();break}
  case "removePackage":{let p=packageByName(d.name);if(!p){p={name:d.name};state.packages.push(p)}p.status="removed";showWindow("packages");renderPackages();break}
  case "updatePackage":{let p=packageByName(d.name);if(!p){p={name:d.name};state.packages.push(p)}Object.assign(p,clone(d.changes||d.package||{}));if(d.version!==undefined)p.version=d.version;if(d.status!==undefined)p.status=d.status;showWindow("packages");renderPackages();break}
  case "highlightPackage":showWindow("packages");renderPackages();await highlightTarget({type:"package",name:d.name},token);break;
  case "openNetwork":showWindow("network");renderNetwork();if(d.boundary||d.cursor)await highlightTarget("network",token);break;
  case "setNetwork":state.network=clone(d.network||d);normalize();showWindow("network");renderNetwork();break;
  case "setNetworkInterfaces":state.network.interfaces=clone(d.interfaces||[]);showWindow("network");renderNetwork();break;
  case "setSockets":state.network.sockets=clone(d.sockets||[]);showWindow("network");renderNetwork();break;
  case "highlightInterface":showWindow("network");renderNetwork();await highlightTarget({type:"interface",name:d.name},token);break;
  case "openLogs":showWindow("logs");renderLogs();if(d.boundary||d.cursor)await highlightTarget("logs",token);break;
  case "setLogs":state.logs=clone(d.logs||[]);showWindow("logs");renderLogs();break;
  case "appendLog":state.logs.push(clone(d.log||{id:d.id,time:d.time,level:d.level,unit:d.unit,message:d.message??d.text}));showWindow("logs");renderLogs();break;
  case "filterLogs":logFilterText=String(d.text??"");showWindow("logs");renderLogs();break;
  case "highlightLog":showWindow("logs");renderLogs();await highlightTarget({type:"log",id:d.id},token);break;
  case "openDisks":showWindow("disks");renderDisks();if(d.boundary||d.cursor)await highlightTarget("disks",token);break;
  case "setDisks":state.disks=clone(d.disks||[]);showWindow("disks");renderDisks();break;
  case "highlightDisk":showWindow("disks");renderDisks();await highlightTarget({type:"disk",device:d.device},token);break;
  case "setCwd":if(!isDir(d.path))ensureDir(d.path);setCwd(d.path);renderTerminal();renderFiles();break;
  case "setHostname":state.hostname=String(d.hostname??d.name??state.hostname);renderTerminal();break;
  case "setUser":state.user=String(d.user??state.user);refs.user.textContent=state.user;renderTerminal();break;
  case "setClock":state.clock=String(d.text??d.clock??"");refs.clock.textContent=state.clock||state.distro||"Linux";break;
  case "setEnv":state.terminal.env[d.name]=String(d.value??"");renderTerminal();break;
  case "unsetEnv":delete state.terminal.env[d.name];renderTerminal();break;
  case "startProcess":startProcess(d.name||d.command||"process",d.command||d.name||"");if(d.output)terminalEntry("",d.output,0,"");renderAll();break;
  case "stopProcess":stopProcess(d.output||"^C");renderAll();break;
  case "pressButton":if(d.boundary||d.cursor)await highlightTarget(d.target,token);break;
  case "highlightTarget":await highlightTarget(d.target,token);break;
  case "moveCursor":await highlightTarget(d.target,token);break;
  case "showNotification":refs.notification.textContent=d.text||d.message||"";refs.notification.classList.add("show");break;
}}
async function seek(steps,animateFinal){const token=++seekToken;__clearTargetBoundary();reset();for(let i=0;i<steps.length;i++){allowBoundary=i===steps.length-1;await apply(steps[i],animateFinal&&i===steps.length-1,token);if(token!==seekToken)return}allowBoundary=true;focusInput()}
function loadPackage(p){baseline=clone(p.apps?.linux||{});reset()}
Object.entries(docks).forEach(([name,el])=>{if(el)el.onclick=()=>{__clearTargetBoundary();showWindow(name)}});
refs.backFile.onclick=()=>{__clearTargetBoundary();setCwd(parentPath(currentPath));renderFiles();renderTerminal()};
refs.newFolderBtn.onclick=()=>{const name=prompt("New folder name:","new-folder");if(name){ensureDir(normalizePath(name,currentPath));renderFiles()}};
refs.newFileBtn.onclick=()=>{const name=prompt("New file name:","new-file.txt");if(name){currentFile=putFile(normalizePath(name,currentPath),"");renderFiles();renderEditor();showWindow("editor")}};
refs.editor.addEventListener("input",()=>{if(currentFile&&nodeAt(currentFile)?.type==="file"){nodeAt(currentFile).content=refs.editor.textContent||"";nodeAt(currentFile).size=String(new Blob([nodeAt(currentFile).content]).size)+" B"}});
refs.terminal.addEventListener("pointerdown",e=>{if(e.button===0)setTimeout(focusInput,0)});
document.querySelectorAll(".windowBtns .winBtn").forEach(btn=>btn.addEventListener("click",e=>{__clearTargetBoundary();const win=e.currentTarget.closest(".window"),action=e.currentTarget.dataset.action;if(!win)return;if(action==="maximize")win.classList.toggle("maximized");else if(action==="minimize"||action==="close")win.classList.remove("show")}));
refs.assistantMin.onclick=e=>{e.stopPropagation();refs.assistant.classList.toggle("minimized")};refs.assistantClose.onclick=e=>{e.stopPropagation();refs.assistant.classList.remove("show")};
let assistantDragFrame=0,assistantDragPoint=null;
function finishAssistantDrag(e){
  if(!assistantDrag)return;
  if(assistantDragFrame){cancelAnimationFrame(assistantDragFrame);assistantDragFrame=0}
  assistantDragPoint=null;
  try{if(e&&refs.assistantHead.hasPointerCapture?.(e.pointerId))refs.assistantHead.releasePointerCapture(e.pointerId)}catch(_){}
  assistantDrag=null;
  refs.assistant.classList.remove("dragging");
}
function paintAssistantDrag(){
  assistantDragFrame=0;
  if(!assistantDrag||!assistantDragPoint)return;
  const host=refs.app.getBoundingClientRect(),w=refs.assistant.offsetWidth,h=refs.assistant.offsetHeight;
  const x=Math.max(6,Math.min(host.width-w-6,assistantDragPoint.x-host.left-assistantDrag.dx));
  const y=Math.max(36,Math.min(host.height-h-6,assistantDragPoint.y-host.top-assistantDrag.dy));
  refs.assistant.style.left=x+"px";
  refs.assistant.style.top=y+"px";
  refs.assistant.style.right="auto";
  refs.assistant.style.bottom="auto";
}
refs.assistantHead.addEventListener("pointerdown",e=>{
  if(e.button!==0||e.target.closest("button"))return;
  e.preventDefault();
  const r=refs.assistant.getBoundingClientRect();
  assistantDrag={pointerId:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top};
  assistantDragPoint={x:e.clientX,y:e.clientY};
  refs.assistant.classList.add("dragging");
  refs.assistantHead.setPointerCapture?.(e.pointerId);
});
refs.assistantHead.addEventListener("pointermove",e=>{
  if(!assistantDrag||e.pointerId!==assistantDrag.pointerId)return;
  assistantDragPoint={x:e.clientX,y:e.clientY};
  if(!assistantDragFrame)assistantDragFrame=requestAnimationFrame(paintAssistantDrag);
});
refs.assistantHead.addEventListener("pointerup",finishAssistantDrag);
refs.assistantHead.addEventListener("pointercancel",finishAssistantDrag);
refs.assistantHead.addEventListener("lostpointercapture",finishAssistantDrag);
window.addEventListener("message",e=>{const m=e.data;if(m?.type==="SIM_PACKAGE"){autoType=!!m.autoType;applyTheme(m.theme||"dark");loadPackage(m.package)}else if(m?.type==="SIM_SETTING"&&m.key==="theme")applyTheme(m.value);else if(m?.type==="SIM_SETTING"&&m.key==="autoType")autoType=!!m.value;else if(m?.type==="SIM_SEEK"){autoType=!!m.autoType;seek(Array.isArray(m.steps)?m.steps:[],!!m.animateFinal)}else if(m?.type==="SIM_EXPLAIN")showAssistant(m)});

/* target-boundary hygiene */
let __trackedBoundaryElement=null,__boundaryFrame=0;
function __clearTargetBoundary(){cancelAnimationFrame(__boundaryFrame);__boundaryFrame=0;__trackedBoundaryElement=null;if(refs?.boundary)refs.boundary.classList.remove("show");document.querySelectorAll(".sim-emphasis").forEach(n=>n.classList.remove("sim-emphasis"))}
function __captureBoundaryElement(){if(!refs?.boundary||!refs.boundary.classList.contains("show"))return;const br=refs.boundary.getBoundingClientRect();if(br.width<=0||br.height<=0)return;const cx=Math.max(1,Math.min(innerWidth-2,br.left+br.width/2)),cy=Math.max(1,Math.min(innerHeight-2,br.top+br.height/2));let top=document.elementFromPoint(cx,cy);if(!top)return;__trackedBoundaryElement=top.closest?.("[data-file],[data-service],[data-pid],[data-package],[data-interface],[data-disk],.window,.dockBtn,.cmdInput")||top}
function __syncTargetBoundary(){cancelAnimationFrame(__boundaryFrame);__boundaryFrame=requestAnimationFrame(()=>{const el=__trackedBoundaryElement;if(!el||!allowBoundary||!el.isConnected){__clearTargetBoundary();return}const r=el.getBoundingClientRect(),host=refs.app.getBoundingClientRect(),pad=4;if(r.width<=0||r.height<=0){__clearTargetBoundary();return}refs.boundary.classList.add("show");refs.boundary.style.left=(r.left-host.left-pad)+"px";refs.boundary.style.top=(r.top-host.top-pad)+"px";refs.boundary.style.width=(r.width+pad*2)+"px";refs.boundary.style.height=(r.height+pad*2)+"px"})}
const __originalHighlightTarget=highlightTarget;highlightTarget=async function(...args){__clearTargetBoundary();const result=await __originalHighlightTarget.apply(this,args);if(refs?.boundary?.classList.contains("show")){__captureBoundaryElement();__syncTargetBoundary()}return result};
document.addEventListener("pointerdown",e=>{if(e.isTrusted&&refs?.boundary?.classList.contains("show"))__clearTargetBoundary()},true);document.addEventListener("keydown",e=>{if(e.isTrusted&&refs?.boundary?.classList.contains("show"))__clearTargetBoundary()},true);document.addEventListener("scroll",__syncTargetBoundary,true);window.addEventListener("resize",__syncTargetBoundary);
baseline={};reset();parent.postMessage({type:"ENGINE_READY",app:APP_ID,supportedActions:SUPPORTED_ACTIONS},"*");
})();
