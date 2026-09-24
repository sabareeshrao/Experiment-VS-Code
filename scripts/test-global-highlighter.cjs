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
        window.postMessage({type:"SIM_HIGHLIGHT",plan:{selectors:["#globalHighlightProbe"]}},"*");
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
        return out;
      });
      assert(result.highlighted,software+": shared highlighter did not activate");
      assert(result.outlineWidth>=4,software+": action outline is too weak: "+JSON.stringify(result));
      assert.equal(result.boxShadow,"none",software+": blue guidance must be boundary-only, not a glow");
      assert.equal(result.filter,"none",software+": blue guidance must not brighten/pulse the control");
      assert(/rgb\(83, 169, 255\)|rgba\(83, 169, 255/.test(result.outlineColor),software+": expected blue boundary: "+result.outlineColor);
      if(checked.length===0){
        const lineStyle=await child.evaluate(()=>{
          const line=document.createElement("div");
          line.id="globalLineHighlightProbe";
          line.className="codeLine sim-emphasis";
          line.textContent="boolean isPresent;";
          line.style.cssText="position:fixed;left:36px;top:100px;width:420px;height:28px;line-height:28px";
          document.body.appendChild(line);
          const cs=getComputedStyle(line);
          const out={
            outlineWidth:parseFloat(cs.outlineWidth)||0,
            outlineColor:cs.outlineColor,
            backgroundColor:cs.backgroundColor
          };
          line.remove();
          return out;
        });
        assert(lineStyle.outlineWidth>=2,"editor-line emphasis rectangle is too weak: "+JSON.stringify(lineStyle));
        assert(/rgb\(83, 169, 255\)/.test(lineStyle.outlineColor),"editor-line emphasis boundary is not bright blue");
        assert(lineStyle.backgroundColor!=="transparent"&&!/rgba?\(0, 0, 0, 0\)/.test(lineStyle.backgroundColor),"editor-line emphasis fill is missing");
        await child.waitForTimeout(5300);
        assert(await child.locator("#globalHighlightProbe").evaluate(el=>el.classList.contains("simActionHighlight")),software+": blue boundary expired without an explicit clear");
      }
      await child.evaluate(()=>window.postMessage({type:"SIM_HIGHLIGHT_CLEAR"},"*"));
      assert(!(await child.locator("#globalHighlightProbe").evaluate(el=>el.classList.contains("simActionHighlight"))),software+": explicit highlight clear did not remove the boundary");
      await child.locator("#globalHighlightProbe").evaluate(el=>el.remove());
      checked.push(software);
    }
    assert.equal(checked.length,Object.keys(contract.simulators||{}).length);
    console.log("Global highlighter verified across "+checked.length+" simulators: "+checked.join(", "));
  }finally{
    if(browser)await browser.close();
    server.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1});
