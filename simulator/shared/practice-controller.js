(()=>{"use strict";
if(window.__SIM_PRACTICE_CONTROLLER__)return;
window.__SIM_PRACTICE_CONTROLLER__=true;
const TARGET_ORIGIN=location.origin==="null"?"*":location.origin;
let active=null,targetEl=null,promptEl=null,typeShell=null,typeInput=null,typedEl=null,ghostEl=null,clickHandler=null,positionHandler=null,typed="",expected="";
function post(type,extra={}){try{parent.postMessage({type,...extra},TARGET_ORIGIN)}catch(_){}}
function ensureUi(){
 if(promptEl)return;
 const style=document.createElement("style");
 style.textContent=`
 .sim-practice-target{outline:3px solid #4da3ff!important;outline-offset:3px!important;box-shadow:0 0 0 2px rgba(77,163,255,.18),0 0 18px rgba(77,163,255,.75)!important;animation:simPracticePulse 1.25s ease-in-out infinite!important}
 @keyframes simPracticePulse{50%{box-shadow:0 0 0 5px rgba(77,163,255,.15),0 0 26px rgba(77,163,255,.85)!important}}
 .sim-practice-prompt{position:fixed;z-index:2147483600;max-width:min(390px,calc(100vw - 18px));padding:9px 12px;border:1px solid #4da3ff;border-radius:8px;background:#10243b;color:#f4f8ff;font:600 12px/17px "Segoe UI",Arial,sans-serif;box-shadow:0 10px 28px #0009;pointer-events:none}
 .sim-practice-prompt::before{content:"PRACTICE";display:block;margin-bottom:3px;color:#79bbff;font-size:9px;letter-spacing:.12em}
 .sim-practice-prompt.wrong{border-color:#ff6b6b;background:#371719}.sim-practice-prompt.wrong::before{content:"TRY AGAIN";color:#ff9999}
 .sim-practice-type{position:fixed;z-index:2147483590;border:2px solid #4da3ff;border-radius:6px;background:rgba(19,22,27,.96);box-shadow:0 0 22px rgba(77,163,255,.45);overflow:auto;pointer-events:auto}
 .sim-practice-type pre{position:absolute;inset:0;margin:0;padding:10px 12px;white-space:pre-wrap;overflow-wrap:anywhere;font:12px/19px Consolas,"Courier New",monospace;tab-size:4}
 .sim-practice-ghost{color:rgba(220,232,245,.27)}.sim-practice-typed{color:#f2f5f8;pointer-events:none}.sim-practice-typed .bad{color:#ff6b6b;text-decoration:underline}
 .sim-practice-capture{position:absolute;inset:0;width:100%;height:100%;opacity:.001;background:transparent;color:transparent;border:0;outline:0;resize:none;caret-color:transparent}
 `;
 document.head.appendChild(style);
 promptEl=document.createElement("div");promptEl.className="sim-practice-prompt";promptEl.hidden=true;document.body.appendChild(promptEl);
}
function resolveTarget(name){
 const map=window.SIM_PRACTICE_TARGETS||{},def=map[name];
 if(typeof def==="function")return def();
 if(typeof def==="string")return document.querySelector(def);
 if(def&&typeof def.selector==="string")return document.querySelector(def.selector);
 return null;
}
function clearTarget(){
 if(targetEl)targetEl.classList.remove("sim-practice-target");
 targetEl=null;
 if(clickHandler){document.removeEventListener("click",clickHandler,true);clickHandler=null}
 if(positionHandler){window.removeEventListener("resize",positionHandler,true);window.removeEventListener("scroll",positionHandler,true);positionHandler=null}
 if(typeShell){typeShell.remove();typeShell=null;typeInput=null;typedEl=null;ghostEl=null}
}
function stop(){clearTarget();active=null;if(promptEl){promptEl.hidden=true;promptEl.classList.remove("wrong")}}
function prompt(text){ensureUi();promptEl.textContent=text||"Complete the highlighted action.";promptEl.hidden=false;promptEl.classList.remove("wrong");placeUi()}
function placeUi(){
 if(!targetEl||!promptEl)return;
 const r=targetEl.getBoundingClientRect(),pw=Math.min(390,innerWidth-18);
 let left=Math.max(9,Math.min(innerWidth-pw-9,r.left));
 let top=r.bottom+9;
 if(top+70>innerHeight)top=Math.max(9,r.top-78);
 promptEl.style.left=left+"px";promptEl.style.top=top+"px";promptEl.style.width=pw+"px";
 if(typeShell){
  const x=Math.max(6,r.left),y=Math.max(6,r.top),w=Math.max(180,Math.min(r.width,innerWidth-x-6)),h=Math.max(72,Math.min(Math.max(r.height,90),260,innerHeight-y-8));
  Object.assign(typeShell.style,{left:x+"px",top:y+"px",width:w+"px",height:h+"px"});
 }
}
function flashWrong(message){
 if(!promptEl)return;
 const original=promptEl.textContent;
 promptEl.textContent=message||"That is not the highlighted control.";
 promptEl.classList.add("wrong");
 setTimeout(()=>{if(!active)return;promptEl.classList.remove("wrong");promptEl.textContent=original},650);
}
function renderTyped(){
 if(!typedEl)return;
 let html="";
 for(let i=0;i<typed.length;i++){
  const ch=typed[i],bad=expected[i]!==ch;
  const safe=ch.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  html+=bad?'<span class="bad">'+safe+"</span>":safe;
 }
 typedEl.innerHTML=html;
 if(typeShell)typeShell.scrollTop=typeShell.scrollHeight;
}
function correctPrefix(){let n=0;while(n<typed.length&&n<expected.length&&typed[n]===expected[n])n++;typed=expected.slice(0,n);return n}
function completeToken(){
 let pos=correctPrefix();
 while(pos<expected.length&&/\s/.test(expected[pos]))pos++;
 if(pos>=expected.length){typed=expected;renderTyped();checkTyped();return}
 const rest=expected.slice(pos);
 const m=rest.match(/^(?:[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|===|!==|==|!=|<=|>=|&&|\|\||\+\+|--|\+=|-=|\*=|\/=|=>|::|.)/s);
 const end=pos+(m?m[0].length:1);typed=expected.slice(0,end);renderTyped();checkTyped();
}
function finishPart(){
 if(!active)return;clearTarget();active.part+=1;
 if(active.part>=active.sequence.length){const token=active.token;active=null;if(promptEl)promptEl.hidden=true;post("SIM_PRACTICE_COMPLETE",{token})}
 else setTimeout(()=>runPart(0),150);
}
function checkTyped(){
 if(!active)return;
 const part=active.sequence[active.part];
 if(typed===expected&&part.interaction!=="terminal")setTimeout(finishPart,120);
 if(typed===expected&&part.interaction==="terminal")prompt((part.prompt||"Type the command.")+"\nPress Enter to run.");
}
function setupTyping(part){
 expected=String(part.text??part.expectedText??"");typed="";
 typeShell=document.createElement("div");typeShell.className="sim-practice-type";
 ghostEl=document.createElement("pre");ghostEl.className="sim-practice-ghost";ghostEl.textContent=expected;
 typedEl=document.createElement("pre");typedEl.className="sim-practice-typed";
 typeInput=document.createElement("textarea");typeInput.className="sim-practice-capture";typeInput.setAttribute("aria-label","Practice typing input");
 typeShell.append(ghostEl,typedEl,typeInput);document.body.appendChild(typeShell);placeUi();
 typeInput.addEventListener("keydown",e=>{
  if(!active)return;
  if(e.key==="Tab"){e.preventDefault();completeToken();return}
  if(e.key==="Backspace"){e.preventDefault();typed=typed.slice(0,-1);renderTyped();return}
  if(e.key==="Enter"){e.preventDefault();if(part.interaction==="terminal"&&typed===expected){finishPart();return}typed+="\n";renderTyped();checkTyped();return}
  if(e.key==="Escape"){e.preventDefault();stop();return}
  if(!e.ctrlKey&&!e.altKey&&!e.metaKey&&e.key.length===1){e.preventDefault();typed+=e.key;renderTyped();checkTyped()}
 });
 setTimeout(()=>typeInput?.focus(),20);
}
function runPart(retry){
 if(!active)return;
 const part=active.sequence[active.part]||{};targetEl=resolveTarget(part.target);
 if(!targetEl){if(retry<25){setTimeout(()=>runPart(retry+1),80);return}prompt("Practice target is not available yet: "+String(part.target||"unknown"));post("SIM_PRACTICE_WRONG",{token:active.token,reason:"target_missing",target:part.target});return}
 targetEl.classList.add("sim-practice-target");
 positionHandler=placeUi;window.addEventListener("resize",positionHandler,true);window.addEventListener("scroll",positionHandler,true);
 prompt(part.prompt||"Complete the highlighted action.");
 if(["type","editor","terminal"].includes(part.interaction)){setupTyping(part);return}
 clickHandler=e=>{
  if(!active)return;
  if(!targetEl.contains(e.target)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();flashWrong("Click the blue highlighted control.");post("SIM_PRACTICE_WRONG",{token:active.token,reason:"wrong_target"});return}
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();finishPart();
 };
 document.addEventListener("click",clickHandler,true);
}
function start(spec,token){stop();ensureUi();const sequence=Array.isArray(spec?.sequence)?spec.sequence.filter(Boolean):[spec].filter(Boolean);if(!sequence.length)return;active={sequence,part:0,token};runPart(0)}
window.addEventListener("message",event=>{if(location.origin!=="null"&&event.origin!==location.origin)return;const m=event.data||{};if(m.type==="SIM_PRACTICE_STOP")stop();if(m.type==="SIM_PRACTICE_STEP")start(m.practice||{},m.token)});
ensureUi();window.SIM_PRACTICE={start,stop};post("SIM_PRACTICE_READY");
})();