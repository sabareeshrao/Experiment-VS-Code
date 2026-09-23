(function(){
"use strict";
if(window.__SIM_BOOT_PROTOCOL__)return;
window.__SIM_BOOT_PROTOCOL__=true;
function announce(){
  var app=(document.body&&document.body.dataset&&document.body.dataset.simApp)||location.pathname.split("/").filter(Boolean).slice(-2,-1)[0]||"simulator";
  try{parent.postMessage({type:"ENGINE_READY",app:app,protocol:"shared-boot-v1"},location.origin==="null"?"*":location.origin)}
  catch(_){try{parent.postMessage({type:"ENGINE_READY",app:app,protocol:"shared-boot-v1"},"*")}catch(__){}}
}
window.addEventListener("message",function(e){
  var m=e.data||{};
  if(m.type==="SIM_PING"||m.type==="SIM_BOOTSTRAP")announce();
});
if(document.readyState==="complete")announce();
else window.addEventListener("load",announce,{once:true});
setTimeout(announce,0);
setTimeout(announce,120);
})();