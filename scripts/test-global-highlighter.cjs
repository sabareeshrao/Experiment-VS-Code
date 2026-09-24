"use strict";

const assert=require("node:assert/strict");
const fs=require("node:fs");
const http=require("node:http");
const path=require("node:path");
const {chromium}=require("playwright");

const root=path.resolve(__dirname,"..");
const contract=JSON.parse(fs.readFileSync(path.join(root,"simulator/action-contract.json"),"utf8"));
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

(async()=>{
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  let browser;
  try{
    browser=await chromium.launch({headless:true});
    const page=await browser.newPage({viewport:{width:1280,height:800}});
    await page.goto(base+"/player.html?step=1");
    const checked=[];
    for(const [software,spec] of Object.entries(contract.simulators||{})){
      const frameLocator=page.locator("#"+spec.frameId);
      assert.equal(await frameLocator.count(),1,software+": player iframe missing");
      await frameLocator.evaluate((frame,software)=>{
        frame.dataset.simLoading="1";
        const raw=frame.dataset.src||frame.getAttribute("src");
        const url=new URL(raw,location.href);
        url.searchParams.set("boot","highlight-ci-"+software+"-"+Date.now());
        frame.src=url.href;
      },software);
      const handle=await frameLocator.elementHandle();
      const child=await handle.contentFrame();
      await child.waitForFunction(()=>window.__SIM_HIGHLIGHT_READY__===true,{timeout:10000});
      const result=await child.evaluate(async()=>{
        const probe=document.createElement("button");
        probe.id="globalHighlightProbe";
        probe.textContent="Highlight probe";
        probe.style.cssText="position:fixed;left:36px;top:36px;width:132px;height:38px;z-index:2147479999";
        document.body.appendChild(probe);
        window.postMessage({type:"SIM_HIGHLIGHT",plan:{selectors:["#globalHighlightProbe"],duration:5000}},"*");
        await new Promise(r=>setTimeout(r,80));
        const cs=getComputedStyle(probe);
        const out={
          highlighted:probe.classList.contains("simActionHighlight"),
          outlineWidth:parseFloat(cs.outlineWidth)||0,
          outlineColor:cs.outlineColor,
          boxShadow:cs.boxShadow,
          filter:cs.filter,
          width:probe.getBoundingClientRect().width,
          height:probe.getBoundingClientRect().height
        };
        window.postMessage({type:"SIM_HIGHLIGHT_CLEAR"},"*");
        probe.remove();
        return out;
      });
      assert(result.highlighted,software+": shared highlighter did not activate");
      assert(result.outlineWidth>=3,software+": action outline is too weak: "+JSON.stringify(result));
      assert(result.boxShadow && result.boxShadow!=="none",software+": action glow is missing");
      assert(/rgb\(101, 184, 255\)|rgba\(101, 184, 255/.test(result.outlineColor),software+": expected bright blue outline: "+result.outlineColor);
      checked.push(software);
    }
    assert.equal(checked.length,Object.keys(contract.simulators||{}).length);
    console.log("Global highlighter verified across "+checked.length+" simulators: "+checked.join(", "));
  }finally{
    if(browser)await browser.close();
    server.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1});
