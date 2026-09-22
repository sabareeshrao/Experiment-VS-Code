const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {baseline,steps}=require('./fixture.cjs'),contract=require('./original-contract.json');
const root=path.resolve(__dirname,'..'),out=process.env.JENKINS_ARTIFACT_DIR||path.join(require('node:os').tmpdir(),'jenkins-checks');fs.mkdirSync(out,{recursive:true});
const code=fs.readFileSync(path.join(root,'engine.js'),'utf8'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const a of contract.actions)assert(code.includes('case "'+a+'"'),a);
for(const id of contract.ids)assert(html.includes('id="'+id+'"'),id);
console.log(`PASS Original contract: ${contract.actions.length} actions, ${contract.ids.length} HTML IDs`);
const clone=v=>JSON.parse(JSON.stringify(v));
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'chrome'}),page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});page.setDefaultTimeout(5000);
 const errors=[],failed=[],passed=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push(r.url()));
 const send=async m=>{await page.evaluate(m=>window.postMessage(m,'*'),m);await page.waitForTimeout(65)};
 const load=async(data=baseline)=>send({type:'SIM_PACKAGE',package:{apps:{jenkins:data}},theme:'light',autoType:false});
 const seek=async(steps=[],animated=false)=>send({type:'SIM_SEEK',steps,animateFinal:animated,autoType:animated});
 const action=(action,data={})=>({action,data});
 const click=async(cmd,root='#main')=>page.locator(root+' [data-cmd="'+cmd+'"]').first().click();
 const side=async target=>page.locator('#sideLinks [data-target="'+target+'"]').click();
 const text=sel=>page.locator(sel).textContent();
 const openJob=async()=>click('openJob');
 const apiJob=async()=>page.locator('#main [data-cmd="openJob"][data-name="web-api"]').click();
 const submit=async()=>page.locator('#modalBody button[type="submit"]').click();
 const check=async(name,fn)=>{await load();await fn();passed.push(name);console.log('PASS',name)};
 try{
 await page.goto(pathToFileURL(path.join(root,'index.html')).href);
 await check('Dashboard, views, sorting, search and single-click navigation',async()=>{
  assert.equal(await page.locator('.jobRow').count(),3);await page.screenshot({path:path.join(out,'jenkins-dashboard.png')});
  await page.locator('[data-cmd="filterView"][data-name="Pipelines"]').click();assert.equal(await page.locator('.jobRow').count(),2);
  await page.locator('#search').fill('web-api');assert.equal(await page.locator('.jobRow').count(),1);await apiJob();assert((await text('.pageTitle')).includes('web-api'));
  await page.locator('.breadcrumbBar [data-nav="dashboard"]').click();assert((await text('.pageTitle')).includes('Dashboard'));await page.locator('#search').fill('');await click('sort');
 });
 await check('New Item, configuration persistence and validation',async()=>{
  await side('newItem');await page.locator('#field-name').fill('new-api');await submit();assert(await page.locator('#configForm').isVisible());
  await page.locator('#field-description').fill('A new project');await page.locator('#field-scmType').selectOption('Git');await click('applyConfig');assert((await text('#configError')).includes('repository'));
  await page.locator('#field-repository').fill('https://example.com/api.git');await page.locator('#field-env').fill('REGION=eu-west\nMODE=test');await page.locator('#field-cron').fill('bad');await click('applyConfig');assert((await text('#configError')).includes('cron'));
  await page.locator('#field-cron').fill('H 2 * * *');await page.locator('#jenkinsfile').fill("pipeline {\n  agent any\n  stages {}\n}");await click('validateScript');assert((await text('#validationMessage')).includes('balanced'));
  await click('previewScript');assert(await page.locator('#modalBody b').count()>0);await page.keyboard.press('Escape');
  await page.locator('#configForm button[type="submit"]').click();await side('configure');assert.equal(await page.locator('#field-description').inputValue(),'A new project');assert.equal(await page.locator('#field-env').inputValue(),'REGION=eu-west\nMODE=test');
  await page.screenshot({path:path.join(out,'jenkins-configure.png')});
 });
 await check('Copy, rename, move, disable and delete projects',async()=>{
  await apiJob();await click('copyJob');await page.locator('#field-name').fill('api-copy');await submit();await page.locator('#configForm button[type="submit"]').click();
  await click('renameJob');await page.locator('#field-name').fill('api-renamed');await page.locator('#field-folder').selectOption('Platform');await submit();assert((await text('.pageTitle')).includes('api-renamed'));
  await click('disableJob');assert(await page.locator('#buildNowBtn').isDisabled());await click('disableJob');assert(!(await page.locator('#buildNowBtn').isDisabled()));
  await click('deleteJob');await submit();assert(!(await text('#main')).includes('api-renamed'));
 });
 await check('Parameter definitions and typed build parameter values',async()=>{
  await apiJob();await side('configure');await page.locator('[data-cmd="editParameter"]:not([data-index])').click();await page.locator('#field-name').fill('FEATURE');await page.locator('#field-type').selectOption('Boolean');await page.locator('#field-default').fill('true');await submit();
  await side('buildParameters');assert(await page.locator('#field-p3').isChecked());await page.locator('#field-p0').fill('feature/test');await page.locator('#field-p1').check();await page.locator('#field-p2').selectOption('eu-west');await page.locator('#runParamsBtn').click();assert((await text('.pageTitle')).includes('#25'));
  assert((await text('#main')).includes('feature/test'));assert((await text('#main')).includes('eu-west'));
  // Replay uses the same parameter state and produces a new numbered build.
  await click('replay');await submit();assert((await text('.pageTitle')).includes('#26'));
 });
 await check('Build lifecycle: create, abort, restart, keep and delete',async()=>{
  await apiJob();await page.locator('#buildNowBtn').click();assert((await text('.pageTitle')).includes('#25'));assert(await page.locator('[data-cmd="abort"]').isVisible());await click('abort');assert((await text('.pageTitle')).includes('web-api'));
  await click('restartStage');await page.locator('#field-stage').selectOption('Test');await submit();assert((await text('.pageTitle')).includes('#26'));assert((await page.locator('[data-stage="Test"] .stageStatus').textContent()).includes('running'));
  await click('keepBuild');assert((await text('#history')).includes('★'));await click('deleteBuild');await submit();assert(!(await text('.pageTitle')).includes('#26'));
 });
 await check('Queue capacity, cancellation and agent reconnection',async()=>{
  const data=clone(baseline);data.manage.nodes.forEach(n=>n.online=false);await load(data);await apiJob();await page.locator('#buildNowBtn').click();assert.equal(await page.locator('.queueItem').count(),1);
  await page.locator('[data-cmd="cancelQueue"]').click();assert.equal(await page.locator('.queueItem').count(),0);await page.locator('#buildNowBtn').click();await side('dashboard');await side('nodes');await click('toggleNode');assert.equal(await page.locator('.queueItem').count(),0);assert((await text('#operations')).includes('web-api #25'));
 });
 await check('Stage details, parallel branches, console search and download',async()=>{
  await seek([action('openBuild',{job:'web-api',number:24})]);await page.locator('[data-stage="Test"] .stageName').click();assert((await text('#modalBody')).includes('Integration suite failed'));await page.keyboard.press('Escape');
  await page.locator('[data-cmd="branchDetails"]').first().click();assert((await text('#modalBody')).includes('24 tests passed'));await page.keyboard.press('Escape');await click('console');
  await page.locator('#logSearch').fill('ERROR');assert.equal(await page.locator('#console mark').count(),1);await click('toggleTimes');assert((await text('#console')).includes('10:42:00'));await click('toggleFollow');assert((await text('#main')).includes('Follow output'));
  const pending=page.waitForEvent('download');await click('downloadLog');const download=await pending;assert(download.suggestedFilename().endsWith('.log'));assert(fs.readFileSync(await download.path(),'utf8').includes('Finished: FAILURE'));
  await page.screenshot({path:path.join(out,'jenkins-console.png')});
 });
 await check('Approval pauses lesson build events until Proceed',async()=>{
  const data=clone(baseline),job=data.jobs[0];job.config.inputApproval={enabled:true,message:'Publish to staging?'};job.simulation={events:[{afterMs:100,status:'success',progress:100,console:'Published sample artifact'}]};await load(data);await apiJob();await page.locator('#buildNowBtn').click();await page.waitForTimeout(200);assert(await page.locator('.approval').isVisible());assert(!(await text('#console')).includes('Published sample artifact'));await click('approve');assert(!(await page.locator('.approval').count()));assert((await text('#console')).includes('Published sample artifact'));
 });
 await check('Playback and timers cancel on seek or package replacement',async()=>{
  const data=clone(baseline);data.jobs[0].simulation={events:[{afterMs:250,status:'success',console:'STALE BUILD EVENT'}]};await load(data);await apiJob();await page.locator('#buildNowBtn').click();await seek([]);await page.waitForTimeout(350);assert(!(await text('#main')).includes('STALE BUILD EVENT'));assert(!(await text('#history')).includes('#25'));
  await seek([action('typeSearch',{text:'a long old search',boundary:false})],true);await load();await page.waitForTimeout(700);assert.equal(await page.locator('#search').inputValue(),'');
  await seek(steps);assert((await text('.pageTitle')).includes('Test Results'));const result=await text('#main');await seek(steps);assert.equal(await text('#main'),result);
 });
 await check('Test suites, filtering, stack traces and duration trends',async()=>{
  await seek([action('openTestResults',{job:'web-api',number:24})]);assert.equal(await page.locator('#testList details').count(),2);await page.locator('#testSearch').fill('HTTP');assert.equal(await page.locator('[data-test]').count(),1);await click('testDetails');assert((await text('#modalBody')).includes('tests/api.test.ts:18:7'));await page.keyboard.press('Escape');assert.equal(await page.locator('.trend').count(),1);
  await page.screenshot({path:path.join(out,'jenkins-tests.png')});
 });
 await check('Workspace browsing, source previews, artifacts and downloads',async()=>{
  await apiJob();await side('workspace');await page.locator('[data-cmd="workspaceFolder"][data-path="src/"]').click();await click('workspaceFile');assert((await text('#modalBody')).includes('port = 3000'));await page.keyboard.press('Escape');
  const pending=page.waitForEvent('download');await click('downloadFile');const download=await pending;assert.equal(download.suggestedFilename(),'main.ts');assert(fs.readFileSync(await download.path(),'utf8').includes('3000'));await click('workspaceUp');assert(await page.locator('[data-path="src/"]').isVisible());
  await side('artifacts');await click('artifactDetails');assert((await text('#modalBody')).includes('24 passed'));await page.keyboard.press('Escape');const artifactPending=page.waitForEvent('download');await click('downloadArtifact');assert.equal((await artifactPending).suggestedFilename(),'summary.txt');
  await page.locator('[data-cmd="downloadArtifact"][data-index="1"]').click();assert((await text('#notification')).includes('No downloadable content'));
 });
 await check('Commit details and line diffs',async()=>{
  await apiJob();await side('changes');await click('changeDetails');assert.equal(await page.locator('.diffRow.add').count(),1);assert((await text('#modalBody')).includes('app.get'));
 });
 await check('Manage Jenkins navigation and credential CRUD',async()=>{
  await side('manage');await page.locator('.manageCard[data-nav="credentials"]').click();await click('editCollection');await page.locator('#field-id').fill('sample-token');await page.locator('#field-type').selectOption('Secret text');await page.locator('#field-secret').fill('example-only');await page.locator('#field-domain').fill('example.com');await submit();assert((await text('#main')).includes('sample-token'));assert(!(await text('#main')).includes('example-only'));
  await page.locator('[data-cmd="editCollection"][data-index="1"]').click();await page.locator('#field-description').fill('Updated credential');await submit();assert((await text('#main')).includes('Updated credential'));await page.locator('[data-cmd="deleteCollection"][data-index="1"]').click();await submit();assert(!(await text('#main')).includes('sample-token'));
 });
 await check('Plugin tabs, focused search, install, enable and update',async()=>{
  await side('plugins');await page.locator('[data-cmd="pluginTab"][data-name="available"]').click();await page.locator('#pluginSearch').pressSequentially('JUnit');assert.equal(await page.locator('[data-plugin]').count(),1);await click('installPlugin');await page.waitForTimeout(600);assert.equal(await page.locator('[data-plugin]').count(),0);
  await page.locator('#pluginSearch').fill('');await page.locator('[data-cmd="pluginTab"][data-name="installed"]').click();assert.equal(await page.locator('[data-plugin]').count(),3);await page.locator('[data-cmd="togglePlugin"][data-id="junit"]').click();assert.equal(await page.locator('[data-cmd="togglePlugin"][data-id="junit"]').textContent(),'Enable');
  await page.locator('[data-cmd="pluginTab"][data-name="updates"]').click();await click('updatePlugin');await page.waitForTimeout(600);assert.equal(await page.locator('[data-plugin]').count(),0);
 });
 await check('Node forms, validation, logs, tools, libraries and security',async()=>{
  await side('nodes');await click('editCollection');await page.locator('#field-name').fill('test-agent');await page.locator('#field-executors').fill('-1');await submit();assert((await text('.formError')).includes('0 to 16'));await page.locator('#field-executors').fill('2');await page.locator('#field-labels').fill('test linux');await submit();assert((await text('#main')).includes('test-agent'));
  await page.locator('[data-cmd="nodeDetails"][data-name="linux-agent"]').first().click();assert((await text('#modalBody')).includes('Remoting'));await page.keyboard.press('Escape');
  await side('manage');await page.locator('[data-nav="systemConfig"]').click();await page.locator('#field-url').fill('https://jenkins.example.com/');await page.locator('#systemForm button').click();assert((await text('#notification')).includes('saved'));
  await side('manage');await page.locator('[data-nav="security"]').click();await page.locator('#field-anonymousRead').check();await page.locator('#securityForm button').click();await side('manage');await page.locator('[data-nav="security"]').click();assert(await page.locator('#field-anonymousRead').isChecked());
  await side('manage');await page.locator('[data-nav="sharedLibraries"]').click();await click('editCollection');await page.locator('#field-name').fill('team-library');await page.locator('#field-repository').fill('https://example.com/team.git');await submit();assert((await text('#main')).includes('team-library'));
 });
 await check('Folder/view creation and project membership filtering',async()=>{
  await side('folders');await click('editFolder');await page.locator('#field-name').fill('Delivery');assert(!(await page.locator('#field-member0').isChecked()));await page.locator('#field-member0').check();await submit();await page.locator('[data-cmd="openFolder"][data-name="Delivery"]').click();assert.equal(await page.locator('.jobRow').count(),1);
  await side('views');await click('editView');await page.locator('#field-name').fill('API only');await page.locator('#field-member0').check();await submit();await page.locator('[data-cmd="filterView"][data-name="API only"]').click();assert.equal(await page.locator('.jobRow').count(),1);
 });
 await check('Multibranch editing, scan logs and branch navigation',async()=>{
  await side('multibranch');await click('scanBranches');await click('scanLog');assert((await text('#modalBody')).includes('Found main'));await page.keyboard.press('Escape');await page.locator('[data-cmd="branchJob"][data-branch="1"]').click();assert((await text('#modalBody')).includes('Jenkinsfile found'));await page.keyboard.press('Escape');await page.locator('[data-cmd="branchJob"][data-branch="0"]').click();assert((await text('.pageTitle')).includes('web-api'));
 });
 await check('Snippet generation and command palette keyboard navigation',async()=>{
  await side('pipelineSyntax');await page.locator('#field-step').selectOption('git');await page.locator('#field-args').fill('https://example.com/repo.git');await page.locator('#snippetForm button').click();assert.equal(await text('#snippet'),"git url: 'https://example.com/repo.git'");
  await page.keyboard.press('Control+k');await page.locator('#paletteInput').fill('Nodes');await page.keyboard.press('Enter');assert.equal(await text('.pageTitle'),'Nodes');await page.keyboard.press('Control+k');await page.locator('#paletteInput').fill('Project:');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');assert((await text('.pageTitle')).includes('docs-site'));
 });
 await check('Bulk plugin selection and cancellation of installation on reset',async()=>{
  await side('plugins');await page.locator('[data-cmd="pluginTab"][data-name="available"]').click();await page.locator('[data-plugin-select="junit"]').check();await click('applyPlugins');await page.waitForTimeout(600);assert.equal(await page.locator('[data-plugin="junit"]').count(),0);
  await load();await side('plugins');await page.locator('[data-cmd="pluginTab"][data-name="available"]').click();await click('installPlugin');await seek([]);await page.waitForTimeout(600);await side('plugins');await page.locator('[data-cmd="pluginTab"][data-name="available"]').click();assert.equal(await page.locator('[data-plugin="junit"]').count(),1);
 });
 await check('Background build events preserve unsaved configuration edits',async()=>{
  const data=clone(baseline);data.jobs[0].simulation={events:[{afterMs:600,status:'success',console:'Completed'}]};await load(data);await apiJob();await page.locator('#buildNowBtn').click();await side('configure');await page.locator('#field-description').fill('Unsaved edit');await page.waitForTimeout(700);assert.equal(await page.locator('#field-description').inputValue(),'Unsaved edit');
 });
 await check('Dark/light themes, responsive layouts and sidebar resizing',async()=>{
  await page.locator('#themeToggle').click();assert((await page.locator('body').getAttribute('class')).includes('theme-dark'));await apiJob();await page.locator('#history [data-build="24"]').click();await page.screenshot({path:path.join(out,'jenkins-dark-build.png')});
  for(const [width,height] of [[1920,1080],[1366,768],[1024,768],[800,800],[500,760]]){await page.setViewportSize({width,height});assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),width+' overflow');assert(await page.locator('#main').evaluate(e=>e.clientWidth>100))}
  await page.setViewportSize({width:1440,height:900});const r=await page.locator('#splitL').boundingBox();await page.mouse.move(r.x,r.y+100);await page.mouse.down();await page.mouse.move(r.x+40,r.y+100);await page.mouse.up();assert((await page.locator('#layout').getAttribute('style')).includes('grid-template-columns'));
 });
 await page.goto(pathToFileURL(path.join(root,'preview.html')).href);const frame=page.frameLocator('#sim');await frame.locator('.jobRow').first().waitFor();assert.equal(await frame.locator('.jobRow').count(),3);
 await page.locator('#feature').selectOption('configure');await frame.locator('#configForm').waitFor();assert.equal(await frame.locator('#jenkinsfile').count(),1);await page.locator('#reset').click();await page.waitForTimeout(70);
 await page.locator('#next').click();await page.locator('#next').click();await frame.locator('#console').waitFor();assert((await frame.locator('.pageTitle').textContent()).includes('#25'));await page.locator('#step').fill('0');await frame.locator('.jobRow').first().waitFor();
 await frame.locator('[data-cmd="openJob"][data-name="web-api"]').click();await frame.locator('#buildNowBtn').click();await page.waitForTimeout(2600);assert((await frame.locator('#console').textContent()).includes('Finished: SUCCESS'));
 await page.locator('#theme').click();assert((await frame.locator('body').getAttribute('class')).includes('theme-dark'));await page.locator('#reset').click();await frame.locator('.jobRow').first().waitFor();await page.screenshot({path:path.join(out,'jenkins-preview.png')});passed.push('Standalone preview, step navigation, interactive build and theme');console.log('PASS Standalone preview, step navigation, interactive build and theme');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log(JSON.stringify({passed:passed.length,errors,failed,artifacts:out},null,2));
 }catch(e){await page.screenshot({path:path.join(out,'failure.png')});console.error({passed,errors,failed});throw e}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
