(() => {
  "use strict";
  const course=window.COURSE||{stages:[]};
  const stages=course.stages||[];
  const $=id=>document.getElementById(id);

  const stepStarts=[];
  let totalSteps=0;
  stages.forEach((stage,index)=>{
    stepStarts[index]=totalSteps;
    totalSteps+=(stage.steps||[]).length;
  });

  const configured=Array.isArray(course.books)&&course.books.length?course.books:null;
  const books=configured||Array.from({length:Math.ceil(stages.length/10)},(_,i)=>({
    id:"book-"+(i+1),
    title:"Book "+(i+1),
    subtitle:"Chapters "+(i*10+1)+"–"+Math.min(stages.length,(i+1)*10),
    chapterStart:i*10+1,
    chapterEnd:Math.min(stages.length,(i+1)*10)
  }));

  const lastRaw=Number(localStorage.getItem("developerJourney.lastStep.v1"));
  const lastStep=Number.isFinite(lastRaw)&&lastRaw>=1&&lastRaw<=totalSteps?lastRaw:1;
  let activeFilter="all";

  function stageForStep(stepNumber){
    const zero=Math.max(0,stepNumber-1);
    for(let i=stages.length-1;i>=0;i--) if(zero>=stepStarts[i]) return i;
    return 0;
  }

  function chapterRange(book){
    const start=Math.max(1,Number(book.chapterStart)||1);
    const end=Math.min(stages.length,Number(book.chapterEnd)||start);
    return {start,end};
  }

  function chapterIndices(book){
    const range=chapterRange(book),out=[];
    for(let c=range.start;c<=range.end;c++) if(stages[c-1])out.push(c-1);
    return out;
  }

  function bookStats(book){
    const indices=chapterIndices(book);
    return {
      indices,
      chapters:indices.length,
      steps:indices.reduce((sum,i)=>sum+(stages[i].steps||[]).length,0)
    };
  }

  function go(step){location.href="player.html?step="+Math.max(1,step);}

  function shortText(text,max=70){
    const s=String(text||"");
    return s.length>max?s.slice(0,max-1).trim()+"…":s;
  }

  function tagsForBook(book){
    const text=((book.title||"")+" "+(book.subtitle||"")).toLowerCase();
    const tags=[];
    if(text.includes("java"))tags.push("Java");
    if(text.includes("database")||text.includes("postgres")||text.includes("sql"))tags.push("Database");
    if(text.includes("linux"))tags.push("Linux");
    if(text.includes("delivery")||text.includes("jenkins"))tags.push("DevOps");
    if(text.includes("api"))tags.push("API");
    if(!tags.length)tags.push("Developer");
    return tags.slice(0,2);
  }

  const resumeStage=stageForStep(lastStep);

  $("bookCount").textContent=books.length;
  $("sidebarBookCount").textContent=books.length;
  $("chapterCount").textContent=stages.length;
  $("allChapterCount").textContent=stages.length;
  $("stepCount").textContent=totalSteps;
  $("continueBtn").textContent="Continue · Step "+lastStep;
  $("continueBtn").onclick=()=>go(lastStep);

  const filters=$("bookFilters");
  books.forEach((book,index)=>{
    const stats=bookStats(book);
    const btn=document.createElement("button");
    btn.className="book-filter";
    btn.type="button";
    btn.dataset.filter=String(index);
    btn.innerHTML="<span>"+escapeHtml(book.title||("Book "+(index+1)))+"</span><em>"+stats.chapters+"</em>";
    btn.onclick=()=>setFilter(String(index));
    filters.appendChild(btn);
  });

  document.querySelector('[data-filter="all"]').onclick=()=>setFilter("all");

  function setFilter(value){
    activeFilter=value;
    $("catalogSearch").value="";
    document.querySelectorAll(".side-filter,.book-filter").forEach(btn=>{
      btn.classList.toggle("active",btn.dataset.filter===value);
    });
    renderBooks();
  }

  $("catalogSearch").addEventListener("input",()=>{
    activeFilter="all";
    document.querySelectorAll(".side-filter,.book-filter").forEach(btn=>{
      btn.classList.toggle("active",btn.dataset.filter==="all");
    });
    renderBooks();
  });

  function chapterMatches(stage,query){
    if(!query)return true;
    return ((stage?.title||"")+" "+(stage?.subtitle||"")).toLowerCase().includes(query);
  }

  function matchingChapters(book,query){
    const indices=chapterIndices(book);
    if(!query)return indices;

    const direct=indices.filter(i=>chapterMatches(stages[i],query));
    if(direct.length)return direct;

    const bookText=((book.title||"")+" "+(book.subtitle||"")+" "+tagsForBook(book).join(" ")).toLowerCase();
    return bookText.includes(query)?indices:[];
  }

  function renderBooks(){
    const shelf=$("bookshelf");
    const query=$("catalogSearch").value.trim().toLowerCase();
    shelf.innerHTML="";
    let visible=0;

    books.forEach((book,index)=>{
      if(activeFilter!=="all"&&String(index)!==activeFilter)return;

      const stats=bookStats(book);
      const shownChapters=matchingChapters(book,query);
      if(query&&!shownChapters.length)return;

      visible++;
      const range=chapterRange(book);
      const card=document.createElement("article");
      card.className="book-card";
      const tags=tagsForBook(book).map(tag=>'<span class="tag">'+escapeHtml(tag)+'</span>').join("");

      card.innerHTML=
        '<div class="book-banner">'+
          '<span class="book-badge">Book '+(index+1)+'</span>'+
          '<h2>'+escapeHtml(shortText(book.title,42))+'</h2>'+
          '<p>Chapters '+range.start+'–'+range.end+' · '+stats.steps+' continuous steps</p>'+
          '<span class="book-art" aria-hidden="true"></span>'+
        '</div>'+
        '<div class="book-body">'+
          '<h3 class="book-title">'+escapeHtml(book.title||("Book "+(index+1)))+'</h3>'+
          '<div class="book-meta">'+stats.chapters+' chapters · '+stats.steps+' steps</div>'+
          '<div class="book-footer"><div class="book-tags">'+tags+'</div><button class="open-book" type="button" title="Start this book">↗</button></div>'+
        '</div>'+
        '<div class="book-chapters"></div>';

      const chapterBox=card.querySelector(".book-chapters");
      shownChapters.forEach(stageIndex=>{
        const stage=stages[stageIndex];
        const first=stepStarts[stageIndex]+1;
        const count=(stage.steps||[]).length;
        const last=first+count-1;
        const row=document.createElement("button");
        row.type="button";
        row.className="chapter-row";
        const resume=stageIndex===resumeStage?'<em class="resume">Resume</em>':'';
        row.innerHTML=
          '<strong>Ch '+(stageIndex+1)+' · '+escapeHtml(stage.title.replace(/^\d+:\s*/,""))+'</strong>'+
          '<span><i>Steps '+first+'–'+last+' · '+count+' steps</i>'+resume+'</span>';
        row.onclick=()=>go(first);
        chapterBox.appendChild(row);
      });

      card.querySelector(".open-book").onclick=()=>go(stepStarts[stats.indices[0]]+1);
      shelf.appendChild(card);
    });

    $("emptyState").classList.toggle("hidden",visible>0);
  }

  function escapeHtml(value){
    return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  renderBooks();
})();