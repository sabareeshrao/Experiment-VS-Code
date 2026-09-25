"use strict";

const assert=require("node:assert/strict");
const fs=require("node:fs");
const http=require("node:http");
const path=require("node:path");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,"..");
const mime={".html":"text/html",".js":"application/javascript",".css":"text/css",".json":"application/json"};
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
  fs.readFile(file,(error,data)=>{
    if(error){res.writeHead(404).end();return}
    res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
    res.end(data);
  });
});

(async()=>{
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 let browser;
 try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.addInitScript(()=>{
    if(window!==window.top)return;
    window.p0Seeks=0;
    window.addEventListener("message",e=>{if(e.data?.type==="SIM_SEEK_DONE"&&e.data.app==="intellij_idea")window.p0Seeks++});
  });
  const frame=()=>page.frames().find(f=>f.url().includes("/intellij/index.html"));
  async function loaded(step){
    await page.waitForFunction(n=>window.p0Seeks>0&&document.querySelector("#stepTitle")?.textContent.startsWith(n+"."),step);
  }
  async function open(step){
    await page.goto(`${base}/player.html?step=${step}`);
    await loaded(step);
  }
  async function next(step){
    const before=await page.evaluate(()=>window.p0Seeks);
    await page.locator("#nextBtn").click();
    await page.waitForFunction(({before,step})=>window.p0Seeks>before&&document.querySelector("#stepTitle")?.textContent.startsWith(step+"."),{before,step});
  }
  async function assertWorkspace(){
    const g=await frame().evaluate(()=>{
      const a=document.querySelector(".app").getBoundingClientRect(),w=document.querySelector(".work").getBoundingClientRect();
      return {app:a.height,work:w.height};
    });
    assert(g.work>g.app*.5,"P0 surface collapsed the IntelliJ workspace: "+JSON.stringify(g));
  }

  await open(511);
  await frame().waitForSelector(".ij-search-popup");
  assert(await frame().locator(".ij-p0-result").count()>=4);
  await frame().locator("[data-search-tab='Classes']").click();
  assert(await frame().locator(".ij-p0-result:not(.filtered)").count()>=1);
  await assertWorkspace();

  await next(512);
  assert(await frame().locator(".ij-search-popup").isVisible());
  await frame().locator("#ijP0SearchInput").press("ArrowDown");
  await frame().locator("#ijP0SearchInput").press("ArrowUp");

  await next(513);
  assert(await frame().locator(".ij-find-popup").isVisible());
  await frame().locator("[data-find-toggle='case']").click();
  assert(await frame().locator("[data-find-toggle='case']").evaluate(el=>el.classList.contains("active")));
  assert(await frame().locator("#ijReplaceQuery").isVisible());

  await next(514);
  assert(await frame().locator(".ij-p0-bottom").isVisible());
  await frame().locator("[data-usage-index='1']").click();
  assert((await frame().locator("#ijUsagesPreview").innerText()).includes("ProjectServiceTest"));

  await next(515);
  assert(await frame().locator(".ij-refactor-dialog").isVisible());
  await frame().locator("#ijRefactorPreviewBtn").click();
  assert(await frame().locator(".ij-refactor-preview").isVisible());

  await next(516);
  assert(await frame().locator(".ij-debug-tool").isVisible());
  assert(await frame().locator("[data-debug-cmd='stepOver']").isVisible());
  await frame().locator("[data-debug-cmd='stepOver']").click();
  assert((await frame().locator(".ij-debug-state").innerText()).length>0);

  await next(517);
  assert(await frame().locator(".ij-tests-tool").isVisible());
  assert.equal(await frame().locator("[data-test-index]").count(),3);
  await frame().locator("[data-test-index='1']").click();
  assert((await frame().locator(".ij-test-detail").innerText()).includes("Assertion failed"));
  await frame().locator("#ijTestsFailed").click();
  assert((await frame().locator(".ij-test-summary").innerText()).includes("0 failed"));

  await next(518);
  assert(await frame().locator(".ij-maven-head").isVisible());
  assert(await frame().locator("[data-maven-section='Dependencies']").isVisible());
  const mavenLayout=await frame().evaluate(()=>{
    const body=document.querySelector("#rightBody").getBoundingClientRect();
    const rows=[...document.querySelectorAll(".ij-maven-row")].map(row=>{
      const r=row.getBoundingClientRect();
      return {left:r.left,right:r.right,height:r.height};
    });
    const dependencyLabels=[...document.querySelectorAll(".ij-maven-section [data-maven-section='Dependencies'] + div .ij-maven-row span:nth-child(2)")].map(el=>{
      const cs=getComputedStyle(el),r=el.getBoundingClientRect();
      return {whiteSpace:cs.whiteSpace,overflow:cs.overflow,textOverflow:cs.textOverflow,height:r.height};
    });
    return {body:{left:body.left,right:body.right},rows,dependencyLabels};
  });
  assert(mavenLayout.rows.every(r=>r.left>=mavenLayout.body.left-1&&r.right<=mavenLayout.body.right+1&&r.height<=31),"Maven rows overflow/wrap outside the tool window: "+JSON.stringify(mavenLayout));
  assert(mavenLayout.dependencyLabels.length>0&&mavenLayout.dependencyLabels.every(x=>x.whiteSpace==="nowrap"&&x.overflow==="hidden"),"Maven dependency labels are allowed to crumble/wrap: "+JSON.stringify(mavenLayout));
  await frame().locator("[data-maven-goal='test']").click();
  assert((await frame().locator("#bottomBody").innerText()).includes("BUILD SUCCESS"));

  await next(519);
  assert(await frame().locator(".ij-services-tool").isVisible());
  assert.equal(await frame().locator(".ij-service-card").count(),2);
  await frame().locator("[data-service-action='stop']").first().click();
  assert((await frame().locator(".ij-service-card").first().innerText()).includes("Stopped"));

  await next(520);
  assert(await frame().locator(".ij-spring-popup").isVisible());
  await frame().locator("[data-spring-tab='mappings']").click();
  assert.equal(await frame().locator(".ij-mapping-table tbody tr").count(),3);
  await frame().locator("#ijSpringFilter").fill("POST");
  assert.equal(await frame().locator(".ij-mapping-table tbody tr:not(.filtered)").count(),1);

  await next(521);
  assert(await frame().locator(".tree-source").count()>=1);
  assert(await frame().locator(".tree-test").count()>=1);
  assert(await frame().locator(".tree-resource").count()>=1);
  assert(await frame().locator(".gitMark").count()>=2);
  await assertWorkspace();

  await next(522);
  assert(await frame().locator(".ij-editor-caret").count()>=1);
  assert(await frame().locator(".ij-editor-selection").count()>=1);
  assert(await frame().locator(".ij-breadcrumbs").isVisible());

  await next(523);
  assert(await frame().locator(".ij-breadcrumbs").isVisible());
  const crumbs=await frame().locator(".ij-breadcrumbs").innerText();
  assert(crumbs.includes("AeroTopo")&&crumbs.includes("ProjectService.java"),"Breadcrumb chain is incomplete: "+crumbs);
  const breadcrumbGeometry=await frame().evaluate(()=>{
    const crumb=document.querySelector(".ij-breadcrumbs").getBoundingClientRect();
    const row=document.querySelector(".ij-breadcrumbs-row").getBoundingClientRect();
    const tabs=document.querySelector("#tabs").getBoundingClientRect();
    const editor=document.querySelector("#editorWrap").getBoundingClientRect();
    const firstCode=document.querySelector(".codeLine")?.getBoundingClientRect();
    const firstGutter=document.querySelector(".gline")?.getBoundingClientRect();
    return {
      crumbLeft:crumb.left,crumbRight:crumb.right,rowLeft:row.left,rowRight:row.right,
      tabsLeft:tabs.left,tabsRight:tabs.right,crumbBottom:crumb.bottom,
      editorTop:editor.top,editorRight:editor.right,
      firstCodeTop:firstCode?.top??null,firstGutterTop:firstGutter?.top??null
    };
  });
  assert(Math.abs(breadcrumbGeometry.rowLeft-breadcrumbGeometry.tabsLeft)<=1.5&&Math.abs(breadcrumbGeometry.rowRight-breadcrumbGeometry.tabsRight)<=1.5,"Breadcrumb row breaks editor/tab continuity: "+JSON.stringify(breadcrumbGeometry));
  assert(Math.abs(breadcrumbGeometry.crumbLeft-breadcrumbGeometry.rowLeft)<=1.5&&Math.abs(breadcrumbGeometry.crumbRight-breadcrumbGeometry.rowRight)<=1.5,"Breadcrumb content does not fill its editor row: "+JSON.stringify(breadcrumbGeometry));
  assert(breadcrumbGeometry.crumbRight<=breadcrumbGeometry.editorRight+1,"Breadcrumb strip escapes the editor: "+JSON.stringify(breadcrumbGeometry));
  assert(breadcrumbGeometry.crumbBottom<=breadcrumbGeometry.editorTop+1.5,"Breadcrumb row overlaps the editor viewport: "+JSON.stringify(breadcrumbGeometry));
  assert(breadcrumbGeometry.firstCodeTop===null||breadcrumbGeometry.firstCodeTop>=breadcrumbGeometry.editorTop-1,"Breadcrumb row overlaps source line 1: "+JSON.stringify(breadcrumbGeometry));
  assert(breadcrumbGeometry.firstGutterTop===null||breadcrumbGeometry.firstGutterTop>=breadcrumbGeometry.editorTop-1,"Breadcrumb row overlaps gutter line 1: "+JSON.stringify(breadcrumbGeometry));

  await next(524);
  assert(await frame().locator(".ij-terminal-tabs").isVisible());
  assert(await frame().locator(".terminalCommandFocus").isVisible());
  assert((await frame().locator(".terminalCommandFocus").innerText()).includes("mvn spring-boot:run"));
  assert((await frame().locator(".ij-exit-code").innerText()).includes("exit 0"));
  const beforeTabs=await frame().locator("[data-terminal-session]").count();
  await frame().locator("#ijTerminalNew").click();
  assert.equal(await frame().locator("[data-terminal-session]").count(),beforeTabs+1);

  assert.deepEqual(errors,[],"Browser JavaScript errors: "+JSON.stringify(errors));
  console.log("IntelliJ P0 UI verification passed: search/navigation, find/usages, refactoring, debugger, JUnit, Maven, Spring, project tree, editor, breadcrumbs and terminal.");
 }finally{
  if(browser)await browser.close();
  server.close();
 }
})().catch(error=>{console.error(error);process.exitCode=1});
