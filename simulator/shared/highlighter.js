(function(){
"use strict";
if(window.__SIM_HIGHLIGHT_READY__) return;
window.__SIM_HIGHLIGHT_READY__=true;

var style=document.createElement("style");
style.textContent=[
".simActionHighlight{position:relative!important;z-index:2147480000!important;outline:4px solid #53a9ff!important;outline-offset:2px!important;box-shadow:none!important;border-radius:5px!important;transition:none!important}",
".simActionHighlight.simActionPulse{animation:none!important;filter:none!important}",
".simActionPointer{position:fixed!important;z-index:2147483000!important;color:#53a9ff!important;font:700 28px/1 sans-serif!important;width:30px!important;height:30px!important;display:grid!important;place-items:center!important;pointer-events:none!important;filter:none!important;text-shadow:none!important}",
"body .codeLine.focus,body .line.focus,body .lineFocus,body .sqlLessonLine.active,body .simLessonLineHighlight{position:relative!important;box-shadow:none!important;border-left:0!important;outline:none!important;background-color:rgba(45,132,245,.34)!important;text-shadow:0 1px 1px rgba(0,0,0,.95)!important}",
"body .codeLine.focus::before,body .line.focus::before,body .lineFocus::before,body .sqlLessonLine.active::before,body .simLessonLineHighlight::before{content:'';position:absolute;left:-7px;top:0;bottom:0;width:6px;border-radius:2px;background:#8bd3ff;box-shadow:none;pointer-events:none;z-index:2}",
"body .codeLine.focus,body .line.focus,body .lineFocus,body .simLessonLineHighlight{padding-left:0!important}",
"body pre .sim-emphasis,body .code .sim-emphasis,body .sql .sim-emphasis,body .codeLine.sim-emphasis,body .line.sim-emphasis{position:relative!important;box-shadow:none!important;border-left:0!important;outline:none!important;background-color:rgba(45,132,245,.34)!important;text-shadow:0 1px 1px rgba(0,0,0,.95)!important}",
"body pre .sim-emphasis::before,body .code .sim-emphasis::before,body .sql .sim-emphasis::before,body .codeLine.sim-emphasis::before,body .line.sim-emphasis::before{content:'';position:absolute;left:-7px;top:0;bottom:0;width:6px;border-radius:2px;background:#8bd3ff;box-shadow:none;pointer-events:none;z-index:2}",
"body .codeLine.focus *,body .line.focus *,body .lineFocus *,body .sqlLessonLine.active *,body .simLessonLineHighlight *,body pre .sim-emphasis *,body .code .sim-emphasis *,body .sql .sim-emphasis *,body .codeLine.sim-emphasis *,body .line.sim-emphasis *{text-shadow:0 1px 1px rgba(0,0,0,.95)!important}",
".sim-line-text{position:relative;z-index:3}",
"html body *{scrollbar-width:thin!important;scrollbar-color:rgba(126,136,148,.72) transparent!important}",
"html body *::-webkit-scrollbar{width:10px!important;height:10px!important;display:block!important}",
"html body *::-webkit-scrollbar-track{background:transparent!important}",
"html body *::-webkit-scrollbar-thumb{background:rgba(126,136,148,.62)!important;border:2px solid transparent!important;background-clip:padding-box!important;border-radius:999px!important;min-width:28px!important;min-height:28px!important}",
"html body *::-webkit-scrollbar-thumb:hover{background:rgba(154,165,178,.82)!important;background-clip:padding-box!important}",
"html body *::-webkit-scrollbar-corner{background:transparent!important}",
"body .tree,body .objectTree,body .apiTreeSide,body .fileList{overflow:auto!important;overflow-x:auto!important;overflow-y:auto!important;scrollbar-gutter:stable}",
"body .tree .treeRow,body .tree .row,body .objectTree .treeRow{width:max-content!important;min-width:100%!important}",
"body .tree .nodeText,body .tree .node,body .tree .treeLabel,body .objectTree .treeLabel{overflow:visible!important;text-overflow:clip!important;max-width:none!important;flex:0 0 auto!important;white-space:nowrap!important}",
"body .terminalWrap,body .terminalViewport,body .codeViewport,body .resultBody,body .result-body,body .markdownPreviewBody,body .apiTreeMain,body .history{overflow-x:auto!important}",
"body .fileList .fileRow{width:max-content!important;min-width:max(100%,560px)!important}",
"body .fileList .fileName{overflow:visible!important;text-overflow:clip!important;white-space:nowrap!important}",
"body .sidebar .collection,body .sidebar .requestRow{min-width:max-content}",
"body .sidebar .requestRow>*{white-space:nowrap}",
"body .sidebar{overflow-x:auto!important}",
"body .sidebar .navItem{width:max-content;min-width:100%;white-space:nowrap}",
"body .listShell{overflow:auto!important}",
"body .listShell .listHead,body .listShell .listRow{min-width:max-content}",
"body .timeline{overflow-x:auto!important}"
].join("");
document.head.appendChild(style);

var active=[];

function visible(el){
 if(!el||!el.isConnected)return false;
 var s=getComputedStyle(el);
 if(s.display==="none"||s.visibility==="hidden"||Number(s.opacity)===0)return false;
 var r=el.getBoundingClientRect();
 return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth;
}
function smallEnough(el){
 if(!visible(el))return false;
 var r=el.getBoundingClientRect(),vw=Math.max(1,innerWidth),vh=Math.max(1,innerHeight);
 return !((r.width>vw*.68&&r.height>72)||(r.height>vh*.48&&r.width>180)||(r.width*r.height>vw*vh*.34));
}
function lineLike(el){
 return !!el?.matches?.(".codeLine,.line,.lineFocus,.sqlLessonLine,.sim-emphasis,.simLessonLineHighlight")||
   !!el?.closest?.("pre.code,pre.sql,.codeViewport,.editorWrap,.monaco-editor");
}
function terminalLike(el){
 return !!el?.matches?.(".terminalCommandFocus,.terminalLine")||!!el?.closest?.(".terminal,.terminalWrap,.terminalViewport");
}
function scrollParents(el){
 var out=[],p=el?.parentElement;
 while(p&&p!==document.body&&p!==document.documentElement){
  var s=getComputedStyle(p);
  if(/auto|scroll|overlay/.test(String(s.overflowX)+String(s.overflowY)))out.push(p);
  p=p.parentElement;
 }
 return out;
}
function reveal(el,preserveHorizontal){
 var parents=scrollParents(el);
 var x=parents.map(function(p){return p.scrollLeft});
 try{el.scrollIntoView({block:"nearest",inline:"nearest",behavior:"auto"})}catch(_){}
 if(preserveHorizontal||lineLike(el)||terminalLike(el)){
  parents.forEach(function(p,i){p.scrollLeft=x[i]});
 }
}
function clean(){
 active.forEach(function(item){
  if(item?.pointer){try{item.pointer.remove()}catch(_){};return}
  if(!item?.el)return;
  item.el.classList.remove("simActionHighlight","simActionPulse","simLessonLineHighlight");
 });
 active=[];
}
function pointAt(el){
 var r=el.getBoundingClientRect();
 var p=document.createElement("div");
 p.className="simActionPointer";
 p.textContent="➜";
 var left=Math.max(2,Math.min(innerWidth-32,r.left+8));
 var top=Math.max(2,Math.min(innerHeight-32,r.top+8));
 p.style.left=left+"px";
 p.style.top=top+"px";
 document.body.appendChild(p);
 active.push({pointer:p,el:el,mode:"pointer"});
 return p;
}
function findText(text,scope){
 if(!text)return null;
 var base=scope?document.querySelector(scope):document;
 if(!base)return null;
 var wanted=String(text).trim().toLowerCase();
 if(!wanted)return null;
 var nodes=base.querySelectorAll("button,[role=button],input,select,option,.treeRow,.row,.toolBtn,.resultTab,.tab,.menuTop,.ctxItem,[data-target],[aria-selected],span,div");
 var best=null,bestLen=1e9;
 Array.prototype.forEach.call(nodes,function(el){
  if(!smallEnough(el))return;
  var t=(el.textContent||el.value||el.getAttribute("aria-label")||el.title||"").trim().toLowerCase();
  if(!t||t.indexOf(wanted)<0)return;
  if(t.length<bestLen){best=el;bestLen=t.length}
 });
 return best;
}
function selectorMatches(selectors,multiple,allowLarge){
 var out=[];
 var listOfSelectors=Array.isArray(selectors)?selectors:[];
 for(var i=0;i<listOfSelectors.length;i++){
  var sel=listOfSelectors[i];
  try{
   var list=multiple?document.querySelectorAll(sel):[document.querySelector(sel)];
   Array.prototype.forEach.call(list,function(el){
    if(el&&(allowLarge?visible(el):smallEnough(el))&&out.indexOf(el)<0)out.push(el);
   });
   if(!multiple&&out.length)break;
  }catch(_){}
 }
 return out;
}
function dataTexts(data){
 var preferred=["file","path","name","key","tab","view","id","goal","command","query","title"];
 var out=[];
 if(!data||typeof data!=="object")return out;
 preferred.forEach(function(k){
  var v=data[k];
  if(typeof v==="string"&&v.trim())out.push(v);
 });
 Object.keys(data).forEach(function(k){
  var v=data[k];
  if(typeof v==="string"&&v.trim()&&out.indexOf(v)<0&&v.length<120)out.push(v);
 });
 return out.map(function(v){
  var clean=String(v).replace(/\\/g,"/");
  return clean.includes("/")?clean.split("/").pop():clean;
 }).filter(Boolean);
}
function autoFind(plan){
 var code=selectorMatches([".codeLine.focus",".line.focus",".lineFocus",".sqlLessonLine.active",".sim-emphasis"],true);
 if(code.length)return {elements:code,mode:"line"};
 var terminal=selectorMatches([".terminalCommandFocus"],true);
 if(terminal.length)return {elements:terminal,mode:"native"};
 var focused=document.activeElement;
 if(focused&&focused!==document.body&&smallEnough(focused))return {elements:[focused],mode:"control"};
 var texts=dataTexts(plan&&plan.data);
 for(var i=0;i<texts.length;i++){
  var hit=findText(texts[i],null);
  if(hit)return {elements:[hit],mode:lineLike(hit)?"line":"control"};
 }
 var contextual=selectorMatches([".treeRow.active",".tab.active","[aria-selected='true']", ".selected","button.active"],false);
 if(contextual.length)return {elements:[contextual[0]],mode:lineLike(contextual[0])?"line":"control"};
 return {elements:[],mode:"none"};
}
function resolve(plan){
 if(plan&&plan.kind==="none")return {elements:[],mode:"none"};
 if(plan&&plan.auto)return autoFind(plan);
 if(plan&&plan.text){
  var byText=findText(plan.text,plan.scope||null);
  if(byText)return {elements:[byText],mode:plan.mode||(lineLike(byText)?"line":"control")};
 }
 var matches=selectorMatches(plan&&plan.selectors,!!(plan&&plan.multiple),true);
 var explicitMode=(plan&&plan.mode)||((matches[0]&&lineLike(matches[0]))?"line":"control");
 return {elements:matches,mode:explicitMode};
}
function report(requestId,found,mode){
 try{parent.postMessage({type:"SIM_HIGHLIGHT_RESULT",requestId:requestId||null,found:!!found,mode:mode||"none"},"*")}catch(_){}
}
function highlight(plan,requestId){
 clean();
 var resolved=resolve(plan||{});
 var elements=resolved.elements||[];
 if(!elements.length){report(requestId,false,resolved.mode);return}
 elements.forEach(function(el){
  reveal(el,!!(plan&&plan.preserveHorizontal));
  if(resolved.mode==="native"){
   active.push({el:el,mode:"native"});
   return;
  }
  if(resolved.mode==="control"&&!smallEnough(el)){
   pointAt(el);
   return;
  }
  var cls=resolved.mode==="line"?"simLessonLineHighlight":"simActionHighlight";
  el.classList.add(cls);
  active.push({el:el,mode:resolved.mode});
 });
 var actualMode=active.some(function(x){return x.mode==="pointer"})?"pointer":resolved.mode;
 report(requestId,true,actualMode);
}
window.addEventListener("message",function(e){
 var m=e.data||{};
 if(m.type==="SIM_HIGHLIGHT")highlight(m.plan||{},m.requestId);
 if(m.type==="SIM_HIGHLIGHT_CLEAR")clean();
});
try{parent.postMessage({type:"SIM_HIGHLIGHT_READY"},"*")}catch(_){}
})();