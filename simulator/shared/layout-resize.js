(() => {
  "use strict";

  const pathParts = location.pathname.split("/").filter(Boolean);
  const pathApp = pathParts[pathParts.length - 2] || "";
  const rawApp = document.body?.dataset?.simApp || pathApp;
  const APP_ALIASES = {
    intellij_idea: "intellij",
    sql_server_management_studio: "ssms"
  };
  const app = APP_ALIASES[rawApp] || rawApp;
  const storageKey = "developerJourney.layout.v3." + app;
  const root = document.documentElement;
  let saved = {};

  try { saved = JSON.parse(localStorage.getItem(storageKey) || "{}") || {}; } catch (_) { saved = {}; }

  const clamp = (n,min,max) => Math.max(min, Math.min(max, n));
  const px = n => Math.round(n) + "px";
  const get = (k,fallback) => Number.isFinite(Number(saved[k])) ? Number(saved[k]) : fallback;
  const commit = (patch) => {
    saved = {...saved, ...patch};
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch (_) {}
  };

  const style = document.createElement("style");
  style.textContent = `
    html.sim-layout-dragging,html.sim-layout-dragging *{user-select:none!important}
    .sim-layout-handle{position:absolute;z-index:180;touch-action:none;background:transparent}
    .sim-layout-handle::after{content:"";position:absolute;background:transparent;transition:background .12s ease}
    .sim-layout-handle:hover::after,.sim-layout-handle.active::after{background:rgba(53,116,240,.42)}
    .sim-layout-handle-v{top:0;bottom:0;width:9px;cursor:col-resize;transform:translateX(-4px)}
    .sim-layout-handle-v::after{top:0;bottom:0;left:3px;width:3px}
    .sim-layout-handle-h{left:0;right:0;height:9px;cursor:row-resize;transform:translateY(-4px)}
    .sim-layout-handle-h::after{left:0;right:0;top:3px;height:3px}
    .sim-window-resizer{position:absolute;z-index:250;touch-action:none}
    .sim-window-resizer.n,.sim-window-resizer.s{left:7px;right:7px;height:7px;cursor:ns-resize}
    .sim-window-resizer.n{top:-2px}.sim-window-resizer.s{bottom:-2px}
    .sim-window-resizer.e,.sim-window-resizer.w{top:7px;bottom:7px;width:7px;cursor:ew-resize}
    .sim-window-resizer.e{right:-2px}.sim-window-resizer.w{left:-2px}
    .sim-window-resizer.ne,.sim-window-resizer.nw,.sim-window-resizer.se,.sim-window-resizer.sw{width:11px;height:11px}
    .sim-window-resizer.ne{right:-2px;top:-2px;cursor:nesw-resize}.sim-window-resizer.nw{left:-2px;top:-2px;cursor:nwse-resize}
    .sim-window-resizer.se{right:-2px;bottom:-2px;cursor:nwse-resize}.sim-window-resizer.sw{left:-2px;bottom:-2px;cursor:nesw-resize}
  `;
  document.head.appendChild(style);

  function dragHandle(el, axis, onMove, onEnd){
    if(!el || el.dataset.layoutWired === "1") return;
    el.dataset.layoutWired = "1";
    let active = false;
    el.addEventListener("pointerdown", e => {
      if(e.button !== 0) return;
      active = true;
      el.classList.add("active");
      root.classList.add("sim-layout-dragging");
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
      e.stopPropagation();
    }, true);
    el.addEventListener("pointermove", e => {
      if(!active) return;
      onMove(e);
      e.preventDefault();
      e.stopPropagation();
    }, true);
    const end = e => {
      if(!active) return;
      active = false;
      el.classList.remove("active");
      root.classList.remove("sim-layout-dragging");
      try { if(el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId); } catch (_) {}
      onEnd?.(e);
      e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener("pointerup", end, true);
    el.addEventListener("pointercancel", end, true);
  }

  function makeHandle(parent, cls, id){
    if(!parent) return null;
    let h = parent.querySelector("#"+id);
    if(h) return h;
    if(getComputedStyle(parent).position === "static") parent.style.position = "relative";
    h = document.createElement("div");
    h.id = id;
    h.className = "sim-layout-handle " + cls;
    h.setAttribute("aria-hidden","true");
    parent.appendChild(h);
    return h;
  }

  function rememberExisting(handle, read){
    if(!handle) return;
    const persist = () => commit(read());
    handle.addEventListener("pointerup", () => requestAnimationFrame(persist), true);
    handle.addEventListener("pointercancel", () => requestAnimationFrame(persist), true);
    handle.addEventListener("dblclick", () => {
      const keys = Object.keys(read());
      for(const k of keys) delete saved[k];
      try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch (_) {}
      location.reload();
    });
  }

  function setupIntelliJ(){
    if(saved.leftW) root.style.setProperty("--leftW", px(get("leftW",250)));
    if(saved.rightW) root.style.setProperty("--rightW", px(get("rightW",270)));
    if(saved.bottomH) root.style.setProperty("--bottomH", px(get("bottomH",190)));
    rememberExisting(document.getElementById("splitL"), () => ({leftW:parseFloat(getComputedStyle(root).getPropertyValue("--leftW"))||250}));
    rememberExisting(document.getElementById("splitR"), () => ({rightW:parseFloat(getComputedStyle(root).getPropertyValue("--rightW"))||270}));
    rememberExisting(document.getElementById("splitH"), () => ({bottomH:parseFloat(getComputedStyle(root).getPropertyValue("--bottomH"))||190}));
  }

  function setupPostman(){
    const main=document.querySelector(".main"), request=document.getElementById("requestArea");
    if(saved.sideW && main) main.style.setProperty("--sideW",px(get("sideW",255)));
    if(saved.respH) root.style.setProperty("--respH",px(get("respH",270)));
    rememberExisting(document.getElementById("splitV"),()=>({sideW:parseFloat(getComputedStyle(main).getPropertyValue("--sideW"))||255}));
    rememberExisting(document.getElementById("splitH"),()=>({respH:parseFloat(getComputedStyle(root).getPropertyValue("--respH"))||270}));
  }

  function setupJira(){
    if(saved.leftW) root.style.setProperty("--leftW",px(get("leftW",220)));
    rememberExisting(document.getElementById("splitV"),()=>({leftW:parseFloat(getComputedStyle(root).getPropertyValue("--leftW"))||220}));

    const main=document.getElementById("main");
    const panel=document.getElementById("issuePanel");
    if(main && panel){
      if(saved.issueW) panel.style.width=px(get("issueW",560));
      const h=makeHandle(panel,"sim-layout-handle-v","jiraIssueResize");
      h.style.left="0";h.style.right="auto";
      dragHandle(h,"x",e=>{
        const mr=main.getBoundingClientRect();
        const w=clamp(mr.right-e.clientX,320,Math.max(360,mr.width-120));
        panel.style.width=px(w);
      },()=>commit({issueW:panel.getBoundingClientRect().width}));
    }
  }

  function setupVSCode(){
    const work=document.querySelector(".workbench"), side=document.querySelector(".sidebar"), editor=document.getElementById("editorGroup");
    if(!work || !side || !editor) return;
    work.style.position="relative";
    const applySide=()=>{
      if(innerWidth<620){work.style.gridTemplateColumns="";v.style.display="none";return;}
      v.style.display="block";
      const act=document.querySelector(".activityBar")?.getBoundingClientRect().width || 48;
      const w=clamp(get("sideW",side.getBoundingClientRect().width||300),140,Math.max(160,work.clientWidth-240));
      work.style.gridTemplateColumns=px(act)+" "+px(w)+" minmax(0,1fr)";
      v.style.left=px(act+w);
    };
    const v=makeHandle(work,"sim-layout-handle-v","vscodeSideResize");
    applySide();
    dragHandle(v,"x",e=>{
      const wr=work.getBoundingClientRect();
      const act=document.querySelector(".activityBar")?.getBoundingClientRect().width || 48;
      const w=clamp(e.clientX-wr.left-act,140,Math.max(160,wr.width-act-240));
      work.style.gridTemplateColumns=px(act)+" "+px(w)+" minmax(0,1fr)";
      v.style.left=px(act+w);
    },()=>{
      const act=document.querySelector(".activityBar")?.getBoundingClientRect().width || 48;
      commit({sideW:side.getBoundingClientRect().width});
      v.style.left=px(act+side.getBoundingClientRect().width);
    });

    editor.style.position="relative";
    const panel=document.querySelector(".panel");
    const h=makeHandle(editor,"sim-layout-handle-h","vscodePanelResize");
    const syncPanel=()=>{
      const ph=editor.classList.contains("panelOpen") ? (parseFloat(getComputedStyle(editor).getPropertyValue("--panel-h"))||get("panelH",185)) : 0;
      h.style.top=px(Math.max(2,editor.clientHeight-ph));
      h.style.display=editor.clientHeight>160?"block":"none";
    };
    if(saved.panelH){
      editor.style.setProperty("--panel-h",px(get("panelH",185)));
      if(get("panelH",185)>40) editor.classList.add("panelOpen");
    }
    syncPanel();
    dragHandle(h,"y",e=>{
      const er=editor.getBoundingClientRect();
      const ph=clamp(er.bottom-e.clientY,0,Math.max(90,er.height-120));
      if(ph>30) editor.classList.add("panelOpen");
      editor.style.setProperty("--panel-h",px(ph));
      h.style.top=px(er.height-ph);
    },()=>{
      const ph=parseFloat(getComputedStyle(editor).getPropertyValue("--panel-h"))||0;
      if(ph<45){editor.classList.remove("panelOpen");editor.style.setProperty("--panel-h","0px");commit({panelH:0});}
      else commit({panelH:ph});
      syncPanel();
    });
    const mo=new MutationObserver(syncPanel);mo.observe(editor,{attributes:true,attributeFilter:["class","style"]});
    window.addEventListener("resize",()=>{applySide();syncPanel()});
  }

  function setupPgAdmin(){
    const work=document.querySelector(".work"), left=document.querySelector(".work > .left"), main=document.querySelector(".work > .main");
    const results=main?.querySelector(".results");
    if(!work||!left||!main||!results)return;
    const sideW=clamp(get("sideW",280),150,Math.max(180,work.clientWidth-320));
    work.style.gridTemplateColumns=px(sideW)+" 5px minmax(0,1fr)";
    const v=document.createElement("div");v.className="sim-layout-handle sim-layout-handle-v";v.id="pgSideResize";v.style.position="relative";v.style.transform="none";work.insertBefore(v,main);
    dragHandle(v,"x",e=>{const r=work.getBoundingClientRect(),w=clamp(e.clientX-r.left,150,Math.max(180,r.width-320));work.style.gridTemplateColumns=px(w)+" 5px minmax(0,1fr)"},()=>commit({sideW:left.getBoundingClientRect().width}));

    const resultsH=clamp(get("resultsH",210),90,Math.max(110,main.clientHeight-150));
    main.style.gridTemplateRows="30px 31px minmax(0,1fr) 5px "+px(resultsH);
    const h=document.createElement("div");h.className="sim-layout-handle sim-layout-handle-h";h.id="pgResultsResize";h.style.position="relative";h.style.transform="none";main.insertBefore(h,results);
    dragHandle(h,"y",e=>{const r=main.getBoundingClientRect(),rh=clamp(r.bottom-e.clientY,90,Math.max(110,r.height-150));main.style.gridTemplateRows="30px 31px minmax(0,1fr) 5px "+px(rh)},()=>commit({resultsH:results.getBoundingClientRect().height}));
  }

  function setupSSMS(){
    const shell=document.querySelector(".shell"), left=document.getElementById("leftPane"), workspace=document.getElementById("workspace");
    if(shell&&left&&workspace){
      const sideW=clamp(get("sideW",left.getBoundingClientRect().width||260),160,Math.max(190,shell.clientWidth-360));
      shell.style.gridTemplateColumns=px(sideW)+" 5px minmax(0,1fr)";
      const v=document.createElement("div");v.className="sim-layout-handle sim-layout-handle-v";v.id="ssmsSideResize";v.style.position="relative";v.style.transform="none";shell.insertBefore(v,workspace);
      dragHandle(v,"x",e=>{const r=shell.getBoundingClientRect(),w=clamp(e.clientX-r.left,160,Math.max(190,r.width-360));shell.style.gridTemplateColumns=px(w)+" 5px minmax(0,1fr)"},()=>commit({sideW:left.getBoundingClientRect().width}));
    }
    const editor=document.getElementById("editorArea"), results=document.getElementById("resultsPane");
    if(editor&&results){
      const rh=clamp(get("resultsH",results.getBoundingClientRect().height||180),90,Math.max(110,editor.clientHeight-130));
      editor.style.gridTemplateRows="minmax(0,1fr) 5px "+px(rh);
      const h=document.createElement("div");h.className="sim-layout-handle sim-layout-handle-h";h.id="ssmsResultsResize";h.style.position="relative";h.style.transform="none";editor.insertBefore(h,results);
      dragHandle(h,"y",e=>{const r=editor.getBoundingClientRect(),x=clamp(r.bottom-e.clientY,90,Math.max(110,r.height-130));editor.style.gridTemplateRows="minmax(0,1fr) 5px "+px(x)},()=>commit({resultsH:results.getBoundingClientRect().height}));
    }
  }

  function setupLinux(){
    const workspace=document.querySelector(".workspace");
    if(!workspace)return;
    const wsKey="windows";
    const winState=saved[wsKey]||{};
    const wins=[...workspace.querySelectorAll(".window")];

    const restoreWindow=w=>{
      const s=winState[w.id];
      if(!s)return;
      Object.assign(w.style,{left:px(s.left),top:px(s.top),width:px(s.width),height:px(s.height),right:"auto",bottom:"auto"});
    };
    wins.forEach(w=>{
      restoreWindow(w);
      const head=w.querySelector(".windowHead");
      if(head && head.dataset.layoutWindowDrag!=="1"){
        head.dataset.layoutWindowDrag="1";
        let drag=null;
        head.addEventListener("pointerdown",e=>{
          if(e.button!==0||e.target.closest("button")||w.classList.contains("maximized"))return;
          const wr=w.getBoundingClientRect(),sr=workspace.getBoundingClientRect();
          drag={dx:e.clientX-wr.left,dy:e.clientY-wr.top,sr};
          try{head.setPointerCapture(e.pointerId)}catch(_){}
          root.classList.add("sim-layout-dragging");e.preventDefault();
        },true);
        head.addEventListener("pointermove",e=>{
          if(!drag)return;
          const wr=w.getBoundingClientRect();
          const left=clamp(e.clientX-drag.sr.left-drag.dx,0,Math.max(0,drag.sr.width-wr.width));
          const top=clamp(e.clientY-drag.sr.top-drag.dy,0,Math.max(0,drag.sr.height-wr.height));
          Object.assign(w.style,{left:px(left),top:px(top),right:"auto",bottom:"auto"});
        },true);
        const end=e=>{
          if(!drag)return;drag=null;root.classList.remove("sim-layout-dragging");
          const wr=w.getBoundingClientRect(),sr=workspace.getBoundingClientRect();
          const all={...(saved[wsKey]||{})};all[w.id]={left:wr.left-sr.left,top:wr.top-sr.top,width:wr.width,height:wr.height};commit({[wsKey]:all});
        };
        head.addEventListener("pointerup",end,true);head.addEventListener("pointercancel",end,true);
      }

      for(const edge of ["n","e","s","w","ne","nw","se","sw"]){
        const rh=document.createElement("div");rh.className="sim-window-resizer "+edge;rh.dataset.edge=edge;w.appendChild(rh);
        let start=null;
        rh.addEventListener("pointerdown",e=>{
          if(e.button!==0||w.classList.contains("maximized"))return;
          const wr=w.getBoundingClientRect(),sr=workspace.getBoundingClientRect();
          start={x:e.clientX,y:e.clientY,left:wr.left-sr.left,top:wr.top-sr.top,width:wr.width,height:wr.height,sr};
          try{rh.setPointerCapture(e.pointerId)}catch(_){}
          root.classList.add("sim-layout-dragging");e.preventDefault();e.stopPropagation();
        },true);
        rh.addEventListener("pointermove",e=>{
          if(!start)return;
          const dx=e.clientX-start.x,dy=e.clientY-start.y,minW=360,minH=220;
          let left=start.left,top=start.top,width=start.width,height=start.height;
          if(edge.includes("e"))width=clamp(start.width+dx,minW,start.sr.width-start.left);
          if(edge.includes("s"))height=clamp(start.height+dy,minH,start.sr.height-start.top);
          if(edge.includes("w")){width=clamp(start.width-dx,minW,start.left+start.width);left=start.left+(start.width-width);}
          if(edge.includes("n")){height=clamp(start.height-dy,minH,start.top+start.height);top=start.top+(start.height-height);}
          Object.assign(w.style,{left:px(left),top:px(top),width:px(width),height:px(height),right:"auto",bottom:"auto"});
        },true);
        const end=e=>{
          if(!start)return;start=null;root.classList.remove("sim-layout-dragging");
          const wr=w.getBoundingClientRect(),sr=workspace.getBoundingClientRect();
          const all={...(saved[wsKey]||{})};all[w.id]={left:wr.left-sr.left,top:wr.top-sr.top,width:wr.width,height:wr.height};commit({[wsKey]:all});
          e.stopPropagation();
        };
        rh.addEventListener("pointerup",end,true);rh.addEventListener("pointercancel",end,true);
      }
    });

    const fileBody=document.querySelector(".fileBody"), places=document.querySelector(".places"), fileList=document.getElementById("fileList");
    if(fileBody&&places&&fileList){
      const pw=clamp(get("placesW",150),100,Math.max(120,fileBody.clientWidth-240));
      fileBody.style.gridTemplateColumns=px(pw)+" 5px minmax(0,1fr)";
      const v=document.createElement("div");v.className="sim-layout-handle sim-layout-handle-v";v.id="linuxPlacesResize";v.style.position="relative";v.style.transform="none";fileBody.insertBefore(v,fileList);
      dragHandle(v,"x",e=>{const r=fileBody.getBoundingClientRect(),w=clamp(e.clientX-r.left,100,Math.max(120,r.width-240));fileBody.style.gridTemplateColumns=px(w)+" 5px minmax(0,1fr)"},()=>commit({placesW:places.getBoundingClientRect().width}));
    }
  }

  function setupJenkins(){
    const layout=document.getElementById("layout"), left=layout?.querySelector(".left"), history=document.getElementById("history");
    const splitL=document.getElementById("splitL"), splitR=document.getElementById("splitR");
    if(!layout||!left||!history)return;
    const apply=()=>{
      if(innerWidth<950){layout.style.gridTemplateColumns="";return;}
      const lw=clamp(get("leftW",left.getBoundingClientRect().width||240),110,320);
      const hw=clamp(get("historyW",history.getBoundingClientRect().width||210),115,320);
      layout.style.gridTemplateColumns=px(lw)+" 5px minmax(0,1fr) 5px "+px(hw);
    };
    apply();
    rememberExisting(splitL,()=>({leftW:left.getBoundingClientRect().width,historyW:history.getBoundingClientRect().width}));
    rememberExisting(splitR,()=>({leftW:left.getBoundingClientRect().width,historyW:history.getBoundingClientRect().width}));
    window.addEventListener("resize",apply);
  }

  function setupAssistantPersistence(){
    // Explanation position/dragging is owned by explanation-controls.js so
    // every simulator uses exactly the same behavior and saved position.
    if(window.__SIM_EXPLANATION_CONTROLS__) return;
    const selectors={
      intellij:["#ideAssistant"],vscode:["#assistant"],pgadmin:["#pgAssistant"],postman:["#postmanAssistant"],
      cmd:["#cmdAssistant"],linux:["#linuxAssistant"],ssms:["#ssmsAssistant"],jira:["#jiraAssistant"],jenkins:["#jenkinsAssistant"]
    };
    const el=document.querySelector(selectors[app]?.[0]||"__none__");
    if(!el)return;
    const key="assistant";
    const parentRect=()=>el.offsetParent?.getBoundingClientRect?.()||{left:0,top:0};
    const s=saved[key];
    if(s && Number.isFinite(s.left)&&Number.isFinite(s.top)){
      Object.assign(el.style,{left:px(s.left),top:px(s.top),right:"auto",bottom:"auto"});
    }
    const persist=()=>{
      if(!el.offsetParent||!el.style.left||!el.style.top)return;
      const r=el.getBoundingClientRect(),p=parentRect();
      commit({assistant:{left:r.left-p.left,top:r.top-p.top,width:r.width,height:r.height}});
    };
    if(typeof ResizeObserver==="function"){const obs=new ResizeObserver(persist);obs.observe(el);}
    document.addEventListener("pointerup",persist,true);
  }

  function applyIfDifferent(el,prop,value){
    if(!el || value==null) return;
    if(el.style[prop]!==value) el.style[prop]=value;
  }

  function nearestScrollParents(el){
    const list=[];
    let p=el?.parentElement;
    while(p&&p!==document.body&&p!==document.documentElement){
      const s=getComputedStyle(p);
      const oy=s.overflowY,ox=s.overflowX;
      if(/auto|scroll|overlay/.test(oy+ox)) list.push(p);
      p=p.parentElement;
    }
    return list;
  }

  function isTerminalFocusTarget(el){
    if(!el)return false;
    const own=((el.id||"")+" "+(typeof el.className==="string"?el.className:"")).toLowerCase();
    if(/cmdinput|terminalcommand|promptline|historycommand/.test(own)) return true;
    return !!el.closest?.("[data-sim-terminal],.terminal,.terminalWrap,.terminalViewport,.console,.consoleBox,#terminal,#terminalWrap,#termWrap,#console");
  }

  function revealFocus(target,options={}){
    const el=typeof target==="string"?document.querySelector(target):target;
    if(!el||!el.isConnected)return false;
    const terminalLike=isTerminalFocusTarget(el);
    const margin=Number(options.margin??(terminalLike?6:18));
    let block=options.block||(terminalLike?"end":"center");
    // A command line should stay near the terminal bottom. Re-centering it
    // after every typed character is what caused the visible scroll shaking.
    if(terminalLike&&block==="center"&&options.forceCenter!==true) block="end";
    const parents=nearestScrollParents(el);

    // Work from the innermost scroll container outward so nested editors,
    // terminals, result panes and future simulators keep the focused action
    // visible while auto-typing/replaying.
    for(const scroller of parents){
      const er=el.getBoundingClientRect(),sr=scroller.getBoundingClientRect();
      const topLimit=sr.top+margin,bottomLimit=sr.bottom-margin;
      if(er.top<topLimit||er.bottom>bottomLimit){
        const centerDelta=((er.top+er.bottom)/2)-((sr.top+sr.bottom)/2);
        if(block==="end") scroller.scrollTop+=er.bottom-bottomLimit;
        else if(block==="start") scroller.scrollTop+=er.top-topLimit;
        else scroller.scrollTop+=centerDelta;
      }
      const leftLimit=sr.left+margin,rightLimit=sr.right-margin;
      if(er.left<leftLimit) scroller.scrollLeft+=er.left-leftLimit;
      else if(er.right>rightLimit) scroller.scrollLeft+=er.right-rightLimit;
    }

    // If no dedicated scrolling parent exists, keep the element inside the
    // iframe viewport without changing its layout.
    if(!parents.length){
      try{el.scrollIntoView({block:block==="end"?"end":block==="start"?"start":"center",inline:"nearest",behavior:"auto"});}catch(_){}
    }
    return true;
  }

  let focusRaf=0,lastFocusEl=null;
  function queueFocusReveal(el,options){
    if(!el||!el.isConnected)return;
    lastFocusEl=el;
    cancelAnimationFrame(focusRaf);
    focusRaf=requestAnimationFrame(()=>revealFocus(lastFocusEl,options||{}));
  }

  // Only explicit focus markers are observed globally. Generic highlight/code
  // classes change repeatedly while simulators render and must never trigger a
  // second competing scroll path.
  const focusSelector="[data-sim-focus='true']";

  const focusObserver=new MutationObserver(records=>{
    let candidate=null;
    for(const record of records){
      if(record.type==="attributes"){
        const el=record.target;
        if(el.matches?.(focusSelector))candidate=el;
      }
      for(const node of record.addedNodes||[]){
        if(node.nodeType!==1)continue;
        if(node.matches?.(focusSelector))candidate=node;
        const nested=node.querySelector?.(focusSelector);
        if(nested)candidate=nested;
      }
    }
    if(candidate)queueFocusReveal(candidate,{});
  });
  focusObserver.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["data-sim-focus"]});

  // Programmatic simulators should call SIM_FOCUS.follow() while auto-typing.
  // Future simulators may instead opt in with data-sim-focus="true".
  window.SIM_FOCUS={
    reveal(target,options){return revealFocus(target,options||{})},
    follow(target,options){queueFocusReveal(typeof target==="string"?document.querySelector(target):target,options||{});},
    mark(target,options){
      const el=typeof target==="string"?document.querySelector(target):target;
      if(!el)return false;
      el.setAttribute("data-sim-focus","true");
      queueFocusReveal(el,options||{});
      return true;
    },
    clear(target){
      const el=typeof target==="string"?document.querySelector(target):target;
      if(el)el.removeAttribute("data-sim-focus");
    }
  };

  function restoreGenericPersistentElements(){
    const generic=saved.generic||{};
    document.querySelectorAll("[data-sim-persist]").forEach(el=>{
      const key=el.dataset.simPersist;
      if(!key) return;
      const s=generic[key];
      if(s){
        const props=(el.dataset.simPersistProps||"width,height,left,top").split(",").map(x=>x.trim()).filter(Boolean);
        for(const prop of props){
          if(Number.isFinite(Number(s[prop]))) applyIfDifferent(el,prop,px(Number(s[prop])));
        }
        const vars=(el.dataset.simPersistVars||"").split(",").map(x=>x.trim()).filter(Boolean);
        for(const name of vars){
          if(s.vars && s.vars[name]!=null && el.style.getPropertyValue(name)!==String(s.vars[name])) el.style.setProperty(name,String(s.vars[name]));
        }
      }

      if(el.dataset.simPersistWired==="1") return;
      el.dataset.simPersistWired="1";
      const capture=()=>{
        if(root.classList.contains("sim-layout-dragging")) return;
        const r=el.getBoundingClientRect();
        const props=(el.dataset.simPersistProps||"width,height,left,top").split(",").map(x=>x.trim()).filter(Boolean);
        const next={};
        for(const prop of props){
          if(prop==="width") next.width=r.width;
          else if(prop==="height") next.height=r.height;
          else if(prop==="left") next.left=r.left;
          else if(prop==="top") next.top=r.top;
        }
        const vars=(el.dataset.simPersistVars||"").split(",").map(x=>x.trim()).filter(Boolean);
        if(vars.length){
          next.vars={};
          for(const name of vars) next.vars[name]=el.style.getPropertyValue(name)||getComputedStyle(el).getPropertyValue(name);
        }
        commit({generic:{...(saved.generic||{}),[key]:next}});
      };
      el.addEventListener("pointerup",()=>requestAnimationFrame(capture),true);
      if(typeof ResizeObserver==="function"){
        const obs=new ResizeObserver(()=>{ if(!root.classList.contains("sim-layout-dragging")) capture(); });
        obs.observe(el);
      }
    });
  }

  function reapplyKnownLayout(){
    if(root.classList.contains("sim-layout-dragging")) return;

    if(app==="intellij"){
      if(saved.leftW) root.style.setProperty("--leftW",px(get("leftW",250)));
      if(saved.rightW) root.style.setProperty("--rightW",px(get("rightW",270)));
      if(saved.bottomH) root.style.setProperty("--bottomH",px(get("bottomH",190)));
    }

    if(app==="postman"){
      const main=document.querySelector(".main");
      if(main&&saved.sideW) main.style.setProperty("--sideW",px(get("sideW",255)));
      if(saved.respH) root.style.setProperty("--respH",px(get("respH",270)));
    }

    if(app==="jira"){
      if(saved.leftW) root.style.setProperty("--leftW",px(get("leftW",220)));
      const panel=document.getElementById("issuePanel");
      if(panel&&saved.issueW) panel.style.width=px(get("issueW",560));
    }

    if(app==="jenkins"){
      const layout=document.getElementById("layout"),left=layout?.querySelector(".left"),history=document.getElementById("history");
      if(layout&&left&&history){
        if(innerWidth<950) layout.style.gridTemplateColumns="";
        else if(saved.leftW||saved.historyW){
          const lw=clamp(get("leftW",left.getBoundingClientRect().width||240),110,320);
          const hw=clamp(get("historyW",history.getBoundingClientRect().width||210),115,320);
          const wanted=px(lw)+" 5px minmax(0,1fr) 5px "+px(hw);
          if(layout.style.gridTemplateColumns!==wanted) layout.style.gridTemplateColumns=wanted;
        }
      }
    }

    if(app==="vscode"){
      const work=document.querySelector(".workbench"),side=document.querySelector(".sidebar"),editor=document.getElementById("editorGroup");
      if(work&&side&&innerWidth>=620&&saved.sideW){
        const act=document.querySelector(".activityBar")?.getBoundingClientRect().width||48;
        const w=clamp(get("sideW",300),140,Math.max(160,work.clientWidth-act-240));
        const wanted=px(act)+" "+px(w)+" minmax(0,1fr)";
        if(work.style.gridTemplateColumns!==wanted) work.style.gridTemplateColumns=wanted;
        const h=document.getElementById("vscodeSideResize");if(h) h.style.left=px(act+w);
      }
      if(editor&&editor.classList.contains("panelOpen")&&Number.isFinite(Number(saved.panelH))&&Number(saved.panelH)>30){
        const max=Math.max(90,editor.clientHeight-120);
        const ph=clamp(Number(saved.panelH),90,max);
        const wanted=px(ph);
        if(editor.style.getPropertyValue("--panel-h")!==wanted) editor.style.setProperty("--panel-h",wanted);
        const h=document.getElementById("vscodePanelResize");if(h) h.style.top=px(Math.max(2,editor.clientHeight-ph));
      }
    }

    if(app==="pgadmin"){
      const work=document.querySelector(".work"),main=document.querySelector(".work > .main");
      if(work&&saved.sideW){
        const w=clamp(get("sideW",280),150,Math.max(180,work.clientWidth-320));
        work.style.gridTemplateColumns=px(w)+" 5px minmax(0,1fr)";
      }
      if(main&&saved.resultsH){
        const rh=clamp(get("resultsH",210),90,Math.max(110,main.clientHeight-150));
        main.style.gridTemplateRows="30px 31px minmax(0,1fr) 5px "+px(rh);
      }
    }

    if(app==="ssms"){
      const shell=document.querySelector(".shell"),editor=document.getElementById("editorArea");
      if(shell&&saved.sideW){
        const w=clamp(get("sideW",260),160,Math.max(190,shell.clientWidth-360));
        shell.style.gridTemplateColumns=px(w)+" 5px minmax(0,1fr)";
      }
      if(editor&&saved.resultsH){
        const rh=clamp(get("resultsH",180),90,Math.max(110,editor.clientHeight-130));
        editor.style.gridTemplateRows="minmax(0,1fr) 5px "+px(rh);
      }
    }

    if(app==="linux"){
      const workspace=document.querySelector(".workspace"),winState=saved.windows||{};
      if(workspace){
        for(const w of workspace.querySelectorAll(".window")){
          const s=winState[w.id];if(!s||w.classList.contains("maximized"))continue;
          Object.assign(w.style,{left:px(s.left),top:px(s.top),width:px(s.width),height:px(s.height),right:"auto",bottom:"auto"});
        }
      }
      const fileBody=document.querySelector(".fileBody");
      if(fileBody&&saved.placesW) fileBody.style.gridTemplateColumns=px(get("placesW",150))+" 5px minmax(0,1fr)";
    }

    restoreGenericPersistentElements();
  }

  function scheduleRestore(){
    for(const delay of [0,40,160,600,1250]) setTimeout(()=>requestAnimationFrame(reapplyKnownLayout),delay);
  }

  const setups={intellij:setupIntelliJ,vscode:setupVSCode,pgadmin:setupPgAdmin,postman:setupPostman,ssms:setupSSMS,linux:setupLinux,jira:setupJira,jenkins:setupJenkins,cmd:()=>{}};
  requestAnimationFrame(()=>{
    try{
      setups[app]?.();
      setupAssistantPersistence();
      restoreGenericPersistentElements();
      reapplyKnownLayout();
    }catch(err){console.warn("layout-resize",app,err)}
  });

  window.addEventListener("message",e=>{
    const type=e.data?.type;
    if(type==="SIM_SEEK"||type==="SIM_PACKAGE"||type==="SIM_SETTING") scheduleRestore();
  });
  window.addEventListener("resize",scheduleRestore);

  // Global persistence contract for current and future simulators:
  // - use SIM_UI_STATE.get/set for custom layout values
  // - or add data-sim-persist="key" to a resizable/movable element
  //   (optional data-sim-persist-props and data-sim-persist-vars).
  window.SIM_UI_STATE={
    app,
    storageKey,
    get(key,fallback){return saved[key]!==undefined?saved[key]:fallback},
    set(key,value){commit({[key]:value});scheduleRestore();return value},
    merge(patch){commit(patch||{});scheduleRestore();return {...saved}},
    restore(){reapplyKnownLayout()},
    snapshot(){return {...saved}}
  };

  window.SIM_LAYOUT={
    reset(){
      try{localStorage.removeItem(storageKey)}catch(_){}
      location.reload();
    },
    get(){return {...saved}},
    getValue(key,fallback){return saved[key]!==undefined?saved[key]:fallback},
    set(patch){commit(patch||{});scheduleRestore();return {...saved}},
    restore(){reapplyKnownLayout()}
  };
})();