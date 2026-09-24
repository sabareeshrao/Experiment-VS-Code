"use strict";

const fs=require("fs");
const path=require("path");

const ROOT=path.resolve(__dirname,"..");
const MANIFEST_PATH=path.join(ROOT,"simulator","adaptive-capabilities.json");
const CONTRACT_PATH=path.join(ROOT,"simulator","action-contract.json");

const DISPLAY_NAMES={
  intellij:"IntelliJ IDEA",vscode:"Visual Studio Code",pgadmin:"pgAdmin 4",postman:"Postman",
  cmd:"Windows Command Prompt",linux:"Linux",ssms:"SQL Server Management Studio",jira:"Jira",
  jenkins:"Jenkins",powerbi:"Power BI Desktop",git:"Git",github:"GitHub",
  github_actions:"GitHub Actions",mysqlworkbench:"MySQL Workbench",redis:"Redis Insight",
  spring_initializer:"Spring Initializr",maven_central:"Maven Central",eclipse:"Eclipse IDE",
  powershell:"Windows PowerShell",kubernetes:"Kubernetes / Headlamp + kubectl"
};

const STOP=new Set(["open","show","set","get","add","remove","delete","create","run","execute","select","toggle","close","clear","start","stop","press","move","update","edit","load","save","apply","configure","switch","type","append","highlight","view"]);

