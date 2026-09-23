(function(){
"use strict";
var VERSION=21;
if(Number(window.__SIM_EXPLANATION_CONTROLS_VERSION__||0)>=VERSION)return;
window.__SIM_EXPLANATION_CONTROLS_VERSION__=VERSION;
window.__SIM_EXPLANATION_CONTROLS__=true;

var IS_EMBEDDED=window.self!==window.top;
var IS_PLAYER=document.body&&document.body.dataset&&document.body.dataset.simPlayer==="1";
var STORAGE_KEY="sim.explanation.v3";
var HOST_ID="globalSimAssistant";
var raf=0,drag=null,resizeObserver=null,lastSignature="";

function clamp(n,min,max){return Math.max(min,Math.min(max,n))}
function readState(){
  var fallback={left:null,top:null,viewportWidth:0,viewportHeight:0,scale:0,minimized:false};
  try{
    var x=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")||{};
    return Object.assign(fallback,x);
  }catch(_){return fallback}
}
var pref=readState();
function save(){
  try{
    localStorage.setItem(STORAGE_KEY,JSON.stringify({
      left:Number.isFinite(pref.left)?pref.left:null,
      top:Number.isFinite(pref.top)?pref.top:null,
      viewportWidth:innerWidth,
      viewportHeight:innerHeight,
      scale:clamp(Number(pref.scale)||0,-2,4),
      minimized:!!pref.minimized
    }));
  }catch(_){}
}
function suppressLegacyAssistants(){
  if(!IS_EMBEDDED)return;
  var nodes=document.querySelectorAll('[data-sim-explanation]:not(#'+HOST_ID+'),#ideAssistant,#assistant,#pgAssistant,#postmanAssistant,#cmdAssistant,#linuxAssistant,#ssmsAssistant,#jiraAssistant,#jenkinsAssistant,#mysqlWorkbenchAssistant,#k8sAssistant');
  nodes.forEach(function(el){
    try{
      el.classList.add("hidden");
      el.classList.remove("show");
      el.setAttribute("aria-hidden","true");
      el.style.setProperty("display","none","important");
      el.style.setProperty("visibility","hidden","important");
      el.style.setProperty("pointer-events","none","important");
      el.style.setProperty("height","0","important");
      el.style.setProperty("max-height","0","important");
      el.style.setProperty("overflow","hidden","important");
    }catch(_){}
  });
}
var legacyObserver=null;
function watchLegacyAssistants(){
  if(!IS_EMBEDDED||legacyObserver||typeof MutationObserver!=="function")return;
  suppressLegacyAssistants();
  legacyObserver=new MutationObserver(function(){suppressLegacyAssistants()});
  try{legacyObserver.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["class","style","hidden"]})}catch(_){}
}

