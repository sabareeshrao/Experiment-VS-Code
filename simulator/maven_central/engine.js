(() => {
"use strict";
const APP_ID="maven_central";
const SUPPORTED_ACTIONS=["resetSearch","searchDependency","setSearch","openArtifact","selectVersion","showMavenSnippet","copyMavenSnippet","highlightTarget"];
const $=id=>document.getElementById(id);
const refs={searchInput:$("searchInput"),searchBtn:$("searchBtn"),results:$("results"),detail:$("artifactDetail"),versions:$("versions"),toast:$("toast"),assistant:$("assistant")};
const catalog=[
 {id:"spring-data-jpa",name:"Spring Boot Starter Data JPA",groupId:"org.springframework.boot",artifactId:"spring-boot-starter-data-jpa",description:"Starter for using Spring Data JPA with Hibernate.",versions:["3.5.6","3.5.5","3.4.9"]},
 {id:"liquibase",name:"Liquibase Core",groupId:"org.liquibase",artifactId:"liquibase-core",description:"Database-independent schema migration library.",versions:["4.33.0","4.32.0","4.31.1"]},
 {id:"mysql",name:"MySQL Connector/J",groupId:"com.mysql",artifactId:"mysql-connector-j",description:"Official MySQL JDBC driver.",versions:["9.4.0","9.3.0","8.4.0"]},
 {id:"web",name:"Spring Boot Starter Web",groupId:"org.springframework.boot",artifactId:"spring-boot-starter-web",description:"Starter for web and REST applications.",versions:["3.5.6","3.5.5","3.4.9"]},
 {id:"junit",name:"JUnit Jupiter",groupId:"org.junit.jupiter",artifactId:"junit-jupiter",description:"JUnit 5 programming and extension model.",versions:["5.13.4","5.12.2","5.11.4"]}
];
const defaults={query:"",results:["spring-data-jpa","liquibase","mysql","web","junit"],selectedArtifact:"spring-data-jpa",selectedVersion:"3.5.6"};
let baseline=null,state=null,toastTimer=0;
const clone=v=>JSON.parse(JSON.stringify(v==null?null:v));
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function normalize(v){return Object.assign({},defaults,clone(v||{}))}
function artifact(){return catalog.find(x=>x.id===state.selectedArtifact)||catalog[0]}
function snippet(){const a=artifact();return "<dependency>\n    <groupId>"+a.groupId+"</groupId>\n    <artifactId>"+a.artifactId+"</artifactId>\n    <version>"+state.selectedVersion+"</version>\n</dependency>"}
function render(){
 refs.searchInput.value=state.query||"";
 const ids=state.results&&state.results.length?state.results:catalog.map(x=>x.id);
 refs.results.innerHTML=ids.map(id=>{const a=catalog.find(x=>x.id===id);if(!a)return"";return '<div class="result '+(a.id===state.selectedArtifact?"active":"")+'" data-id="'+a.id+'"><b>'+esc(a.name)+'</b><div class="coord">'+esc(a.groupId)+":"+esc(a.artifactId)+'</div></div>'}).join("");
 refs.results.querySelectorAll(".result").forEach(row=>row.onclick=()=>{state.selectedArtifact=row.dataset.id;state.selectedVersion=artifact().versions[0];render()});
 const a=artifact();
 refs.detail.innerHTML='<h1>'+esc(a.name)+'</h1><div class="meta">'+esc(a.groupId)+" : "+esc(a.artifactId)+'</div><div class="summary">'+esc(a.description)+'</div><div id="snippetCard" class="snippetCard"><div class="snippetHead">Maven dependency XML <button id="copySnippetBtn" type="button">Copy</button></div><pre class="snippet">'+esc(snippet())+"</pre></div>";
 $("copySnippetBtn").onclick=copySnippet;
 refs.versions.innerHTML=a.versions.map(v=>'<div class="versionRow '+(v===state.selectedVersion?"active":"")+'" data-version="'+esc(v)+'"><span>'+esc(v)+'</span><b class="badge">'+(v===a.versions[0]?"Latest":"Release")+"</b></div>").join("");
 refs.versions.querySelectorAll(".versionRow").forEach(row=>row.onclick=()=>{state.selectedVersion=row.dataset.version;render()});
}
function search(q){state.query=String(q||"");const needle=state.query.trim().toLowerCase();state.results=catalog.filter(a=>!needle||[a.name,a.groupId,a.artifactId,a.description].some(x=>x.toLowerCase().includes(needle))).map(a=>a.id);if(state.results.length&&!state.results.includes(state.selectedArtifact)){state.selectedArtifact=state.results[0];state.selectedVersion=artifact().versions[0]}render()}
function toast(text){clearTimeout(toastTimer);refs.toast.textContent=text;refs.toast.classList.add("show");toastTimer=setTimeout(()=>refs.toast.classList.remove("show"),1500)}
async function copySnippet(){const text=snippet();try{if(navigator.clipboard)await navigator.clipboard.writeText(text)}catch(_){ }toast("Copied Maven dependency XML")}
function reset(){state=normalize(baseline||{});render()}
function apply(step){const d=step&&step.data||{};switch(step&&step.action){
 case"resetSearch":reset();break;
 case"setSearch":state.query=String(d.query||d.text||"");render();break;
 case"searchDependency":search(d.query||d.text||d.name||"");break;
 case"openArtifact":{const q=d.id||d.artifactId||d.name;const a=catalog.find(x=>x.id===q||x.artifactId===q||x.name===q);if(a){state.selectedArtifact=a.id;state.selectedVersion=d.version||a.versions[0];render()}break}
 case"selectVersion":state.selectedVersion=String(d.version||d.value||artifact().versions[0]);render();break;
 case"showMavenSnippet":render();break;
 case"copyMavenSnippet":copySnippet();break;
 case"highlightTarget":break;
}}
function install(){refs.searchBtn.onclick=()=>search(refs.searchInput.value);refs.searchInput.onkeydown=e=>{if(e.key==="Enter")search(refs.searchInput.value)};document.addEventListener("keydown",e=>{if(["INPUT","SELECT","TEXTAREA"].includes(document.activeElement&&document.activeElement.tagName))return;if(e.key==="ArrowLeft")parent.postMessage({type:"SIM_NAVIGATE",app:APP_ID,direction:"prev"},"*");if(e.key==="ArrowRight")parent.postMessage({type:"SIM_NAVIGATE",app:APP_ID,direction:"next"},"*")})}
window.addEventListener("message",e=>{const m=e.data||{};if(m.type==="SIM_PACKAGE"){baseline=normalize(m.package&&m.package.apps&&m.package.apps.maven_central||{});reset()}if(m.type==="SIM_SEEK"){reset();(m.steps||[]).forEach(apply);parent.postMessage({type:"SIM_SEEK_DONE",app:APP_ID},"*")}if(m.type==="SIM_EXPLAIN"){refs.assistant.classList.remove("hidden");const t=refs.assistant.querySelector("[data-sim-explanation-text]");if(t)t.textContent=m.text||m.explanation||""}if(m.type==="SIM_PING")parent.postMessage({type:"ENGINE_READY",app:APP_ID,actions:SUPPORTED_ACTIONS},"*")});
install();baseline=normalize({});reset();parent.postMessage({type:"ENGINE_READY",app:APP_ID,actions:SUPPORTED_ACTIONS},"*");
})();