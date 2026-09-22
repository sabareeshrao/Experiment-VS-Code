(function(){
"use strict";
if(window.__SIM_HIGHLIGHT_READY__) return;
window.__SIM_HIGHLIGHT_READY__=true;

var style=document.createElement("style");
style.textContent=[
".simActionHighlight{position:relative!important;z-index:2147483000!important;outline:2px solid #4da3ff!important;outline-offset:2px!important;box-shadow:0 0 0 4px rgba(77,163,255,.18),0 0 18px rgba(77,163,255,.42)!important;border-radius:4px!important;transition:box-shadow .12s ease,outline-color .12s ease!important}",
".simActionHighlight.simActionPulse{animation:simActionPulse .75s ease-out 1}",
"@keyframes simActionPulse{0%{box-shadow:0 0 0 0 rgba(77,163,255,.55),0 0 10px rgba(77,163,255,.35)}65%{box-shadow:0 0 0 7px rgba(77,163,255,.10),0 0 20px rgba(77,163,255,.42)}100%{box-shadow:0 0 0 4px rgba(77,163,255,.18),0 0 18px rgba(77,163,255,.42)}}"
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
 try{el.scrollIntoView({block:"nearest",inline:"nearest",behavior:"auto"});}catch(_){}
 active=el;
 active.classList.add("simActionHighlight");
 void active.offsetWidth;
 active.classList.add("simActionPulse");
 var ms=Math.max(550,Math.min(2200,Number(plan&&plan.duration)||1100));
 timer=setTimeout(clean,ms);
}
window.addEventListener("message",function(e){
 var m=e.data||{};
 if(m.type==="SIM_HIGHLIGHT")highlight(m.plan||{});
 if(m.type==="SIM_HIGHLIGHT_CLEAR")clean();
});
try{parent.postMessage({type:"SIM_HIGHLIGHT_READY"},"*");}catch(_){}
})();