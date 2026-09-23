(() => {
"use strict";
const APP_ID="spring_initializer";
const SUPPORTED_ACTIONS=["resetGenerator","setProjectType","setLanguage","setBootVersion","setMetadata","setGroup","setArtifact","setName","setPackageName","setDescription","setPackaging","setJavaVersion","setConfigFormat","openDependencies","closeDependencies","searchDependencies","addDependency","removeDependency","generateProject","highlightTarget"];
const $=id=>document.getElementById(id);
const refs={projectType:$("projectType"),language:$("language"),bootVersion:$("bootVersion"),group:$("group"),artifact:$("artifact"),name:$("name"),packageName:$("packageName"),description:$("description"),packaging:$("packaging"),javaVersion:$("javaVersion"),configFormat:$("configFormat"),dependencyList:$("dependencyList"),addDependencyBtn:$("addDependencyBtn"),generateBtn:$("generateBtn"),generatedSummary:$("generatedSummary"),dependencyShade:$("dependencyShade"),dependencySearch:$("dependencySearch"),dependencyCatalog:$("dependencyCatalog"),dependencyClose:$("dependencyClose"),assistant:$("assistant")};
const dependencies=[
 {id:"web",name:"Spring Web",description:"Build web and RESTful applications with Spring MVC."},
 {id:"data-jpa",name:"Spring Data JPA",description:"Persist data with Spring Data and Hibernate."},
 {id:"validation",name:"Validation",description:"Bean Validation with Hibernate Validator."},
 {id:"security",name:"Spring Security",description:"Authentication and authorization support."},
 {id:"liquibase",name:"Liquibase Migration",description:"Database schema migration with Liquibase."},
 {id:"mysql",name:"MySQL Driver",description:"MySQL JDBC driver."},
 {id:"postgresql",name:"PostgreSQL Driver",description:"PostgreSQL JDBC driver."},
 {id:"lombok",name:"Lombok",description:"Java annotation library that reduces boilerplate."},
 {id:"devtools",name:"Spring Boot DevTools",description:"Fast restarts and development conveniences."}
];
const defaults={projectType:"Maven",language:"Java",bootVersion:"3.5.6",group:"com.example",artifact:"demo",name:"demo",packageName:"com.example.demo",description:"Demo project for Spring Boot",packaging:"Jar",javaVersion:"17",configFormat:"Properties",dependencies:[],generated:false};
let baseline=null,state=null;
const clone=v=>JSON.parse(JSON.stringify(v==null?null:v));
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function normalize(v){const src=clone(v||{});return Object.assign({},defaults,src,{dependencies:Array.isArray(src.dependencies)?src.dependencies.slice():[]})}
function renderSegment(el,items,value,key){el.innerHTML=items.map(x=>'<button type="button" class="seg '+(x===value?"active":"")+'" data-value="'+esc(x)+'">'+esc(x)+'</button>').join("");el.querySelectorAll("button").forEach(b=>b.onclick=()=>{state[key]=b.dataset.value;render()})}
function renderCatalog(q){const needle=String(q||"").trim().toLowerCase();refs.dependencyCatalog.innerHTML=dependencies.filter(d=>!needle||d.name.toLowerCase().includes(needle)||d.description.toLowerCase().includes(needle)).map(d=>'<div class="catRow" data-id="'+d.id+'"><b>'+esc(d.name)+'</b><span>'+esc(d.description)+'</span></div>').join("");refs.dependencyCatalog.querySelectorAll(".catRow").forEach(row=>row.onclick=()=>{if(!state.dependencies.includes(row.dataset.id))state.dependencies.push(row.dataset.id);refs.dependencyShade.classList.remove("show");render()})}
function render(){
 renderSegment(refs.projectType,["Maven","Gradle"],state.projectType,"projectType");
 renderSegment(refs.language,["Java","Kotlin","Groovy"],state.language,"language");
 refs.bootVersion.innerHTML=["3.5.6","3.5.5","3.4.9","3.3.13"].map(v=>'<option '+(v===state.bootVersion?"selected":"")+'>'+v+'</option>').join("");
 refs.group.value=state.group;refs.artifact.value=state.artifact;refs.name.value=state.name;refs.packageName.value=state.packageName;refs.description.value=state.description;
 renderSegment(refs.packaging,["Jar","War"],state.packaging,"packaging");
 renderSegment(refs.javaVersion,["21","17","11"],state.javaVersion,"javaVersion");
 renderSegment(refs.configFormat,["Properties","YAML"],state.configFormat,"configFormat");
 refs.dependencyList.innerHTML=state.dependencies.length?state.dependencies.map(id=>{const d=dependencies.find(x=>x.id===id)||{id:id,name:id};return '<div class="dep" data-id="'+esc(id)+'"><span>'+esc(d.name)+'</span><button type="button" title="Remove">×</button></div>'}).join(""):'<div class="empty">No dependency selected.</div>';
 refs.dependencyList.querySelectorAll(".dep button").forEach(b=>b.onclick=()=>{const id=b.parentElement.dataset.id;state.dependencies=state.dependencies.filter(x=>x!==id);render()});
 refs.generatedSummary.classList.toggle("show",!!state.generated);
 if(state.generated)refs.generatedSummary.textContent=state.projectType+" • "+state.language+" • Java "+state.javaVersion+"\n"+state.group+":"+state.artifact+"\n"+(state.dependencies.length?state.dependencies.join(", "):"No dependencies")+"\nGenerated "+state.artifact+".zip";
 renderCatalog(refs.dependencySearch.value);
}
function reset(){state=normalize(baseline||{});refs.dependencyShade.classList.remove("show");refs.dependencySearch.value="";render()}
function setValue(key,value){state[key]=String(value==null?"":value);render()}
function apply(step){const d=step&&step.data||{};switch(step&&step.action){
 case"resetGenerator":reset();break;
 case"setProjectType":setValue("projectType",d.value||d.projectType||"Maven");break;
 case"setLanguage":setValue("language",d.value||d.language||"Java");break;
 case"setBootVersion":setValue("bootVersion",d.value||d.version||"3.5.6");break;
 case"setMetadata":Object.assign(state,d);render();break;
 case"setGroup":setValue("group",d.value||d.group);break;
 case"setArtifact":state.artifact=String(d.value||d.artifact||"demo");if(d.keepName!==true){state.name=state.artifact;state.packageName=(state.group||"com.example")+"."+state.artifact.replace(/-/g,"")}render();break;
 case"setName":setValue("name",d.value||d.name);break;
 case"setPackageName":setValue("packageName",d.value||d.packageName);break;
 case"setDescription":setValue("description",d.value||d.description);break;
 case"setPackaging":setValue("packaging",d.value||d.packaging||"Jar");break;
 case"setJavaVersion":setValue("javaVersion",d.value||d.version||"17");break;
 case"setConfigFormat":setValue("configFormat",d.value||d.format||"Properties");break;
 case"openDependencies":refs.dependencyShade.classList.add("show");break;
 case"closeDependencies":refs.dependencyShade.classList.remove("show");break;
 case"searchDependencies":refs.dependencyShade.classList.add("show");refs.dependencySearch.value=d.query||d.text||"";renderCatalog(refs.dependencySearch.value);break;
 case"addDependency":{const id=d.id||d.dependency||d.name;if(id&&!state.dependencies.includes(id))state.dependencies.push(id);render();break}
 case"removeDependency":state.dependencies=state.dependencies.filter(x=>x!==(d.id||d.dependency||d.name));render();break;
 case"generateProject":state.generated=true;render();break;
 case"highlightTarget":break;
}}
function install(){
 refs.bootVersion.onchange=()=>{state.bootVersion=refs.bootVersion.value};
 [["group","group"],["artifact","artifact"],["name","name"],["packageName","packageName"],["description","description"]].forEach(pair=>{refs[pair[0]].oninput=()=>{state[pair[1]]=refs[pair[0]].value}});
 refs.addDependencyBtn.onclick=()=>refs.dependencyShade.classList.add("show");
 refs.dependencyClose.onclick=()=>refs.dependencyShade.classList.remove("show");
 refs.dependencyShade.onclick=e=>{if(e.target===refs.dependencyShade)refs.dependencyShade.classList.remove("show")};
 refs.dependencySearch.oninput=()=>renderCatalog(refs.dependencySearch.value);
 refs.generateBtn.onclick=()=>{state.generated=true;render()};
 document.addEventListener("keydown",e=>{if(e.key==="Escape")refs.dependencyShade.classList.remove("show");if(["INPUT","SELECT","TEXTAREA"].includes(document.activeElement&&document.activeElement.tagName))return;if(e.key==="ArrowLeft")parent.postMessage({type:"SIM_NAVIGATE",app:APP_ID,direction:"prev"},"*");if(e.key==="ArrowRight")parent.postMessage({type:"SIM_NAVIGATE",app:APP_ID,direction:"next"},"*")});
}
window.addEventListener("message",e=>{const m=e.data||{};if(m.type==="SIM_PACKAGE"){baseline=normalize(m.package&&m.package.apps&&m.package.apps.spring_initializer||{});reset()}if(m.type==="SIM_SEEK"){reset();(m.steps||[]).forEach(apply);parent.postMessage({type:"SIM_SEEK_DONE",app:APP_ID},"*")}if(m.type==="SIM_EXPLAIN"){refs.assistant.classList.remove("hidden");const t=refs.assistant.querySelector("[data-sim-explanation-text]");if(t)t.textContent=m.text||m.explanation||""}if(m.type==="SIM_PING")parent.postMessage({type:"ENGINE_READY",app:APP_ID,actions:SUPPORTED_ACTIONS},"*")});
install();baseline=normalize({});reset();parent.postMessage({type:"ENGINE_READY",app:APP_ID,actions:SUPPORTED_ACTIONS},"*");
})();