function ensureStyle(){
  if(document.getElementById("sim-global-explanation-style-v3"))return;
  var s=document.createElement("style");
  s.id="sim-global-explanation-style-v3";
  s.textContent=[
    "#"+HOST_ID+"{position:fixed;z-index:2147480000;display:none;width:360px;max-width:calc(100vw - 20px);background:#24262a;color:#eceef2;border:1px solid #50545c;border-radius:7px;box-shadow:0 12px 34px rgba(0,0,0,.42);overflow:hidden;font-family:'Segoe UI',Arial,sans-serif;box-sizing:border-box}",
    "#"+HOST_ID+".show{display:block}",
    "#"+HOST_ID+".hidden{display:none!important}",
    "#"+HOST_ID+" .simExplainGlobalHead{height:34px;min-height:34px;display:flex;align-items:center;gap:5px;padding:0 7px 0 10px;background:#2e3035;border-bottom:1px solid #454850;cursor:grab;user-select:none;touch-action:none;box-sizing:border-box}",
    "#"+HOST_ID+".dragging .simExplainGlobalHead{cursor:grabbing}",
    "#"+HOST_ID+" [data-sim-explanation-title]{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px;line-height:1.2;font-weight:700;color:#f3f4f6}",
    "#"+HOST_ID+" .simExplainControls{display:flex;align-items:center;gap:1px;flex:none}",
    "#"+HOST_ID+" button{width:25px;height:25px;min-width:25px;border:0;border-radius:4px;background:transparent;color:#d7dae0;display:grid;place-items:center;padding:0;cursor:pointer;font:600 14px/25px 'Segoe UI',Arial,sans-serif}",
    "#"+HOST_ID+" button:hover{background:#3a3d43;color:#fff}",
    "#"+HOST_ID+" button:focus-visible{outline:2px solid #7aa2ff;outline-offset:1px}",
    "#"+HOST_ID+" .simExplainGlobalBody{padding:10px 11px;background:#24262a;color:#e7e9ed;font-size:10.5px;line-height:1.55;box-sizing:border-box;overflow-y:auto;overflow-x:hidden;user-select:text;scrollbar-width:thin!important;scrollbar-color:#656b75 transparent!important}",
    "#"+HOST_ID+" .simExplainGlobalBody::-webkit-scrollbar{display:block!important;width:8px!important;height:8px!important}",
    "#"+HOST_ID+" .simExplainGlobalBody::-webkit-scrollbar-thumb{background:#656b75;border:2px solid transparent;background-clip:padding-box;border-radius:999px}",
    "#"+HOST_ID+" [data-sim-explanation-text]{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}",
    "#"+HOST_ID+" .simExplainAnswer{display:none;margin-top:9px;padding:8px 9px;border:1px solid #50545c;border-radius:5px;background:#1e2024;white-space:pre-wrap;overflow-wrap:anywhere}",
    "#"+HOST_ID+" .simExplainAnswer.show{display:block}",
    "#"+HOST_ID+" .simExplainAnswer:before{content:'Answer';display:block;margin-bottom:4px;color:#aeb3bc;font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}",
    "#"+HOST_ID+".minimized .simExplainGlobalBody{display:none!important}",
    "#"+HOST_ID+".minimized{height:34px!important;max-height:34px!important}",
    "#"+HOST_ID+".minimized .simExplainGlobalHead{border-bottom:0}",
    IS_EMBEDDED?"[data-sim-explanation]:not(#"+HOST_ID+"),#ideAssistant,#assistant,#pgAssistant,#postmanAssistant,#cmdAssistant,#linuxAssistant,#ssmsAssistant,#jiraAssistant,#jenkinsAssistant{display:none!important;visibility:hidden!important;pointer-events:none!important}":""
  ].join("\n");
  document.head.appendChild(s);
}
function ensureHost(){
  ensureStyle();
  var box=document.getElementById(HOST_ID);
  if(box)return box;
  box=document.createElement("aside");
  box.id=HOST_ID;
  box.className="hidden";
  box.setAttribute("data-sim-explanation","global");
  box.innerHTML='<div class="simExplainGlobalHead" data-sim-explanation-drag><strong data-sim-explanation-title>Lesson explanation</strong><div class="simExplainControls"><button type="button" data-sim-explanation-smaller title="Smaller">−</button><button type="button" data-sim-explanation-larger title="Larger">+</button><button type="button" data-sim-explanation-min title="Minimize">▁</button><button type="button" data-sim-explanation-close title="Close">×</button></div></div><div class="simExplainGlobalBody" data-sim-explanation-body><p data-sim-explanation-text></p><div class="simExplainAnswer"></div></div>';
  document.body.appendChild(box);
  bind(box);
  applyScale(box,false);
  restorePosition(box);
  observe(box);
  return box;
}
function bodyOf(box){return box.querySelector(".simExplainGlobalBody")}
function headOf(box){return box.querySelector(".simExplainGlobalHead")}
function widthForScale(){
  return clamp(360+(clamp(Number(pref.scale)||0,-2,4)*54),252,576);
}
function applyScale(box,saveAfter){
  var width=Math.min(widthForScale(),Math.max(252,innerWidth-20));
  box.style.width=Math.round(width)+"px";
  var body=bodyOf(box);
  if(body){
    var font=clamp(10.5+(Number(pref.scale)||0)*1.15,9,15.1);
    body.style.fontSize=font.toFixed(1)+"px";
  }
  clampPosition(box,false);
  scheduleFit(box);
  if(saveAfter)save();
}
function initialPosition(box){
  var r=box.getBoundingClientRect();
  var left=Math.max(10,innerWidth-r.width-18);
  var top=Math.min(Math.max(12,68),Math.max(12,innerHeight-60));
  pref.left=left;pref.top=top;pref.viewportWidth=innerWidth;pref.viewportHeight=innerHeight;
}
function restorePosition(box){
  if(!Number.isFinite(pref.left)||!Number.isFinite(pref.top)){
    initialPosition(box);
  }else{
    var left=pref.left,top=pref.top;
    if(pref.viewportWidth&&Math.abs(innerWidth-pref.viewportWidth)>24)left*=innerWidth/pref.viewportWidth;
    if(pref.viewportHeight&&Math.abs(innerHeight-pref.viewportHeight)>24)top*=innerHeight/pref.viewportHeight;
    pref.left=left;pref.top=top;
  }
  box.style.right="auto";box.style.bottom="auto";
  box.style.left=Math.round(pref.left)+"px";
  box.style.top=Math.round(pref.top)+"px";
  clampPosition(box,true);
}
function clampPosition(box,saveAfter){
  var r=box.getBoundingClientRect(),pad=8;
  var maxLeft=Math.max(pad,innerWidth-r.width-pad);
  var maxTop=Math.max(pad,innerHeight-Math.min(r.height,innerHeight-pad*2)-pad);
  var left=clamp(Number(pref.left)||pad,pad,maxLeft);
  var top=clamp(Number(pref.top)||pad,pad,maxTop);
  pref.left=left;pref.top=top;
  box.style.left=Math.round(left)+"px";box.style.top=Math.round(top)+"px";
  if(saveAfter)save();
}
function fitHeight(box){
  if(!box||box.classList.contains("hidden")||box.classList.contains("minimized"))return;
  var body=bodyOf(box),head=headOf(box);
  if(!body||!head)return;

  var pad=8;
  var headH=head.getBoundingClientRect().height||34;

  // Always measure the content at its natural height first. A previous fit
  // must never become the next lesson's artificial height.
  box.style.height="auto";
  box.style.maxHeight="none";
  body.style.maxHeight="none";
  body.style.overflowY="visible";

  var naturalBody=Math.max(0,body.scrollHeight);
  var viewportBodyMax=Math.max(64,innerHeight-headH-(pad*2));
  var desiredBody=Math.min(naturalBody,viewportBodyMax);
  var desiredTotal=headH+desiredBody+2;

  // If the complete card can fit in the viewport but the user's saved top
  // position leaves too little room below, move the card upward once instead
  // of crushing the body to the old 64px floor.
  var top=box.getBoundingClientRect().top;
  var maxTop=Math.max(pad,innerHeight-desiredTotal-pad);
  if(top>maxTop){
    top=maxTop;
    pref.top=top;
    box.style.top=Math.round(top)+"px";
    save();
  }

  var availableBody=Math.max(64,innerHeight-top-headH-pad);
  var finalMax=Math.min(viewportBodyMax,availableBody);

  if(naturalBody>finalMax+1){
    body.style.maxHeight=Math.floor(finalMax)+"px";
    body.style.overflowY="auto";
  }else{
    body.style.maxHeight="none";
    body.style.overflowY="visible";
  }
}
function scheduleFit(box){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(function(){fitHeight(box)});
}
function observe(box){
  if(typeof ResizeObserver!=="function")return;
  try{
    if(resizeObserver)resizeObserver.disconnect();
    resizeObserver=new ResizeObserver(function(){scheduleFit(box)});
    var text=box.querySelector("[data-sim-explanation-text]");
    var answer=box.querySelector(".simExplainAnswer");
    if(text)resizeObserver.observe(text);
    if(answer)resizeObserver.observe(answer);
  }catch(_){}
}
function bind(box){
  if(box.dataset.bound==="1")return;
  box.dataset.bound="1";
  var head=headOf(box);
  box.querySelector("[data-sim-explanation-smaller]").onclick=function(e){e.stopPropagation();pref.scale=clamp((Number(pref.scale)||0)-1,-2,4);applyScale(box,true)};
  box.querySelector("[data-sim-explanation-larger]").onclick=function(e){e.stopPropagation();pref.scale=clamp((Number(pref.scale)||0)+1,-2,4);applyScale(box,true)};
  box.querySelector("[data-sim-explanation-min]").onclick=function(e){e.stopPropagation();pref.minimized=!pref.minimized;box.classList.toggle("minimized",pref.minimized);save();scheduleFit(box)};
  box.querySelector("[data-sim-explanation-close]").onclick=function(e){e.stopPropagation();box.classList.add("hidden");box.classList.remove("show")};
  head.addEventListener("pointerdown",function(e){
    if(e.button!==0||e.target.closest("button"))return;
    var r=box.getBoundingClientRect();
    drag={id:e.pointerId,dx:e.clientX-r.left,dy:e.clientY-r.top};
    box.classList.add("dragging");
    try{head.setPointerCapture(e.pointerId)}catch(_){}
    e.preventDefault();
  });
  head.addEventListener("pointermove",function(e){
    if(!drag||e.pointerId!==drag.id)return;
    var r=box.getBoundingClientRect(),pad=8;
    pref.left=clamp(e.clientX-drag.dx,pad,Math.max(pad,innerWidth-r.width-pad));
    pref.top=clamp(e.clientY-drag.dy,pad,Math.max(pad,innerHeight-r.height-pad));
    box.style.left=Math.round(pref.left)+"px";box.style.top=Math.round(pref.top)+"px";
    scheduleFit(box);
    e.preventDefault();
  });
  function end(e){
    if(!drag||e.pointerId!==drag.id)return;
    drag=null;box.classList.remove("dragging");save();scheduleFit(box);
    try{head.releasePointerCapture(e.pointerId)}catch(_){}
  }
  head.addEventListener("pointerup",end);
  head.addEventListener("pointercancel",end);
}
function show(payload){
  payload=payload||{};
  var signature=[payload.title||"",payload.text||"",payload.answer||"",payload.stage||""].join("\u0001");
  var box=ensureHost();
  if(signature===lastSignature&&!box.classList.contains("hidden")){
    // Same lesson may be requested again after iframe hydration/seek completion.
    // Do not rebuild/re-measure the card; that is what caused visible shaking.
    return box;
  }
  lastSignature=signature;
  var title=box.querySelector("[data-sim-explanation-title]");
  var text=box.querySelector("[data-sim-explanation-text]");
  var answer=box.querySelector(".simExplainAnswer");
  title.textContent=payload.title||"Lesson explanation";
  text.textContent=payload.text||"";
  if(payload.answer){answer.textContent=String(payload.answer);answer.classList.add("show")}
  else{answer.textContent="";answer.classList.remove("show")}
  box.classList.remove("hidden");
  box.classList.add("show");
  box.classList.toggle("minimized",!!pref.minimized);
  applyScale(box,false);
  if(!Number.isFinite(pref.left)||!Number.isFinite(pref.top))initialPosition(box);
  restorePosition(box);
  scheduleFit(box);
  return box;
}
function hide(){
  var box=document.getElementById(HOST_ID);
  if(box){box.classList.add("hidden");box.classList.remove("show")}
}
function resetPosition(){
  var box=ensureHost();pref.left=null;pref.top=null;initialPosition(box);restorePosition(box);save();scheduleFit(box);
}
window.SIM_EXPLANATION={show:show,hide:hide,resetPosition:resetPosition,getElement:function(){return ensureHost()},fit:function(){scheduleFit(ensureHost())},version:VERSION};
window.addEventListener("message",function(e){
  var m=e.data||{};
  if(m.type==="SIM_EXPLAIN")show(m);
});
window.addEventListener("resize",function(){
  var box=document.getElementById(HOST_ID);
  if(!box)return;
  applyScale(box,false);
  clampPosition(box,true);
  scheduleFit(box);
});
document.addEventListener("keydown",function(e){
  if(e.key!=="Escape")return;
  var box=document.getElementById(HOST_ID);
  if(box&&!box.classList.contains("hidden"))hide();
},true);

// In embedded simulators this runtime only suppresses legacy/native assistants.
// The player owns the one visible global card.
ensureStyle();
if(IS_EMBEDDED)watchLegacyAssistants();
if(IS_PLAYER)ensureHost();
})();