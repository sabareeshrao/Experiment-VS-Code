"use strict";

const assert=require("node:assert/strict");
const fs=require("node:fs");
const http=require("node:http");
const path=require("node:path");
const {chromium}=require("playwright");

const root=path.resolve(__dirname,"..");
const mime={".html":"text/html",".js":"application/javascript",".css":"text/css",".json":"application/json"};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  const file=path.resolve(root,"."+pathname);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
  fs.readFile(file,(error,data)=>{
    if(error){res.writeHead(404).end();return}
    res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
    res.end(data);
  });
});

function loadCourse(){
  const raw=fs.readFileSync(path.join(root,"lessons.js"),"utf8").trim().replace(/^window\.COURSE\s*=\s*/,"").replace(/;\s*$/,"");
  return JSON.parse(raw);
}
function flatten(course){
  const out=[];
  for(const stage of course.stages||[])for(const step of stage.steps||[])out.push({...step,globalIndex:out.length});
  return out;
}

(async()=>{
  const course=loadCourse(),flat=flatten(course);
  const power=flat.filter(s=>s.software==="powerbi");
  assert.equal(power.length,88,"Expected the 88-step Power BI verification chapter");
  assert(power.every(s=>["target","code","none"].includes(s.highlight?.kind)),"Power BI still contains a non-explicit highlight contract");
  assert.equal(power.filter(s=>s.highlight?.kind==="auto").length,0,"Power BI still contains auto highlights");

  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  let browser;
  try{
    browser=await chromium.launch({headless:true});
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const errors=[];
    page.on("pageerror",e=>errors.push(e.message));

    async function frame(){
      const f=page.frames().find(x=>x.url().includes("/powerbi/index.html"));
      assert(f,"Power BI frame not loaded");
      return f;
    }
    async function waitStep(globalIndex){
      const n=globalIndex+1;
      await page.waitForFunction(step=>document.querySelector("#stepTitle")?.textContent?.startsWith(step+"."),n,{timeout:15000});
      const f=await frame();
      await f.waitForFunction(()=>{
        const guidance=document.querySelector(".simActionHighlight,.simActionPointer,.simLessonLineHighlight,.codeLine.focus,.sim-emphasis");
        return !!guidance;
      },{timeout:5000});
      await page.waitForSelector("[data-sim-explanation-title]",{timeout:5000});
      const state=await f.evaluate(()=>{
        const highlighted=[...document.querySelectorAll(".simActionHighlight,.simActionPointer,.simLessonLineHighlight,.codeLine.focus,.sim-emphasis")].filter(el=>{
          const cs=getComputedStyle(el),r=el.getBoundingClientRect();
          return cs.display!=="none"&&cs.visibility!=="hidden"&&r.width>0&&r.height>0;
        });
        return {guidance:highlighted.length,status:document.querySelector("#statusMessage")?.textContent||""};
      });
      const title=(await page.locator("[data-sim-explanation-title]").innerText()).trim();
      const body=(await page.locator("[data-sim-explanation-text]").innerText()).trim();
      assert(!title.startsWith("[no highlight]"),"Power BI step "+n+" exposed [no highlight] in the title: "+title);
      assert(!body.startsWith("[no highlight]"),"Power BI step "+n+" exposed [no highlight] in the body");
      assert(state.guidance>0,"Power BI step "+n+" has no visible highlight/pointer");
      return {f,state};
    }

    await page.goto(base+"/player.html?step="+(power[0].globalIndex+1));
    let current=await waitStep(power[0].globalIndex);

    for(let i=0;i<power.length;i++){
      const step=power[i];
      if(i>0){
        await page.locator("#nextBtn").click();
        current=await waitStep(step.globalIndex);
      }
      const f=current.f,a=step.action?.action,d=step.action?.data||{};

      if(a==="openFormatPane"){
        assert(await f.locator('[data-pbi-highlight="format-pane"]').isVisible(),"Power BI Format pane is dormant");
      }
      if(a==="openAnalyticsPane"){
        assert(await f.locator('[data-pbi-highlight="analytics-pane"]').isVisible(),"Power BI Analytics pane is dormant");
      }
      if(["toggleColumnQuality","toggleColumnDistribution","profileColumn"].includes(a)){
        const strip=f.locator("#pqProfilingStrip");
        assert(await strip.isVisible(),"Power BI profiling strip is dormant on "+a);
        const text=await strip.innerText();
        if(a==="toggleColumnQuality")assert(text.includes("Column quality ON"),"Column quality did not surface");
        if(a==="toggleColumnDistribution")assert(text.includes("Column distribution ON"),"Column distribution did not surface");
        if(a==="profileColumn")assert(text.includes("Column profile"),"Column profile did not surface");
      }
      if(a==="setVisualType"){
        assert(await f.locator(`[data-vtype="${d.type}"].active`).isVisible(),"Visual type change is not reflected in the gallery");
      }
      if(a==="addFieldToWell"){
        const well=f.locator(`[data-well="${d.well}"]`);
        assert(await well.isVisible(),"Field well is not visible: "+d.well);
        assert((await well.innerText()).includes(d.field),"Field was not added to "+d.well+": "+d.field);
      }
      if(a==="openMobileLayout"||a==="setMobileVisualPosition"){
        assert.equal((await f.locator("#modalTitle").innerText()).trim(),"Mobile layout","Mobile layout surface is dormant");
      }
      if(a==="selectPage"){
        assert((await f.locator("#statusMessage").innerText()).startsWith("Page:"),"selectPage did not expose the selected page");
      }
    }

    assert.deepEqual(errors,[],"Power BI browser JavaScript errors");
    console.log("Power BI highlight coverage passed for all "+power.length+" steps, including format/analytics/profiling/field-well/mobile surfaces.");
  }finally{
    if(browser)await browser.close();
    server.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1});