function readJson(file){return JSON.parse(fs.readFileSync(file,"utf8"))}
function unique(a){return [...new Set(a)]}
function words(value){
  return String(value||"")
    .replace(/([a-z0-9])([A-Z])/g,"$1 $2")
    .replace(/[_\-./]+/g," ")
    .trim().toLowerCase().split(/\s+/).filter(Boolean);
}
function kebab(value){return words(value).join("-")}
function title(value){return words(value).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ")}
function extractStringLiterals(block){return unique([...String(block||"").matchAll(/["']([^"']+)["']/g)].map(m=>m[1]))}
function extractSupportedActions(source){
  let m=source.match(/(?:const|let|var)\s+SUPPORTED_ACTIONS\s*=\s*\[([\s\S]*?)\]\s*;/);
  if(m)return extractStringLiterals(m[1]);
  m=source.match(/ENGINE_READY[\s\S]{0,1800}?actions\s*:\s*\[([\s\S]*?)\]/);
  if(m)return extractStringLiterals(m[1]);
  m=source.match(/actions\s*:\s*\[([\s\S]*?)\][\s\S]{0,350}?ENGINE_READY/);
  if(m)return extractStringLiterals(m[1]);
  return [];
}
function actionKind(action){
  const first=words(action)[0]||"";
  if(["delete","remove","drop","kill","abort","shutdown","discard","clear"].includes(first))return "destructive_or_reset";
  if(["create","add","generate","import","clone","init","fork"].includes(first))return "create";
  if(["set","edit","update","rename","configure","type","append","replace","assign","grant","revoke"].includes(first))return "modify";
  if(["run","execute","send","start","publish","deploy","connect","commit","push","pull","fetch","merge","rebase","apply","approve"].includes(first))return "execute";
  if(["open","show","view","select","expand","inspect","search","find","load"].includes(first))return "open_or_inspect";
  if(["toggle","enable","disable","collapse"].includes(first))return "toggle";
  return "interaction";
}
function area(id,action){
  const t=new Set([...words(id),...words(action)]);
  const rules=[
    ["terminal",["terminal","cli","shell","command","powershell","cmd"]],
    ["editor",["editor","code","completion","diagnostic","quick","refactor","constructor","getter","setter","symbol","documentation"]],
    ["project_navigation",["project","file","directory","package","tree","workspace"]],
    ["run_debug_test",["run","debug","breakpoint","test","junit","coverage","console"]],
    ["database_sql",["database","sql","query","schema","table","result","transaction","index","procedure","function","jdbc","jpa","hibernate"]],
    ["source_control",["git","commit","branch","merge","rebase","stash","remote","tag","pull","push","history","diff","blame"]],
    ["build_dependencies",["maven","gradle","dependency","build","artifact","plugin"]],
    ["web_api",["request","response","http","graphql","grpc","websocket","api","url","header","cookie","mock","monitor"]],
    ["ci_cd",["jenkins","pipeline","workflow","job","stage","runner","artifact","deployment","approval"]],
    ["kubernetes",["pod","deployment","replicaset","statefulset","daemonset","namespace","cluster","kubectl","node","ingress","service","yaml","cronjob"]],
    ["analytics",["power","dax","tmdl","visual","report","measure","model","query","canvas","slicer","bookmark"]],
    ["security",["security","auth","oauth","jwt","permission","credential","secret","role","login","user"]],
    ["observability",["log","metric","event","profile","statistics","performance","monitor","trace"]],
    ["settings_layout",["settings","preference","layout","pane","sidebar","theme","window","tool"]]
  ];
  for(const [name,tokens] of rules)if(tokens.some(x=>t.has(x)))return name;
  return "general";
}
function inferCandidateActions(featureId,actions){
  const ft=words(featureId).filter(x=>!STOP.has(x)&&x.length>2);
  if(!ft.length)return [];
  return actions.map(a=>{
    const aw=words(a).filter(x=>!STOP.has(x)&&x.length>2);
    const overlap=ft.filter(x=>aw.includes(x));
    const score=overlap.length/Math.max(ft.length,aw.length,1);
    return {action:a,score:Number(score.toFixed(3)),overlap};
  }).filter(x=>x.overlap.length&&x.score>=0.25).sort((a,b)=>b.score-a.score).slice(0,8);
}
function makeRecord({software,spec,meta,featureId,manifestDeclared,canonicalActions,allActions}){
  const action=canonicalActions[0]||"";
  const kind=action?actionKind(action):(featureId.includes("persistent")||featureId.includes("resizable")?"passive_infrastructure":"passive_ui_capability");
  const candidates=inferCandidateActions(featureId,allActions).filter(x=>!canonicalActions.includes(x.action));
  const areaName=area(featureId,action);
  const destructive=canonicalActions.some(a=>actionKind(a)==="destructive_or_reset");
  const display=title(featureId);
  const sourceKinds=[];
  if(manifestDeclared)sourceKinds.push("adaptive_capability_manifest");
  if(canonicalActions.length)sourceKinds.push("engine_supported_action");
  const expectedAfter=canonicalActions.length
    ? "The software must visibly reflect the result of the canonical action; hidden JavaScript state alone is insufficient."
    : "The named capability must be visibly represented in the software UI when a lesson depends on it.";
  return {
    schema_version:1,
    software:{
      id:software,
      display_name:DISPLAY_NAMES[software]||software,
      directory:spec.directory,
      package_key:spec.packageKey,
      target_fidelity:meta.targetFidelity??null
    },
    feature:{
      id:featureId,
      display_name:display,
      area:areaName,
      interaction_kind:kind,
      implementation_status:canonicalActions.length?"engine_action_exposed":(manifestDeclared?"registered_capability":"catalog_only"),
      source_kinds:sourceKinds,
      manifest_declared:!!manifestDeclared,
      canonical_actions:canonicalActions,
      candidate_related_actions:candidates,
      action_mapping_note:canonicalActions.length
        ?"Canonical actions are backed by the simulator's advertised supported-action surface."
        :"No exact canonical action name matches this feature id. Candidate mappings are heuristic and must be confirmed in the engine before authoring action data."
    },
    intent:{
      user_goal:"Use "+display+" as part of a realistic "+(DISPLAY_NAMES[software]||software)+" workflow.",
      transcript_requirement:"Treat this as available only when the transcript/video requires the visible capability described here.",
      when_to_use:"Use this feature file when transcript actions, spoken UI references, or expected visible results correspond to "+display+".",
      when_not_to_use:"Do not substitute this feature for a different control merely because the concepts are related."
    },
    ui_contract:{
      owner:"simulator/"+spec.directory,
      primary_area:areaName,
      required_visibility:"A lesson using this capability must produce a visible software-owned UI state.",
      before_state:"The simulator starts from the package baseline plus prior cumulative actions.",
      interaction:canonicalActions.length
        ?"Invoke one of the canonical actions with data matching its engine handler."
        :"This capability may be passive or represented through another action; inspect the implementation before choosing lesson action data.",
      after_state:expectedAfter,
      focus_and_scroll:"If the interaction types, selects, opens, runs, or changes content, keep the active control/result visible without replay shaking.",
      highlight_rule:"Highlight only the precise control, row, field, tab, code line, command, or result relevant to this feature; never the whole application surface.",
      explanation_rule:"Explanation UI is parent-owned and global. This feature must not create its own competing explanation card."
    },
    input_contract:{
      likely_input_modes:kind==="modify"?["mouse","keyboard/text"]:kind==="execute"?["mouse","keyboard when applicable"]:["mouse","keyboard when applicable"],
      parameters:"Read the exact engine handler for the selected canonical action before creating lesson action.data. This catalog intentionally does not invent unsupported parameters.",
      destructive:destructive,
      destructive_note:destructive?"Replay must remain deterministic and reset from package baseline before historical actions are reapplied.":"No destructive semantics are inferred from the canonical action name."
    },
    state_contract:{
      baseline_source:"window.COURSE.package.apps."+spec.packageKey,
      cumulative_replay:true,
      deterministic_required:true,
      historical_replay:"silent",
      final_step_animation:"allowed when requested",
      user_preferences:"User-controlled layout/theme/persistent preferences must not be overwritten by lesson replay unless the lesson explicitly changes that preference."
    },
    transcript_matching:{
      canonical_feature_id:featureId,
      normalized_terms:unique([featureId,display,...words(featureId)]),
      exact_engine_actions:canonicalActions,
      candidate_engine_actions:candidates.map(x=>x.action),
      decision_rule:"A transcript mention is not enough by itself. Match the visible interaction and expected UI result, then confirm the canonical engine action."
    },
    lesson_authoring:{
      required_capability_value:featureId,
      feature_available:true,
      preferred_actions:canonicalActions,
      action_lookup_required:!canonicalActions.length,
      authoring_steps:[
        "Confirm the transcript actually uses this visible feature.",
        "Open this feature file rather than relying only on AI_CAPABILITY_INDEX.json.",
        "If preferred_actions is non-empty, inspect the matching engine handler for required action.data.",
        "If preferred_actions is empty, inspect candidate_related_actions and the simulator engine; do not invent an action.",
        "Ensure the resulting lesson action visibly changes or focuses the expected UI.",
        "Validate deterministic direct-jump replay from a clean load."
      ],
      missing_feature_rule:"If the transcript requires behavior beyond this file and no engine action/UI supports it, mark the requirement missing and upgrade the master simulator before building that lesson."
    },
    implementation:{
      engine_source:"simulator/"+spec.directory+"/"+spec.engineSource,
      ui_source:"simulator/"+spec.directory+"/index.html",
      manifest_source:"simulator/adaptive-capabilities.json#simulators."+spec.manifestKey,
      action_contract_source:"simulator/action-contract.json#simulators."+software,
      implementation_search_terms:unique([featureId,...canonicalActions]),
      source_review_required:!canonicalActions.length
    },
    replay_and_quality:{
      direct_middle_jump_required:true,
      normal_reload_required:true,
      hard_refresh_forbidden:true,
      stale_screen_forbidden:true,
      historical_flicker_forbidden:true,
      duplicate_explanation_forbidden:true,
      giant_highlight_forbidden:true,
      visual_fidelity_note:"Catalog presence proves registered/implemented capability coverage, not pixel-perfect visual fidelity. Visual fidelity must be assessed separately."
    },
    validation:{
      manifest_feature_present:!!manifestDeclared,
      engine_action_present:canonicalActions.length>0,
      exact_action_names:canonicalActions,
      catalog_generated_from_current_master:true,
      visual_browser_verification:"not implied",
      regression_expectations:[
        "Feature file remains present while capability/action remains supported.",
        "Canonical actions remain declared by the simulator.",
        "Feature remains software-owned rather than implemented in app.js.",
        "Lesson replay remains deterministic."
      ]
    },
    maintenance:{
      canonical_file:"simulator/"+spec.directory+"/features/"+featureId+".json",
      update_when:[
        "feature UI changes materially",
        "canonical action is added/renamed/removed",
        "lesson data parameters change",
        "capability is split into more precise sub-features",
        "transcript audits discover a missing visible state"
      ],
      generated_baseline_note:"This file is a detailed baseline generated from the registered capability and engine action surfaces. Future manual enrichment is allowed; the generator does not need to replace enriched files unless explicitly run with --force."
    }
  };
}

function catalogForSoftware(root,software,spec,manifest){
  const meta=manifest.simulators?.[spec.manifestKey]||{};
  const enginePath=path.join(root,"simulator",spec.directory,spec.engineSource);
  const source=fs.readFileSync(enginePath,"utf8");
  const actions=extractSupportedActions(source);
  const records=new Map();
  for(const f of unique(meta.features||[])){
    const id=kebab(f);
    records.set(id,{manifestDeclared:true,canonicalActions:[]});
  }
  for(const a of actions){
    const id=kebab(a);
    if(!records.has(id))records.set(id,{manifestDeclared:false,canonicalActions:[]});
    records.get(id).canonicalActions.push(a);
  }
  const out=[...records.entries()].map(([featureId,x])=>makeRecord({software,spec,meta,featureId,manifestDeclared:x.manifestDeclared,canonicalActions:unique(x.canonicalActions),allActions:actions}))
    .sort((a,b)=>a.feature.id.localeCompare(b.feature.id));
  return {meta,actions,records:out};
}

function writeCatalog(root,software,spec,manifest,{force=false}={}){
  const dir=path.join(root,"simulator",spec.directory,"features");
  fs.mkdirSync(dir,{recursive:true});
  const {meta,actions,records}=catalogForSoftware(root,software,spec,manifest);
  const files=[];
  for(const record of records){
    const file=path.join(dir,record.feature.id+".json");
    if(force||!fs.existsSync(file))fs.writeFileSync(file,JSON.stringify(record,null,2)+"\n");
    files.push(record.feature.id+".json");
  }
  const index={
    schema_version:1,
    software_id:software,
    display_name:DISPLAY_NAMES[software]||software,
    directory:spec.directory,
    purpose:"Routing index only. Read the individual feature JSON file before deciding whether a transcript requirement is supported.",
    feature_file_count:files.length,
    manifest_feature_count:unique(meta.features||[]).length,
    engine_action_count:actions.length,
    files,
    sources:{
      manifest:"simulator/adaptive-capabilities.json#simulators."+spec.manifestKey,
      engine:"simulator/"+spec.directory+"/"+spec.engineSource,
      action_contract:"simulator/action-contract.json#simulators."+software
    }
  };
  fs.writeFileSync(path.join(dir,"index.json"),JSON.stringify(index,null,2)+"\n");
  const readme=[
    "# "+(DISPLAY_NAMES[software]||software)+" detailed feature catalog",
    "",
    "This directory is the AI-facing detailed capability source for this simulator.",
    "",
    "- One JSON file = one feature/action-level capability.",
    "- `index.json` is navigation only; do not use it as a substitute for reading the relevant feature file.",
    "- Features come from the adaptive capability manifest, the simulator's actual supported actions, or both.",
    "- `candidate_related_actions` are heuristic and must be confirmed in the engine.",
    "- Catalog presence does not by itself prove pixel-perfect UI fidelity.",
    "- Missing transcript behavior must be implemented in this master simulator before downstream lesson creation.",
    ""
  ].join("\n");
  fs.writeFileSync(path.join(dir,"README.md"),readme);
  return index;
}

function main(){
  const contract=readJson(CONTRACT_PATH);
  const manifest=readJson(MANIFEST_PATH);
  const force=process.argv.includes("--force");
  const onlyArg=process.argv.find(x=>x.startsWith("--software="));
  const only=onlyArg?new Set(onlyArg.slice("--software=".length).split(",").filter(Boolean)):null;
  let total=0;
  for(const [software,spec] of Object.entries(contract.simulators||{})){
    if(only&&!only.has(software))continue;
    const index=writeCatalog(ROOT,software,spec,manifest,{force});
    total+=index.feature_file_count;
    console.log(software+": "+index.feature_file_count+" detailed feature files");
  }
  console.log("Detailed feature files:",total);
}
if(require.main===module)main();

module.exports={extractSupportedActions,catalogForSoftware,makeRecord,kebab,title};
