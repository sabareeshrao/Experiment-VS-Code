(function(){
"use strict";

if(window.__SIM_POINTER_READY__) return;
window.__SIM_POINTER_READY__=true;

var style=document.createElement("style");
style.textContent=`
.simPointerRoot{position:fixed;left:0;top:0;z-index:2147483646;pointer-events:none;transform:translate3d(-80px,-80px,0);opacity:0;transition:opacity .14s ease;filter:drop-shadow(0 2px 2px rgba(0,0,0,.55))}
.simPointerRoot.visible{opacity:1}
.simPointerArrow{width:24px;height:30px;display:block}
.simPointerClick{position:fixed;z-index:2147483645;width:10px;height:10px;margin:-5px 0 0 -5px;border:2px solid rgba(76,166,255,.95);border-radius:50%;pointer-events:none;opacity:0;transform:scale(.45)}
.simPointerClick.fire{animation:simPointerPulse .34s ease-out}
.simPointerLabel{position:absolute;left:19px;top:22px;padding:2px 6px;border-radius:4px;background:rgba(20,20,20,.88);border:1px solid rgba(255,255,255,.16);color:#e8e8e8;font:10px/16px "Segoe UI",Arial,sans-serif;white-space:nowrap;opacity:0;transform:translateY(-2px);transition:opacity .12s ease}
.simPointerRoot.showLabel .simPointerLabel{opacity:1}
@keyframes simPointerPulse{0%{opacity:.95;transform:scale(.45)}100%{opacity:0;transform:scale(3)}}
`;
document.head.appendChild(style);

var root=document.createElement("div");
root.className="simPointerRoot";
root.setAttribute("aria-hidden","true");
root.innerHTML='<svg class="simPointerArrow" viewBox="0 0 28 34"><path d="M2 1.5 24.5 20l-10.2 1.4 5.4 10.2-5 2.5-5.2-10.3-7.5 7.1Z" fill="#fff" stroke="#111" stroke-width="2" stroke-linejoin="round"/></svg><span class="simPointerLabel"></span>';
document.body.appendChild(root);

var ripple=document.createElement("div");
ripple.className="simPointerClick";
document.body.appendChild(ripple);

var x=Math.max(24,innerWidth-42),y=52,visible=false,anchorEl=null,anchorPlan=null,raf=0,sequence=0;
var label=root.querySelector(".simPointerLabel");

function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function isVisible(el){
 if(!el||!el.isConnected)return false;
 var s=getComputedStyle(el);
 if(s.display==="none"||s.visibility==="hidden"||Number(s.opacity)===0)return false;
 var r=el.getBoundingClientRect();
 return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth;
}
function textRects(el){
 var rects=[],walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{
   acceptNode:function(node){return node.nodeValue&&node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}
 });
 var node;
 while((node=walker.nextNode())){
   try{
     var range=document.createRange();
     range.selectNodeContents(node);
     Array.prototype.forEach.call(range.getClientRects(),function(r){
       if(r.width>1&&r.height>1)rects.push({left:r.left-4,right:r.right+4,top:r.top-3,bottom:r.bottom+3});
     });
   }catch(_){}
 }
 return rects;
}
function overlayRects(){
 var list=document.querySelectorAll(".assistant,.pgAssistant,#ideAssistant,#postmanAssistant,#cmdAssistant,#linuxAssistant,#ssmsAssistant,.modal,.popup");
 var out=[];
 Array.prototype.forEach.call(list,function(el){
   if(!isVisible(el))return;
   var r=el.getBoundingClientRect();
   out.push({left:r.left-5,right:r.right+5,top:r.top-5,bottom:r.bottom+5});
 });
 return out;
}
function inside(p,r){return p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom;}
function distToRect(p,r){
 var dx=Math.max(r.left-p.x,0,p.x-r.right),dy=Math.max(r.top-p.y,0,p.y-r.bottom);
 return Math.sqrt(dx*dx+dy*dy);
}
function safePoint(el,plan){
 var r=el.getBoundingClientRect(),pad=Math.min(12,Math.max(5,Math.min(r.width,r.height)/4));
 var cx=r.left+r.width/2,cy=r.top+r.height/2;
 if(plan&&plan.anchor==="center")return{x:clamp(cx,8,innerWidth-8),y:clamp(cy,8,innerHeight-8)};
 var candidates=[
   {x:r.left+pad,y:cy},{x:r.right-pad,y:cy},
   {x:cx,y:r.top+pad},{x:cx,y:r.bottom-pad},
   {x:r.left+pad,y:r.top+pad},{x:r.right-pad,y:r.top+pad},
   {x:r.left+pad,y:r.bottom-pad},{x:r.right-pad,y:r.bottom-pad}
 ];
 if(r.width<44&&r.height<44)candidates.unshift({x:cx,y:cy});
 var texts=textRects(el),overlays=overlayRects(),best=candidates[0],bestScore=-1e9;
 candidates.forEach(function(p){
   p.x=clamp(p.x,7,innerWidth-7);p.y=clamp(p.y,7,innerHeight-7);
   var score=0,minText=9999;
   texts.forEach(function(t){if(inside(p,t))score-=5000;minText=Math.min(minText,distToRect(p,t));});
   overlays.forEach(function(o){if(inside(p,o))score-=3000;});
   score+=Math.min(minText,120);
   if(p.x<12||p.x>innerWidth-12||p.y<12||p.y>innerHeight-12)score-=300;
   if(score>bestScore){bestScore=score;best=p;}
 });
 return best;
}
function findByText(text,scope){
 if(!text)return null;
 var rootScope=scope?document.querySelector(scope):document;
 if(!rootScope)return null;
 var wanted=String(text).trim().toLowerCase();
 var nodes=rootScope.querySelectorAll("button,[role=button],input,select,option,.treeRow,.row,.toolBtn,.resultTab,.tab,.menuTop,.ctxItem,[data-target],span,div");
 var best=null,bestLen=1e9;
 Array.prototype.forEach.call(nodes,function(el){
   if(!isVisible(el))return;
   var t=(el.textContent||el.value||el.getAttribute("aria-label")||el.title||"").trim().toLowerCase();
   if(!t||t.indexOf(wanted)<0)return;
   if(t.length<bestLen){best=el;bestLen=t.length;}
 });
 return best;
}
function findTarget(plan){
 if(!plan)return null;
 var selectors=Array.isArray(plan.selectors)?plan.selectors:[];
 for(var i=0;i<selectors.length;i++){
   try{
     var el=document.querySelector(selectors[i]);
     if(el&&isVisible(el))return el;
   }catch(_){}
 }
 if(plan.dataTarget){
   try{
     var dt=document.querySelector('[data-target="'+String(plan.dataTarget).replace(/"/g,'\\\"')+'"]');
     if(dt&&isVisible(dt))return dt;
   }catch(_){}
 }
 if(plan.text){
   var byText=findByText(plan.text,plan.scope||null);
   if(byText)return byText;
 }
 return null;
}
function setPos(px,py){
 x=clamp(px,4,innerWidth-4);y=clamp(py,4,innerHeight-4);
 root.style.transform="translate3d("+x+"px,"+y+"px,0)";
}
function setVisible(v){
 visible=!!v;
 root.classList.toggle("visible",visible);
}
function fireClick(kind){
 ripple.style.left=x+"px";ripple.style.top=y+"px";
 ripple.classList.remove("fire");void ripple.offsetWidth;ripple.classList.add("fire");
 if(kind==="doubleclick"){setTimeout(function(){ripple.classList.remove("fire");void ripple.offsetWidth;ripple.classList.add("fire");},150);}
}
function parkAndHide(delay){
 setTimeout(function(){setVisible(false);anchorEl=null;anchorPlan=null;},delay==null?250:delay);
}
function ensureInView(el){
 if(!el)return;
 var r=el.getBoundingClientRect();
 if(r.top<4||r.bottom>innerHeight-4||r.left<4||r.right>innerWidth-4){
   try{el.scrollIntoView({block:"nearest",inline:"nearest",behavior:"auto"});}catch(_){}
 }
}
function moveTo(plan,requestId){
 var my=++sequence;
 var target=findTarget(plan);
 if(target)ensureInView(target);
 target=findTarget(plan)||target;
 anchorEl=target;anchorPlan=plan;
 var duration=Math.max(180,Math.min(900,Number(plan.duration)||520));
 var startX=x,startY=y,start=performance.now();
 if(!visible){
   var startPark={x:clamp(innerWidth-38,20,innerWidth-20),y:clamp(48,20,innerHeight-20)};
   setPos(startPark.x,startPark.y);startX=x;startY=y;setVisible(true);
 }
 label.textContent=plan.label||"";
 root.classList.toggle("showLabel",!!plan.label);

 function frame(now){
   if(my!==sequence)return;
   var el=anchorEl&&anchorEl.isConnected?anchorEl:findTarget(plan);
   if(el){anchorEl=el;ensureInView(el);}
   var end=el?safePoint(el,plan):{x:clamp(innerWidth-34,18,innerWidth-18),y:54};
   var t=clamp((now-start)/duration,0,1),ease=1-Math.pow(1-t,3);
   setPos(startX+(end.x-startX)*ease,startY+(end.y-startY)*ease);
   if(t<1){raf=requestAnimationFrame(frame);return;}
   if(el){var exact=safePoint(el,plan);setPos(exact.x,exact.y);}
   var gesture=plan.gesture||"click";
   if(gesture!=="hover"&&gesture!=="park")fireClick(gesture);
   var finish=function(){
     if(my!==sequence)return;
     if(gesture==="typing")setVisible(false);
     try{parent.postMessage({type:"SIM_POINTER_DONE",id:requestId||null},"*");}catch(_){}
     if(gesture!=="typing")parkAndHide(plan.hideAfter==null?360:Number(plan.hideAfter));
   };
   setTimeout(finish,gesture==="doubleclick"?330:gesture==="typing"?120:180);
 }
 cancelAnimationFrame(raf);
 raf=requestAnimationFrame(frame);
}
function reanchor(){
 if(!visible||!anchorEl||!anchorEl.isConnected||!anchorPlan)return;
 try{
   var p=safePoint(anchorEl,anchorPlan);
   setPos(p.x,p.y);
 }catch(_){}
}
window.addEventListener("resize",reanchor);
document.addEventListener("scroll",reanchor,true);

window.addEventListener("message",function(e){
 var m=e.data||{};
 if(m.type==="SIM_POINTER"){
   moveTo(m.plan||{},m.id||null);
 }else if(m.type==="SIM_POINTER_HIDE"){
   ++sequence;cancelAnimationFrame(raf);setVisible(false);anchorEl=null;anchorPlan=null;
 }
});
try{parent.postMessage({type:"SIM_POINTER_READY"},"*");}catch(_){}
})();