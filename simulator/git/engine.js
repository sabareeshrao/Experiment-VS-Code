(() => {
"use strict";

const APP_ID = "git";
const SUPPORTED_ACTIONS = [
  "openRepository","initRepository","cloneRepository","setView","openView","refreshRepository",
  "createBranch","checkoutBranch","switchBranch","renameBranch","deleteBranch","stageFile",
  "unstageFile","stageAll","unstageAll","editFile","addFile","deleteFile",
  "discardChanges","setCommitMessage","commit","amendCommit","openHistory","selectCommit",
  "showCommit","showDiff","selectFile","addRemote","removeRemote","fetch",
  "pull","push","setTracking","mergeBranch","rebaseBranch","resolveConflict",
  "createTag","deleteTag","stash","stashApply","stashPop","stashDrop",
  "openTerminal","closeTerminal","toggleTerminal","setTerminalShell","runCommand","addTerminalOutput",
  "clearTerminal","setStatus","showNotification","highlightTarget","highlight","pressButton",
  "openRepositoryInfo","openSettings","setUserConfig","setConfig","showConfig","openCredentials",
  "setCredentialHelper","setSigningKey","toggleCommitSigning","openBranches","compareBranches","createRemoteBranch",
  "deleteRemoteBranch","renameRemote","pruneRemote","fetchPrune","openReflog","selectReflogEntry",
  "resetSoft","resetMixed","resetHard","revertCommit","cherryPick","openInteractiveRebase",
  "setRebasePlan","continueRebase","abortRebase","openMergeConflict","continueMerge","abortMerge",
  "squashCommits","openBlame","showFileHistory","showStatusPorcelain","showLogGraph","showBranchList",
  "showRemoteList","showTagList","showStashList","showObject","openBisect","bisectStart",
  "bisectMark","bisectReset","openGitignore","setGitignore","generatePatch","applyPatch",
  "openHooks","setHook","runHook","openLFS","trackLfs","untrackLfs",
  "openSubmodules","addSubmodule","updateSubmodules","removeSubmodule","openWorktrees","addWorktree",
  "removeWorktree","openTags","createAnnotatedTag","openStashes","checkoutCommit","restoreBranch",
  "openContextMenu","chooseContextMenuPath","closeContextMenu","openAdaptiveDialog","closeAdaptiveUi"
];

const $ = id => document.getElementById(id);
const refs = {
  app:$("app"), repoPath:$("repoPath"), activeBranch:$("activeBranch"), branchButton:$("branchButton"), syncText:$("syncText"),
  openRepoBtn:$("openRepoBtn"), initBtn:$("initBtn"), cloneBtn:$("cloneBtn"), fetchBtn:$("fetchBtn"), pullBtn:$("pullBtn"), pushBtn:$("pushBtn"), stageAllBtn:$("stageAllBtn"), refreshBtn:$("refreshBtn"), commitTopBtn:$("commitTopBtn"),
  sidebar:$("sidebar"), navChanges:$("navChanges"), navHistory:$("navHistory"), navGraph:$("navGraph"), changeCount:$("changeCount"), commitCount:$("commitCount"), branchList:$("branchList"), remoteList:$("remoteList"), tagList:$("tagList"), stashList:$("stashList"),
  mainTab:$("mainTab"), diffTab:$("diffTab"), mainView:$("mainView"), terminalPane:$("terminalPane"), terminalBody:$("terminalBody"), terminalShell:$("terminalShell"), detailsHead:$("detailsHead"), detailsBody:$("detailsBody"),
  statusRepo:$("statusRepo"), statusBranch:$("statusBranch"), statusChanges:$("statusChanges"), statusText:$("statusText"), toast:$("toast"), boundary:$("targetBoundary"), splitL:$("splitL"), splitR:$("splitR"), splitH:$("splitH"), settingsBtn:$("settingsBtn"), advancedBtn:$("advancedBtn"), utilityShade:$("utilityShade"), utilityTitle:$("utilityTitle"), utilityBody:$("utilityBody"), utilityClose:$("utilityClose"), ctxMenu:$("ctxMenu"), assistant:$("assistant"), assistantText:$("assistantText"), assistantMin:$("assistantMin"), assistantClose:$("assistantClose")
};

let packageRef = null;
let baseline = null;
let state = null;
let autoType = true;
let seekToken = 0;
let allowBoundary = true;
let toastTimer = 0;
let trackedBoundaryElement = null;
let boundaryFrame = 0;
let utilityKind = "";
let logicalCommitSerial = 0;

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const esc = s => String(s ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const arr = value => Array.isArray(value) ? value : [];

function defaultState() {
  return {
    title:"Git",
    version:"Local Repository",
    repository:{name:"", path:"", initialized:false},
    activeBranch:"main",
    branches:[], remotes:[], tags:[], stashes:[], files:[], commits:[], conflicts:[],
    view:"changes", selectedFile:"", selectedCommit:"", commitMessage:"",
    terminalOpen:true, terminalShell:"Git", terminalHistory:[],
    status:"Ready",
    config:{user:{name:"",email:""},settings:{},credentialHelper:"",signingKey:"",signCommits:false},
    remoteBranches:[],reflog:[],rebasePlan:[],bisect:{active:false,good:"",bad:"",current:""},
    gitignore:"",hooks:{},lfs:{patterns:[]},submodules:[],worktrees:[],patches:[],detachedHead:false,
    mergeState:{active:false,from:"",message:""}
  };
}

function normalize(raw) {
  const d = Object.assign(defaultState(), clone(raw || {}));
  d.repository = Object.assign({name:"",path:"",initialized:false}, d.repository || {});
  d.branches = arr(d.branches).map(b => typeof b === "string" ? {name:b} : Object.assign({}, b));
  d.remotes = arr(d.remotes).map(r => typeof r === "string" ? {name:r,url:""} : Object.assign({}, r));
  d.tags = arr(d.tags).map(t => typeof t === "string" ? {name:t} : Object.assign({}, t));
  d.stashes = arr(d.stashes).map((s,i) => typeof s === "string" ? {id:`stash@{${i}}`,message:s} : Object.assign({id:`stash@{${i}}`}, s));
  d.files = arr(d.files).map(f => typeof f === "string" ? {path:f,status:"M",staged:false,content:"",oldContent:""} : Object.assign({path:"",status:"M",staged:false,content:"",oldContent:""}, f));
  d.commits = arr(d.commits).map(c => Object.assign({hash:"",message:"",author:"",date:"",branch:""}, c));
  d.conflicts = arr(d.conflicts);
  d.terminalHistory = arr(d.terminalHistory).map(x => typeof x === "string" ? {cmd:"",out:x} : Object.assign({cmd:"",out:""}, x));

  d.remoteBranches = arr(d.remoteBranches).map(b => typeof b === "string" ? {name:b} : Object.assign({}, b));
  d.reflog = arr(d.reflog).map(x => typeof x === "string" ? {hash:"",action:x,message:""} : Object.assign({hash:"",action:"",message:""}, x));
  d.rebasePlan = arr(d.rebasePlan).map(x => typeof x === "string" ? {action:"pick",hash:"",message:x} : Object.assign({action:"pick",hash:"",message:""}, x));
  d.config = Object.assign({user:{name:"",email:""},settings:{},credentialHelper:"",signingKey:"",signCommits:false}, d.config || {});
  d.config.user = Object.assign({name:"",email:""}, d.config.user || {});
  d.config.settings = Object.assign({}, d.config.settings || {});
  d.bisect = Object.assign({active:false,good:"",bad:"",current:""}, d.bisect || {});
  d.hooks = Object.assign({}, d.hooks || {});
  d.lfs = Object.assign({patterns:[]}, d.lfs || {}); d.lfs.patterns = arr(d.lfs.patterns);
  d.submodules = arr(d.submodules).map(x => typeof x === "string" ? {path:x,url:""} : Object.assign({path:"",url:"",branch:""}, x));
  d.worktrees = arr(d.worktrees).map(x => typeof x === "string" ? {path:x,branch:""} : Object.assign({path:"",branch:""}, x));
  d.patches = arr(d.patches);
  d.mergeState = Object.assign({active:false,from:"",message:""}, d.mergeState || {});

  if (!d.branches.some(b => b.name === d.activeBranch) && d.repository.initialized) d.branches.unshift({name:d.activeBranch,current:true,ahead:0,behind:0});
  d.branches.forEach(b => b.current = b.name === d.activeBranch);
  return d;
}

function applyTheme(theme) {
  document.body.classList.toggle("theme-dark", theme !== "light");
}

function setStatus(text) {
  state.status = String(text ?? "Ready");
  refs.statusText.textContent = state.status;
}

function fileStatusClass(code) {
  const c = String(code || "M").toUpperCase().slice(0,1);
  return c === "A" ? "statusA" : c === "D" ? "statusD" : c === "?" || c === "U" ? "statusU" : "statusM";
}

function branchDisplay(b) {
  const bits = [];
  if (Number(b.ahead || 0)) bits.push(`↑${b.ahead}`);
  if (Number(b.behind || 0)) bits.push(`↓${b.behind}`);
  return bits.length ? ` ${bits.join(" ")}` : "";
}

function currentBranchObject() {
  return state.branches.find(b => b.name === state.activeBranch) || null;
}

function selectedFileObject() {
  return state.files.find(f => f.path === state.selectedFile) || null;
}

function selectedCommitObject() {
  return state.commits.find(c => String(c.hash) === String(state.selectedCommit)) || null;
}

function renderSidebar() {
  refs.branchList.innerHTML = state.branches.map(b => `<div class="listItem ${b.name===state.activeBranch?'active':''}" data-branch="${esc(b.name)}">${b.name===state.activeBranch?'●':'○'} ${esc(b.name)}<span class="muted">${esc(branchDisplay(b))}</span></div>`).join("") || `<div class="listItem muted">No branches</div>`;
  refs.remoteList.innerHTML = state.remotes.map(r => `<div class="listItem" data-remote="${esc(r.name)}">⇅ ${esc(r.name)} <span class="muted">${esc(r.url||"")}</span></div>`).join("") || `<div class="listItem muted">No remotes</div>`;
  refs.tagList.innerHTML = state.tags.map(t => `<div class="listItem" data-tag="${esc(t.name)}">◆ ${esc(t.name)}</div>`).join("") || `<div class="listItem muted">No tags</div>`;
  refs.stashList.innerHTML = state.stashes.map(s => `<div class="listItem" data-stash="${esc(s.id||s.message)}">▤ ${esc(s.message||s.id)}</div>`).join("") || `<div class="listItem muted">No stashes</div>`;
  document.querySelectorAll(".navItem[data-view]").forEach(el => el.classList.toggle("active", el.dataset.view === state.view));
  refs.changeCount.textContent = String(state.files.length);
  refs.commitCount.textContent = String(state.commits.length);
}

function renderChanges() {
  refs.mainTab.textContent = "Working Tree";
  refs.diffTab.textContent = state.selectedFile ? "Diff" : "Details";
  const rows = state.files.map(f => {
    const code = String(f.status || "M").toUpperCase();
    return `<div class="fileRow ${f.path===state.selectedFile?'active':''}" data-file="${esc(f.path)}"><span class="stageBox ${f.staged?'checked':''}" data-stage="${esc(f.path)}">${f.staged?'✓':''}</span><span title="${esc(f.path)}">${esc(f.path)}</span><span class="statusCode ${fileStatusClass(code)}">${esc(code)}</span><span class="muted">${f.staged?'Staged':'Working'}</span></div>`;
  }).join("");
  refs.mainView.innerHTML = `<div class="viewHead"><span class="viewTitle">Changes</span><span class="muted">${state.files.filter(f=>f.staged).length} staged, ${state.files.filter(f=>!f.staged).length} unstaged</span><div class="grow"></div></div><div class="fileList">${rows || '<div class="empty">Working tree clean</div>'}</div>`;
}

function renderHistory() {
  refs.mainTab.textContent = "History";
  refs.diffTab.textContent = "Commit Details";
  const rows = state.commits.map(c => `<div class="commitRow ${String(c.hash)===String(state.selectedCommit)?'active':''}" data-commit="${esc(c.hash)}"><span class="hash">${esc(String(c.hash).slice(0,10))}</span><span>${esc(c.message)}${c.branch?`<span class="branchTag">${esc(c.branch)}</span>`:''}${arr(c.tags).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</span><span class="muted">${esc(c.author)}</span><span class="muted">${esc(c.date)}</span></div>`).join("");
  refs.mainView.innerHTML = `<div class="viewHead"><span class="viewTitle">Commit History</span><span class="muted">${state.activeBranch}</span><div class="grow"></div></div><div class="historyList">${rows || '<div class="empty">No commits yet</div>'}</div>`;
}

function renderGraph() {
  refs.mainTab.textContent = "Graph";
  refs.diffTab.textContent = "Commit Details";
  const rows = state.commits.map((c,i) => `<div class="commitRow ${String(c.hash)===String(state.selectedCommit)?'active':''}" data-commit="${esc(c.hash)}"><span><span style="color:var(--accent)">${i===0?'●':'│●'}</span> <span class="hash">${esc(String(c.hash).slice(0,8))}</span></span><span>${esc(c.message)}${c.branch?`<span class="branchTag">${esc(c.branch)}</span>`:''}</span><span class="muted">${esc(c.author)}</span><span class="muted">${esc(c.date)}</span></div>`).join("");
  refs.mainView.innerHTML = `<div class="viewHead"><span class="viewTitle">Repository Graph</span><span class="muted">${state.branches.length} branches</span><div class="grow"></div></div><div class="historyList">${rows || '<div class="empty">No graph data</div>'}</div>`;
}

function diffHtml(file) {
  if (!file) return `<div class="empty">Select a changed file to inspect its diff.</div>`;
  if (file.diff) return `<div class="diff">${String(file.diff).split("\n").map(line => `<span class="diffLine ${line.startsWith('+')&&!line.startsWith('+++')?'diffAdd':line.startsWith('-')&&!line.startsWith('---')?'diffDel':line.startsWith('@@')||line.startsWith('diff ')?'diffMeta':''}">${esc(line)}</span>`).join("")}</div>`;
  const before = String(file.oldContent ?? "").split("\n");
  const after = String(file.content ?? "").split("\n");
  const lines = [`--- a/${file.path}`,`+++ b/${file.path}`];
  before.forEach(x => lines.push(`-${x}`));
  after.forEach(x => lines.push(`+${x}`));
  return `<div class="diff">${lines.map(line => `<span class="diffLine ${line.startsWith('+')&&!line.startsWith('+++')?'diffAdd':line.startsWith('-')&&!line.startsWith('---')?'diffDel':''}">${esc(line)}</span>`).join("")}</div>`;
}

function renderDetails() {
  if (state.view === "changes") {
    const f = selectedFileObject();
    refs.detailsHead.textContent = f ? "File Details" : "Commit";
    if (f) {
      refs.detailsBody.innerHTML = `<div class="detailCard"><div class="detailTitle">${esc(f.path)}</div><div class="detailBody"><div class="kv"><span>Status</span><b>${esc(f.status)}</b></div><div class="kv"><span>Stage</span><b>${f.staged?'Staged':'Unstaged'}</b></div></div></div>${diffHtml(f)}<button class="commitButton" id="detailStageBtn">${f.staged?'Unstage File':'Stage File'}</button>`;
      const btn = $("detailStageBtn"); if (btn) btn.onclick = () => applyStep({action:f.staged?"unstageFile":"stageFile",data:{path:f.path}},false,seekToken);
    } else {
      refs.detailsBody.innerHTML = `<div class="field"><label>Commit message</label><textarea id="commitMessage" placeholder="Summary of changes">${esc(state.commitMessage)}</textarea></div><button class="commitButton" id="commitButton" ${state.files.some(f=>f.staged)?'':'disabled'}>Commit staged changes</button><div class="detailCard" style="margin-top:10px"><div class="detailTitle">Identity</div><div class="detailBody">${esc(state.user?.name||'')} ${state.user?.email?`&lt;${esc(state.user.email)}&gt;`:''}</div></div>`;
      const msg = $("commitMessage"); if (msg) msg.oninput = () => state.commitMessage = msg.value;
      const btn = $("commitButton"); if (btn) btn.onclick = () => applyStep({action:"commit",data:{message:state.commitMessage}},false,seekToken);
    }
  } else {
    const c = selectedCommitObject();
    refs.detailsHead.textContent = c ? "Commit Details" : "Repository";
    if (c) refs.detailsBody.innerHTML = `<div class="detailCard"><div class="detailTitle">${esc(c.message)}</div><div class="detailBody"><div class="kv"><span>Commit</span><b class="hash">${esc(c.hash)}</b></div><div class="kv"><span>Author</span><span>${esc(c.author)}</span></div><div class="kv"><span>Date</span><span>${esc(c.date)}</span></div><div class="kv"><span>Branch</span><span>${esc(c.branch||'')}</span></div></div></div>${c.diff?`<div class="diff">${String(c.diff).split("\n").map(x=>`<span class="diffLine ${x.startsWith('+')?'diffAdd':x.startsWith('-')?'diffDel':''}">${esc(x)}</span>`).join('')}</div>`:''}`;
    else refs.detailsBody.innerHTML = `<div class="detailCard"><div class="detailTitle">Repository</div><div class="detailBody"><div class="kv"><span>Name</span><b>${esc(state.repository.name||'—')}</b></div><div class="kv"><span>Path</span><span>${esc(state.repository.path||'—')}</span></div><div class="kv"><span>Branch</span><span>${esc(state.activeBranch)}</span></div><div class="kv"><span>Remotes</span><span>${state.remotes.length}</span></div></div></div>`;
  }
}

function renderTerminal() {
  refs.terminalPane.classList.toggle("hidden", state.terminalOpen === false);
  refs.terminalShell.textContent = state.terminalShell || "Git";
  const lines = state.terminalHistory.map(entry => {
    const prompt = entry.prompt || `${state.repository.path || state.repository.name || '~'} (${state.activeBranch}) $`;
    const cmd = entry.cmd ? `<div class="cmdLine"><span class="cmdPrompt">${esc(prompt)}</span> <span class="sim-command-text">${esc(entry.cmd)}</span></div>` : "";
    const out = entry.out ? `<div>${esc(entry.out)}</div>` : "";
    return cmd + out;
  }).join("");
  refs.terminalBody.innerHTML = lines + `<div class="cmdLine" id="currentPrompt"><span class="cmdPrompt">${esc(state.repository.path || state.repository.name || '~')} (${esc(state.activeBranch)}) $</span> <span class="caret"></span></div>`;
  refs.terminalBody.scrollTop = refs.terminalBody.scrollHeight;
}

function renderHeader() {
  const repoName = state.repository.name || "No repository selected";
  const path = state.repository.path || "";
  refs.repoPath.textContent = path ? `${repoName}  —  ${path}` : repoName;
  refs.activeBranch.textContent = state.activeBranch || "main";
  const b = currentBranchObject();
  refs.syncText.textContent = b ? `${Number(b.ahead||0)} ahead, ${Number(b.behind||0)} behind` : "Local repository";
  refs.statusRepo.textContent = repoName;
  refs.statusBranch.textContent = `⑂ ${state.activeBranch || 'main'}`;
  refs.statusChanges.textContent = `${state.files.length} change${state.files.length===1?'':'s'}`;
  refs.statusText.textContent = state.status || "Ready";
}

function renderAll() {
  renderHeader();
  renderSidebar();
  if (state.view === "history") renderHistory(); else if (state.view === "graph") renderGraph(); else renderChanges();
  renderDetails();
  renderTerminal();
  bindDynamicUi();
}

function bindDynamicUi() {
  refs.mainView.querySelectorAll("[data-file]").forEach(el => el.onclick = e => {
    const stage = e.target.closest("[data-stage]");
    if (stage) { const f = state.files.find(x=>x.path===stage.dataset.stage); if(f) applyStep({action:f.staged?"unstageFile":"stageFile",data:{path:f.path}},false,seekToken); return; }
    state.selectedFile = el.dataset.file; renderAll(); clearBoundary();
  });
  refs.mainView.querySelectorAll("[data-commit]").forEach(el => el.onclick = () => { state.selectedCommit = el.dataset.commit; renderAll(); clearBoundary(); });
  refs.branchList.querySelectorAll("[data-branch]").forEach(el => el.onclick = () => applyStep({action:"checkoutBranch",data:{branch:el.dataset.branch}},false,seekToken));
}

let contextState=null;
function contextItems(items,path=[]){return (items||[]).map((it,i)=>{if(it.separator)return '<div class="ctxSep"></div>';const ch=it.items||[],p=[...path,i].join('.');return '<div class="ctxItem '+(ch.length?'has':'')+'" data-ctx-path="'+p+'"><span>'+esc(it.label||'')+'</span><span class="muted">'+esc(it.shortcut||'')+'</span><span>'+(ch.length?'▶':'')+'</span>'+(ch.length?'<div class="ctxSub">'+contextItems(ch,[...path,i])+'</div>':'')+'</div>'}).join('')}
function contextEntry(path){let items=contextState?.items||[],e=null;for(const p of String(path||'').split('.').filter(Boolean)){e=items[Number(p)];items=e?.items||[]}return e}
function openContextMenu(kind,x,y,context={}){const items=window.GIT_CAPABILITIES?.contextMenus?.[kind]||[];contextState={kind,items,context};refs.ctxMenu.innerHTML=contextItems(items);refs.ctxMenu.classList.add('show');refs.ctxMenu.style.left=Math.max(4,Math.min(innerWidth-260,Number(x)||60))+'px';refs.ctxMenu.style.top=Math.max(4,Math.min(innerHeight-220,Number(y)||60))+'px'}
function closeContextMenu(){contextState=null;refs.ctxMenu?.classList.remove('show')}
function showExplanation(m){if(!refs.assistant||!refs.assistantText)return;refs.assistantText.textContent=m.text||m.explanation||m.why||'';refs.assistant.classList.remove('hidden','minimized');refs.assistant.classList.add('show')}
function persistLayout(){try{localStorage.setItem('developerJourney.git.layout.v1',JSON.stringify({side:getComputedStyle(document.documentElement).getPropertyValue('--sideW').trim(),details:getComputedStyle(document.documentElement).getPropertyValue('--detailsW').trim(),term:getComputedStyle(document.documentElement).getPropertyValue('--termH').trim()}))}catch(_){}}
function restoreLayout(){try{const v=JSON.parse(localStorage.getItem('developerJourney.git.layout.v1')||'null');if(v?.side)document.documentElement.style.setProperty('--sideW',v.side);if(v?.details)document.documentElement.style.setProperty('--detailsW',v.details);if(v?.term)document.documentElement.style.setProperty('--termH',v.term)}catch(_){}}
function loadPackage(pkg) {
  packageRef = clone(pkg || {});
  baseline = normalize(packageRef?.apps?.[APP_ID] || {});
  reset();
}

function reset() {
  state = normalize(baseline || {});
  logicalCommitSerial = 0;
  clearTimeout(toastTimer); toastTimer = 0; refs.toast.className = "toast";
  closeUtility();
  clearBoundary();
  renderAll();
}


function closeUtility() {
  utilityKind = "";
  if (refs.utilityShade) refs.utilityShade.classList.remove("show");
  if (refs.utilityBody) refs.utilityBody.innerHTML = "";
}
function showUtility(kind,title,content,html=false) {
  utilityKind = kind || "advanced";
  refs.utilityTitle.textContent = title || "Git";
  if (html) refs.utilityBody.innerHTML = content || ""; else refs.utilityBody.textContent = content || "";
  refs.utilityShade.classList.add("show");
}
function utilityContinuation(action) {
  const groups = {
    settings:["openSettings","setUserConfig","setConfig","showConfig","openCredentials","setCredentialHelper","setSigningKey","toggleCommitSigning"],
    branches:["openBranches","compareBranches","createRemoteBranch","deleteRemoteBranch","renameRemote","pruneRemote","fetchPrune","showBranchList","showRemoteList"],
    reflog:["openReflog","selectReflogEntry","resetSoft","resetMixed","resetHard","revertCommit","cherryPick"],
    rebase:["openInteractiveRebase","setRebasePlan","continueRebase","abortRebase","squashCommits"],
    conflict:["openMergeConflict","resolveConflict","continueMerge","abortMerge"],
    inspect:["openBlame","showFileHistory","showStatusPorcelain","showLogGraph","showBranchList","showRemoteList","showTagList","showStashList","showObject","openRepositoryInfo"],
    bisect:["openBisect","bisectStart","bisectMark","bisectReset"],
    gitignore:["openGitignore","setGitignore"],
    patch:["generatePatch","applyPatch"],
    hooks:["openHooks","setHook","runHook"],
    lfs:["openLFS","trackLfs","untrackLfs"],
    submodules:["openSubmodules","addSubmodule","updateSubmodules","removeSubmodule"],
    worktrees:["openWorktrees","addWorktree","removeWorktree"],
    tags:["openTags","createAnnotatedTag","createTag","deleteTag"],
    stashes:["openStashes","stash","stashApply","stashPop","stashDrop"]
  };
  return !!groups[utilityKind]?.includes(action);
}
function clearTransientBeforeStep(action) {
  clearTimeout(toastTimer); toastTimer = 0; refs.toast.className = "toast";
  if (utilityKind && !utilityContinuation(action)) closeUtility();
}
function renderConfigUtility() {
  const cfg = state.config || {};
  const html = `<div class="utilityGrid">
    <div class="utilityCard"><h3>User identity</h3><pre>${esc(`${cfg.user?.name||""}\n${cfg.user?.email||""}`)}</pre></div>
    <div class="utilityCard"><h3>Credential helper</h3><pre>${esc(cfg.credentialHelper||"Not configured")}</pre></div>
    <div class="utilityCard"><h3>Commit signing</h3><pre>${esc(`enabled: ${!!cfg.signCommits}\nkey: ${cfg.signingKey||""}`)}</pre></div>
    <div class="utilityCard"><h3>Other config</h3><pre>${esc(JSON.stringify(cfg.settings||{},null,2))}</pre></div>
  </div>`;
  showUtility("settings","Git Configuration",html,true);
}
function renderBranchesUtility() {
  const html = `<div class="utilityGrid">
    <div class="utilityCard"><h3>Local branches</h3><pre>${esc(state.branches.map(b=>`${b.name}${b.name===state.activeBranch?" *":""}${branchDisplay(b)}`).join("\n"))}</pre></div>
    <div class="utilityCard"><h3>Remote branches</h3><pre>${esc(state.remoteBranches.map(b=>b.name||b).join("\n"))}</pre></div>
    <div class="utilityCard"><h3>Remotes</h3><pre>${esc(state.remotes.map(r=>`${r.name} ${r.url||""}`).join("\n"))}</pre></div>
  </div>`;
  showUtility("branches","Branches and Remotes",html,true);
}
function renderReflogUtility() {
  const html = state.reflog.map(x=>`<div class="reflogRow"><span class="hash">${esc(String(x.hash||"").slice(0,10))}</span><span>${esc(x.action||"")}</span><span>${esc(x.message||"")}</span></div>`).join("") || `<div class="empty">No reflog entries</div>`;
  showUtility("reflog","Reflog",html,true);
}
function renderRebaseUtility() {
  const html = state.rebasePlan.map(x=>`<div class="rebaseRow"><span class="actionBadge">${esc(x.action||"pick")}</span><span class="hash">${esc(String(x.hash||"").slice(0,10))}</span><span>${esc(x.message||"")}</span></div>`).join("") || `<div class="empty">No rebase plan</div>`;
  showUtility("rebase","Interactive Rebase",html,true);
}
function renderConflictUtility(path) {
  const c = state.conflicts.find(x=>(x.path||x.file)===path) || state.conflicts[0];
  const html = c ? `<div class="conflictBlock"><div class="conflictHead">${esc(c.path||c.file||"Conflict")}</div><div class="conflictPane"><pre>${esc(c.ours||c.current||c.oldContent||"Current branch")}</pre><pre>${esc(c.theirs||c.incoming||c.content||"Incoming branch")}</pre></div></div>` : `<div class="empty">No merge conflicts</div>`;
  showUtility("conflict","Merge Conflict Editor",html,true);
}
function renderInspect(title,text) { showUtility("inspect",title,String(text??"")); }
function addReflog(action,message,hash) {
  state.reflog.unshift({hash:String(hash||state.commits[0]?.hash||""),action:String(action||""),message:String(message||"")});
  if(state.reflog.length>100)state.reflog.length=100;
}
function commitAt(hash) { return state.commits.find(c=>String(c.hash)===String(hash)); }
function restoreCommitSnapshot(c,mode) {
  if(!c)return;
  if(Array.isArray(c.snapshotFiles)) state.files = clone(c.snapshotFiles);
  else if(mode==="hard") state.files = [];
  state.selectedCommit = c.hash;
}

function showToast(message,type="success",ms=1500) {
  clearTimeout(toastTimer);
  refs.toast.textContent = String(message ?? "");
  refs.toast.className = `toast show ${type}`;
  toastTimer = setTimeout(() => refs.toast.classList.remove("show"), Math.max(300, Number(ms)||1500));
}

function uniqueHash() {
  const staged = state.files.filter(f=>f.staged).map(f=>f.path).sort().join("|");
  const seed = `${state.activeBranch}|${state.commits.length}|${logicalCommitSerial}|${state.commitMessage}|${staged}`;
  let h = 0; for (let i=0;i<seed.length;i++) h = ((h<<5)-h + seed.charCodeAt(i))|0;
  logicalCommitSerial++;
  return Math.abs(h).toString(16).padStart(7,"0").slice(0,7);
}

function fileByPath(path) { return state.files.find(f => f.path === path); }

function stageFile(path, staged) {
  const f = fileByPath(path); if (!f) return false; f.staged = staged; state.selectedFile = path; return true;
}

function terminalEntry(command, output, prompt) {
  state.terminalHistory.push({cmd:String(command??""),out:String(output??""),prompt:prompt ? String(prompt) : undefined});
}

async function animateCommand(command, output, token) {
  const base = clone(state.terminalHistory), text = String(command ?? "");
  const steps = Math.min(70, Math.max(1,text.length)), duration = Math.min(1050, Math.max(220,text.length*32));
  for (let i=1;i<=steps;i++) {
    if (token !== seekToken) return;
    state.terminalHistory = base.concat([{cmd:text.slice(0,Math.ceil(text.length*i/steps)),out:""}]); renderTerminal();
    await sleep(duration/steps);
  }
  state.terminalHistory = base.concat([{cmd:text,out:String(output??"")}]); renderTerminal();
}

function findTarget(target) {
  if (!target) return null;
  if (typeof target === "object") {
    if (target.type === "file") return [...document.querySelectorAll("[data-file]")].find(x=>x.dataset.file===target.path) || null;
    if (target.type === "branch") return [...document.querySelectorAll("[data-branch]")].find(x=>x.dataset.branch===target.name) || null;
    if (target.type === "commit") return [...document.querySelectorAll("[data-commit]")].find(x=>x.dataset.commit===String(target.hash)) || null;
    if (target.type === "nav") return target.view === "history" ? refs.navHistory : target.view === "graph" ? refs.navGraph : refs.navChanges;
    target = target.target || target.name || "";
  }
  const t = String(target);
  const map = {
    content:refs.mainView, sidebar:refs.sidebar, terminal:refs.terminalPane, branch:refs.branchButton,
    commitButton:$("commitButton") || refs.commitTopBtn, primary:refs.commitTopBtn, changes:refs.navChanges, history:refs.navHistory, graph:refs.navGraph,
    fetch:refs.fetchBtn, pull:refs.pullBtn, push:refs.pushBtn, stageAll:refs.stageAllBtn, refresh:refs.refreshBtn, commitMessage:$("commitMessage")
  };
  if (map[t]) return map[t];
  if (t.startsWith("file:")) return [...document.querySelectorAll("[data-file]")].find(x=>x.dataset.file===t.slice(5)) || null;
  if (t.startsWith("branch:")) return [...document.querySelectorAll("[data-branch]")].find(x=>x.dataset.branch===t.slice(7)) || null;
  if (t.startsWith("commit:")) return [...document.querySelectorAll("[data-commit]")].find(x=>x.dataset.commit===t.slice(7)) || null;
  if (t.startsWith("remote:")) return [...document.querySelectorAll("[data-remote]")].find(x=>x.dataset.remote===t.slice(7)) || null;
  return document.getElementById(t) || null;
}

function clearBoundary() {
  cancelAnimationFrame(boundaryFrame); boundaryFrame = 0; trackedBoundaryElement = null; refs.boundary.classList.remove("show");
}

function syncBoundary() {
  cancelAnimationFrame(boundaryFrame);
  boundaryFrame = requestAnimationFrame(() => {
    const el = trackedBoundaryElement;
    if (!el || !allowBoundary || !el.isConnected) { clearBoundary(); return; }
    const r = el.getBoundingClientRect(), host = refs.app.getBoundingClientRect(), style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || r.width<=0 || r.height<=0 || r.right<=0 || r.bottom<=0 || r.left>=innerWidth || r.top>=innerHeight) { clearBoundary(); return; }
    refs.boundary.classList.add("show");
    const pad=4; refs.boundary.style.left=`${r.left-host.left-pad}px`; refs.boundary.style.top=`${r.top-host.top-pad}px`; refs.boundary.style.width=`${r.width+pad*2}px`; refs.boundary.style.height=`${r.height+pad*2}px`;
  });
}

async function highlightTarget(target) {
  if (!allowBoundary) return;
  clearBoundary();
  const el = findTarget(target); if (!el) return;
  trackedBoundaryElement = el; syncBoundary();
}

function setView(view) {
  state.view = ["changes","history","graph"].includes(view) ? view : "changes";
  if (state.view !== "changes") state.selectedFile = "";
  renderAll();
}

function makeCommit(d, amend=false) {
  const staged = state.files.filter(f=>f.staged);
  if (!staged.length && !d.allowEmpty) { setStatus("Nothing staged to commit"); showToast("Nothing staged to commit","warning"); return; }
  const message = String(d.message ?? state.commitMessage ?? "").trim() || (amend ? "Amended commit" : "Commit changes");
  const commitObj = Object.assign({
    hash:String(d.hash || uniqueHash()), message, author:d.author || state.user?.name || "", date:d.date || "Just now", branch:state.activeBranch,
    files:staged.map(f=>f.path)
  }, d.commit || {});
  if (amend && state.commits.length) state.commits[0] = Object.assign({}, state.commits[0], commitObj);
  else state.commits.unshift(commitObj);
  state.files = state.files.filter(f=>!f.staged);
  state.commitMessage = ""; state.selectedFile = ""; state.selectedCommit = commitObj.hash;
  addReflog(amend ? "commit --amend" : "commit", message, commitObj.hash);
  setStatus(amend ? "Commit amended" : `Committed ${String(commitObj.hash).slice(0,7)}`);
}


async function applyAdvancedAction(action,d,animate,token,step) {
  switch(action) {
    case "openContextMenu": openContextMenu(d.menu||d.kind||"file",d.x,d.y,d.context||{}); return true;
    case "chooseContextMenuPath": { const e=contextEntry(d.path),ctx=clone(contextState?.context||{}); closeContextMenu(); if(e?.command && SUPPORTED_ACTIONS.includes(e.command)) await applyStep({action:e.command,data:{...ctx,...(d.data||{})}},false,token); return true; }
    case "closeContextMenu": closeContextMenu(); return true;
    case "openAdaptiveDialog": showUtility("adaptive",d.title||"Git",d.text||JSON.stringify(d,null,2)); return true;
    case "closeAdaptiveUi": closeContextMenu(); closeUtility(); return true;
    case "openRepositoryInfo":
      renderInspect("Repository Information", JSON.stringify({repository:state.repository,branch:state.activeBranch,branches:state.branches.length,commits:state.commits.length,remotes:state.remotes},null,2)); return true;
    case "openSettings": renderConfigUtility(); return true;
    case "setUserConfig":
      state.config.user.name=d.name??state.config.user.name; state.config.user.email=d.email??state.config.user.email; renderConfigUtility(); setStatus("Git user identity updated"); return true;
    case "setConfig":
      state.config.settings[d.key]=d.value; renderConfigUtility(); setStatus(`git config ${d.key} updated`); return true;
    case "showConfig": renderConfigUtility(); return true;
    case "openCredentials":
      showUtility("settings","Credentials",`Credential helper: ${state.config.credentialHelper||"Not configured"}\nCredentials are represented safely and never reveal real secrets.`); return true;
    case "setCredentialHelper": state.config.credentialHelper=d.helper||d.value||""; renderConfigUtility(); setStatus("Credential helper updated"); return true;
    case "setSigningKey": state.config.signingKey=d.key||d.value||""; renderConfigUtility(); setStatus("Signing key configured"); return true;
    case "toggleCommitSigning": state.config.signCommits=d.enabled!==false; renderConfigUtility(); setStatus(`Commit signing ${state.config.signCommits?"enabled":"disabled"}`); return true;

    case "openBranches": renderBranchesUtility(); return true;
    case "compareBranches": {
      const from=d.from||state.activeBranch,to=d.to||""; const diff=d.diff||`Compare ${from}...${to}\n${d.ahead??0} commits ahead\n${d.behind??0} commits behind`; showUtility("branches","Compare Branches",diff); return true; }
    case "createRemoteBranch": {
      const name=d.name||d.branch; if(name&&!state.remoteBranches.some(b=>b.name===name))state.remoteBranches.push({name,remote:d.remote||"origin"}); renderBranchesUtility(); setStatus(`Created remote branch ${name}`); return true; }
    case "deleteRemoteBranch": { const name=d.name||d.branch; state.remoteBranches=state.remoteBranches.filter(b=>b.name!==name); renderBranchesUtility(); setStatus(`Deleted remote branch ${name}`); return true; }
    case "renameRemote": { const r=state.remotes.find(x=>x.name===(d.from||d.name)); if(r)r.name=d.to||d.newName||r.name; renderBranchesUtility(); setStatus("Remote renamed"); return true; }
    case "pruneRemote": {
      const prefix=(d.remote||"origin")+"/"; const removed=new Set(arr(d.branches||d.removed)); state.remoteBranches=state.remoteBranches.filter(b=>!removed.has(b.name)&&!(d.all&&b.name.startsWith(prefix))); renderBranchesUtility(); setStatus("Remote branches pruned"); return true; }
    case "fetchPrune": {
      terminalEntry(d.command||`git fetch --prune ${d.remote||"origin"}`,d.output||"Pruned stale remote-tracking branches."); if(d.removed)state.remoteBranches=state.remoteBranches.filter(b=>!d.removed.includes(b.name)); renderBranchesUtility(); setStatus("Fetch with prune complete"); return true; }

    case "openReflog": renderReflogUtility(); return true;
    case "selectReflogEntry": {
      const e=state.reflog[Number(d.index)||0]||state.reflog.find(x=>String(x.hash)===String(d.hash)); if(e)state.selectedCommit=e.hash; renderReflogUtility(); return true; }
    case "resetSoft": {
      const c=commitAt(d.hash)||state.commits[Number(d.index)||0]; if(c){state.selectedCommit=c.hash; state.files.forEach(f=>f.staged=true); addReflog("reset --soft",`moving HEAD to ${c.hash}`,c.hash);} renderReflogUtility(); setStatus("Soft reset complete"); return true; }
    case "resetMixed": {
      const c=commitAt(d.hash)||state.commits[Number(d.index)||0]; if(c){state.selectedCommit=c.hash; state.files.forEach(f=>f.staged=false); addReflog("reset",`moving HEAD to ${c.hash}`,c.hash);} renderReflogUtility(); setStatus("Mixed reset complete"); return true; }
    case "resetHard": {
      const c=commitAt(d.hash)||state.commits[Number(d.index)||0]; if(c){restoreCommitSnapshot(c,"hard"); addReflog("reset --hard",`moving HEAD to ${c.hash}`,c.hash);} renderReflogUtility(); setStatus("Hard reset complete"); return true; }
    case "revertCommit": {
      const c=commitAt(d.hash)||state.commits[0]; if(c){const rev={hash:d.newHash||uniqueHash(),message:d.message||`Revert "${c.message}"`,author:d.author||state.user?.name||"",date:d.date||"Just now",branch:state.activeBranch,reverts:c.hash};state.commits.unshift(rev);addReflog("revert",rev.message,rev.hash);} renderReflogUtility(); setStatus("Revert commit created"); return true; }
    case "cherryPick": {
      const c=commitAt(d.hash); if(c){const cp=Object.assign({},clone(c),{hash:d.newHash||uniqueHash(),branch:state.activeBranch,date:d.date||"Just now",cherryPickedFrom:c.hash});state.commits.unshift(cp);addReflog("cherry-pick",cp.message,cp.hash);} renderReflogUtility(); setStatus("Cherry-pick complete"); return true; }

    case "openInteractiveRebase":
      state.rebasePlan=clone(d.plan||state.commits.slice(0,Math.min(5,state.commits.length)).reverse().map(c=>({action:"pick",hash:c.hash,message:c.message}))); renderRebaseUtility(); return true;
    case "setRebasePlan": state.rebasePlan=clone(d.plan||[]); renderRebaseUtility(); setStatus("Rebase plan updated"); return true;
    case "continueRebase":
      if(d.commits)state.commits=clone(d.commits); state.rebasePlan=[]; addReflog("rebase -i","interactive rebase completed",state.commits[0]?.hash); renderRebaseUtility(); setStatus("Rebase continued"); return true;
    case "abortRebase": state.rebasePlan=[]; renderRebaseUtility(); setStatus("Rebase aborted"); return true;
    case "squashCommits": {
      const hashes=arr(d.hashes); const selected=state.commits.filter(c=>hashes.includes(c.hash)); if(selected.length){state.commits=state.commits.filter(c=>!hashes.includes(c.hash)); const sq={hash:d.hash||uniqueHash(),message:d.message||selected.map(c=>c.message).join(" / "),author:d.author||state.user?.name||"",date:d.date||"Just now",branch:state.activeBranch,squashedFrom:hashes}; state.commits.unshift(sq); addReflog("rebase -i","squash",sq.hash);} renderRebaseUtility(); setStatus("Commits squashed"); return true; }

    case "openMergeConflict": renderConflictUtility(d.path||d.file); return true;
    case "continueMerge":
      state.mergeState.active=false; state.conflicts=[]; if(d.commit)state.commits.unshift(clone(d.commit)); addReflog("merge",d.message||"merge continued",d.commit?.hash||state.commits[0]?.hash); closeUtility(); setStatus("Merge completed"); return true;
    case "abortMerge": state.mergeState={active:false,from:"",message:""}; state.conflicts=[]; state.files=state.files.filter(f=>f.status!=="U"); closeUtility(); setStatus("Merge aborted"); return true;

    case "openBlame": {
      const rows=arr(d.lines).map(x=>`<div class="blameRow"><span class="hash">${esc(String(x.hash||"").slice(0,8))}</span><span>${esc(x.author||"")}</span><span>${esc(x.text||"")}</span></div>`).join(""); showUtility("inspect","Blame: "+(d.path||d.file||""),rows||"<div class='empty'>No blame data</div>",true); return true; }
    case "showFileHistory": {
      const path=d.path||d.file||""; const list=arr(d.commits).length?d.commits:state.commits.filter(c=>!c.files||c.files.includes(path)); renderInspect("File History: "+path,list.map(c=>`${String(c.hash).slice(0,8)} ${c.message}`).join("\n")); return true; }
    case "showStatusPorcelain": renderInspect("git status --short",d.text||state.files.map(f=>`${f.staged?"M ":" M"} ${f.path}`).join("\n")||""); return true;
    case "showLogGraph": renderInspect("git log --graph --oneline --decorate",d.text||state.commits.map((c,i)=>`${i?"| *":"*"} ${String(c.hash).slice(0,8)} ${c.message}`).join("\n")); return true;
    case "showBranchList": renderInspect("git branch -vv",state.branches.map(b=>`${b.name===state.activeBranch?"*":" "} ${b.name}${branchDisplay(b)} ${b.tracking||""}`).join("\n")); return true;
    case "showRemoteList": renderInspect("git remote -v",state.remotes.map(r=>`${r.name}\t${r.url} (fetch)\n${r.name}\t${r.url} (push)`).join("\n")); return true;
    case "showTagList": renderInspect("git tag",state.tags.map(t=>t.name).join("\n")); return true;
    case "showStashList": renderInspect("git stash list",state.stashes.map(s=>`${s.id}: ${s.message}`).join("\n")); return true;
    case "showObject": {
      const c=commitAt(d.hash)||{}; renderInspect("Git Object",d.text||JSON.stringify(c,null,2)); return true; }

    case "openBisect": showUtility("bisect","Git Bisect",JSON.stringify(state.bisect,null,2)); return true;
    case "bisectStart": state.bisect={active:true,good:d.good||"",bad:d.bad||"",current:d.current||d.bad||state.commits[0]?.hash||""}; showUtility("bisect","Git Bisect",JSON.stringify(state.bisect,null,2)); setStatus("Bisect started"); return true;
    case "bisectMark": {
      const verdict=d.verdict||d.mark||"good"; state.bisect[verdict]=d.hash||state.bisect.current; state.bisect.current=d.next||""; showUtility("bisect","Git Bisect",JSON.stringify(state.bisect,null,2)); setStatus(`Bisect marked ${verdict}`); return true; }
    case "bisectReset": state.bisect={active:false,good:"",bad:"",current:""}; showUtility("bisect","Git Bisect","Bisect session reset."); setStatus("Bisect reset"); return true;

    case "openGitignore": showUtility("gitignore",".gitignore",state.gitignore||""); return true;
    case "setGitignore": state.gitignore=String(d.text??d.content??""); showUtility("gitignore",".gitignore",state.gitignore); setStatus(".gitignore updated"); return true;
    case "generatePatch": {
      const patch={name:d.name||"changes.patch",text:d.text||state.files.map(f=>f.diff||`diff --git a/${f.path} b/${f.path}`).join("\n")}; state.patches.push(patch); showUtility("patch","Generated Patch: "+patch.name,patch.text); return true; }
    case "applyPatch": {
      if(d.files)state.files=state.files.concat(clone(d.files)); terminalEntry(d.command||`git apply ${d.name||"changes.patch"}`,d.output||"Patch applied."); showUtility("patch","Apply Patch",d.output||"Patch applied successfully."); setStatus("Patch applied"); return true; }

    case "openHooks": showUtility("hooks","Git Hooks",JSON.stringify(state.hooks,null,2)); return true;
    case "setHook": state.hooks[d.name||"pre-commit"]=String(d.script??d.text??""); showUtility("hooks","Git Hooks",JSON.stringify(state.hooks,null,2)); setStatus(`Hook ${d.name||"pre-commit"} updated`); return true;
    case "runHook": {
      const name=d.name||"pre-commit",out=d.output||`Running ${name}\n${state.hooks[name]?"Hook passed":"No hook configured"}`; terminalEntry(`.git/hooks/${name}`,out); showUtility("hooks","Hook Result",out); return true; }

    case "openLFS": showUtility("lfs","Git LFS",JSON.stringify(state.lfs,null,2)); return true;
    case "trackLfs": { const p=d.pattern||d.path;if(p&&!state.lfs.patterns.includes(p))state.lfs.patterns.push(p);showUtility("lfs","Git LFS",JSON.stringify(state.lfs,null,2));setStatus(`LFS tracking ${p}`);return true; }
    case "untrackLfs": { const p=d.pattern||d.path;state.lfs.patterns=state.lfs.patterns.filter(x=>x!==p);showUtility("lfs","Git LFS",JSON.stringify(state.lfs,null,2));setStatus(`LFS untracked ${p}`);return true; }

    case "openSubmodules": showUtility("submodules","Submodules",JSON.stringify(state.submodules,null,2)); return true;
    case "addSubmodule": state.submodules.push({path:d.path||"",url:d.url||"",branch:d.branch||"main"}); showUtility("submodules","Submodules",JSON.stringify(state.submodules,null,2)); setStatus("Submodule added"); return true;
    case "updateSubmodules": { if(d.submodules)state.submodules=clone(d.submodules); terminalEntry(d.command||"git submodule update --init --recursive",d.output||"Submodules updated."); showUtility("submodules","Submodules",JSON.stringify(state.submodules,null,2)); return true; }
    case "removeSubmodule": state.submodules=state.submodules.filter(x=>x.path!==d.path); showUtility("submodules","Submodules",JSON.stringify(state.submodules,null,2)); setStatus("Submodule removed"); return true;

    case "openWorktrees": showUtility("worktrees","Worktrees",JSON.stringify(state.worktrees,null,2)); return true;
    case "addWorktree": state.worktrees.push({path:d.path||"",branch:d.branch||""}); showUtility("worktrees","Worktrees",JSON.stringify(state.worktrees,null,2)); setStatus("Worktree added"); return true;
    case "removeWorktree": state.worktrees=state.worktrees.filter(x=>x.path!==d.path); showUtility("worktrees","Worktrees",JSON.stringify(state.worktrees,null,2)); setStatus("Worktree removed"); return true;

    case "openTags": showUtility("tags","Tags",JSON.stringify(state.tags,null,2)); return true;
    case "createAnnotatedTag": {
      const name=d.name||d.tag; if(name&&!state.tags.some(t=>t.name===name))state.tags.push({name,hash:d.hash||state.commits[0]?.hash||"",message:d.message||"",annotated:true,tagger:d.tagger||state.user?.name||""}); showUtility("tags","Tags",JSON.stringify(state.tags,null,2)); setStatus(`Annotated tag ${name} created`); return true; }
    case "openStashes": showUtility("stashes","Stashes",JSON.stringify(state.stashes,null,2)); return true;

    case "checkoutCommit": {
      const c=commitAt(d.hash); if(c){state.detachedHead=true;state.selectedCommit=c.hash;state.activeBranch=`HEAD@${String(c.hash).slice(0,7)}`;addReflog("checkout",`detached HEAD at ${c.hash}`,c.hash);} setStatus("Detached HEAD"); return true; }
    case "restoreBranch": {
      const name=d.branch||d.name||state.branches[0]?.name||"main";state.detachedHead=false;state.activeBranch=name;if(!state.branches.some(b=>b.name===name))state.branches.push({name});state.branches.forEach(b=>b.current=b.name===name);addReflog("checkout",`moving to ${name}`,state.commits[0]?.hash);setStatus(`Restored branch ${name}`);return true; }
    default: return false;
  }
}

async function applyStep(step, animate, token) {
  const action = step?.action || "";
  const d = step?.data || {};
  clearTransientBeforeStep(action);
  clearBoundary();
  switch (action) {
    case "openRepository":
      state.repository = Object.assign({}, state.repository, d.repository || {}, {name:d.name ?? d.repository?.name ?? state.repository.name,path:d.path ?? d.repository?.path ?? state.repository.path,initialized:d.initialized !== false});
      if (d.branch) state.activeBranch = d.branch; if (d.files) state.files = clone(d.files); if (d.commits) state.commits = clone(d.commits); setStatus(`Opened ${state.repository.name || 'repository'}`); break;
    case "initRepository":
      state.repository = Object.assign({}, state.repository, {name:d.name || state.repository.name || "repository",path:d.path || state.repository.path || "",initialized:true});
      state.activeBranch = d.branch || state.activeBranch || "main"; if (!state.branches.some(b=>b.name===state.activeBranch)) state.branches.push({name:state.activeBranch,current:true,ahead:0,behind:0});
      if (d.output) terminalEntry(d.command || "git init",d.output); setStatus("Repository initialized"); break;
    case "cloneRepository":
      state.repository = Object.assign({}, state.repository, {name:d.name || d.repository?.name || "repository",path:d.path || d.repository?.path || "",initialized:true});
      state.activeBranch = d.branch || "main"; state.branches = clone(d.branches || [{name:state.activeBranch,current:true}]); state.remotes = clone(d.remotes || [{name:"origin",url:d.url||""}]);
      if (d.files) state.files=clone(d.files); if(d.commits)state.commits=clone(d.commits); terminalEntry(d.command||`git clone ${d.url||''}`,d.output||""); setStatus("Repository cloned"); break;
    case "setView": case "openView": setView(d.view || d.section || "changes"); return;
    case "refreshRepository": setStatus(d.status || "Repository refreshed"); break;
    case "createBranch": {
      const name = d.name || d.branch; if(name && !state.branches.some(b=>b.name===name)) state.branches.push({name,current:false,ahead:0,behind:0}); if(d.checkout) state.activeBranch=name; setStatus(`Created branch ${name}`); break; }
    case "checkoutBranch": case "switchBranch": {
      const name=d.name||d.branch; if(name){if(!state.branches.some(b=>b.name===name)) state.branches.push({name}); state.activeBranch=name; state.branches.forEach(b=>b.current=b.name===name); setStatus(`Switched to ${name}`);} break; }
    case "renameBranch": { const from=d.from||state.activeBranch,to=d.to||d.name; const b=state.branches.find(x=>x.name===from); if(b&&to){b.name=to;if(state.activeBranch===from)state.activeBranch=to;} setStatus(`Renamed branch to ${to}`); break; }
    case "deleteBranch": { const name=d.name||d.branch; state.branches=state.branches.filter(b=>b.name!==name); if(state.activeBranch===name)state.activeBranch=state.branches[0]?.name||"main"; setStatus(`Deleted branch ${name}`); break; }
    case "stageFile": if(stageFile(d.path||d.file,true)) setStatus(`Staged ${d.path||d.file}`); break;
    case "unstageFile": if(stageFile(d.path||d.file,false)) setStatus(`Unstaged ${d.path||d.file}`); break;
    case "stageAll": state.files.forEach(f=>f.staged=true); setStatus("Staged all changes"); break;
    case "unstageAll": state.files.forEach(f=>f.staged=false); setStatus("Unstaged all changes"); break;
    case "editFile": {
      const path=d.path||d.file; let f=fileByPath(path); if(!f){f={path,status:"A",staged:false,content:"",oldContent:""};state.files.push(f);} if(d.oldContent!==undefined)f.oldContent=String(d.oldContent); if(d.content!==undefined)f.content=String(d.content); if(d.diff!==undefined)f.diff=String(d.diff); if(d.status)f.status=d.status; if(d.staged!==undefined)f.staged=!!d.staged; state.selectedFile=path; setStatus(`Modified ${path}`); break; }
    case "addFile": { const f=Object.assign({path:d.path||d.file||"new-file",status:"A",staged:false,content:"",oldContent:""},clone(d.fileData||d.file||{})); if(typeof d.file==="string")f.path=d.file; if(!fileByPath(f.path))state.files.push(f);state.selectedFile=f.path;setStatus(`Added ${f.path}`);break; }
    case "deleteFile": { const path=d.path||d.file; let f=fileByPath(path); if(!f){f={path,status:"D",staged:false,content:"",oldContent:d.oldContent||""};state.files.push(f);} else f.status="D";state.selectedFile=path;setStatus(`Deleted ${path}`);break; }
    case "discardChanges": { const path=d.path||d.file; if(path)state.files=state.files.filter(f=>f.path!==path);else state.files=[]; if(state.selectedFile===path||!path)state.selectedFile="";setStatus(path?`Discarded ${path}`:"Discarded all changes");break; }
    case "setCommitMessage": state.commitMessage=String(d.message??d.text??""); setStatus("Commit message updated"); break;
    case "commit": makeCommit(d,false); break;
    case "amendCommit": makeCommit(d,true); break;
    case "openHistory": state.view="history"; setStatus("Opened commit history"); break;
    case "selectCommit": case "showCommit": state.selectedCommit=String(d.hash||d.commit||""); state.view=d.keepView?state.view:"history"; break;
    case "showDiff": if(d.path||d.file){state.selectedFile=d.path||d.file;state.view="changes";} else if(d.hash) {state.selectedCommit=String(d.hash);state.view="history";} break;
    case "selectFile": state.selectedFile=d.path||d.file||""; state.view="changes"; break;
    case "addRemote": { const name=d.name||"origin"; const existing=state.remotes.find(r=>r.name===name); if(existing)Object.assign(existing,d); else state.remotes.push({name,url:d.url||""}); setStatus(`Remote ${name} added`); break; }
    case "removeRemote": { const name=d.name||"origin"; state.remotes=state.remotes.filter(r=>r.name!==name);setStatus(`Remote ${name} removed`);break; }
    case "fetch": { const b=currentBranchObject(); if(b&&d.behind!==undefined)b.behind=Number(d.behind); terminalEntry(d.command||`git fetch ${d.remote||'origin'}`,d.output||"");setStatus(d.status||"Fetch complete");break; }
    case "pull": { const b=currentBranchObject(); if(b){b.behind=Number(d.behindAfter??0);if(d.aheadAfter!==undefined)b.ahead=Number(d.aheadAfter);} if(d.commits)state.commits=clone(d.commits); terminalEntry(d.command||`git pull ${d.remote||'origin'} ${d.branch||state.activeBranch}`,d.output||"");setStatus(d.status||"Pull complete");break; }
    case "push": { const b=currentBranchObject(); if(b){b.ahead=Number(d.aheadAfter??0);if(d.behindAfter!==undefined)b.behind=Number(d.behindAfter);} terminalEntry(d.command||`git push ${d.remote||'origin'} ${d.branch||state.activeBranch}`,d.output||"");setStatus(d.status||"Push complete");break; }
    case "setTracking": { const b=state.branches.find(x=>x.name===(d.branch||state.activeBranch)); if(b)b.tracking=d.remoteBranch||d.tracking||"";setStatus("Tracking branch updated");break; }
    case "mergeBranch": {
      if(d.conflicts){state.mergeState={active:true,from:d.branch||d.from||"",message:d.message||""};state.conflicts=clone(d.conflicts);(d.conflicts||[]).forEach(c=>{let f=fileByPath(c.path||c.file);if(!f){f={path:c.path||c.file,status:"U",staged:false,content:c.content||"",oldContent:c.oldContent||""};state.files.push(f);}else f.status="U";});setStatus("Merge has conflicts");showToast("Merge conflicts require resolution","warning");}
      else {if(d.commit)state.commits.unshift(clone(d.commit));setStatus(`Merged ${d.branch||d.from||'branch'}`);} break; }
    case "rebaseBranch": if(d.commits)state.commits=clone(d.commits); if(d.conflicts)state.conflicts=clone(d.conflicts);setStatus(d.status||`Rebased ${d.branch||state.activeBranch}`);break;
    case "resolveConflict": { const path=d.path||d.file; state.conflicts=state.conflicts.filter(c=>(c.path||c.file)!==path); let f=fileByPath(path); if(f){f.status=d.status||"M";f.content=d.content??f.content;f.staged=d.staged!==false;} setStatus(`Resolved conflict in ${path}`);break; }
    case "createTag": { const name=d.name||d.tag; if(name&&!state.tags.some(t=>t.name===name))state.tags.push({name,hash:d.hash||state.commits[0]?.hash||"",message:d.message||""});setStatus(`Created tag ${name}`);break; }
    case "deleteTag": { const name=d.name||d.tag;state.tags=state.tags.filter(t=>t.name!==name);setStatus(`Deleted tag ${name}`);break; }
    case "stash": { const id=d.id||`stash@{${state.stashes.length}}`;state.stashes.unshift({id,message:d.message||"WIP",branch:d.branch||state.activeBranch,files:clone(d.files||state.files)});if(d.keepChanges!==true)state.files=[];setStatus(`Saved ${id}`);break; }
    case "stashApply": case "stashPop": { const id=d.id||state.stashes[0]?.id; const s=state.stashes.find(x=>x.id===id)||state.stashes[0];if(s&&s.files)state.files=clone(s.files);if(action==="stashPop"&&s)state.stashes=state.stashes.filter(x=>x!==s);setStatus(`${action==="stashPop"?'Popped':'Applied'} ${id||'stash'}`);break; }
    case "stashDrop": { const id=d.id||state.stashes[0]?.id;state.stashes=state.stashes.filter(s=>s.id!==id);setStatus(`Dropped ${id}`);break; }
    case "openTerminal": state.terminalOpen=true;break;
    case "closeTerminal": state.terminalOpen=false;break;
    case "toggleTerminal": state.terminalOpen=d.visible!==undefined?!!d.visible:!state.terminalOpen;break;
    case "setTerminalShell": state.terminalShell=String(d.shell||d.name||"Git");break;
    case "runCommand": state.terminalOpen=true; if(animate&&autoType) await animateCommand(d.command,d.output,token); else terminalEntry(d.command,d.output,d.prompt); if(d.status)setStatus(d.status);break;
    case "addTerminalOutput": terminalEntry(d.command||"",d.output??d.text??"");break;
    case "clearTerminal": state.terminalHistory=[];break;
    case "setStatus": setStatus(d.text||d.status||step.text||"Ready");break;
    case "showNotification": showToast(d.message||step.text||"",d.type||"success",d.ms||1600);break;
    case "pressButton": {
      const target=d.target||"";
      if(target==="fetch") return applyStep({action:"fetch",data:d},animate,token);
      if(target==="pull") return applyStep({action:"pull",data:d},animate,token);
      if(target==="push") return applyStep({action:"push",data:d},animate,token);
      if(target==="stageAll") return applyStep({action:"stageAll",data:d},animate,token);
      if(target==="commitButton"||target==="primary") return applyStep({action:"commit",data:d},animate,token);
      await highlightTarget(target); break; }
    case "highlight": case "highlightTarget": await highlightTarget(d.target||d); break;
    default: { const handled = await applyAdvancedAction(action,d,animate,token,step); if(!handled)setStatus(`Unsupported action: ${action}`); break; }
  }
  if (token !== seekToken) return;
  renderAll();
  if (d.boundary && action !== "highlight" && action !== "highlightTarget") await highlightTarget(d.boundary === true ? d.target : d.boundary);
}

async function seek(steps, animateFinal) {
  const token = ++seekToken;
  reset();
  const list = Array.isArray(steps) ? steps : [];
  for (let i=0;i<list.length;i++) {
    allowBoundary = i === list.length-1;
    await applyStep(list[i], !!animateFinal && i===list.length-1, token);
    if (token !== seekToken) return;
  }
  allowBoundary = true;
}

function installUi() {
  refs.navChanges.onclick=()=>{state.view="changes";renderAll();clearBoundary()};
  refs.navHistory.onclick=()=>{state.view="history";renderAll();clearBoundary()};
  refs.navGraph.onclick=()=>{state.view="graph";renderAll();clearBoundary()};
  refs.fetchBtn.onclick=()=>applyStep({action:"fetch",data:{}},false,seekToken);
  refs.pullBtn.onclick=()=>applyStep({action:"pull",data:{}},false,seekToken);
  refs.pushBtn.onclick=()=>applyStep({action:"push",data:{}},false,seekToken);
  refs.stageAllBtn.onclick=()=>applyStep({action:"stageAll",data:{}},false,seekToken);
  refs.refreshBtn.onclick=()=>applyStep({action:"refreshRepository",data:{}},false,seekToken);
  refs.commitTopBtn.onclick=()=>{state.selectedFile="";state.view="changes";renderAll(); const msg=$("commitMessage"); if(msg)msg.focus();};
  refs.openRepoBtn.onclick=()=>showToast("Use workflow.openRepository to load repository state.","warning",1200);
  refs.initBtn.onclick=()=>applyStep({action:"initRepository",data:{}},false,seekToken);
  refs.cloneBtn.onclick=()=>showToast("Use workflow.cloneRepository with URL and destination.","warning",1200);
  refs.branchButton.onclick=()=>showToast(`Current branch: ${state.activeBranch}`,"success",900);

  const drag = (el,onMove) => {
    if(!el)return; let dragging=false;
    el.addEventListener("pointerdown",e=>{dragging=true;el.setPointerCapture(e.pointerId);e.preventDefault()});
    el.addEventListener("pointermove",e=>{if(dragging)onMove(e)});
    el.addEventListener("pointerup",()=>dragging=false); el.addEventListener("pointercancel",()=>dragging=false);
  };
  drag(refs.splitL,e=>{if(innerWidth<=650)return;const r=document.querySelector(".workspace").getBoundingClientRect();document.documentElement.style.setProperty("--sideW",Math.max(150,Math.min(390,e.clientX-r.left))+"px")});
  drag(refs.splitR,e=>{if(innerWidth<=900)return;const r=document.querySelector(".workspace").getBoundingClientRect();document.documentElement.style.setProperty("--detailsW",Math.max(220,Math.min(430,r.right-e.clientX))+"px")});
  drag(refs.splitH,e=>{const r=document.querySelector(".center").getBoundingClientRect();document.documentElement.style.setProperty("--termH",Math.max(80,Math.min(Math.max(100,r.height-110),r.bottom-e.clientY))+"px")});
  refs.settingsBtn.onclick=()=>renderConfigUtility();
  refs.advancedBtn.onclick=()=>showUtility("inspect","Advanced Git Tools",`Reflog\nInteractive Rebase\nBisect\nBlame\nGit LFS\nHooks\nSubmodules\nWorktrees\nPatches`);
  refs.utilityClose.onclick=closeUtility;
  refs.utilityShade.addEventListener("pointerdown",e=>{if(e.target===refs.utilityShade)closeUtility()});
  restoreLayout();
  [refs.splitL,refs.splitR,refs.splitH].forEach(el=>el?.addEventListener('pointerup',persistLayout));
  refs.assistantMin?.addEventListener('click',()=>refs.assistant.classList.toggle('minimized'));
  refs.assistantClose?.addEventListener('click',()=>refs.assistant.classList.remove('show'));
  document.addEventListener('contextmenu',e=>{const f=e.target.closest?.('[data-file]'),c=e.target.closest?.('[data-commit]'),b=e.target.closest?.('[data-branch]'),t=e.target.closest?.('#terminalPane');if(f){e.preventDefault();openContextMenu('file',e.clientX,e.clientY,{path:f.dataset.file});return}if(c){e.preventDefault();openContextMenu('commit',e.clientX,e.clientY,{hash:c.dataset.commit});return}if(b){e.preventDefault();openContextMenu('branch',e.clientX,e.clientY,{branch:b.dataset.branch});return}if(t){e.preventDefault();openContextMenu('terminal',e.clientX,e.clientY,{});}},true);
  document.addEventListener('pointerdown',e=>{const i=e.target.closest?.('[data-ctx-path]');if(i&&!i.classList.contains('has')){const ent=contextEntry(i.dataset.ctxPath);const ctx=contextState?.context||{};closeContextMenu();if(ent?.command&&SUPPORTED_ACTIONS.includes(ent.command))applyStep({action:ent.command,data:ctx},false,seekToken);e.preventDefault();e.stopPropagation();return}if(contextState&&!e.target.closest?.('#ctxMenu'))closeContextMenu()},true);

  document.addEventListener("pointerdown", e => { if(e.isTrusted && refs.boundary.classList.contains("show")) clearBoundary(); }, true);
  document.addEventListener("keydown", e => { if(e.isTrusted && refs.boundary.classList.contains("show")) clearBoundary(); }, true);
  document.addEventListener("scroll", syncBoundary, true);
  window.addEventListener("resize", syncBoundary);
  if (typeof ResizeObserver === "function") new ResizeObserver(syncBoundary).observe(document.documentElement);
}

window.addEventListener("message", e => {
  const m = e.data || {};
  if (m.type === "SIM_PACKAGE") {
    autoType = m.autoType !== false;
    applyTheme(m.theme || "dark");
    loadPackage(m.package || {});
  } else if (m.type === "SIM_SEEK") {
    autoType = m.autoType !== false;
    seek(m.steps, !!m.animateFinal);
  } else if (m.type === "SIM_EXPLAIN") {
    showExplanation(m);
  } else if (m.type === "SIM_SETTING") {
    if (m.key === "autoType") autoType = !!m.value;
    if (m.key === "theme") applyTheme(m.value);
  }
});

installUi();
baseline = normalize({});
reset();
parent.postMessage({type:"ENGINE_READY",app:APP_ID,actions:SUPPORTED_ACTIONS},"*");
})();