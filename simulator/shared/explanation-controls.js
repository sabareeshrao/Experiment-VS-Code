(function(){
"use strict";
if(window.__SIM_EXPLANATION_CONTROLS__) return;
window.__SIM_EXPLANATION_CONTROLS__=true;

var STYLE_ID="sim-explanation-controls-style";
if(!document.getElementById(STYLE_ID)){
  var style=document.createElement("style");
  style.id=STYLE_ID;
  style.textContent=[
    /* One explanation-card UI for every simulator.  Postman's compact card is
       the visual reference: neutral surface, quiet header, clear controls. */
    "[data-sim-explanation].simExplainUnified{position:fixed!important;z-index:20000!important;width:min(360px,calc(100vw - 18px));max-width:calc(100vw - 18px)!important;background:#242424!important;color:#e8e8e8!important;border:1px solid #4b4b4b!important;border-radius:6px!important;box-shadow:0 10px 34px rgba(0,0,0,.42)!important;overflow:hidden!important;user-select:none!important;touch-action:none!important}",
    "body.theme-light [data-sim-explanation].simExplainUnified{background:#fff!important;color:#222!important;border-color:#888!important;box-shadow:0 10px 34px rgba(0,0,0,.25)!important}",
    "[data-sim-explanation].simExplainUnified.hidden{display:none!important}",
    "[data-sim-explanation].simExplainUnified.show{display:block!important}",
    "[data-sim-explanation].simExplainUnified.minimized,[data-sim-explanation].simExplainUnified.min{height:auto!important;max-height:none!important}",
    "[data-sim-explanation].simExplainUnified.minimized .simExplainGlobalBody,[data-sim-explanation].simExplainUnified.min .simExplainGlobalBody{display:none!important}",

    ".simExplainGlobalHead{height:34px!important;min-height:34px!important;display:flex!important;align-items:center!important;gap:6px!important;padding:0 7px 0 9px!important;background:#2b2b2b!important;color:#f1f1f1!important;border:0!important;border-bottom:1px solid #444!important;font:700 10px/1 'Segoe UI',Arial,sans-serif!important;cursor:grab!important;touch-action:none!important;user-select:none!important}",
    "body.theme-light .simExplainGlobalHead{background:#f5f5f5!important;color:#222!important;border-bottom-color:#ddd!important}",
    ".simExplainDragging .simExplainGlobalHead{cursor:grabbing!important}",
    ".simExplainGlobalHead .grow{flex:1!important;min-width:6px!important}",
    ".simExplainGlobalHead strong,.simExplainGlobalHead #assistantTitle,.simExplainGlobalHead #pgAssistantTitle,.simExplainGlobalHead #ideAssistantTitle,.simExplainGlobalHead #ssmsAssistantTitle,.simExplainGlobalHead #jenkinsAssistantTitle{font:700 10px/1.2 'Segoe UI',Arial,sans-serif!important;color:inherit!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}",
    /* Remove simulator-specific decoration so every card looks like Postman. */
    ".simExplainGlobalHead .ideAssistantIcon,.simExplainGlobalHead .assistantIcon,.simExplainGlobalHead .pgAssistantIcon{display:none!important}",
    ".simExplainGlobalHead .ideAssistantTitles span,.simExplainGlobalHead .assistantTitles span,.simExplainGlobalHead .pgAssistantTitles span,.simExplainGlobalHead #ssmsAssistantStage{display:none!important}",
    ".simExplainGlobalHead .ideAssistantTitles,.simExplainGlobalHead .assistantTitles,.simExplainGlobalHead .pgAssistantTitles,.simExplainGlobalHead .assistantTitles{min-width:0!important;flex:1!important}",

    ".simExplainGlobalHead button,.simExplainSizeBtn{box-sizing:border-box!important;width:25px!important;min-width:25px!important;height:25px!important;min-height:25px!important;padding:0!important;margin:0!important;border:0!important;border-radius:4px!important;background:transparent!important;color:#ddd!important;box-shadow:none!important;outline:0!important;display:grid!important;place-items:center!important;font:600 15px/25px 'Segoe UI',Arial,sans-serif!important;text-align:center!important;opacity:1!important;visibility:visible!important;cursor:pointer!important}",
    "body.theme-light .simExplainGlobalHead button,body.theme-light .simExplainSizeBtn{color:#555!important}",
    ".simExplainGlobalHead button:hover,.simExplainSizeBtn:hover{background:#3a3a3a!important;color:#fff!important}",
    "body.theme-light .simExplainGlobalHead button:hover,body.theme-light .simExplainSizeBtn:hover{background:#e7e7e7!important;color:#111!important}",
    ".simExplainGlobalHead button:focus-visible,.simExplainSizeBtn:focus-visible{outline:2px solid #ff6c37!important;outline-offset:1px!important}",
    ".simExplainSizeControls{display:flex!important;align-items:center!important;gap:1px!important;margin-left:auto!important;flex:0 0 auto!important}",
    ".simExplainHeaderButtons,.jenkinsAssistantButtons{display:flex!important;align-items:center!important;gap:1px!important;flex:0 0 auto!important}",

    ".simExplainGlobalBody{padding:10px!important;background:#242424!important;color:#e6e6e6!important;font:10.5px/16px 'Segoe UI',Arial,sans-serif!important;line-height:1.55!important;max-height:210px!important;overflow:auto!important;user-select:text!important}",
    "body.theme-light .simExplainGlobalBody{background:#fff!important;color:#222!important}",
    ".simExplainGlobalBody p{margin:0!important}",
    ".simExplainGlobalBody [data-sim-explain-actions],.simExplainGlobalBody .simExplainActions,.simExplainGlobalBody .assistantMeta,.simExplainGlobalBody .jenkinsAssistantMeta,.simExplainGlobalBody .stepTag,.simExplainGlobalBody .assistantTag,.simExplainGlobalBody .pgAssistantTag,.assistantLang,.pgAssistantLanguage{display:none!important}",

    /* Explanation-card scrollbars follow Postman's unobtrusive treatment. */
    ".simExplainGlobalBody{scrollbar-width:thin!important;scrollbar-color:rgba(128,134,142,.62) transparent!important}",
    ".simExplainGlobalBody::-webkit-scrollbar{width:8px!important;height:8px!important}",
    ".simExplainGlobalBody::-webkit-scrollbar-track{background:transparent!important}",
    ".simExplainGlobalBody::-webkit-scrollbar-thumb{background:rgba(128,134,142,.55)!important;border:2px solid transparent!important;background-clip:padding-box!important;border-radius:999px!important}",
    ".simExplainGlobalBody::-webkit-scrollbar-thumb:hover{background:rgba(154,160,168,.76)!important;background-clip:padding-box!important}",

    /* Legacy selectors remain drag-compatible while the canonical classes are
       applied at runtime. */
    "[data-sim-explanation-drag],#ideAssistantDrag,#assistantHead,#pgAssistantHead,#ssmsAssistantDrag,#jiraAssistantHead,#jenkinsAssistantHead,.ideAssistantHead,.assistantHead,.pgAssistantHead{cursor:grab!important;touch-action:none!important;user-select:none!important}"
  ].join("");
  document.head.appendChild(style);
}

var assistantSelectors=["[data-sim-explanation]","#ideAssistant","#assistant","#pgAssistant","#postmanAssistant","#cmdAssistant","#linuxAssistant","#ssmsAssistant","#jiraAssistant","#jenkinsAssistant"];
var metaSelectors=["#ideAssistantStep","#assistantStep","#pgAssistantStep","#assistantMeta","#ssmsAssistantMeta","#jenkinsAssistantMeta"];
var textSelectors=["#ideAssistantText","#assistantText","#pgAssistantText","#ssmsAssistantText","#jiraAssistantBody","#jenkinsAssistantBody"];
var scaleKey="sim.explanationScale.v1";
var positionKey="sim.explanationPosition.v1";
var dragPending=false;
var universalDrag=null;

function firstWithin(root,selectors){
  for(var i=0;i<selectors.length;i++){
    var el=root.querySelector(selectors[i]);
    if(el)return el;
  }
  return null;
}
function getAssistant(){
  for(var i=0;i<assistantSelectors.length;i++){
    var el=document.querySelector(assistantSelectors[i]);
    if(el)return el;
  }
  return null;
}
function getHead(box){
  return firstWithin(box,["[data-sim-explanation-drag]","#ideAssistantDrag","#assistantHead","#pgAssistantHead","#ssmsAssistantDrag","#jiraAssistantHead","#jenkinsAssistantHead",".ideAssistantHead",".assistantHead",".pgAssistantHead"]);
}
function getBody(box){
  return firstWithin(box,["[data-sim-explanation-body]",".ideAssistantBody",".assistantBody",".pgAssistantBody",".jenkinsAssistantContent"]);
}
function applyUnifiedClasses(box){
  if(!box)return;
  box.classList.add("simExplainUnified");
  box.setAttribute("data-sim-explanation","1");
  var head=getHead(box),body=getBody(box);
  if(head)head.classList.add("simExplainGlobalHead");
  if(body)body.classList.add("simExplainGlobalBody");
  /* Jenkins keeps its text body one level deeper; the content wrapper is the
     shared body, so normalize its padding while preserving the actual text. */
  var jenkinsButtons=head&&head.querySelector(".jenkinsAssistantButtons");
  if(jenkinsButtons)jenkinsButtons.classList.add("simExplainHeaderButtons");
}
function getMeta(box){
  var meta=firstWithin(box,metaSelectors);
  if(meta)return meta;
  var body=getBody(box);
  if(!body)return null;
  meta=document.createElement("div");
  meta.className="simExplainActions";
  meta.setAttribute("data-sim-explain-actions","1");
  body.insertBefore(meta,body.firstChild);
  return meta;
}
function getText(box){
  return firstWithin(box,textSelectors);
}
function getScale(){
  var n=parseInt(localStorage.getItem(scaleKey)||"0",10);
  return Number.isFinite(n)?Math.max(-2,Math.min(4,n)):0;
}
function readPosition(){
  try{
    var raw=localStorage.getItem(positionKey);
    if(!raw)return null;
    var p=JSON.parse(raw);
    if(!Number.isFinite(p.left)||!Number.isFinite(p.top))return null;
    return p;
  }catch(_){return null;}
}
function savePosition(){
  var box=getAssistant();
  if(!box)return;
  var r=box.getBoundingClientRect();
  if(!r.width||!r.height)return;
  var maxLeft=Math.max(0,innerWidth-r.width);
  var maxTop=Math.max(0,innerHeight-r.height);
  var left=Math.max(0,Math.min(maxLeft,r.left));
  var top=Math.max(0,Math.min(maxTop,r.top));
  try{
    localStorage.setItem(positionKey,JSON.stringify({
      left:left,
      top:top,
      viewportWidth:innerWidth,
      viewportHeight:innerHeight
    }));
  }catch(_){}
}
function defaultPosition(box){
  box.style.left="auto";
  box.style.top="auto";
  box.style.right="16px";
  box.style.bottom="38px";
}
function restorePosition(){
  var box=getAssistant();
  if(!box)return;
  var p=readPosition();
  if(!p){
    defaultPosition(box);
    return;
  }

  var r=box.getBoundingClientRect();
  var left=p.left;
  var top=p.top;

  if(p.viewportWidth&&Math.abs(innerWidth-p.viewportWidth)>24){
    left=left*(innerWidth/p.viewportWidth);
  }
  if(p.viewportHeight&&Math.abs(innerHeight-p.viewportHeight)>24){
    top=top*(innerHeight/p.viewportHeight);
  }

  left=Math.max(4,Math.min(Math.max(4,innerWidth-r.width-4),left));
  top=Math.max(4,Math.min(Math.max(4,innerHeight-r.height-4),top));

  box.style.right="auto";
  box.style.bottom="auto";
  box.style.left=Math.round(left)+"px";
  box.style.top=Math.round(top)+"px";
}
function bindPositionPersistence(){
  var box=getAssistant();
  if(!box||box.dataset.simPositionBound==="1")return;
  var head=getHead(box);
  if(!head)return;
  box.dataset.simPositionBound="1";
  box.setAttribute("data-sim-explanation","1");
  head.setAttribute("data-sim-explanation-drag","1");

  // One universal drag implementation for every simulator. We intercept in
  // document capture phase so legacy per-simulator drag handlers cannot fight
  // with this shared behavior.
  document.addEventListener("pointerdown",function(e){
    var targetHead=e.target.closest("[data-sim-explanation-drag]");
    if(!targetHead||!box.contains(targetHead)||e.target.closest("button"))return;
    var r=box.getBoundingClientRect();
    universalDrag={
      pointerId:e.pointerId,
      dx:e.clientX-r.left,
      dy:e.clientY-r.top
    };
    dragPending=true;
    box.classList.add("simExplainDragging");
    box.style.right="auto";
    box.style.bottom="auto";
    box.style.left=Math.round(r.left)+"px";
    box.style.top=Math.round(r.top)+"px";
    try{targetHead.setPointerCapture?.(e.pointerId)}catch(_){}
    e.preventDefault();
    e.stopImmediatePropagation();
  },true);

  document.addEventListener("pointermove",function(e){
    if(!universalDrag||e.pointerId!==universalDrag.pointerId)return;
    var r=box.getBoundingClientRect(),pad=4;
    var left=Math.max(pad,Math.min(innerWidth-r.width-pad,e.clientX-universalDrag.dx));
    var top=Math.max(pad,Math.min(innerHeight-r.height-pad,e.clientY-universalDrag.dy));
    box.style.left=Math.round(left)+"px";
    box.style.top=Math.round(top)+"px";
    box.style.right="auto";
    box.style.bottom="auto";
    e.preventDefault();
    e.stopImmediatePropagation();
  },true);

  function finishDrag(e){
    if(!universalDrag||e.pointerId!==universalDrag.pointerId)return;
    universalDrag=null;
    dragPending=false;
    box.classList.remove("simExplainDragging");
    savePosition();
    restorePosition();
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  document.addEventListener("pointerup",finishDrag,true);
  document.addEventListener("pointercancel",finishDrag,true);
}
function rememberBase(box,body,text){
  if(!box.dataset.simExplainBaseWidth)box.dataset.simExplainBaseWidth="360";
  if(!box.dataset.simExplainBaseFont)box.dataset.simExplainBaseFont="10.5";
}
function applyScale(){
  var box=getAssistant();
  if(!box)return;
  var body=getBody(box),text=getText(box),level=getScale();
  rememberBase(box,body,text);
  var baseWidth=parseFloat(box.dataset.simExplainBaseWidth)||340;
  var baseFont=parseFloat(box.dataset.simExplainBaseFont)||11;
  var width=Math.max(240,baseWidth+(level*58));
  var font=Math.max(9,baseFont+(level*1.45));
  box.style.width="min("+Math.round(width)+"px, calc(100vw - 18px))";
  box.style.maxWidth="calc(100vw - 18px)";
  if(body){
    body.style.fontSize=font.toFixed(1)+"px";
    body.style.lineHeight="1.58";
  }
  if(text){
    text.style.fontSize="inherit";
    text.style.lineHeight="inherit";
  }
  requestAnimationFrame(restorePosition);
}
function changeScale(delta){
  var next=Math.max(-2,Math.min(4,getScale()+delta));
  localStorage.setItem(scaleKey,String(next));
  applyScale();
}
function ensureControls(){
  var box=getAssistant();
  if(!box)return;
  applyUnifiedClasses(box);
  bindPositionPersistence();
  var head=getHead(box);
  if(!head||head.querySelector(".simExplainSizeControls")){applyScale();return;}

  var wrap=document.createElement("span");
  wrap.className="simExplainSizeControls";

  var minus=document.createElement("button");
  minus.type="button";
  minus.className="simExplainSizeBtn";
  minus.textContent="−";
  minus.title="Decrease explanation box and font size";

  var plus=document.createElement("button");
  plus.type="button";
  plus.className="simExplainSizeBtn";
  plus.textContent="+";
  plus.title="Increase explanation box and font size";

  minus.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();changeScale(-1);});
  plus.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();changeScale(1);});

  wrap.appendChild(minus);wrap.appendChild(plus);

  var anchor=head.querySelector('[id$="Min"],[id$="Close"],button');
  if(anchor&&anchor.parentNode){
    anchor.parentNode.insertBefore(wrap,anchor);
    if(anchor.parentNode!==head)anchor.parentNode.classList.add("simExplainHeaderButtons");
  }else head.appendChild(wrap);

  applyScale();
}
function hideExplanationMeta(box){
  var selectors=metaSelectors.concat(["[data-sim-explain-actions]"]);
  selectors.forEach(function(selector){
    Array.prototype.forEach.call(box.querySelectorAll(selector),function(el){
      el.style.display="none";
      el.setAttribute("aria-hidden","true");
    });
  });
}
function hideLanguageLabels(box){
  Array.prototype.forEach.call(box.querySelectorAll(".assistantLang,.pgAssistantLanguage"),function(el){el.style.display="none";});
}
function refresh(m){
  var box=getAssistant();
  if(!box)return;
  applyUnifiedClasses(box);
  box.classList.remove("hidden","minimized","min");
  box.classList.add("show");
  box.style.display="";
  ensureControls();
  hideLanguageLabels(box);
  hideExplanationMeta(box);
  applyScale();
  requestAnimationFrame(restorePosition);
}

window.addEventListener("message",function(e){
  var m=e.data||{};
  if(m.type==="SIM_EXPLAIN"){
    // Engine listeners run first; update the metadata afterward so old
    // "Step / Telugu (Romanized)" labels never remain visible.
    setTimeout(function(){refresh(m);},0);
  }
});

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",function(){
    ensureControls();
    requestAnimationFrame(restorePosition);
  });
}else{
  ensureControls();
  requestAnimationFrame(restorePosition);
}

window.addEventListener("resize",function(){
  applyScale();
  requestAnimationFrame(restorePosition);
});
})();