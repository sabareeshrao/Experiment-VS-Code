"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),http=require("node:http"),path=require("node:path");
const {chromium}=require("playwright");
const root=path.resolve(__dirname,".."),mime={".html":"text/html",".js":"application/javascript",".css":"text/css",".json":"application/json"};
const server=http.createServer((req,res)=>{const file=path.resolve(root,"."+decodeURIComponent(new URL(req.url,"http://localhost").pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});res.end(data)})});
(async()=>{await new Promise(r=>server.listen(0,"127.0.0.1",r));let browser;try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1400,height:880}}),base="http://127.0.0.1:"+server.address().port;
 await page.goto(base+"/player.html?step=497");
 await page.waitForFunction(()=>document.querySelector("#stepTitle")?.textContent.startsWith("497."));
 const frame=()=>page.frames().find(f=>f.url().includes("/intellij/index.html"));
 await frame().waitForSelector("#ijClassName");
 await frame().waitForFunction(()=>document.activeElement?.id==="ijClassName");
 await frame().locator("#ijClassName").press("ArrowRight");
 await page.waitForFunction(()=>document.querySelector("#stepTitle")?.textContent.startsWith("498."));
 assert.match(await page.locator("#stepTitle").innerText(),/^498\./);

 await page.locator("#prevBtn").click();
 await page.waitForFunction(()=>document.querySelector("#stepTitle")?.textContent.startsWith("497."));
 let input=frame().locator("#ijClassName");
 await input.click();
 await input.press("End");
 await input.type("X");
 assert((await input.inputValue()).endsWith("X"),"Live input did not accept typed text");
 await input.press("ArrowRight");
 await page.waitForFunction(()=>document.querySelector("#stepTitle")?.textContent.startsWith("498."));
 assert.match(await page.locator("#stepTitle").innerText(),/^498\./);

 await page.locator("#prevBtn").click();
 await page.waitForFunction(()=>document.querySelector("#stepTitle")?.textContent.startsWith("497."));
 input=frame().locator("#ijClassName");
 await input.press("Alt+ArrowRight");
 await page.waitForFunction(()=>document.querySelector("#stepTitle")?.textContent.startsWith("498."));
 console.log("Lesson navigation focus regression passed: live text cannot steal Left/Right lesson arrows.");
}finally{if(browser)await browser.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
