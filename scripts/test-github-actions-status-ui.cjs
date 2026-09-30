"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const mime = { ".html":"text/html", ".js":"application/javascript", ".css":"text/css", ".json":"application/json" };

const server = http.createServer((req,res)=>{
  const file = path.resolve(root, "." + decodeURIComponent(new URL(req.url,"http://localhost").pathname));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file,(err,data)=>{
    if(err) return res.writeHead(404).end();
    res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});
    res.end(data);
  });
});

(async()=>{
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  let browser;
  try{
    const base=`http://127.0.0.1:${server.address().port}`;
    browser=await chromium.launch({headless:true});
    const page=await browser.newPage({viewport:{width:1365,height:900}});

    await page.goto(`${base}/simulator/github_actions/index.html`);
    await page.waitForSelector("#content");

    await page.evaluate(()=>window.postMessage({
      type:"SIM_PACKAGE",
      package:{
        apps:{
          github_actions:{
            owner:"sabareeshrao",
            repository:"Developer-7-Intellij",
            runs:[],
            workflows:[]
          }
        }
      }
    },"*"));

    const steps=[
      {action:"triggerRun",data:{
        id:"set-3-pr-ci",
        name:"GeoOps CI",
        event:"pull_request",
        branch:"feature/GEO-3-delivery-workflow",
        commit:"set3001",
        status:"in_progress",
        jobs:[{
          name:"build",
          status:"in_progress",
          runner:"ubuntu-latest",
          steps:[{name:"Verify with Maven",status:"in_progress",log:"Running tests"}]
        }]
      }},
      {action:"setRunStatus",data:{
        id:"set-3-pr-ci",
        status:"success",
        duration:"1m 11s",
        jobs:[{
          name:"build",
          status:"success",
          runner:"ubuntu-latest",
          steps:[{name:"Verify with Maven",status:"success",log:"BUILD SUCCESS"}]
        }]
      }},
      {action:"openRun",data:{id:"set-3-pr-ci"}}
    ];

    await page.evaluate(steps=>window.postMessage({
      type:"SIM_SEEK",
      steps,
      autoType:false,
      animateFinal:false
    },"*"),steps);

    await page.waitForSelector('[data-run-status="success"]');
    const ui=await page.evaluate(()=>({
      label:document.querySelector('[data-run-status="success"]')?.innerText||"",
      body:document.querySelector("#content")?.innerText||""
    }));

    assert.equal(ui.label,"Success","Successful Actions run is missing readable status text: "+JSON.stringify(ui));
    assert(ui.body.includes("Verify with Maven"),"Run steps are not visible: "+JSON.stringify(ui));

    console.log("GitHub Actions status-label fidelity passed.");
  } finally {
    await browser?.close();
    server.close();
  }
})().catch(error=>{
  console.error(error);
  process.exitCode=1;
});
