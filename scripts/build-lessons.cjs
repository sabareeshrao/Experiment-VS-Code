"use strict";

const fs=require("fs");
const path=require("path");

function readJson(file){return JSON.parse(fs.readFileSync(file,"utf8"))}

function buildCourse(root=path.resolve(__dirname,"..")){
  const sourceRoot=path.join(root,"lesson-json");
  const manifest=readJson(path.join(sourceRoot,"course.json"));
  if(!Array.isArray(manifest.chapters)||!manifest.chapters.length)throw new Error("lesson-json/course.json has no chapters");

  const stages=manifest.chapters.map((ref,index)=>{
    if(!ref||typeof ref.path!=="string"||!ref.path.trim())throw new Error("Chapter reference "+(index+1)+" has no path");
    const file=path.resolve(sourceRoot,ref.path);
    if(!file.startsWith(sourceRoot+path.sep))throw new Error("Chapter path escapes lesson-json: "+ref.path);
    const chapter=readJson(file);
    if(ref.id&&chapter.id!==ref.id)throw new Error("Chapter id mismatch for "+ref.path+": expected "+ref.id+", found "+chapter.id);
    const {schema_version,id,...stage}=chapter;
    return stage;
  });

  return {
    title:manifest.title,
    subtitle:manifest.subtitle,
    books:manifest.books||[],
    package:manifest.package||{apps:{}},
    stages
  };
}

function renderLessons(course){return "window.COURSE = "+JSON.stringify(course,null,2)+";\n"}

function writeLessons(root=path.resolve(__dirname,"..")){
  const output=path.join(root,"lessons.js");
  const text=renderLessons(buildCourse(root));
  fs.writeFileSync(output,text);
  return text;
}

if(require.main===module){
  const root=path.resolve(__dirname,"..");
  const expected=renderLessons(buildCourse(root));
  const target=path.join(root,"lessons.js");
  if(process.argv.includes("--check")){
    const actual=fs.existsSync(target)?fs.readFileSync(target,"utf8"):"";
    if(actual!==expected){
      console.error("lessons.js is stale. Run: node scripts/build-lessons.cjs");
      process.exit(1);
    }
    console.log("lessons.js matches lesson-json source");
  }else{
    fs.writeFileSync(target,expected);
    console.log("Wrote lessons.js from lesson-json");
  }
}

module.exports={buildCourse,renderLessons,writeLessons};
