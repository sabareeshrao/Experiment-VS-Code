(() => {
"use strict";
const $=id=>document.getElementById(id);
const host=$("viewHost"),nav=$("topnav"),cliPanel=$("cliPanel"),cliOutput=$("cliOutput"),cliInput=$("cliInput"),modalShade=$("modalShade"),modal=$("modal"),toastHost=$("toastHost");
const APP_ID="redis";
const SUPPORTED_ACTIONS=["setView","selectKey","searchKeys","filterKeyType","createKey","deleteKey","editKey","setKeyValue","setHashField","pushListItem","addSetMember","addSortedSetMember","runWorkbench","setWorkbenchQuery","openCli","runCliCommand","clearCli","openSearchIndex","runSearchQuery","showExplain","showProfile","openAnalysisTab","loadSlowLog","startProfiler","stopProfiler","subscribeChannel","publishMessage","openSettings","openDatabaseDialog","showDialog","showToast"];

const seedKeys=[
 {name:"user:1001",type:"hash",ttl:-1,size:"248 B",value:{name:"Ava Carter",email:"ava@example.com",plan:"pro",region:"us-east"}},
 {name:"session:8f2a19",type:"string",ttl:1689,size:"186 B",value:"eyJ1c2VySWQiOjEwMDEsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdfQ=="},
 {name:"product:4201",type:"json",ttl:-1,size:"1.18 KB",value:{id:4201,name:"Mechanical Keyboard",price:129.99,inventory:44,tags:["hardware","keyboard","wireless"],rating:4.8}},
 {name:"queue:emails",type:"list",ttl:-1,size:"752 B",value:["welcome:1004","receipt:9931","reset:1008","newsletter:weekly"]},
 {name:"feature:beta-users",type:"set",ttl:-1,size:"416 B",value:["1001","1022","1048","1091","1110"]},
 {name:"leaderboard:weekly",type:"zset",ttl:83220,size:"612 B",value:[["ava",9820],["liam",9350],["mia",9010],["noah",8775]]},
 {name:"events:orders",type:"stream",ttl:-1,size:"3.71 KB",value:[["1712149941210-0",{event:"order.created",id:"9931"}],["1712149965823-0",{event:"payment.captured",id:"9931"}]]},
 {name:"cache:catalog:v3",type:"string",ttl:211,size:"8.42 KB",value:"{cached catalog payload...}"},
 {name:"search:products:index",type:"hash",ttl:-1,size:"914 B",value:{index:"idx:products",prefix:"product:",schema:"$.name TEXT $.price NUMERIC"}},
 {name:"rate:login:10.0.0.8",type:"string",ttl:49,size:"72 B",value:"7"},
 {name:"cart:1001",type:"json",ttl:3456,size:"682 B",value:{userId:1001,items:[{sku:"KB-42",qty:1},{sku:"PAD-10",qty:2}],total:169.97}}
];

const initialState=()=>({
 view:"browser", keys:structuredClone(seedKeys), selectedKey:"user:1001", keyQuery:"", typeFilter:"all",
 workbenchQuery:"FT.SEARCH idx:products '@price:[50 150]' LIMIT 0 10",
 workbenchResult:null, analysisTab:"memory", searchQuery:"@name:(keyboard)", cliOpen:false,
 cliHistory:[{cmd:"PING",result:"PONG"},{cmd:"DBSIZE",result:"(integer) 11"}],
 subscribed:["orders:*"],messages:[
   {channel:"orders:created",time:"12:41:08",payload:'{"id":9931,"userId":1001}'},
   {channel:"orders:paid",time:"12:41:10",payload:'{"id":9931,"status":"captured"}'}
 ],
 profiler:false
});
let state=initialState(),baseline=initialState();

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function clone(v){return structuredClone(v);}
function fmtTTL(v){if(v===-1)return"No limit";if(v<60)return v+" sec";if(v<3600)return Math.floor(v/60)+" min";return Math.floor(v/3600)+" hr";}
function typeLabel(t){return({string:"STRING",hash:"HASH",json:"JSON",list:"LIST",set:"SET",zset:"ZSET",stream:"STREAM"}[t]||t.toUpperCase());}
function notify(msg){const n=document.createElement("div");n.className="toast";n.textContent=msg;toastHost.appendChild(n);setTimeout(()=>n.remove(),2600);}
function showModal(title,body,actions=[{label:"Cancel"},{label:"Done",primary:true}]){modal.innerHTML='<div class="modal-head">'+esc(title)+'</div><div class="modal-body">'+body+'</div><div class="modal-actions">'+actions.map((a,i)=>'<button class="btn '+(a.primary?"primary":"")+'" data-mi="'+i+'">'+esc(a.label)+'</button>').join("")+'</div>';modalShade.classList.add("show");modal.querySelectorAll("[data-mi]").forEach((b,i)=>b.onclick=()=>{if(actions[i].onClick)actions[i].onClick();modalShade.classList.remove("show");});}
modalShade.onclick=e=>{if(e.target===modalShade)modalShade.classList.remove("show");};

function filteredKeys(){
 const q=state.keyQuery.toLowerCase();
 return state.keys.filter(k=>(state.typeFilter==="all"||k.type===state.typeFilter)&&(!q||k.name.toLowerCase().includes(q)));
}
function selected(){return state.keys.find(k=>k.name===state.selectedKey)||state.keys[0];}
function keyRows(){
 const keys=filteredKeys();
 return keys.map(k=>'<div class="key-row '+(k.name===state.selectedKey?"active":"")+'" data-key="'+esc(k.name)+'"><span class="type-pill type-'+k.type+'">'+typeLabel(k.type)+'</span><div><div class="key-name">'+esc(k.name)+'</div><div class="key-meta">'+fmtTTL(k.ttl)+'</div></div><span class="key-meta">'+esc(k.size)+'</span><span>›</span></div>').join("");
}
function renderValue(k){
 if(!k)return'<div class="empty"><div><strong>No key selected</strong><p>Select a key to inspect its value.</p></div></div>';
 if(k.type==="hash"){
   return '<table class="kv-table"><thead><tr><th>Field</th><th>Value</th><th></th></tr></thead><tbody>'+Object.entries(k.value).map(([a,b])=>'<tr><td class="mono">'+esc(a)+'</td><td>'+esc(b)+'</td><td>⋯</td></tr>').join("")+'</tbody></table>';
 }
 if(k.type==="json"){
   const pretty=JSON.stringify(k.value,null,2).replace(/"([^"]+)":/g,'<span class="json-key">"$1"</span>:').replace(/: "([^"]*)"/g,': <span class="json-string">"$1"</span>').replace(/: ([0-9.]+)/g,': <span class="json-num">$1</span>');
   return '<pre class="json-view mono">'+pretty+'</pre>';
 }
 if(k.type==="list"||k.type==="set"){
   return '<table class="kv-table"><thead><tr><th>#</th><th>Value</th></tr></thead><tbody>'+k.value.map((v,i)=>'<tr><td>'+i+'</td><td class="mono">'+esc(v)+'</td></tr>').join("")+'</tbody></table>';
 }
 if(k.type==="zset"){
   return '<table class="kv-table"><thead><tr><th>Member</th><th>Score</th></tr></thead><tbody>'+k.value.map(v=>'<tr><td class="mono">'+esc(v[0])+'</td><td>'+v[1]+'</td></tr>').join("")+'</tbody></table>';
 }
 if(k.type==="stream"){
   return '<table class="kv-table"><thead><tr><th>Entry ID</th><th>Fields</th></tr></thead><tbody>'+k.value.map(v=>'<tr><td class="mono">'+esc(v[0])+'</td><td class="mono">'+esc(JSON.stringify(v[1]))+'</td></tr>').join("")+'</tbody></table>';
 }
 return '<div class="string-value mono">'+esc(k.value)+'</div>';
}
function browser(){
 const k=selected();
 return '<section class="page"><div class="page-head"><div><h1>Browser</h1><div class="sub">Browse and edit keys in Local Redis</div></div><div class="page-actions"><button class="btn" id="treeViewBtn">Tree view</button><button class="btn primary" id="addKeyBtn">+ Add key</button></div></div><div class="browser-grid"><aside class="key-pane"><div class="toolbar"><label class="search-input">⌕<input id="keySearch" placeholder="Search by key name or pattern" value="'+esc(state.keyQuery)+'"></label><div class="selectlike"><select id="typeFilter" style="background:transparent;border:0;outline:0"><option value="all">All types</option>'+["string","hash","json","list","set","zset","stream"].map(t=>'<option value="'+t+'" '+(state.typeFilter===t?"selected":"")+'>'+typeLabel(t)+'</option>').join("")+'</select></div></div><div class="key-summary"><span>'+filteredKeys().length+' keys</span><span class="grow"></span><span>Key · TTL · Size</span></div><div id="keyList" class="key-list">'+keyRows()+'</div><div class="key-footer">Database 0 · 11 keys · 16.9 KB</div></aside><section class="detail-pane"><div class="detail-head"><span class="type-pill type-'+(k?.type||"string")+'">'+(k?typeLabel(k.type):"")+'</span><div class="detail-title"><strong>'+esc(k?.name||"")+'</strong><div class="meta-line"><span>TTL: '+(k?fmtTTL(k.ttl):"")+'</span><span>Size: '+esc(k?.size||"")+'</span><span>Encoding: '+(k?.type==="hash"?"listpack":"embstr")+'</span></div></div><div class="detail-actions"><button class="btn" id="refreshKey">↻ Refresh</button><button class="btn" id="editKeyBtn">Edit</button><button class="btn danger" id="deleteKeyBtn">Delete</button></div></div><div class="detail-body"><div class="value-card"><div class="value-toolbar"><strong>Value</strong><span class="badge">'+esc(k?.type||"")+'</span><span class="grow"></span><button class="ghost-btn">ASCII</button><button class="ghost-btn">Copy</button></div><div class="value-content">'+renderValue(k)+'</div></div></div></section></div></section>';
}
function workbench(){
 return '<section class="page"><div class="page-head"><div><h1>Workbench</h1><div class="sub">Build, run and visualize Redis commands</div></div><div class="page-actions"><button class="btn">Guides</button><button class="btn">Query history</button></div></div><div class="split-page"><aside class="side-nav"><div class="side-title">Workbench</div><div class="side-item active">My workbench</div><div class="side-item">Saved queries</div><div class="side-title">Guides</div><div class="side-item">Getting started</div><div class="side-item">Redis Search</div><div class="side-item">JSON</div><div class="side-item">Streams</div><div class="side-item">Vector search</div></aside><div class="content-panel"><div class="editor-shell"><div class="editor-head"><span>Query 1</span><span class="grow"></span><span>Redis commands · Auto-complete on</span></div><textarea id="wbEditor" class="command-editor" spellcheck="false">'+esc(state.workbenchQuery)+'</textarea></div><div style="display:flex;gap:8px;margin-top:9px"><button id="runWb" class="btn primary">▶ Run</button><button class="btn">Explain command</button><button class="btn">Format</button></div>'+(state.workbenchResult?'<div class="result-card"><div class="result-head"><strong>Result</strong><span class="grow"></span><span class="badge">12 ms</span><button class="ghost-btn">Table</button><button class="ghost-btn">Raw</button></div><div class="result-body">'+esc(state.workbenchResult)+'</div></div>':'<div class="empty"><div><strong>Run a Redis command</strong><p>Workbench supports multi-line commands, autocomplete and rich result visualizations.</p></div></div>')+'</div></div></section>';
}
function searchView(){
 return '<section class="page"><div class="page-head"><div><h1>Search</h1><div class="sub">Create, inspect and query Redis Search indexes</div></div><div class="page-actions"><button class="btn primary">+ Create index</button></div></div><div class="split-page"><aside class="side-nav"><div class="side-title">Indexes</div><div class="side-item active">idx:products <span class="status-ok">●</span></div><div class="side-item">idx:users <span class="status-ok">●</span></div><div class="side-title">Query library</div><div class="side-item">Products under $150</div><div class="side-item">Top rated products</div></aside><div class="content-panel"><div class="tab-row"><button class="active">Query</button><button>Index details</button><button>Documents</button></div><div class="editor-shell"><div class="editor-head"><strong>idx:products</strong><span class="grow"></span><span>FT.SEARCH</span></div><textarea id="searchEditor" class="command-editor" style="min-height:100px">@name:(keyboard) @price:[50 150]</textarea></div><div style="display:flex;gap:8px;margin-top:9px"><button id="runSearch" class="btn primary">Search</button><button id="explainSearch" class="btn">Explain</button><button id="profileSearch" class="btn">Profile</button><button class="btn">Save query</button></div><div class="result-card"><div class="result-head"><strong>Documents</strong><span class="grow"></span><span>1 result · 4 ms</span></div><table class="data-table"><thead><tr><th>Key</th><th>name</th><th>price</th><th>inventory</th></tr></thead><tbody><tr><td class="mono">product:4201</td><td>Mechanical Keyboard</td><td>129.99</td><td>44</td></tr></tbody></table></div></div></div></section>';
}
function analysis(){
 const slow=[["1727023431","GET product:4201","31 ms","127.0.0.1:53210"],["1727023378","FT.SEARCH idx:products *","18 ms","127.0.0.1:53102"],["1727023304","HGETALL user:1001","12 ms","127.0.0.1:52988"]];
 return '<section class="page"><div class="page-head"><div><h1>Analyze</h1><div class="sub">Monitor usage, memory and command performance</div></div><div class="page-actions"><button class="btn">↻ Refresh</button></div></div><div class="content-panel"><div class="tab-row" id="analysisTabs">'+["memory","slowlog","profiler","recommendations"].map(t=>'<button data-atab="'+t+'" class="'+(state.analysisTab===t?"active":"")+'">'+({memory:"Memory & Keys",slowlog:"Slow Log",profiler:"Profiler",recommendations:"Recommendations"}[t])+'</button>').join("")+'</div>'+(state.analysisTab==="memory"?'<div class="cards"><div class="stat-card"><small>Memory usage</small><strong>21.4 MB</strong><span>of 256 MB maxmemory</span><div class="progress"><i style="width:8%"></i></div></div><div class="stat-card"><small>Total keys</small><strong>11</strong><span>7 data types</span></div><div class="stat-card"><small>Connected clients</small><strong>6</strong><span>0 blocked</span></div></div><div class="chart-card"><strong>Memory by data type</strong><div class="fake-chart">'+[45,72,34,81,58,63,39,76,51,68,42,55].map(h=>'<i style="height:'+h+'%"></i>').join("")+'</div></div>':state.analysisTab==="slowlog"?'<table class="data-table"><thead><tr><th>Timestamp</th><th>Command</th><th>Duration</th><th>Client</th></tr></thead><tbody>'+slow.map(r=>'<tr>'+r.map((x,i)=>'<td class="'+(i===1?"mono":"")+'">'+esc(x)+'</td>').join("")+'</tr>').join("")+'</tbody></table>':state.analysisTab==="profiler"?'<div class="panel-card"><div class="panel-title">Profiler <span class="grow"></span><span class="badge '+(state.profiler?"status-ok":"")+'">'+(state.profiler?"Running":"Stopped")+'</span></div><div class="panel-body"><p style="color:var(--muted)">Inspect commands sent to Redis in real time.</p><button id="profilerBtn" class="btn primary">'+(state.profiler?"Stop profiler":"Start profiler")+'</button></div></div>':'<div class="panel-card"><div class="panel-title">Recommendations</div><div class="panel-body"><div class="message"><strong>Consider setting TTLs on cache keys</strong><p style="color:var(--muted)">3 cache-like keys have no expiration configured.</p></div><div class="message"><strong>Review large JSON values</strong><p style="color:var(--muted)">Large documents can increase network and serialization cost.</p></div></div></div>')+'</div></section>';
}
function pubsub(){
 return '<section class="page"><div class="page-head"><div><h1>Pub/Sub</h1><div class="sub">Subscribe to channels and publish messages</div></div></div><div class="content-panel"><div class="pub-layout"><div class="panel-card"><div class="panel-title">Subscriptions</div><div class="panel-body"><div class="form-field"><label>Channel or pattern</label><input id="subChannel" type="text" value="orders:*"></div><button id="subscribeBtn" class="btn primary">Subscribe</button><div class="side-title">Active</div>'+state.subscribed.map(x=>'<div class="side-item active">'+esc(x)+' <span style="float:right">×</span></div>').join("")+'<hr style="border:0;border-top:1px solid var(--line);margin:14px 0"><div class="form-field"><label>Publish to channel</label><input id="pubChannel" type="text" value="orders:test"></div><div class="form-field"><label>Message</label><textarea id="pubMessage" rows="4">{"status":"ok"}</textarea></div><button id="publishBtn" class="btn">Publish</button></div></div><div class="panel-card"><div class="panel-title">Messages <span class="grow"></span><span class="badge">'+state.messages.length+'</span></div><div>'+state.messages.map(m=>'<div class="message"><div class="message-head"><span>'+esc(m.time)+'</span><span class="badge">'+esc(m.channel)+'</span></div><div class="message-body">'+esc(m.payload)+'</div></div>').join("")+'</div></div></div></div></section>';
}
function render(){
 nav.querySelectorAll("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===state.view));
 host.innerHTML=state.view==="browser"?browser():state.view==="workbench"?workbench():state.view==="search"?searchView():state.view==="analysis"?analysis():pubsub();
 bindView();
 renderCli();
}
function bindView(){
 host.querySelectorAll("[data-key]").forEach(r=>r.onclick=()=>{state.selectedKey=r.dataset.key;render();});
 const ks=$("keySearch");if(ks)ks.oninput=()=>{state.keyQuery=ks.value;const list=$("keyList");if(list){list.innerHTML=keyRows();bindView();}};
 const tf=$("typeFilter");if(tf)tf.onchange=()=>{state.typeFilter=tf.value;render();};
 const add=$("addKeyBtn");if(add)add.onclick=()=>showModal("Add key",'<div class="form-field"><label>Key type</label><select class="selectlike" style="width:100%"><option>String</option><option>Hash</option><option>JSON</option><option>List</option><option>Set</option><option>Sorted Set</option><option>Stream</option></select></div><div class="form-field"><label>Key name</label><input type="text" value="app:new-key"></div><div class="form-field"><label>Value</label><textarea rows="5">{}</textarea></div>');
 const del=$("deleteKeyBtn");if(del)del.onclick=()=>showModal("Delete key",'<p>Delete <strong>'+esc(selected()?.name)+'</strong>? This action cannot be undone.</p>',[{label:"Cancel"},{label:"Delete",primary:true,onClick:()=>{state.keys=state.keys.filter(x=>x.name!==state.selectedKey);state.selectedKey=state.keys[0]?.name;render();notify("Key deleted");}}]);
 const edit=$("editKeyBtn");if(edit)edit.onclick=()=>showModal("Edit value",'<div class="form-field"><label>'+esc(selected()?.name)+'</label><textarea rows="10" class="mono">'+esc(typeof selected()?.value==="string"?selected().value:JSON.stringify(selected()?.value,null,2))+'</textarea></div>');
 const wb=$("wbEditor");if(wb)wb.oninput=()=>state.workbenchQuery=wb.value;
 const run=$("runWb");if(run)run.onclick=()=>{state.workbenchResult='1) "product:4201"\n2) 1) "name"\n   2) "Mechanical Keyboard"\n   3) "price"\n   4) "129.99"\n   5) "inventory"\n   6) "44"';render();};
 const rs=$("runSearch");if(rs)rs.onclick=()=>notify("Search completed in 4 ms");
 const es=$("explainSearch");if(es)es.onclick=()=>showModal("Query plan",'<pre class="result-body">INTERSECT\n  TEXT @name:keyboard\n  NUMERIC @price:[50 150]</pre>');
 const ps=$("profileSearch");if(ps)ps.onclick=()=>showModal("Query profile",'<pre class="result-body">Total profile time: 0.442 ms\nIterator: INTERSECT\nResult processors: 0.081 ms</pre>');
 host.querySelectorAll("[data-atab]").forEach(b=>b.onclick=()=>{state.analysisTab=b.dataset.atab;render();});
 const pb=$("profilerBtn");if(pb)pb.onclick=()=>{state.profiler=!state.profiler;render();notify(state.profiler?"Profiler started":"Profiler stopped");};
 const sb=$("subscribeBtn");if(sb)sb.onclick=()=>{const v=$("subChannel").value.trim();if(v&&!state.subscribed.includes(v))state.subscribed.push(v);render();notify("Subscribed to "+v);};
 const pub=$("publishBtn");if(pub)pub.onclick=()=>{const ch=$("pubChannel").value.trim(),p=$("pubMessage").value;state.messages.unshift({channel:ch,time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"}),payload:p});render();notify("Message published");};
}
function renderCli(){
 cliPanel.classList.toggle("open",state.cliOpen);
 cliOutput.innerHTML=state.cliHistory.map(x=>'<div class="cli-line cli-cmd">127.0.0.1:6379&gt; '+esc(x.cmd)+'</div><div class="cli-line cli-res">'+esc(x.result)+'</div>').join("");
 cliOutput.scrollTop=cliOutput.scrollHeight;
}
function runCli(cmd){
 const c=cmd.trim();if(!c)return;
 const upper=c.toUpperCase();let res="OK";
 if(upper==="PING")res="PONG";
 else if(upper==="DBSIZE")res="(integer) "+state.keys.length;
 else if(upper.startsWith("GET ")){const name=c.slice(4).trim();const k=state.keys.find(x=>x.name===name);res=k?'"'+(typeof k.value==="string"?k.value:JSON.stringify(k.value))+'"':"(nil)";}
 else if(upper.startsWith("TYPE ")){const k=state.keys.find(x=>x.name===c.slice(5).trim());res=k?k.type:"none";}
 else if(upper==="INFO MEMORY")res="# Memory\nused_memory_human:21.40M\nmaxmemory_human:256.00M";
 else if(upper.startsWith("SCAN"))res='1) "0"\n2) 1) "user:1001"\n   2) "product:4201"\n   3) "session:8f2a19"';
 state.cliHistory.push({cmd:c,result:res});cliInput.value="";renderCli();
}
nav.onclick=e=>{const b=e.target.closest("[data-view]");if(!b)return;state.view=b.dataset.view;render();};
$("cliToggle").onclick=()=>{state.cliOpen=!state.cliOpen;renderCli();if(state.cliOpen)setTimeout(()=>cliInput.focus(),30);};
$("closeCli").onclick=()=>{state.cliOpen=false;renderCli();};
$("clearCli").onclick=()=>{state.cliHistory=[];renderCli();};
cliInput.onkeydown=e=>{if(e.key==="Enter"){runCli(cliInput.value);}};
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();state.cliOpen=true;renderCli();cliInput.focus();}});
$("settingsBtn").onclick=()=>showModal("Settings",'<div class="tab-row"><button class="active">General</button><button>Advanced</button><button>Privacy</button></div><div class="form-field"><label>Theme</label><div class="selectlike">Dark <span class="grow"></span>⌄</div></div><div class="form-field"><label>Confirm destructive commands</label><div class="selectlike">Enabled <span class="grow"></span>●</div></div><p style="color:var(--muted)">Redis Insight simulator · UI target based on Redis Insight 3.x</p>');
$("helpBtn").onclick=()=>showModal("Help & resources",'<div class="side-item">Redis Insight documentation</div><div class="side-item">Keyboard shortcuts</div><div class="side-item">Report an issue</div><div class="side-item">About Redis Insight</div>');
$("dbSwitcher").onclick=e=>{if(e.target.closest("button")||e.currentTarget===e.target||e.target.closest(".db-title")||e.target.closest("small"))showModal("Databases",'<div class="panel-card"><div class="panel-title"><span class="status-dot" style="margin-right:8px"></span>Local Redis<span class="grow"></span><span class="badge">Connected</span></div><div class="panel-body">127.0.0.1:6379 · Standalone · Redis 7.4</div></div><div style="margin-top:10px"><button class="btn primary">+ Add database</button></div>');};

async function applyAction(step){
 const a=step?.action||step?.type,d=step?.data||{};
 modalShade.classList.remove("show");
 if(a==="setView")state.view=d.view||d.name||"browser";
 else if(a==="selectKey")state.selectedKey=d.key||d.name;
 else if(a==="searchKeys")state.keyQuery=d.query||"";
 else if(a==="filterKeyType")state.typeFilter=d.type||"all";
 else if(a==="createKey"){const name=d.key||d.name||"app:new-key",type=d.type||"string";state.keys=state.keys.filter(k=>k.name!==name);state.keys.push({name,type,ttl:d.ttl??-1,size:d.size||"64 B",value:clone(d.value??(type==="hash"?{}:type==="list"||type==="set"||type==="zset"?[]:""))});state.selectedKey=name;state.view="browser";}
 else if(a==="deleteKey"){state.keys=state.keys.filter(k=>k.name!==(d.key||state.selectedKey));state.selectedKey=state.keys[0]?.name;}
 else if(a==="editKey"){const k=state.keys.find(k=>k.name===(d.key||state.selectedKey));if(k){if(d.newName){k.name=d.newName;state.selectedKey=d.newName}if("value"in d)k.value=clone(d.value);if("ttl"in d)k.ttl=d.ttl;}state.view="browser";}
 else if(a==="setKeyValue"){const k=state.keys.find(k=>k.name===(d.key||state.selectedKey));if(k)k.value=clone(d.value);state.view="browser";}
 else if(a==="setHashField"){const k=state.keys.find(k=>k.name===(d.key||state.selectedKey));if(k){k.type="hash";if(!k.value||Array.isArray(k.value)||typeof k.value!=="object")k.value={};k.value[d.field||"field"]=d.value??"";}state.view="browser";}
 else if(a==="pushListItem"){const k=state.keys.find(k=>k.name===(d.key||state.selectedKey));if(k){k.type="list";if(!Array.isArray(k.value))k.value=[];if(d.side==="left")k.value.unshift(d.value??"item");else k.value.push(d.value??"item");}state.view="browser";}
 else if(a==="addSetMember"){const k=state.keys.find(k=>k.name===(d.key||state.selectedKey));if(k){k.type="set";if(!Array.isArray(k.value))k.value=[];if(!k.value.includes(d.value))k.value.push(d.value);}state.view="browser";}
 else if(a==="addSortedSetMember"){const k=state.keys.find(k=>k.name===(d.key||state.selectedKey));if(k){k.type="zset";if(!Array.isArray(k.value))k.value=[];k.value=k.value.filter(x=>x[0]!==d.member);k.value.push([d.member||"member",Number(d.score||0)]);k.value.sort((x,y)=>y[1]-x[1]);}state.view="browser";}
 else if(a==="setWorkbenchQuery")state.workbenchQuery=d.query||d.text||"";
 else if(a==="runWorkbench"){state.workbenchResult=d.result||"OK";state.view="workbench";}
 else if(a==="openCli")state.cliOpen=true;
 else if(a==="runCliCommand")runCli(d.command||"PING");
 else if(a==="clearCli")state.cliHistory=[];
 else if(a==="openSearchIndex"){state.view="search";state.searchIndex=d.index||"idx:products";}
 else if(a==="runSearchQuery"){state.view="search";state.searchQuery=d.query||state.searchQuery;state.searchResult=clone(d.result||{});}
 else if(a==="showExplain"){state.view="search";showModal("Query plan",'<pre class="result-body">'+esc(d.plan||"INTERSECT\n  TEXT @name:keyboard\n  NUMERIC @price:[50 150]")+'</pre>');}
 else if(a==="showProfile"){state.view="search";showModal("Query profile",'<pre class="result-body">'+esc(d.profile||"Total profile time: 0.442 ms\nIterator: INTERSECT\nResult processors: 0.081 ms")+'</pre>');}
 else if(a==="openAnalysisTab"){state.view="analysis";state.analysisTab=d.tab||"memory";}
 else if(a==="loadSlowLog"){state.view="analysis";state.analysisTab="slowlog";}
 else if(a==="startProfiler"){state.view="analysis";state.analysisTab="profiler";state.profiler=true;}
 else if(a==="stopProfiler"){state.profiler=false;}
 else if(a==="subscribeChannel"){if(d.channel&&!state.subscribed.includes(d.channel))state.subscribed.push(d.channel);state.view="pubsub";}
 else if(a==="publishMessage"){state.messages.unshift({channel:d.channel||"events",time:d.time||"now",payload:d.message||""});state.view="pubsub";}
 else if(a==="openSettings")showModal("Settings",'<div class="form-field"><label>Theme</label><div class="selectlike">'+esc(d.theme||"Dark")+'</div></div>');
 else if(a==="openDatabaseDialog")showModal("Databases",'<div class="panel-card"><div class="panel-title"><span class="status-dot" style="margin-right:8px"></span>'+esc(d.name||"Local Redis")+'<span class="grow"></span><span class="badge">Connected</span></div><div class="panel-body">'+esc(d.host||"127.0.0.1")+':'+esc(d.port||6379)+' · '+esc(d.mode||"Standalone")+'</div></div>');
 else if(a==="showToast")notify(d.message||step.text||"Done");
 else if(a==="showDialog")showModal(d.title||"Redis Insight",'<p>'+esc(d.text||"")+'</p>');
 render();
}
async function seek(steps){
 state=clone(baseline);
 for(const step of steps||[]){if(step.app&&step.app!==APP_ID)continue;await applyAction(step);}
 render();
}
function announceReady(){
 try{
   parent.postMessage({
     type:"ENGINE_READY",
     app:APP_ID,
     actions:SUPPORTED_ACTIONS,
     protocol:"redis-engine-v3"
   },location.origin==="null"?"*":location.origin);
 }catch(_){
   try{parent.postMessage({type:"ENGINE_READY",app:APP_ID,actions:SUPPORTED_ACTIONS,protocol:"redis-engine-v3"},"*");}catch(__){}
 }
}
function loadPackage(pkg){
 const app=pkg?.apps?.redis||pkg?.apps?.redisinsight;
 baseline=app?.state?{...initialState(),...clone(app.state)}:initialState();
 state=clone(baseline);
 render();
}
window.addEventListener("message",e=>{
 if(location.origin!=="null"&&e.origin!==location.origin)return;
 const m=e.data||{};
 if(m.type==="SIM_PING"||m.type==="SIM_BOOTSTRAP"){
   announceReady();
 } else if(m.type==="SIM_PACKAGE"){
   loadPackage(m.package||{});
   announceReady();
 } else if(m.type==="SIM_SEEK"){
   seek(m.steps||m.actions||[]);
 } else if(m.type==="SIM_EXPLAIN"){
   const box=$("assistant");box.classList.remove("hidden");
   box.querySelector("[data-sim-explanation-title]").textContent=m.title||"Redis Insight";
   box.querySelector("[data-sim-explanation-text]").textContent=m.text||"";
 }
});
window.REDIS_SIM={
 getState:()=>clone(state),
 setState:s=>{state={...state,...clone(s)};render();},
 applyAction,
 reset:()=>{state=initialState();baseline=initialState();render();},
 loadPackage,
 seek
};
window.SimEngine={
 loadPackage,
 apply:applyAction,
 seek,
 getState:()=>clone(state),
 reset:()=>{state=initialState();baseline=initialState();render();}
};
render();
announceReady();
window.addEventListener("DOMContentLoaded",announceReady,{once:true});
window.addEventListener("load",announceReady,{once:true});
setTimeout(announceReady,80);
setTimeout(announceReady,300);
})();