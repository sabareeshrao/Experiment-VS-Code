(function(){
"use strict";
if(window.__SIM_HIGHLIGHT_READY__) return;
window.__SIM_HIGHLIGHT_READY__=true;

var style=document.createElement("style");
style.textContent=[
".simActionHighlight{position:relative!important;z-index:2147480000!important;outline:3px solid rgba(101,184,255,1)!important;outline-offset:3px!important;box-shadow:0 0 0 2px rgba(235,247,255,.98),0 0 0 6px rgba(60,151,255,.96),0 0 20px 9px rgba(60,151,255,.82),0 0 42px 16px rgba(60,151,255,.48)!important;border-radius:5px!important;transition:none!important}",
".simActionHighlight.simActionPulse{animation:none!important;filter:brightness(1.12)!important}",
"@keyframes simActionPulse{from{opacity:1}to{opacity:1}}",
/* Global editor-line safety: the lesson marker must live in the editor's
   left padding lane, never on top of column 1 text. */
"body .codeLine.focus,body .line.focus,body .lineFocus,body .sqlLessonLine.active{position:relative!important;box-shadow:none!important;border-left:0!important}",
"body .codeLine.focus::before,body .line.focus::before,body .lineFocus::before,body .sqlLessonLine.active::before{content:'';position:absolute;left:-8px;top:1px;bottom:1px;width:4px;border-radius:4px;background:#65b8ff;box-shadow:0 0 5px 2px rgba(101,184,255,.95),0 0 13px 5px rgba(77,163,255,.58);pointer-events:none;z-index:2}",
"body .codeLine.focus,body .line.focus,body .lineFocus{padding-left:0!important}",
"body pre .sim-emphasis,body .code .sim-emphasis,body .sql .sim-emphasis,body .codeLine.sim-emphasis,body .line.sim-emphasis{position:relative!important;box-shadow:none!important;border-left:0!important}",
"body pre .sim-emphasis::before,body .code .sim-emphasis::before,body .sql .sim-emphasis::before,body .codeLine.sim-emphasis::before,body .line.sim-emphasis::before{content:'';position:absolute;left:-8px;top:1px;bottom:1px;width:4px;border-radius:4px;background:#65b8ff;box-shadow:0 0 5px 2px rgba(101,184,255,.95),0 0 13px 5px rgba(77,163,255,.58);pointer-events:none;z-index:2}",
"body .codeLine.focus,body .line.focus,body .lineFocus,body .sqlLessonLine.active,body pre .sim-emphasis,body .code .sim-emphasis,body .sql .sim-emphasis,body .codeLine.sim-emphasis,body .line.sim-emphasis{background-image:linear-gradient(90deg,rgba(77,163,255,.18),rgba(77,163,255,.07) 42%,transparent 78%)!important}",
".sim-line-text{position:relative;z-index:3}",
/* Global overflow + scrollbar safety.  Every simulator can expose long tree
   paths, filenames, SQL/code lines, table rows, console output, etc.  Never
   crop that content just because the pane is narrow. */
"html body *{scrollbar-width:thin!important;scrollbar-color:rgba(126,136,148,.72) transparent!important}",
"html body *::-webkit-scrollbar{width:10px!important;height:10px!important;display:block!important}",
"html body *::-webkit-scrollbar-track{background:transparent!important}",
"html body *::-webkit-scrollbar-thumb{background:rgba(126,136,148,.62)!important;border:2px solid transparent!important;background-clip:padding-box!important;border-radius:999px!important;min-width:28px!important;min-height:28px!important}",
"html body *::-webkit-scrollbar-thumb:hover{background:rgba(154,165,178,.82)!important;background-clip:padding-box!important}",
"html body *::-webkit-scrollbar-corner{background:transparent!important}",
/* Explorer/tree panes: horizontal scrolling is deliberate.  Child rows keep
   their natural width so the browser has something to scroll to. */
"body .tree,body .objectTree,body .apiTreeSide,body .fileList{overflow:auto!important;overflow-x:auto!important;overflow-y:auto!important;scrollbar-gutter:stable}",
"body .tree .treeRow,body .tree .row,body .objectTree .treeRow{width:max-content!important;min-width:100%!important}",
"body .tree .nodeText,body .tree .node,body .tree .treeLabel,body .objectTree .treeLabel{overflow:visible!important;text-overflow:clip!important;max-width:none!important;flex:0 0 auto!important;white-space:nowrap!important}",
/* Other long-content panes already support overflow; make horizontal access
   explicit without changing their internal layout. */
"body .terminalWrap,body .terminalViewport,body .codeViewport,body .resultBody,body .result-body,body .markdownPreviewBody,body .apiTreeMain,body .history{overflow-x:auto!important}",
/* Lists that intentionally have minimum-width rows must be allowed to drive a
   horizontal scrollbar rather than shrink their text into ellipses. */
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

var active=null,timer=0;

function visible(el){
 if(!el||!el.isConnected)return false;
 var s=getComputedStyle(el);
 if(s.display==="none"||s.visibility==="hidden"||Number(s.opacity)===0)return false;
 var r=el.getBoundingClientRect();
 return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth;
}
function clean(){
 clearTimeout(timer);
 if(active){
   active.classList.remove("simActionHighlight","simActionPulse");
   active=null;
 }
}
function findText(text,scope){
 if(!text)return null;
 var base=scope?document.querySelector(scope):document;
 if(!base)return null;
 var wanted=String(text).trim().toLowerCase();
 var nodes=base.querySelectorAll("button,[role=button],input,select,option,.treeRow,.row,.toolBtn,.resultTab,.tab,.menuTop,.ctxItem,[data-target],span,div");
 var best=null,bestLen=1e9;
 Array.prototype.forEach.call(nodes,function(el){
   if(!visible(el))return;
   var t=(el.textContent||el.value||el.getAttribute("aria-label")||el.title||"").trim().toLowerCase();
   if(!t||t.indexOf(wanted)<0)return;
   if(t.length<bestLen){best=el;bestLen=t.length;}
 });
 return best;
}
function find(plan){
 if(plan&&plan.text){
   var byText=findText(plan.text,plan.scope||null);
   if(byText)return byText;
 }
 var selectors=Array.isArray(plan&&plan.selectors)?plan.selectors:[];
 for(var i=0;i<selectors.length;i++){
   try{
     var el=document.querySelector(selectors[i]);
     if(el&&visible(el))return el;
   }catch(_){}
 }
 return null;
}
function highlight(plan){
 clean();
 var el=find(plan||{});
 if(!el)return;
 var r=el.getBoundingClientRect();
 var vw=Math.max(1,innerWidth),vh=Math.max(1,innerHeight);
 // Never draw guidance around an entire editor, pane, modal, canvas or page.
 // Those huge rectangles look like bugs and obscure the actual software UI.
 if((r.width>vw*.68&&r.height>72)||(r.height>vh*.48&&r.width>180)||(r.width*r.height>vw*vh*.34))return;
 try{el.scrollIntoView({block:"nearest",inline:"nearest",behavior:"auto"});}catch(_){}
 active=el;
 active.classList.add("simActionHighlight");
 // Global guidance contract: precise blue action glow remains visible for five seconds
 // so the learner has enough time to notice the intended control without obscuring the UI.
 var ms=Math.max(5000,Number(plan&&plan.duration)||0);
 timer=setTimeout(clean,ms);
}
window.addEventListener("message",function(e){
 var m=e.data||{};
 if(m.type==="SIM_HIGHLIGHT")highlight(m.plan||{});
 if(m.type==="SIM_HIGHLIGHT_CLEAR")clean();
});
try{parent.postMessage({type:"SIM_HIGHLIGHT_READY"},"*");}catch(_){}
})();