"use strict";
const fs=require("fs"),path=require("path");
const names={"intellij":"IntelliJ IDEA","eclipse":"Eclipse IDE","vscode":"Visual Studio Code","pgadmin":"pgAdmin 4","postman":"Postman","cmd":"Windows Command Prompt","powershell":"Windows PowerShell","linux":"Linux","ssms":"SQL Server Management Studio","jira":"Jira","jenkins":"Jenkins","powerbi":"Power BI Desktop","git":"Git","github":"GitHub","github_actions":"GitHub Actions","mysqlworkbench":"MySQL Workbench","redis":"Redis Insight","spring_initializer":"Spring Initializr","maven_central":"Maven Central","kubernetes":"Kubernetes / Headlamp + kubectl"};
function build(root=path.resolve(__dirname,"..")){
 const contract=JSON.parse(fs.readFileSync(path.join(root,"simulator/action-contract.json"),"utf8"));
 const manifest=JSON.parse(fs.readFileSync(path.join(root,"simulator/adaptive-capabilities.json"),"utf8"));
 const software={};
 for(const [id,spec] of Object.entries(contract.simulators||{})){
  const meta=manifest.simulators?.[spec.manifestKey]||{};
  const catalog="simulator/"+spec.directory+"/features/index.json";
  software[id]={
   display_name:names[id]||id,
   directory:spec.directory,
   package_key:spec.packageKey,
   action_source:"simulator/"+spec.directory+"/"+spec.engineSource,
   capability_summary_source:"simulator/adaptive-capabilities.json#simulators."+spec.manifestKey,
   detailed_feature_catalog:catalog,
   detailed_feature_directory:"simulator/"+spec.directory+"/features/",
   detailed_feature_read_required:true,
   target_fidelity:meta.targetFidelity??null,
   summary_features:[...new Set(meta.features||[])].sort(),
   indexed_actions:[...new Set(meta.actions||[])].sort(),
   action_lookup_required:!(Array.isArray(meta.actions)&&meta.actions.length),
   ...(id==="intellij"?{
     microscopic_schema_version:2,
     microscopic_generator:"scripts/build-intellij-microscopic-features.cjs",
     current_replay_limitations:{
       projectImpact_runtime_enforced:false,
       checkpoints:false,
       semantic_anchors:false,
       textual_marker_for_typeCode:true
     }
   }:{})
  };
 }
 return {
  schema_version:3,
  lesson_source:{root:"lesson-json",course_manifest:"lesson-json/course.json",chapter_schema:"lesson-json/chapter.schema.json",generated_output:"lessons.js",compiler:"scripts/build-lessons.cjs"},
  file_purpose:"AI ROUTING INDEX — not a complete capability list. Use it to locate each software's detailed feature catalog, then read the relevant individual feature JSON files before deciding transcript support.",
  generated_by:"scripts/build-capability-index.cjs",
  detailed_catalog_generator:"scripts/build-feature-catalog.cjs",
  rules:[
   "This file is a router/summary only. Do NOT decide that a feature is present or missing from this file alone.",
   "For the target software, open detailed_feature_catalog and then read the relevant individual JSON files under detailed_feature_directory.",
   "Each detailed file describes source evidence, canonical actions, candidate mappings, visible UI contract, replay rules, transcript matching and lesson-authoring guidance.",
   "Every advertised engine action must have an action-level feature file even when the old summary manifest omitted it.",
   "Candidate related actions are heuristic; inspect action_source before writing action.data.",
   "Create or edit chapters under lesson-json/; do not hand-edit lessons.js.",
   "After lesson JSON changes run node scripts/build-lessons.cjs, then validate.",
   "Never invent a new action if an existing canonical action already represents the transcript interaction.",
   "If the transcript requires behavior not represented by the detailed catalog and engine UI, mark it missing and upgrade the master simulator first.",
   "Product-specific UI belongs only inside that simulator.",
   "Simulator visibility is lesson-driven; never add software-specific global player buttons or one-off ?software= preview routes.",
   "For IntelliJ, feature JSON uses microscopic schema v2; read the exact file before authoring action.data.",
   "Do not assume IntelliJ projectImpact, checkpoint, or semantic-anchor support exists until runtime implements it."
  ],
  lesson_json_contract:{
   software:"Canonical key from software.",
   required_capability:"Exact detailed feature id from the target software features/ directory.",
   feature_available:"Boolean determined after reading the relevant detailed feature file and confirming the visible behavior.",
   canonical_action:"Existing simulator action confirmed from the feature file and action source.",
   missing_feature_request:{surface:"Missing product-owned surface.",interaction:"Required interaction.",expected_ui:["Visible controls/results."],expected_behavior:"Required state/result."}
  },
  software
 };
}
function json(v){return JSON.stringify(v,null,2)+"\n"}
if(require.main===module){const root=path.resolve(__dirname,".."),target=path.join(root,"AI_CAPABILITY_INDEX.json");fs.writeFileSync(target,json(build(root)));console.log("Wrote AI_CAPABILITY_INDEX.json")}
module.exports={build,json};
