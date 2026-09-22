(() => {
"use strict";
const $=id=>document.getElementById(id);
const refs={window:$("window"),title:$("winTitle"),titlebar:$("titlebar"),wrap:$("terminalWrap"),term:$("terminal"),flash:$("statusFlash"),boundary:$("targetBoundary"),cwdStatus:$("cwdStatus"),errorStatus:$("errorStatus"),processStatus:$("processStatus"),menuPopup:$("menuPopup"),modalShade:$("modalShade"),modalTitle:$("modalTitle"),modalBody:$("modalBody"),modalClose:$("modalClose"),assistant:$("cmdAssistant"),assistantHead:$("assistantHead"),assistantTitle:$("assistantTitle"),assistantMeta:$("assistantMeta"),assistantText:$("assistantText"),assistantMin:$("assistantMin"),assistantClose:$("assistantClose")};
const clone=v=>JSON.parse(JSON.stringify(v??null));
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const APP_ID="cmd";
const SUPPORTED_ACTIONS=["setCwd","runCommand","executeCommand","typeCommand","showOutput","clearTerminal","highlightText","setTitle","setPrompt","pressKey","highlightTarget","moveCursor","setEnv","unsetEnv","createDirectory","createFile","deletePath","setFilesystem","startProcess","stopProcess","showProperties","setErrorLevel","showHelp"];
let pkg=null,data=null,autoType=true,seekToken=0,allowBoundary=true;
let cwd="C:\\",promptSuffix=">",entries=[],env={},persistentEnv={},fs={},history=[],historyIndex=0,errorLevel=0,activeProcess=null,inputDraft="",inputCursor=null;
let trackedBoundary=null,boundaryFrame=0,assistantDrag=null;

function applyTheme(theme){document.body.classList.toggle("theme-dark",theme!=="light")}
function fsKey(path){return normalizePath(path).toLowerCase()}
function stripQuotes(s){s=String(s??"").trim();return s.length>=2&&s[0]==='"'&&s.at(-1)==='"'?s.slice(1,-1):s}
function expandVars(s){return String(s??"").replace(/%%/g,"\u0000").replace(/%([^%]+)%/g,(m,k)=>{const u=k.toUpperCase();if(u==="CD")return cwd;if(u==="ERRORLEVEL")return String(errorLevel);const hit=Object.keys(env).find(x=>x.toUpperCase()===u);return hit?String(env[hit]):m}).replace(/\u0000/g,"%");}
function normalizePath(raw,base=cwd){
  let s=stripQuotes(expandVars(raw||".")).replace(/\//g,"\\");
  if(/^\\\\/.test(s))return s.replace(/\\+$/,"" );
  let drive=(base.match(/^[A-Za-z]:/)||["C:"])[0].toUpperCase();
  let tail=s;
  if(/^[A-Za-z]:/.test(s)){drive=s.slice(0,2).toUpperCase();tail=s.slice(2);if(!tail)tail="\\"}
  let parts=[];
  if(tail.startsWith("\\"))parts=[];else parts=String(base).replace(/^[A-Za-z]:\\?/,"").split("\\").filter(Boolean);
  tail.split("\\").filter(Boolean).forEach(p=>{if(p===".")return;if(p==="..")parts.pop();else parts.push(p)});
  return drive+"\\"+parts.join("\\");
}
function parentPath(p){p=normalizePath(p);if(/^[A-Z]:\\?$/.test(p))return p.slice(0,2)+"\\";const i=p.lastIndexOf("\\");return i<=2?p.slice(0,2)+"\\":p.slice(0,i)}
function baseName(p){p=normalizePath(p);if(/^[A-Z]:\\$/.test(p))return p;return p.slice(p.lastIndexOf("\\")+1)}
function ensureDir(path){const p=normalizePath(path);if(!fs[fsKey(p)])fs[fsKey(p)]={path:p,type:"dir"};const parent=parentPath(p);if(parent!==p&&!fs[fsKey(parent)])ensureDir(parent);return p}
function putFile(path,content=""){const p=normalizePath(path);ensureDir(parentPath(p));fs[fsKey(p)]={path:p,type:"file",content:String(content??"")};return p}
function nodeAt(path){return fs[fsKey(path)]||null}
function exists(path){return !!nodeAt(path)}
function isDir(path){return nodeAt(path)?.type==="dir"}
function listChildren(path){const p=normalizePath(path),prefix=p.endsWith("\\")?p:p+"\\";return Object.values(fs).filter(n=>n.path.toLowerCase().startsWith(prefix.toLowerCase())&&n.path.slice(prefix.length).indexOf("\\")<0).sort((a,b)=>a.type===b.type?a.path.localeCompare(b.path):a.type==="dir"?-1:1)}
function deleteRecursive(path){const p=normalizePath(path).toLowerCase();Object.keys(fs).forEach(k=>{if(k===p||k.startsWith(p+"\\"))delete fs[k]})}
function initFilesystem(){
  fs={};
  ensureDir("C:\\");ensureDir("C:\\Users");ensureDir("C:\\Users\\developer");ensureDir("C:\\Users\\developer\\JavaPractice");
  const dirs=data?.directories||[];dirs.forEach(ensureDir);
  const files=data?.files||data?.filesystem?.files||{};Object.entries(files).forEach(([p,v])=>putFile(p,typeof v==="object"?v.content:v));
  if(Array.isArray(data?.filesystem)){data.filesystem.forEach(n=>n.type==="dir"?ensureDir(n.path):putFile(n.path,n.content||""))}
}
function promptText(){
  if(data?.promptPrefix!==undefined)return String(data.promptPrefix)+(data?.promptSuffix!==undefined?data.promptSuffix:promptSuffix);
  const custom=data?.promptTemplate;
  if(custom)return formatPrompt(custom);
  return cwd+(data?.promptSuffix!==undefined?data.promptSuffix:promptSuffix);
}
function formatPrompt(t){return String(t).replace(/\$P/gi,cwd).replace(/\$G/gi,">").replace(/\$L/gi,"<").replace(/\$B/gi,"|").replace(/\$S/gi," ").replace(/\$D/gi,new Date().toLocaleDateString()).replace(/\$T/gi,new Date().toLocaleTimeString())}
function reset(){
  if(!data)return;
  cwd=normalizePath(data.cwd||"C:\\Users\\developer\\JavaPractice","C:\\");promptSuffix=data.promptSuffix!==undefined?String(data.promptSuffix):">";
  env={COMSPEC:"C:\\Windows\\System32\\cmd.exe",USERPROFILE:"C:\\Users\\developer",USERNAME:"developer",OS:"Windows_NT",JAVA_HOME:"C:\\Program Files\\Java\\jdk-21",MAVEN_HOME:"C:\\apache-maven-3.9.9",PATH:"C:\\Windows\\System32;C:\\Program Files\\Java\\jdk-21\\bin;C:\\apache-maven-3.9.9\\bin;C:\\Program Files\\Git\\cmd",...(clone(data.env||{}))};persistentEnv=clone(data.persistentEnv||{});
  entries=[];history=[];historyIndex=0;errorLevel=0;activeProcess=null;inputDraft="";initFilesystem();
  if(!exists(cwd))ensureDir(cwd);
  if(data.initialOutput)entries.push({type:"output",text:String(data.initialOutput)});
  refs.title.textContent=data.title||"Command Prompt";refs.window.classList.remove("closed","minimized");render();
}
function setStatus(){refs.cwdStatus.textContent=cwd;refs.errorStatus.textContent="ERRORLEVEL "+errorLevel;refs.processStatus.textContent=activeProcess?activeProcess.name:"Ready"}
function makeOutput(text,kind="output"){if(text===undefined||text===null||String(text)==="")return;entries.push({type:kind,text:String(text)})}
function render(highlight=""){
  const oldInput=document.activeElement?.id==="cmdInput";const selection=oldInput?[$("cmdInput")?.selectionStart,$("cmdInput")?.selectionEnd]:null;
  refs.term.innerHTML="";
  entries.forEach((e,idx)=>{
    const div=document.createElement("div");div.className="line"+(e.focus?" focusLine":"")+(e.type==="error"?" errorText":"")+(e.type==="muted"?" mutedText":"");
    if(e.type==="command"){
      div.classList.add("promptLine");const p=document.createElement("span");p.className="prompt";p.textContent=e.prompt??promptText();const c=document.createElement("span");c.className="command sim-command-text";c.dataset.entry=idx;
      if(highlight&&String(e.text).includes(highlight)){const parts=String(e.text).split(highlight);c.innerHTML=parts.map((x,i)=>esc(x)+(i<parts.length-1?'<span class="match">'+esc(highlight)+'</span>':"")).join("")}else c.textContent=e.text;
      div.append(p,c);
    }else{
      if(highlight&&String(e.text).includes(highlight)){const parts=String(e.text).split(highlight);div.innerHTML=parts.map((x,i)=>esc(x)+(i<parts.length-1?'<span class="match">'+esc(highlight)+'</span>':"")).join("")}else div.textContent=e.text;
    }
    refs.term.appendChild(div);
  });
  const current=document.createElement("div");current.className="line promptLine";current.id="currentPrompt";const p=document.createElement("span");p.className="prompt";p.textContent=promptText();const input=document.createElement("input");input.id="cmdInput";input.className="cmdInput";input.autocomplete="off";input.spellcheck=false;input.value=inputDraft;current.append(p,input);refs.term.appendChild(current);wireInput(input);setStatus();refs.wrap.scrollTop=refs.wrap.scrollHeight;
  if(oldInput){input.focus();if(selection&&selection[0]!=null)try{input.setSelectionRange(selection[0],selection[1])}catch{}}
}
function wireInput(input){
  input.oninput=()=>{inputDraft=input.value};
  input.onkeydown=e=>{
    if(e.key==="Enter"){e.preventDefault();const cmd=input.value;inputDraft="";if(cmd.trim()){history.push(cmd);historyIndex=history.length}executeManual(cmd);return}
    if(e.key==="ArrowUp"){e.preventDefault();if(history.length){historyIndex=Math.max(0,historyIndex-1);input.value=history[historyIndex]||"";inputDraft=input.value;queueMicrotask(()=>input.setSelectionRange(input.value.length,input.value.length))}return}
    if(e.key==="ArrowDown"){e.preventDefault();if(history.length){historyIndex=Math.min(history.length,historyIndex+1);input.value=historyIndex===history.length?"":history[historyIndex]||"";inputDraft=input.value;queueMicrotask(()=>input.setSelectionRange(input.value.length,input.value.length))}return}
    if(e.key==="Tab"){e.preventDefault();autocomplete(input);return}
    if(e.ctrlKey&&e.key.toLowerCase()==="c"){e.preventDefault();if(activeProcess){makeOutput("^C");stopProcess("Process terminated by user.");render()}else{input.value="";inputDraft="";makeOutput("^C");render()}return}
  };
}
function focusInput(){const input=$("cmdInput");if(input)input.focus()}
function autocomplete(input){
  const before=input.value.slice(0,input.selectionStart),m=before.match(/(?:^|\s)("?[^\s"]*)$/);if(!m)return;const token=stripQuotes(m[1]||"");const dir=token.includes("\\")?normalizePath(parentPath(token)):cwd;const prefix=token.includes("\\")?baseName(token):token;const hits=listChildren(dir).filter(n=>baseName(n.path).toLowerCase().startsWith(prefix.toLowerCase()));if(!hits.length)return;const replacement=(token.includes("\\")?token.slice(0,token.lastIndexOf("\\")+1):"")+baseName(hits[0].path)+(hits[0].type==="dir"?"\\":"");input.value=before.slice(0,before.length-m[1].length)+replacement+input.value.slice(input.selectionEnd);inputDraft=input.value;input.setSelectionRange(before.length-m[1].length+replacement.length,before.length-m[1].length+replacement.length)
}
function flash(t){refs.flash.textContent=t;refs.flash.classList.add("show");clearTimeout(flash.t);flash.t=setTimeout(()=>refs.flash.classList.remove("show"),850)}
function tokenize(s){const out=[];String(s).replace(/"([^"]*)"|(\S+)/g,(_,q,b)=>{out.push(q!==undefined?q:b);return ""});return out}
function splitOutsideQuotes(s,separator){let out=[],buf="",q=false;for(let i=0;i<s.length;i++){if(s[i]==='"')q=!q;if(!q&&s.startsWith(separator,i)){out.push(buf);buf="";i+=separator.length-1}else buf+=s[i]}out.push(buf);return out}
function splitChain(s){let out=[],buf="",q=false;for(let i=0;i<s.length;i++){const ch=s[i];if(ch==='"')q=!q;if(!q){if(s.startsWith("&&",i)){out.push({text:buf,op:"&&"});buf="";i++;continue}if(s.startsWith("||",i)){out.push({text:buf,op:"||"});buf="";i++;continue}if(ch==="&"){out.push({text:buf,op:"&"});buf="";continue}}buf+=ch}out.push({text:buf,op:null});return out}
function parseRedirection(s){let q=false;for(let i=0;i<s.length;i++){if(s[i]==='"')q=!q;if(q)continue;if(s.startsWith(">>",i)){return {cmd:s.slice(0,i).trim(),mode:"append",file:s.slice(i+2).trim()}}if(s[i]===">"){return {cmd:s.slice(0,i).trim(),mode:"write",file:s.slice(i+1).trim()}}}return {cmd:s.trim(),mode:null,file:null}}
function formatDir(path,bare=false){const p=normalizePath(path||cwd);if(!isDir(p))return {code:1,out:`File Not Found\n${p}`};const kids=listChildren(p);if(bare)return {code:0,out:kids.map(n=>baseName(n.path)).join("\n")};const lines=[` Volume in drive ${p.slice(0,1)} has no label.`,` Volume Serial Number is 1A2B-3C4D`,``, ` Directory of ${p}`,""];kids.forEach(n=>{const stamp="09/22/2026  11:00 AM";lines.push(`${stamp}    ${n.type==="dir"?"<DIR>         ":"              "+String((n.content||"").length).padStart(6," ")} ${baseName(n.path)}`)});lines.push("",`${kids.filter(n=>n.type==="file").length} File(s)`,`${kids.filter(n=>n.type==="dir").length} Dir(s)`);return {code:0,out:lines.join("\n")}}
function knownToolOutput(cmd,args,stdin=""){
  const a=args.join(" ");
  if(cmd==="java"&&args.includes("-version"))return {code:0,out:'openjdk version "21.0.5" 2026-10-15 LTS\nOpenJDK Runtime Environment (build 21.0.5+11-LTS)\nOpenJDK 64-Bit Server VM (build 21.0.5+11-LTS, mixed mode, sharing)'};
  if(cmd==="javac"&&args.includes("-version"))return {code:0,out:"javac 21.0.5"};
  if((cmd==="mvn"||cmd==="mvn.cmd")&&(args.includes("-v")||args.includes("--version")))return {code:0,out:`Apache Maven 3.9.9\nMaven home: ${env.MAVEN_HOME||"C:\\apache-maven-3.9.9"}\nJava version: 21.0.5`};
  if(cmd==="mvn"){
    if(/spring-boot:run/i.test(a)){activeProcess={name:"Spring Boot :8080",command:"mvn "+a};return {code:0,out:"[INFO] Scanning for projects...\n[INFO] --- spring-boot:run ---\nStarted JavaPracticeApplication in 2.341 seconds\nTomcat started on port 8080 (http)"}}
    return {code:0,out:`[INFO] Scanning for projects...\n[INFO] --- ${a||"package"} ---\n[INFO] BUILD SUCCESS\n[INFO] Total time:  1.842 s`};
  }
  if(cmd==="git"){
    if(args[0]==="status")return {code:0,out:"On branch main\nnothing to commit, working tree clean"};
    if(args[0]==="branch"&&args.includes("--show-current"))return {code:0,out:"main"};
    if(args[0]==="log")return {code:0,out:"a1b2c3d (HEAD -> main) Java Practice updates\n7f8e9d0 Initial commit"};
    if(["add","commit","push","pull","fetch"].includes(args[0]))return {code:0,out:args[0]==="commit"?'[main a1b2c3d] Update Java Practice':args[0]==="push"?"Everything up-to-date":""};
  }
  if(cmd==="docker"){
    if(args.includes("--version"))return {code:0,out:"Docker version 28.4.0, build simulated"};
    if(args[0]==="ps")return {code:0,out:"CONTAINER ID   IMAGE        STATUS         PORTS\n6ba1c12f9a21   postgres:17  Up 2 minutes   0.0.0.0:5432->5432/tcp"};
    if(["build","run","compose"].includes(args[0]))return {code:0,out:"Docker command completed successfully."};
  }
  if(cmd==="curl")return {code:0,out:'{"status":"ok","source":"simulator"}'};
  return null;
}
function executeSingle(raw,stdin=""){
  let s=expandVars(String(raw||"").trim());if(!s)return {code:0,out:""};
  const red=parseRedirection(s);s=red.cmd;const args=tokenize(s);const cmd=String(args.shift()||"").toLowerCase();let result={code:0,out:""};
  if(/^[a-z]:$/i.test(cmd)){const root=cmd.toUpperCase()+"\\";ensureDir(root);cwd=root;result={code:0,out:""}}
  else if(cmd==="cd"||cmd==="chdir"){const cdArgs=args.filter(x=>x.toLowerCase()!=="/d");if(!cdArgs.length)result={code:0,out:cwd};else{let target=normalizePath(cdArgs.join(" "));if(isDir(target)){cwd=target;result={code:0,out:""}}else result={code:1,out:"The system cannot find the path specified."}}}
  else if(cmd==="dir"){const bare=args.some(x=>x.toLowerCase()==="/b"),target=args.find(x=>!x.startsWith("/"))||cwd;result=formatDir(target,bare)}
  else if(cmd==="cls"){entries=[];result={code:0,out:"",clear:true}}
  else if(cmd==="echo"){let t=args.join(" ");if(/^\.$/.test(t))t="";result={code:0,out:t}}
  else if(cmd==="set"){const text=args.join(" ");if(!text)result={code:0,out:Object.keys(env).sort().map(k=>`${k}=${env[k]}`).join("\n")};else if(text.includes("=")){const i=text.indexOf("="),k=text.slice(0,i),v=text.slice(i+1);if(v==="")delete env[k];else env[k]=v;result={code:0,out:""}}else{const k=Object.keys(env).find(x=>x.toLowerCase().startsWith(text.toLowerCase()));result=k?{code:0,out:`${k}=${env[k]}`}:{code:1,out:`Environment variable ${text} not defined`}}}
  else if(cmd==="setx"){const k=args[0],v=args.slice(1).join(" ");if(!k)result={code:1,out:"ERROR: Invalid syntax."};else{persistentEnv[k]=v;result={code:0,out:"SUCCESS: Specified value was saved."}}}
  else if(cmd==="mkdir"||cmd==="md"){if(!args.length)result={code:1,out:"The syntax of the command is incorrect."};else{args.forEach(x=>ensureDir(x));result={code:0,out:""}}}
  else if(cmd==="rmdir"||cmd==="rd"){const targets=args.filter(x=>!x.startsWith("/"));if(!targets.length)result={code:1,out:"The syntax of the command is incorrect."};else{targets.forEach(deleteRecursive);result={code:0,out:""}}}
  else if(cmd==="type"){const p=normalizePath(args.join(" ")),n=nodeAt(p);result=n?.type==="file"?{code:0,out:n.content}:{code:1,out:"The system cannot find the file specified."}}
  else if(cmd==="copy"){const src=nodeAt(args[0]),dst=args[1]?normalizePath(args[1]):null;if(!src||src.type!=="file"||!dst)result={code:1,out:"The system cannot find the file specified."};else{putFile(dst,src.content);result={code:0,out:"        1 file(s) copied."}}}
  else if(cmd==="move"){const sp=normalizePath(args[0]||""),src=nodeAt(sp),dp=args[1]?normalizePath(args[1]):null;if(!src||!dp)result={code:1,out:"The system cannot find the file specified."};else{if(src.type==="file")putFile(dp,src.content);else ensureDir(dp);deleteRecursive(sp);result={code:0,out:"        1 file(s) moved."}}}
  else if(cmd==="del"||cmd==="erase"){const p=normalizePath(args.filter(x=>!x.startsWith("/"))[0]||"");if(!exists(p))result={code:1,out:"Could Not Find "+p};else{deleteRecursive(p);result={code:0,out:""}}}
  else if(cmd==="title"){refs.title.textContent=args.join(" ")||"Command Prompt";result={code:0,out:""}}
  else if(cmd==="prompt"){data.promptTemplate=args.join(" ")||"$P$G";result={code:0,out:""}}
  else if(cmd==="ver")result={code:0,out:"Microsoft Windows [Version 11.0.26100.6584]"};
  else if(cmd==="whoami")result={code:0,out:`desktop-sim\\${env.USERNAME||"developer"}`};
  else if(cmd==="where"){const name=args[0]||"";const map={java:(env.JAVA_HOME||"")+"\\bin\\java.exe",javac:(env.JAVA_HOME||"")+"\\bin\\javac.exe",mvn:(env.MAVEN_HOME||"")+"\\bin\\mvn.cmd",git:"C:\\Program Files\\Git\\cmd\\git.exe",cmd:"C:\\Windows\\System32\\cmd.exe"};result=map[name.toLowerCase()]?{code:0,out:map[name.toLowerCase()]}:{code:1,out:`INFO: Could not find files for the given pattern(s).`}}
  else if(cmd==="find"||cmd==="findstr"){const needle=(args.find(x=>!x.startsWith("/"))||"").replace(/^"|"$/g,"");const source=stdin||"";const lines=source.split(/\r?\n/).filter(x=>cmd==="findstr"?x.toLowerCase().includes(needle.toLowerCase()):x.includes(needle));result={code:lines.length?0:1,out:lines.join("\n")}}
  else if(cmd==="tree"){const root=normalizePath(args[0]||cwd),kids=listChildren(root);result={code:0,out:[baseName(root)||root,...kids.map((n,i)=>(i===kids.length-1?"└── ":"├── ")+baseName(n.path))].join("\n")}}
  else if(cmd==="help")result={code:0,out:"CD CHDIR CLS COPY DEL DIR ECHO ERASE EXIT FIND FINDSTR HELP MD MKDIR MOVE PATH PROMPT RD RMDIR SET SETX TITLE TREE TYPE VER WHERE"};
  else if(cmd==="path"){if(args.length)env.PATH=args.join(" ");result={code:0,out:`PATH=${env.PATH||""}`}}
  else if(cmd==="exit"){refs.window.classList.add("closed");result={code:0,out:""}}
  else{const known=knownToolOutput(cmd,args,stdin);result=known||{code:9009,out:`'${cmd}' is not recognized as an internal or external command,\noperable program or batch file.`}}
  if(red.mode&&red.file){const p=normalizePath(red.file),old=nodeAt(p)?.content||"",txt=result.out||"";putFile(p,red.mode==="append"?old+(old?"\n":"")+txt:txt);result={...result,out:""}}
  errorLevel=result.code;return result;
}
function executePipeline(segment){const parts=splitOutsideQuotes(segment,"|").map(x=>x.trim()).filter(Boolean);let stdin="",last={code:0,out:""};for(const p of parts){last=executeSingle(p,stdin);stdin=last.out||""}return last}
function executeLine(line){const chain=splitChain(line);let last={code:0,out:""},previousOp=null;for(const part of chain){const text=part.text.trim();if(text){const shouldRun=previousOp==="&&"?last.code===0:previousOp==="||"?last.code!==0:true;if(shouldRun){last=executePipeline(text);if(last.clear)entries=[];if(last.out)makeOutput(last.out,last.code===0?"output":"error")}}previousOp=part.op}return last}
async function executeManual(command){entries.push({type:"command",prompt:promptText(),text:String(command)});executeLine(command);render();focusInput()}
async function animateCommand(command,token){const base=entries.slice(),p=promptText(),chars=String(command),steps=Math.min(70,Math.max(1,chars.length)),duration=Math.min(1050,Math.max(220,chars.length*30));for(let i=1;i<=steps;i++){if(token!==seekToken)return;entries=base.concat([{type:"command",prompt:p,text:chars.slice(0,Math.floor(chars.length*i/steps)),focus:true}]);render();await sleep(duration/steps)}entries=base.concat([{type:"command",prompt:p,text:chars}]);render()}
async function runPlaybackCommand(d,animate,token){const cmd=String(d.command??"");if(animate&&autoType)await animateCommand(cmd,token);else entries.push({type:"command",prompt:promptText(),text:cmd});if(token!==seekToken)return;if(d.output!==undefined){if(String(d.output)!=="")makeOutput(d.output,d.error?"error":"output");errorLevel=Number(d.errorLevel??(d.error?1:0))}else executeLine(cmd);if(d.cwdAfter!==undefined)cwd=normalizePath(String(d.cwdAfter));if(d.title!==undefined)refs.title.textContent=String(d.title);render()}
function startProcess(name,command=""){activeProcess={name:name||"Running process",command};setStatus()}
function stopProcess(message=""){if(message)makeOutput(message,"muted");activeProcess=null;errorLevel=0;setStatus()}
function showProperties(){refs.modalTitle.textContent="Command Prompt Properties";refs.modalBody.innerHTML='<div class="propGrid"><label>Current directory</label><input value="'+esc(cwd)+'" readonly><label>Font</label><select><option>Consolas</option><option>Courier New</option></select><label>Font size</label><input value="14"><label>Screen buffer</label><input value="120 × 9001"><label>Window size</label><input value="120 × 30"><label>QuickEdit Mode</label><input type="checkbox" checked><label>Insert Mode</label><input type="checkbox" checked></div>';refs.modalShade.classList.add("show")}
function showAssistant(m){refs.assistantTitle.textContent=m.title||"Current Step";refs.assistantMeta.textContent=`Step ${m.step||""} · ${m.stage||""} · ${m.language||"Telugu (Romanized)"}`;refs.assistantText.textContent=m.text||"";refs.assistant.classList.remove("minimized");refs.assistant.classList.add("show")}
async function highlightTarget(d,token){if(!allowBoundary)return;const commands=refs.term.querySelectorAll(".command[data-entry]");const el=d.target==="title"?refs.title:d.target==="latestCommand"?commands[commands.length-1]:d.target==="terminal"?refs.wrap:d.target==="input"?$("cmdInput"):(document.querySelector(d.target)||$("currentPrompt")||refs.wrap);if(!el)return;trackedBoundary=el;syncBoundary();await sleep(220);if(token!==seekToken)return}
function clearBoundary(){cancelAnimationFrame(boundaryFrame);boundaryFrame=0;trackedBoundary=null;refs.boundary.classList.remove("show")}
function syncBoundary(){cancelAnimationFrame(boundaryFrame);boundaryFrame=requestAnimationFrame(()=>{const el=trackedBoundary;if(!el||!allowBoundary||!el.isConnected){clearBoundary();return}const r=el.getBoundingClientRect(),host=refs.window.getBoundingClientRect(),pad=4;if(r.width<=0||r.height<=0){clearBoundary();return}refs.boundary.classList.add("show");refs.boundary.style.left=(r.left-host.left-pad)+"px";refs.boundary.style.top=(r.top-host.top-pad)+"px";refs.boundary.style.width=(r.width+pad*2)+"px";refs.boundary.style.height=(r.height+pad*2)+"px"})}
async function apply(st,animate,token){if(token!==seekToken)return;const d=st.data||{};switch(st.action){
 case "setCwd":{const p=normalizePath(d.cwd??cwd);if(!exists(p))ensureDir(p);cwd=p;render();break}
 case "runCommand":await runPlaybackCommand(d,animate,token);if(d.boundary!==false)await highlightTarget({target:"latestCommand"},token);break;
 case "executeCommand":await runPlaybackCommand({...d,output:undefined},animate,token);if(d.boundary!==false)await highlightTarget({target:"latestCommand"},token);break;
 case "typeCommand":if(animate&&autoType)await animateCommand(String(d.command??""),token);else entries.push({type:"command",prompt:promptText(),text:String(d.command??"")});render();if(d.boundary!==false)await highlightTarget({target:"latestCommand"},token);break;
 case "showOutput":if(d.mode==="replace")entries=[{type:"output",text:String(d.text??"")}];else makeOutput(d.text??"",d.error?"error":"output");render();break;
 case "clearTerminal":entries=[];render();break;
 case "highlightText":render(String(d.contains??""));break;
 case "setTitle":refs.title.textContent=String(d.text??"Command Prompt");break;
 case "setPrompt":if(d.cwd!==undefined)cwd=normalizePath(String(d.cwd));if(d.prefix!==undefined)data.promptPrefix=String(d.prefix);if(d.suffix!==undefined)data.promptSuffix=String(d.suffix);if(d.template!==undefined)data.promptTemplate=String(d.template);render();break;
 case "pressKey":flash(String(d.key||"Key"));if(String(d.key).toLowerCase()==="ctrl+c"&&activeProcess)stopProcess("^C");if(d.output)makeOutput(d.output);render();break;
 case "setEnv":env[d.name]=String(d.value??"");render();break;
 case "unsetEnv":delete env[d.name];render();break;
 case "createDirectory":ensureDir(d.path);render();break;
 case "createFile":putFile(d.path,d.content||"");render();break;
 case "deletePath":deleteRecursive(d.path);render();break;
 case "setFilesystem":data.files=clone(d.files||{});data.directories=clone(d.directories||[]);initFilesystem();render();break;
 case "startProcess":startProcess(d.name||d.command,d.command||"");if(d.output)makeOutput(d.output);render();break;
 case "stopProcess":stopProcess(d.output||"Process terminated.");render();break;
 case "showProperties":showProperties();break;
 case "setErrorLevel":errorLevel=Number(d.value||0);setStatus();break;
 case "showHelp":makeOutput(d.text||"Type HELP for available commands.");render();break;
 case "highlightTarget":await highlightTarget(d,token);break;
 case "moveCursor":await highlightTarget(d,token);break;
 default:flash("Unsupported: "+st.action)
}}
async function seek(steps,animateFinal){const token=++seekToken;clearBoundary();reset();for(let i=0;i<steps.length;i++){allowBoundary=i===steps.length-1;await apply(steps[i],animateFinal&&i===steps.length-1,token);if(token!==seekToken)return}allowBoundary=true;focusInput()}
function loadPackage(p){pkg=clone(p);data=clone(pkg.apps?.cmd||{});reset()}

window.addEventListener("message",e=>{const m=e.data;if(m?.type==="SIM_PACKAGE"){autoType=!!m.autoType;applyTheme(m.theme||"dark");loadPackage(m.package)}else if(m?.type==="SIM_SETTING"&&m.key==="autoType")autoType=!!m.value;else if(m?.type==="SIM_SETTING"&&m.key==="theme")applyTheme(m.value);else if(m?.type==="SIM_SEEK"){autoType=!!m.autoType;seek(Array.isArray(m.steps)?m.steps:[],!!m.animateFinal)}else if(m?.type==="SIM_EXPLAIN")showAssistant(m)});

refs.wrap.addEventListener("pointerdown",e=>{
  if(e.button!==0)return;
  if(e.target.closest?.("button,.cmdAssistant,.modal,.menuPopup"))return;
  setTimeout(focusInput,0);
});
refs.modalClose.onclick=()=>refs.modalShade.classList.remove("show");refs.modalShade.onclick=e=>{if(e.target===refs.modalShade)refs.modalShade.classList.remove("show")};
$("minBtn").onclick=()=>refs.window.classList.toggle("minimized");$("maxBtn").onclick=()=>refs.window.classList.toggle("maximized");$("closeBtn").onclick=()=>{refs.window.classList.add("closed");flash("Simulated window close")};
const menuMap={File:["New Window","Open Windows Terminal","Exit"],Edit:["Mark","Copy","Paste","Select All","Scroll","Find"],Defaults:["Options","Font","Layout","Colors","Terminal"],Properties:["Options","Font","Layout","Colors","Terminal"]};
document.querySelectorAll("[data-menu]").forEach(b=>b.onclick=e=>{e.stopPropagation();const items=menuMap[b.dataset.menu]||[];refs.menuPopup.style.left=b.offsetLeft+"px";refs.menuPopup.innerHTML=items.map(x=>`<div data-item="${esc(x)}">${esc(x)}</div>`).join("");refs.menuPopup.classList.add("show");refs.menuPopup.querySelectorAll("[data-item]").forEach(x=>x.onclick=()=>{if(b.dataset.menu==="Properties"||b.dataset.menu==="Defaults")showProperties();else if(x.dataset.item==="Paste")focusInput();else flash(x.dataset.item);refs.menuPopup.classList.remove("show")})});document.addEventListener("click",()=>refs.menuPopup.classList.remove("show"));
refs.assistantMin.onclick=e=>{e.stopPropagation();refs.assistant.classList.toggle("minimized")};refs.assistantClose.onclick=e=>{e.stopPropagation();refs.assistant.classList.remove("show")};
refs.assistantHead.addEventListener("pointerdown",e=>{if(e.target.tagName==="BUTTON")return;const r=refs.assistant.getBoundingClientRect();assistantDrag={dx:e.clientX-r.left,dy:e.clientY-r.top};refs.assistant.setPointerCapture?.(e.pointerId)});refs.assistantHead.addEventListener("pointermove",e=>{if(!assistantDrag)return;refs.assistant.style.left=Math.max(0,Math.min(innerWidth-refs.assistant.offsetWidth,e.clientX-assistantDrag.dx))+"px";refs.assistant.style.top=Math.max(0,Math.min(innerHeight-refs.assistant.offsetHeight,e.clientY-assistantDrag.dy))+"px";refs.assistant.style.right="auto";refs.assistant.style.bottom="auto"});refs.assistantHead.addEventListener("pointerup",()=>assistantDrag=null);
document.addEventListener("pointerdown",e=>{if(e.isTrusted&&refs.boundary.classList.contains("show"))clearBoundary()},true);document.addEventListener("keydown",e=>{if(e.isTrusted&&refs.boundary.classList.contains("show"))clearBoundary()},true);document.addEventListener("scroll",syncBoundary,true);window.addEventListener("resize",syncBoundary);
if(typeof ResizeObserver==="function")new ResizeObserver(syncBoundary).observe(document.documentElement);

render();parent.postMessage({type:"ENGINE_READY",app:APP_ID,supportedActions:SUPPORTED_ACTIONS},"*");
})();
