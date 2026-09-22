(function(){
"use strict";
if(window.__SIM_EXPLANATION_CONTROLS__) return;
window.__SIM_EXPLANATION_CONTROLS__=true;

var STYLE_ID="sim-explanation-controls-style";
if(!document.getElementById(STYLE_ID)){
  var style=document.createElement("style");
  style.id=STYLE_ID;
  style.textContent=[
    ".simExplainSizeControls{display:flex;align-items:center;gap:2px;margin-left:4px}",
    ".simExplainSizeBtn{width:24px!important;min-width:24px!important;height:24px!important;padding:0!important;border:0!important;border-radius:4px!important;background:transparent!important;color:#c9c9c9!important;font:600 14px/24px 'Segoe UI',Arial,sans-serif!important;text-align:center!important}",
    ".simExplainSizeBtn:hover{background:rgba(255,255,255,.10)!important;color:#fff!important}",
    ".simExplainActions{display:block!important;margin:0 0 7px!important;padding:3px 7px!important;border-radius:4px!important;background:rgba(255,255,255,.055)!important;border:1px solid rgba(255,255,255,.10)!important;color:#c6c9cf!important;font-size:.88em!important;line-height:1.4!important;white-space:normal!important;overflow-wrap:anywhere!important}",
    ".assistantLang,.pgAssistantLanguage{display:none!important}",
    "#ideAssistant,#assistant,#pgAssistant,#postmanAssistant,#cmdAssistant,#linuxAssistant,#ssmsAssistant,#jiraAssistant{z-index:20000!important}"
  ].join("");
  document.head.appendChild(style);
}

var assistantSelectors=["#ideAssistant","#assistant","#pgAssistant","#postmanAssistant","#cmdAssistant","#linuxAssistant","#ssmsAssistant","#jiraAssistant"];
var metaSelectors=["#ideAssistantStep","#assistantStep","#pgAssistantStep","#assistantMeta","#ssmsAssistantMeta"];
var textSelectors=["#ideAssistantText","#assistantText","#pgAssistantText","#ssmsAssistantText","#jiraAssistantBody"];
var scaleKey="sim.explanationScale.v1";

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
  return firstWithin(box,["#ideAssistantDrag","#assistantHead","#pgAssistantHead","#ssmsAssistantDrag",".ideAssistantHead",".assistantHead",".pgAssistantHead"]);
}
function getBody(box){
  return firstWithin(box,[".ideAssistantBody",".assistantBody",".pgAssistantBody"]);
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
function rememberBase(box,body,text){
  if(!box.dataset.simExplainBaseWidth){
    var width=parseFloat(getComputedStyle(box).width)||340;
    box.dataset.simExplainBaseWidth=String(width);
  }
  var target=text||body;
  if(target&&!box.dataset.simExplainBaseFont){
    var font=parseFloat(getComputedStyle(target).fontSize)||11;
    box.dataset.simExplainBaseFont=String(font);
  }
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
}
function changeScale(delta){
  var next=Math.max(-2,Math.min(4,getScale()+delta));
  localStorage.setItem(scaleKey,String(next));
  applyScale();
}
function ensureControls(){
  var box=getAssistant();
  if(!box)return;
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
  if(anchor)head.insertBefore(wrap,anchor);
  else head.appendChild(wrap);

  applyScale();
}
function setActions(text){
  var box=getAssistant();
  if(!box)return;
  var meta=getMeta(box);
  if(!meta)return;
  meta.classList.add("simExplainActions");
  meta.textContent=text||"Action";
  meta.removeAttribute("title");
}
function hideLanguageLabels(box){
  Array.prototype.forEach.call(box.querySelectorAll(".assistantLang,.pgAssistantLanguage"),function(el){el.style.display="none";});
}
function refresh(m){
  var box=getAssistant();
  if(!box)return;
  box.classList.remove("hidden","minimized","min");
  box.classList.add("show");
  box.style.display="";
  ensureControls();
  hideLanguageLabels(box);
  setActions(m&&m.actionTrail?m.actionTrail:"Actions performed");
  applyScale();
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
  document.addEventListener("DOMContentLoaded",function(){ensureControls();});
}else ensureControls();

window.addEventListener("resize",applyScale);
})();