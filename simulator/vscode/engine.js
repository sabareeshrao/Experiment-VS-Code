(function(){
"use strict";

var $=function(id){return document.getElementById(id);};
var clone=function(v){return JSON.parse(JSON.stringify(v==null?null:v));};
var esc=function(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");};

var R={
 tree:$("tree"),tabs:$("tabs"),breadcrumbs:$("breadcrumbs"),editorArea:$("editorArea"),codeViewport:$("codeViewport"),codeTable:$("codeTable"),minimap:$("minimap"),
 markdownPreviewBtn:$("markdownPreviewBtn"),markdownPreview:$("markdownPreview"),markdownPreviewBody:$("markdownPreviewBody"),markdownPreviewTitle:$("markdownPreviewTitle"),
 terminal:$("terminal"),editorGroup:$("editorGroup"),position:$("positionLabel"),language:$("languageLabel"),branch:$("branchLabel"),command:$("commandLabel"),
 context:$("contextMenu"),assistant:$("assistant"),assistantHead:$("assistantHead"),assistantTitle:$("assistantTitle"),assistantStage:$("assistantStage"),
 assistantStep:$("assistantStep"),assistantText:$("assistantText")
};

var baseline={},state={},files={},activeFile=null,openedTabs=[],changedLines=[],expandedFolders=new Set(),panelVisible=false,markdownPreviewOpen=false,seekToken=0,contextPath=null;
var panelHeightLevel=Math.max(-1,Math.min(4,parseInt(localStorage.getItem("sim.vscode.panelHeight.v1")||"0",10)||0));

function fileKind(path){
 var n=(path||"").split("/").pop()||"";
 if(/\.java$/i.test(n))return"java";
 if(/\.class$/i.test(n))return"classfile";
 if(/\.(js|jsx|ts|tsx)$/i.test(n))return"js";
 if(/\.md$/i.test(n))return"md";
 if(/\.json$/i.test(n))return"json";
 if(/\.(xml|iml)$/i.test(n))return"xml";
 return"plain";
}
function languageName(path){
 var k=fileKind(path);
 if(k==="java")return"Java";
 if(k==="js")return/\.tsx?$/i.test(path)?"TypeScript":"JavaScript";
 if(k==="md")return"Markdown";
 if(k==="json")return"JSON";
 if(k==="xml")return"XML";
 return"Plain Text";
}
function iconMarkup(path,folder){
 if(folder)return'<span class="fileIcon folder">▰</span>';
 var k=fileKind(path),label="·";
 if(k==="java")label="J";
 else if(k==="classfile")label="J";
 else if(k==="js")label="JS";
 else if(k==="md")label="M↓";
 else if(k==="json")label="{}";
 else if(k==="xml")label="◇";
 return'<span class="fileIcon '+k+'">'+esc(label)+'</span>';
}
function normalize(){
 state=state||{};
 files=clone(state.files||{});
 Object.keys(files).forEach(function(p){
   if(typeof files[p]==="string")files[p]={content:files[p]};
   else if(files[p]&&files[p].content==null)files[p].content="";
 });
 openedTabs=(state.openTabs||[]).map(function(x){
   return typeof x==="string"?{path:x,pinned:true}:{path:x.path,pinned:x.pinned!==false};
 }).filter(function(x){return x.path&&files[x.path];});
 activeFile=state.initialFile&&files[state.initialFile]?state.initialFile:(openedTabs[0]?openedTabs[0].path:(Object.keys(files)[0]||null));
 if(activeFile&&!openedTabs.some(function(t){return t.path===activeFile;}))openedTabs.push({path:activeFile,pinned:true});
 expandedFolders=new Set(state.expandedFolders||["src","src/polymorphism"]);
 panelVisible=!!state.panelVisible;
}
function buildTree(){
 var root={name:"",path:"",folder:true,children:{}};
 Object.keys(files).sort().forEach(function(path){
   var parts=path.split("/"),node=root,current="";
   parts.forEach(function(part,i){
     current=current?current+"/"+part:part;
     if(!node.children[part])node.children[part]={name:part,path:current,folder:i<parts.length-1,children:{}};
     node=node.children[part];
   });
 });
 return root;
}
function sortNodes(a,b){
 if(a.folder!==b.folder)return a.folder?-1:1;
 return a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:"base"});
}
function renderTree(){
 R.tree.innerHTML="";
 var root=buildTree();
 function walk(node,depth){
   Object.keys(node.children).map(function(k){return node.children[k];}).sort(sortNodes).forEach(function(child){
     var row=document.createElement("div"),isOpen=child.folder&&expandedFolders.has(child.path);
     row.className="treeRow"+(!child.folder&&child.path===activeFile?" active":"");
     row.style.paddingLeft=(5+depth*16)+"px";
     row.dataset.path=child.path;
     row.innerHTML='<span class="twisty">'+(child.folder?(isOpen?"⌄":"›"):"")+'</span>'+iconMarkup(child.path,child.folder)+'<span class="treeLabel">'+esc(child.name)+'</span>';
     row.onclick=function(){
       if(child.folder){
         if(isOpen)expandedFolders.delete(child.path);else expandedFolders.add(child.path);
         renderTree();
       }else{
         openDoc(child.path,false);
         changedLines=[];
         renderAll();
         scrollActiveTab();
       }
     };
     row.ondblclick=function(){
       if(!child.folder){openDoc(child.path,true);renderAll();scrollActiveTab();}
     };
     row.oncontextmenu=function(e){
       e.preventDefault();
       contextPath=child.path;
       showContext(e.clientX,e.clientY,child.folder);
     };
     R.tree.appendChild(row);
     if(child.folder&&isOpen)walk(child,depth+1);
   });
 }
 walk(root,0);
}
function openDoc(path,pinned){
 if(!path||!files[path])return;
 if(pinned===undefined)pinned=true;
 var tab=openedTabs.find(function(t){return t.path===path;});
 if(tab){if(pinned)tab.pinned=true;}
 else if(!pinned){
   var preview=openedTabs.findIndex(function(t){return !t.pinned;});
   if(preview>=0)openedTabs[preview]={path:path,pinned:false};
   else openedTabs.push({path:path,pinned:false});
 }else openedTabs.push({path:path,pinned:true});
 activeFile=path;
 state.openTabs=openedTabs.map(function(t){return{path:t.path,pinned:t.pinned};});
 ensureParentFolders(path);
}
function ensureParentFolders(path){
 var parts=path.split("/");
 for(var i=1;i<parts.length;i++)expandedFolders.add(parts.slice(0,i).join("/"));
}
function closeDoc(path){
 var i=openedTabs.findIndex(function(t){return t.path===path;});
 if(i<0)return;
 var wasActive=activeFile===path;
 openedTabs.splice(i,1);
 if(wasActive)activeFile=(openedTabs[i]||openedTabs[i-1]||{}).path||null;
 state.openTabs=openedTabs.map(function(t){return{path:t.path,pinned:t.pinned};});
 changedLines=[];
 renderAll();
}
function renderTabs(){
 R.tabs.innerHTML="";
 if(!openedTabs.length){
   var w=document.createElement("div");
   w.className="tab active";
   w.innerHTML='<span class="tabText">Welcome</span>';
   R.tabs.appendChild(w);
   return;
 }
 openedTabs.forEach(function(t){
   var el=document.createElement("div");
   el.className="tab"+(t.path===activeFile?" active":"")+(!t.pinned?" preview":"");
   el.title=t.path;
   el.innerHTML=iconMarkup(t.path,false)+'<span class="tabText">'+esc(t.path.split("/").pop())+'</span><button class="tabClose" title="Close">×</button>';
   el.onclick=function(e){
     if(e.target.closest(".tabClose"))return;
     activeFile=t.path;
     changedLines=[];
     renderAll();
     scrollActiveTab();
   };
   el.ondblclick=function(){t.pinned=true;state.openTabs=openedTabs;renderTabs();};
   el.onauxclick=function(e){if(e.button===1){e.preventDefault();closeDoc(t.path);}};
   el.querySelector(".tabClose").onclick=function(e){e.stopPropagation();closeDoc(t.path);};
   R.tabs.appendChild(el);
 });
}
function scrollActiveTab(){
 requestAnimationFrame(function(){
   var t=R.tabs.querySelector(".tab.active");
   if(t)t.scrollIntoView({block:"nearest",inline:"nearest"});
 });
}
function renderBreadcrumbs(){
 R.breadcrumbs.innerHTML="";
 if(!activeFile){R.breadcrumbs.textContent=state.workspaceName||"Java Practice";return;}
 var parts=activeFile.split("/");
 parts.forEach(function(part,i){
   if(i){
     var sep=document.createElement("span");
     sep.className="crumbSep";
     sep.textContent="›";
     R.breadcrumbs.appendChild(sep);
   }
   var c=document.createElement("span");
   c.className="crumb";
   c.textContent=part;
   R.breadcrumbs.appendChild(c);
 });
}
function classifyWord(word,nextChar,prevChar){
 var namespace=new Set(["package","import"]);
 var flow=new Set(["return","if","else","for","while","throw","try","catch","finally","new"]);
 var kw=new Set(["public","private","protected","static","final","abstract","class","interface","extends","implements","throws","void","const","let","var","function","export","from","async","await","this"]);
 var types=new Set(["int","double","float","long","short","byte","boolean","char","String"]);
 var constants=new Set(["true","false","null","undefined"]);
 if(namespace.has(word))return"tokNamespace";
 if(flow.has(word))return"tokFlow";
 if(kw.has(word))return"tokKw";
 if(types.has(word))return"tokType";
 if(constants.has(word))return"tokNum";
 if(nextChar==="(")return"tokFn";
 if(prevChar===".")return"tokProp";
 if(/^[A-Z]/.test(word))return"tokClass";
 return"";
}
function syntaxLine(line){
 var out="",i=0,bracketIndex=0;
 while(i<line.length){
   if(line[i]==="/"&&line[i+1]==="/"){
     out+='<span class="tokComment">'+esc(line.slice(i))+'</span>';
     break;
   }
   var ch=line[i];
   if(ch==='"'||ch==="'"||ch.charCodeAt(0)===96){
     var quote=ch,j=i+1,escaped=false;
     while(j<line.length){
       var q=line[j];
       if(escaped){escaped=false;j++;continue;}
       if(q==="\\"){escaped=true;j++;continue;}
       if(q===quote){j++;break;}
       j++;
     }
     out+='<span class="tokString">'+esc(line.slice(i,j))+'</span>';
     i=j;
     continue;
   }
   if(/[0-9]/.test(ch)){
     var n=i+1;
     while(n<line.length&&/[0-9._]/.test(line[n]))n++;
     out+='<span class="tokNum">'+esc(line.slice(i,n))+'</span>';
     i=n;
     continue;
   }
   if(/[A-Za-z_$]/.test(ch)){
     var w=i+1;
     while(w<line.length&&/[A-Za-z0-9_$]/.test(line[w]))w++;
     var word=line.slice(i,w),k=w;
     while(k<line.length&&/\s/.test(line[k]))k++;
     var p=i-1;
     while(p>=0&&/\s/.test(line[p]))p--;
     var cls=classifyWord(word,line[k]||"",p>=0?line[p]:"");
     out+=cls?'<span class="'+cls+'">'+esc(word)+'</span>':esc(word);
     i=w;
     continue;
   }
   if("{}()[]".indexOf(ch)>=0){
     out+='<span class="br'+(bracketIndex++%3)+'">'+esc(ch)+'</span>';
     i++;
     continue;
   }
   out+=esc(ch);
   i++;
 }
 return out;
}
function renderCode(){
 R.codeTable.innerHTML="";
 if(!activeFile||!files[activeFile]){
   var empty=document.createElement("div");
   empty.className="emptyEditor";
   empty.textContent="Open a file from Explorer";
   R.codeTable.appendChild(empty);
   R.position.textContent="Ln 1, Col 1";
   R.language.textContent="Plain Text";
   return;
 }
 var content=String(files[activeFile].content||""),lines=content.split("\n"),current=changedLines.length?changedLines[0]:1;
 lines.forEach(function(line,index){
   var lineNo=index+1;
   var indentChars=(line.match(/^\s*/)||[""])[0].replace(/\t/g,"    ").length;
   var indent=Math.floor(indentChars/4);
   var el=document.createElement("div");
   el.className="codeLine"+(lineNo===current?" current":"")+(changedLines.indexOf(lineNo)>=0&&line.trim()?" changed":"");
   el.innerHTML='<span class="lineNo">'+lineNo+'</span><span class="codeText indent" style="--indent-guides:'+indent+'">'+syntaxLine(line)+'</span>';
   R.codeTable.appendChild(el);
 });
 R.position.textContent="Ln "+current+", Col 1";
 R.language.textContent=languageName(activeFile);
 renderMinimap(lines);
 if(changedLines.length){
   var target=R.codeTable.children[Math.max(0,current-1)];
   if(target)target.scrollIntoView({block:"center"});
 }
}
function renderMinimap(lines){
 R.minimap.innerHTML="";
 lines.slice(0,220).forEach(function(line){
   var m=document.createElement("div"),trim=line.trim();
   m.className="miniLine"+(/^\/\//.test(trim)?" com":/["']/.test(trim)?" str":/\b(public|class|return|import|package)\b/.test(trim)?" kw":"");
   m.style.width=Math.max(8,Math.min(82,trim.length*1.1))+"px";
   R.minimap.appendChild(m);
 });
 var v=document.createElement("div");
 v.className="minimapViewport";
 R.minimap.appendChild(v);
}

function inlineMarkdown(text){
 var out="",i=0;
 while(i<text.length){
   if(text[i]==="`"){
     var end=text.indexOf("`",i+1);
     if(end>i){out+='<code>'+esc(text.slice(i+1,end))+'</code>';i=end+1;continue;}
   }
   if(text.slice(i,i+2)==="**"){
     var b=text.indexOf("**",i+2);
     if(b>i){out+='<strong>'+inlineMarkdown(text.slice(i+2,b))+'</strong>';i=b+2;continue;}
   }
   if(text[i]==="[" ){
     var close=text.indexOf("]",i+1),openParen=close>=0?text.indexOf("(",close+1):-1,closeParen=openParen>=0?text.indexOf(")",openParen+1):-1;
     if(close>i&&openParen===close+1&&closeParen>openParen){
       var label=text.slice(i+1,close),href=text.slice(openParen+1,closeParen);
       out+='<a href="'+esc(href)+'" target="_blank" rel="noreferrer">'+inlineMarkdown(label)+'</a>';
       i=closeParen+1;continue;
     }
   }
   out+=esc(text[i]);i++;
 }
 return out;
}
function markdownToHtml(source){
 var lines=String(source||"").split("\n"),html=[],inCode=false,code=[],listType=null;
 function closeList(){if(listType){html.push("</"+listType+">");listType=null;}}
 function closeCode(){if(inCode){html.push("<pre><code>"+esc(code.join("\n"))+"</code></pre>");inCode=false;code=[];}}
 lines.forEach(function(line){
   if(/^\s*```/.test(line)){
     if(inCode)closeCode();else{closeList();inCode=true;}
     return;
   }
   if(inCode){code.push(line);return;}
   var m;
   if((m=line.match(/^(#{1,3})\s+(.+)$/))){closeList();var level=m[1].length;html.push("<h"+level+">"+inlineMarkdown(m[2])+"</h"+level+">");return;}
   if(/^\s*---+\s*$/.test(line)){closeList();html.push("<hr>");return;}
   if((m=line.match(/^\s*>\s?(.*)$/))){closeList();html.push("<blockquote>"+inlineMarkdown(m[1])+"</blockquote>");return;}
   if((m=line.match(/^\s*[-*+]\s+(.+)$/))){
     if(listType!=="ul"){closeList();html.push("<ul>");listType="ul";}
     html.push("<li>"+inlineMarkdown(m[1])+"</li>");return;
   }
   if((m=line.match(/^\s*\d+[.)]\s+(.+)$/))){
     if(listType!=="ol"){closeList();html.push("<ol>");listType="ol";}
     html.push("<li>"+inlineMarkdown(m[1])+"</li>");return;
   }
   closeList();
   if(!line.trim()){html.push("");return;}
   html.push("<p>"+inlineMarkdown(line)+"</p>");
 });
 closeList();closeCode();
 return html.join("");
}
function renderMarkdownPreview(){
 var isMarkdown=!!activeFile&&/\.md$/i.test(activeFile);
 R.markdownPreviewBtn.classList.toggle("hidden",!isMarkdown);
 if(!isMarkdown)markdownPreviewOpen=false;
 R.editorArea.classList.toggle("markdownSplit",isMarkdown&&markdownPreviewOpen);
 R.markdownPreview.classList.toggle("hidden",!(isMarkdown&&markdownPreviewOpen));
 if(isMarkdown&&markdownPreviewOpen){
   R.markdownPreviewTitle.textContent=activeFile.split("/").pop()+" — Preview";
   R.markdownPreviewBody.innerHTML=markdownToHtml(files[activeFile]?files[activeFile].content:"");
 }
}
function renderPanel(){
 R.editorGroup.classList.toggle("panelOpen",panelVisible);
 var maxHeight=Math.max(150,Math.floor(innerHeight*0.68));
 var height=Math.max(120,Math.min(maxHeight,185+(panelHeightLevel*75)));
 R.editorGroup.style.setProperty("--panel-h",panelVisible?height+"px":"0px");
 R.terminal.textContent=state.terminal||"PS Java Practice> ";
}
function renderChrome(){
 R.command.textContent=state.workspaceName||"Java Practice";
 R.branch.textContent=(state.git&&state.git.branch)||"main";
}
function renderAll(){
 renderTree();
 renderTabs();
 renderBreadcrumbs();
 renderCode();
 renderMarkdownPreview();
 renderPanel();
 renderChrome();
}
function reset(){
 state=clone(baseline||{});
 normalize();
 changedLines=[];
 markdownPreviewOpen=false;
 renderAll();
}
function ensureFile(path){
 if(!path)return null;
 if(!files[path])files[path]={content:""};
 state.files=files;
 openDoc(path,true);
 return path;
}
async function apply(step,animate,token){
 var d=step&&step.data?step.data:{};
 switch(step&&step.action){
  case"openFile":
   openDoc(d.file||d.path||activeFile,true);
   break;
  case"closeFile":
   closeDoc(d.file||d.path||activeFile);
   return;
  case"createFile":{
   var p=ensureFile(d.file||d.path);
   if(p)files[p].content=String(d.content||"");
   break;
  }
  case"setFile":{
   var sf=ensureFile(d.file||d.path);
   if(sf)files[sf].content=String(d.content||d.code||"");
   break;
  }
  case"typeCode":{
   var tp=ensureFile(d.file||d.path||activeFile);
   if(!tp)break;
   var old=String(files[tp].content||""),add=String(d.code||d.text||""),baseLines=old.split("\n").length,next=old+add;
   changedLines=add.split("\n").map(function(x,idx){return x.trim()?baseLines+idx:null;}).filter(Boolean);
   if(d.marker&&old.indexOf(d.marker)>=0){
     var ls=old.split("\n"),idx=ls.findIndex(function(x){return x.indexOf(d.marker)>=0;});
     var indent=(ls[idx].match(/^\s*/)||[""])[0],block=add.split("\n").map(function(x){return indent+x;});
     if(d.position==="before")ls.splice.apply(ls,[idx,0].concat(block));
     else if(d.position==="after")ls.splice.apply(ls,[idx+1,0].concat(block));
     else ls.splice.apply(ls,[idx,1].concat(block));
     next=ls.join("\n");
     changedLines=block.map(function(x,b){return x.trim()?idx+1+b:null;}).filter(Boolean);
   }
   if(animate&&add.length<500){
     var built="";
     for(var ai=0;ai<add.length;ai++){
       if(token!==seekToken)return;
       built+=add[ai];
       files[tp].content=old+built;
       renderCode();
       await new Promise(function(res){setTimeout(res,8);});
     }
   }
   files[tp].content=next;
   break;
  }
  case"terminalCommand":
  case"runTerminal":
   state.terminal=(state.terminal||"PS Java Practice> ")+String(d.command||"")+(d.output!==undefined?"\n"+d.output:"")+"\nPS Java Practice> ";
   panelVisible=true;
   break;
  case"setTerminal":
   state.terminal=String(d.text||d.output||"");
   panelVisible=true;
   break;
  case"newProject":
   state.workspaceName=d.name||state.workspaceName||"Java Practice";
   break;
  case"createDirectory":
  case"createPackage":
   break;
 }
 state.files=files;
 state.openTabs=openedTabs.map(function(t){return{path:t.path,pinned:t.pinned};});
 state.expandedFolders=Array.from(expandedFolders);
 state.panelVisible=panelVisible;
 renderAll();
 scrollActiveTab();
}
async function seek(steps,animateFinal){
 var token=++seekToken;
 reset();
 for(var i=0;i<steps.length;i++){
   await apply(steps[i],animateFinal&&i===steps.length-1,token);
   if(token!==seekToken)return;
 }
}
function showContext(x,y,isFolder){
 R.context.classList.remove("hidden");
 R.context.style.left=Math.min(x,innerWidth-200)+"px";
 R.context.style.top=Math.min(y,innerHeight-145)+"px";
 var close=R.context.querySelector('[data-action="close"]');
 close.style.display=isFolder?"none":"flex";
}
document.addEventListener("click",function(e){
 if(!e.target.closest("#contextMenu"))R.context.classList.add("hidden");
});
R.context.onclick=function(e){
 var action=e.target.dataset.action;
 if(!action||!contextPath)return;
 if(action==="open"&&!files[contextPath]){expandedFolders.add(contextPath);renderTree();}
 else if(action==="open"){openDoc(contextPath,false);renderAll();}
 else if(action==="pin"){openDoc(contextPath,true);renderAll();}
 else if(action==="close")closeDoc(contextPath);
 else if(action==="copy"&&navigator.clipboard)navigator.clipboard.writeText(contextPath).catch(function(){});
 R.context.classList.add("hidden");
};

$("refreshBtn").onclick=renderTree;
$("collapseBtn").onclick=function(){expandedFolders=new Set(["src"]);renderTree();};
$("newFileBtn").onclick=function(){
 var p="untitled.txt",n=1;
 while(files[p])p="untitled-"+(++n)+".txt";
 files[p]={content:""};
 openDoc(p,true);
 renderAll();
};
$("newFolderBtn").onclick=function(){expandedFolders.add("new-folder");renderTree();};
$("panelClose").onclick=function(){panelVisible=false;renderPanel();};
$("panelCollapse").onclick=function(){panelVisible=!panelVisible;renderPanel();};
$("panelShrink").onclick=function(){panelHeightLevel=Math.max(-1,panelHeightLevel-1);localStorage.setItem("sim.vscode.panelHeight.v1",String(panelHeightLevel));renderPanel();};
$("panelGrow").onclick=function(){panelHeightLevel=Math.min(4,panelHeightLevel+1);localStorage.setItem("sim.vscode.panelHeight.v1",String(panelHeightLevel));panelVisible=true;renderPanel();};
window.addEventListener("resize",renderPanel);
R.markdownPreviewBtn.onclick=function(){
 if(!activeFile||!/\.md$/i.test(activeFile))return;
 markdownPreviewOpen=!markdownPreviewOpen;
 renderMarkdownPreview();
};
$("markdownPreviewClose").onclick=function(){
 markdownPreviewOpen=false;
 renderMarkdownPreview();
};

document.addEventListener("keydown",function(e){
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="w"){
   e.preventDefault();
   if(activeFile)closeDoc(activeFile);
 }
 if(e.ctrlKey&&e.key==="Tab"){
   e.preventDefault();
   if(openedTabs.length>1){
     var i=openedTabs.findIndex(function(t){return t.path===activeFile;});
     i=(i+(e.shiftKey?-1:1)+openedTabs.length)%openedTabs.length;
     activeFile=openedTabs[i].path;
     changedLines=[];
     renderAll();
     scrollActiveTab();
   }
 }
 if((e.ctrlKey||e.metaKey)&&e.key&&e.key.charCodeAt(0)===96){
   e.preventDefault();
   panelVisible=!panelVisible;
   renderPanel();
 }
 if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==="v"&&activeFile&&/\.md$/i.test(activeFile)){
   e.preventDefault();
   markdownPreviewOpen=!markdownPreviewOpen;
   renderMarkdownPreview();
 }
});

function explain(m){
 R.assistantTitle.textContent=m.title||"Step explanation";
 R.assistantStage.textContent=m.stage||"Developer guidance";
 R.assistantStep.textContent="Step "+(m.step||"");
 R.assistantText.textContent=m.text||"";
 R.assistant.classList.remove("hidden");
}
var drag=null;
R.assistantHead.onpointerdown=function(e){
 if(e.target.closest("button"))return;
 var r=R.assistant.getBoundingClientRect();
 drag={id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top};
 if(R.assistant.setPointerCapture)R.assistant.setPointerCapture(e.pointerId);
};
document.addEventListener("pointermove",function(e){
 if(!drag||e.pointerId!==drag.id)return;
 var w=R.assistant.offsetWidth,h=R.assistant.offsetHeight;
 R.assistant.style.left=Math.max(6,Math.min(innerWidth-w-6,e.clientX-drag.dx))+"px";
 R.assistant.style.top=Math.max(6,Math.min(innerHeight-h-6,e.clientY-drag.dy))+"px";
 R.assistant.style.right="auto";
 R.assistant.style.bottom="auto";
});
document.addEventListener("pointerup",function(e){if(drag&&e.pointerId===drag.id)drag=null;});
$("assistantMin").onclick=function(){R.assistant.classList.toggle("min");};
$("assistantClose").onclick=function(){R.assistant.classList.add("hidden");};

window.addEventListener("message",function(e){
 var m=e.data||{};
 if(m.type==="SIM_PACKAGE"){
   baseline=clone(m.package&&m.package.apps?m.package.apps.vscode:{});
   reset();
 }
 if(m.type==="SIM_SEEK")seek(Array.isArray(m.steps)?m.steps:[],!!m.animateFinal);
 if(m.type==="SIM_EXPLAIN")explain(m);
});

baseline={workspaceName:"Java Practice",files:{},terminal:"PS Java Practice> ",openTabs:[],git:{branch:"main"}};
reset();
parent.postMessage({type:"ENGINE_READY",app:"vscode",actions:["openFile","closeFile","createFile","setFile","typeCode","terminalCommand","setTerminal","newProject","createDirectory","createPackage"]},"*");
})();