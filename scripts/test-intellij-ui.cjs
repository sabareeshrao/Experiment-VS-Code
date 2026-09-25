"use strict";

// npm install --no-save --package-lock=false playwright@1.63.0
// npx playwright install chromium
// node scripts/test-intellij-ui.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..");
const mime = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json" };

const server = http.createServer((req, res) => {
  const file = path.resolve(root, "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => {
      if (window !== window.top) return;
      window.ijSeeks = 0;
      window.ijFocuses = [];
      window.addEventListener("message", event => {
        if (event.data?.type === "SIM_SEEK_DONE" && event.data.app === "intellij_idea") window.ijSeeks++;
      });
    });
    const frame = () => page.frames().find(f => f.url().includes("/intellij/index.html"));
    const title = () => page.locator("#stepTitle").innerText();
    async function loaded(step) {
      await page.waitForFunction(n => window.ijSeeks > 0 && document.querySelector("#stepTitle").textContent.startsWith(n + "."), step);
    }
    async function open(step) {
      await page.goto(`${base}/player.html?step=${step}`);
      await loaded(step);
    }
    async function navigate(action, step) {
      const before = await page.evaluate(() => window.ijSeeks);
      await action();
      await page.waitForFunction(({ before, step }) => window.ijSeeks > before && document.querySelector("#stepTitle").textContent.startsWith(step + "."), { before, step });
    }
    const jump = step => navigate(() => page.getByRole("button", { name: new RegExp(`^${step}\\.`) }).click(), step);
    async function geometry() {
      const g = await frame().evaluate(() => {
        const rect = selector => {
          const r = document.querySelector(selector).getBoundingClientRect();
          return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height, width: r.width };
        };
        return { app: rect(".app"), toolbar: rect(".toolbar"), work: rect(".work"), status: rect(".status"), editor: rect("#editorWrap"), tree: rect("#tree"), treeVisible: getComputedStyle(document.querySelector(".left")).display !== "none" };
      });
      assert(g.work.height > g.app.height * 0.55, `Collapsed workspace: ${JSON.stringify(g)}`);
      assert(Math.abs(g.work.top - g.toolbar.bottom) <= 1, "Workspace overlaps toolbar");
      assert(Math.abs(g.work.bottom - g.status.top) <= 1, "Unused space before status bar");
      assert(Math.abs(g.status.bottom - g.app.bottom) <= 1, "Status is not at the bottom");
      assert(g.editor.height > 100, "Editor collapsed");
      if (g.treeVisible) assert(g.tree.height > 100, "Project tree collapsed");
    }
    async function completion() {
      await geometry();
      const g = await frame().evaluate(() => {
        const popup = document.querySelector("#completion"), editor = document.querySelector("#editorWrap");
        const p = popup.getBoundingClientRect(), e = editor.getBoundingClientRect();
        return { visible: popup.classList.contains("show"), height: p.height, fits: p.top >= e.top && p.bottom <= e.bottom + 1 && p.left >= e.left && p.right <= e.right + 1, split: document.querySelector(".editorPane").classList.contains("editorSplit") };
      });
      assert(g.visible && g.height > 80 && g.fits, `Clipped completion: ${JSON.stringify(g)}`);
      assert(!g.split, "Previous chapter leaked split-editor state");
    }

    // Regression for the original Student.java corruption: breadcrumbs must
    // occupy their own row and never cover line 1 or the gutter.
    await open(5);
    await frame().waitForSelector(".ij-breadcrumbs");
    const studentLayout = await frame().evaluate(() => {
      const rect = el => {
        const r=el.getBoundingClientRect();
        return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height};
      };
      const crumb=document.querySelector(".ij-breadcrumbs");
      const editor=document.querySelector("#editorWrap");
      const gutter=document.querySelector(".gutter");
      const firstCode=document.querySelector(".codeLine");
      const firstGutter=document.querySelector(".gline");
      return {
        crumb:rect(crumb),editor:rect(editor),gutter:rect(gutter),
        firstCode:firstCode?rect(firstCode):null,
        firstGutter:firstGutter?rect(firstGutter):null,
        firstCodeText:firstCode?.textContent||"",
        editorScrollLeft:editor.scrollLeft
      };
    });
    assert(studentLayout.firstCodeText.includes("public class Student"), "Student.java line 1 is not rendered as the first source line: "+JSON.stringify(studentLayout));
    assert(studentLayout.crumb.bottom<=studentLayout.editor.top+1.5, "Breadcrumbs overlap the Student.java editor viewport: "+JSON.stringify(studentLayout));
    assert(studentLayout.firstCode&&studentLayout.firstCode.top>=studentLayout.editor.top-1, "Student.java line 1 is hidden under breadcrumbs: "+JSON.stringify(studentLayout));
    assert(studentLayout.firstGutter&&studentLayout.firstGutter.top>=studentLayout.editor.top-1, "Student.java gutter line 1 is hidden under breadcrumbs: "+JSON.stringify(studentLayout));

    await open(495);
    await frame().evaluate(() => document.addEventListener("focusin", e => parent.ijFocuses.push(e.target.id)));
    await geometry();
    for (let step = 496; step <= 505; step++) {
      await navigate(() => page.locator("#nextBtn").click(), step);
      await geometry();
      if (step === 497) {
        await frame().waitForFunction(() => document.activeElement?.id === "ijClassName");
        await page.keyboard.press("r");
        assert((await frame().locator("#ijClassName").inputValue()).endsWith("r"), "Typed input was consumed as a replay shortcut");
        await page.keyboard.press("ArrowRight");
        await page.waitForFunction(() => document.querySelector("#stepTitle").textContent.startsWith("498."));
        await page.keyboard.press("ArrowLeft");
        await page.waitForFunction(() => document.querySelector("#stepTitle").textContent.startsWith("497."));
        assert((await title()).startsWith("497."), "Lesson arrows stopped working after live text editing");
      }
      if (step === 504) await completion();
    }
    assert.deepEqual(await page.evaluate(() => window.ijFocuses.filter(id => id === "ijClassName")), ["ijClassName","ijClassName"], "Historical replay stole focus beyond the deliberate 497 revisit");
    assert((await frame().locator("#bottomPanel").boundingBox()).height > 80, "Run panel collapsed");
    assert((await frame().locator("#bottomBody").innerText()).includes("Process finished with exit code 0"));
    await navigate(() => page.locator("#prevBtn").click(), 504);
    await navigate(() => page.locator("#replayBtn").click(), 504);
    await completion();

    await jump(497);
    await frame().locator("#ijClassName").press("Alt+ArrowRight");
    await page.waitForFunction(() => document.querySelector("#stepTitle").textContent.startsWith("498."));
    await navigate(() => page.keyboard.press("ArrowRight"), 499);
    await navigate(() => page.keyboard.press("ArrowLeft"), 498);
    await navigate(() => page.keyboard.press("r"), 498);
    await page.locator("#stepSearch").click();
    await page.locator("#stepSearch").fill("Test");
    await page.keyboard.press("ArrowLeft");
    assert((await title()).startsWith("498."), "Parent search input lost cursor navigation");
    await page.locator("#stepSearch").fill("");

    await open(492);
    assert(await frame().locator(".ij-welcome").isVisible());
    await jump(504);
    await completion();
    const oldCss = await frame().locator('link[rel="stylesheet"]').getAttribute("href");
    await page.reload();
    await loaded(504);
    await completion();
    assert.notEqual(await frame().locator('link[rel="stylesheet"]').getAttribute("href"), oldCss, "Reload reused stale simulator asset URL");
    await frame().getByRole("button", { name: "sout Prints a string to System.out", exact: true }).click();
    assert(!(await frame().locator("#completion").isVisible()), "Completion choice was not clickable");
    await jump(510);
    assert(await frame().locator(".ij-symbol-card").isVisible());

    await jump(504);
    const left = frame().locator("#leftPanel"), splitter = await frame().locator("#splitL").boundingBox();
    const oldWidth = (await left.boundingBox()).width;
    await page.mouse.move(splitter.x + splitter.width / 2, splitter.y + 150);
    await page.mouse.down();
    await page.mouse.move(splitter.x + 60, splitter.y + 150, { steps: 8 });
    await page.mouse.up();
    const width = (await left.boundingBox()).width;
    assert(width > oldWidth + 20, "Project splitter did not resize");
    await navigate(() => page.locator("#replayBtn").click(), 504);
    assert(Math.abs((await left.boundingBox()).width - width) <= 1, "Replay erased pane width");
    await page.reload();
    await loaded(504);
    assert(Math.abs((await frame().locator("#leftPanel").boundingBox()).width - width) <= 1, "Reload erased pane width");

    for (const viewport of [{ width: 1024, height: 768 }, { width: 760, height: 720 }, { width: 520, height: 720 }, { width: 1280, height: 520 }]) {
      await page.setViewportSize(viewport);
      await open(504);
      await completion();
      const responsive = await frame().evaluate(() => {
        const left=document.querySelector("#leftPanel"),right=document.querySelector("#rightPanel");
        const lr=left.getBoundingClientRect(),rr=right.getBoundingClientRect();
        return {
          leftVisible:getComputedStyle(left).display!=="none",
          rightVisible:getComputedStyle(right).display!=="none",
          leftWidth:lr.width,
          rightWidth:rr.width,
          leftVar:getComputedStyle(document.documentElement).getPropertyValue("--leftW").trim(),
          rightVar:getComputedStyle(document.documentElement).getPropertyValue("--rightW").trim()
        };
      });
      if(viewport.width<=1100&&viewport.width>650){
        assert(responsive.leftVisible&&responsive.leftWidth<=225, "Saved desktop Project width overrode compact IntelliJ layout: "+JSON.stringify({viewport,responsive}));
      }
      if(viewport.width<=950){
        assert(!responsive.rightVisible, "Right tool window stayed visible below IntelliJ compact breakpoint: "+JSON.stringify({viewport,responsive}));
      }
      if(viewport.width<=650){
        assert(!responsive.leftVisible, "Project pane stayed visible on mobile IntelliJ layout: "+JSON.stringify({viewport,responsive}));
      }
      await navigate(() => page.locator("#nextBtn").click(), 505);
      await geometry();
      assert((await frame().locator("#bottomPanel").boundingBox()).height > 60);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(1);
    assert(!await frame().locator("body").evaluate(e => e.classList.contains("ijScreenshotMode")), "Normal IntelliJ inherited screenshot mode");
    await geometry();

    // Project tree horizontal overflow regression: long labels must remain one line,
    // increase intrinsic content width, and be reachable with horizontal scrolling.
    const treeScroll = await frame().evaluate(() => {
      const tree=document.querySelector("#tree");
      const row=document.createElement("div");
      row.className="treeAux";
      row.dataset.scrollRegression="1";
      row.innerHTML='<span class="twist"></span><span class="ico">·</span><span>org.springframework.boot:spring-boot-starter-validation:3.4.0 extremely-long-dependency-name-for-horizontal-scroll-verification</span><span class="nodeMeta">Maven dependency metadata</span>';
      tree.appendChild(row);
      const before={clientWidth:tree.clientWidth,scrollWidth:tree.scrollWidth,rowHeight:row.getBoundingClientRect().height,whiteSpace:getComputedStyle(row).whiteSpace};
      tree.scrollLeft=tree.scrollWidth;
      const after=tree.scrollLeft;
      row.remove();
      return {...before,scrollLeft:after};
    });
    assert(treeScroll.scrollWidth > treeScroll.clientWidth + 80, "Project tree did not expose horizontal overflow");
    assert(treeScroll.rowHeight < 32, `Long Project tree item wrapped vertically: ${JSON.stringify(treeScroll)}`);
    assert.equal(treeScroll.whiteSpace, "nowrap", "Project tree row is allowed to wrap");
    assert(treeScroll.scrollLeft > 0, "Project tree horizontal scrollbar is not functional");

    // IntelliJ terminal command rectangle regression: current command gets the
    // VS Code-style yellow outline, historical replay commands do not.
    await frame().evaluate(() => window.postMessage({
      type:"SIM_SEEK",
      autoType:false,
      animateFinal:false,
      steps:[{action:"typeTerminal",data:{command:"mvn test",output:"BUILD SUCCESS"}}]
    }, "*"));
    await frame().waitForSelector(".terminalCommandFocus");
    const terminalFocus = await frame().locator(".terminalCommandFocus").evaluate(el => {
      const cs=getComputedStyle(el);
      return {text:el.textContent,outlineWidth:parseFloat(cs.outlineWidth)||0,outlineColor:cs.outlineColor};
    });
    assert(terminalFocus.text.includes("mvn test"), "IntelliJ terminal highlighted the wrong command line");
    assert(terminalFocus.outlineWidth >= 2, "IntelliJ terminal yellow rectangle is too weak");
    assert(/rgb\(255, 212, 0\)/.test(terminalFocus.outlineColor), "IntelliJ terminal command rectangle is not yellow");

    await frame().evaluate(() => window.postMessage({
      type:"SIM_SEEK",
      autoType:false,
      animateFinal:false,
      steps:[
        {action:"typeTerminal",data:{command:"mvn test",output:"BUILD SUCCESS"}},
        {action:"openTerminal",data:{}}
      ]
    }, "*"));
    await frame().waitForTimeout(80);
    assert.equal(await frame().locator(".terminalCommandFocus").count(), 0, "Historical IntelliJ terminal command remained highlighted");
    assert.deepEqual(errors, [], "Browser JavaScript errors");
    console.log("IntelliJ browser regression checks passed: layout, completion, Run, focus, navigation, replay, reload, resize persistence, responsive views and normal mode.");
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
