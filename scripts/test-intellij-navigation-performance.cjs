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
    const page=await browser.newPage({viewport:{width:1280,height:800}});
    await page.goto(base+"/simulator/intellij/index.html");
    await page.waitForFunction(()=>window.__INTELLIJ_REPLAY_STATS__);

    await page.evaluate(()=>{
      window.__seekDone=0;
      window.addEventListener("message",event=>{
        if(event.data?.type==="SIM_SEEK_DONE"&&event.data?.app==="intellij_idea")window.__seekDone++;
      });
      window.postMessage({
        type:"SIM_PACKAGE",
        package:{apps:{intellij_idea:{
          project:{name:"ReplayPerf",sdk:"Java 17",languageLevel:"17"},
          tree:[{name:"src",path:"src",type:"folder",open:true,children:[{name:"Main.java",path:"src/Main.java",type:"file",language:"java"}]}],
          files:{"src/Main.java":{language:"java",content:"public class Main {\n    int value = 1;\n}\n"}},
          initialFile:"src/Main.java",
          visibleFeatures:[],problems:[],breakpoints:[],runConfigurations:[]
        }}},
        theme:"dark",
        autoType:false
      },"*");
    });

    const repeated=Array.from({length:80},()=>({action:"openFile",data:{file:"src/Main.java"}}));
    await page.evaluate(steps=>window.postMessage({type:"SIM_SEEK",mode:"replace",steps,animateFinal:false,autoType:false,targetCount:steps.length},"*"),repeated);
    await page.waitForFunction(()=>window.__seekDone>=1);

    const before=await page.evaluate(()=>({...window.__INTELLIJ_REPLAY_STATS__}));
    await page.evaluate(()=>{
      window.__editorMutations=0;
      const editor=document.querySelector("#editorWrap");
      window.__editorObserver=new MutationObserver(records=>{window.__editorMutations+=records.length});
      window.__editorObserver.observe(editor,{childList:true,subtree:true});
      const action={action:"openFile",data:{file:"src/Main.java"}};
      window.postMessage({
        type:"SIM_SEEK",
        mode:"append",
        steps:[action],
        baseCount:80,
        baseKey:JSON.stringify(action),
        targetCount:81,
        animateFinal:false,
        autoType:false
      },"*");
    });
    await page.waitForFunction(()=>window.__seekDone>=2);
    const after=await page.evaluate(()=>{
      window.__editorObserver?.disconnect();
      return {stats:{...window.__INTELLIJ_REPLAY_STATS__},mutations:window.__editorMutations};
    });

    assert.equal(after.stats.lastMode,"incremental","Next did not use incremental replay");
    assert.equal(after.stats.lastAppliedActions,1,"Next replayed more than the new action");
    assert.equal(after.stats.checkpointRestores,before.checkpointRestores,"Next restored a checkpoint and can visibly blink");
    assert(after.stats.redundantOpenFileSkips>before.redundantOpenFileSkips,"Repeated openFile was not treated as a no-op render");
    assert.equal(after.mutations,0,"Repeated same-file navigation rebuilt the editor DOM and can blink");

    await page.evaluate(steps=>window.postMessage({type:"SIM_SEEK",mode:"replace",steps:steps.slice(0,79),animateFinal:false,autoType:false,targetCount:79},"*"),repeated);
    await page.waitForFunction(()=>window.__seekDone>=3);
    const backward=await page.evaluate(()=>({...window.__INTELLIJ_REPLAY_STATS__}));
    assert.equal(backward.lastMode,"checkpoint","Backward navigation did not use a checkpoint");
    assert(backward.lastAppliedActions<=19,"Backward navigation replayed too much history: "+JSON.stringify(backward));

    console.log("IntelliJ incremental navigation/checkpoint/blink regression passed",JSON.stringify(backward));
  }finally{
    await browser?.close();
    server.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1});
