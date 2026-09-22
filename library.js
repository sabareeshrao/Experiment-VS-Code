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
  let selectedBook=-1;

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
    for(let c=range.start;c<=range.end;c++) if(stages[c-1]) out.push(c-1);
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

  const currentStage=stageForStep(lastStep);

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
    document.querySelectorAll(".side-filter,.book-filter").forEach(btn=>btn.classList.toggle("active",btn.dataset.filter===value));
    renderBooks();
  }

  $("catalogSearch").addEventListener("input",renderBooks);

  function matchesBook(book,index,query){
    if(activeFilter!=="all"&&String(index)!==activeFilter)return false;
    if(!query)return true;
    const stagesText=chapterIndices(book).map(i=>stages[i]?.title||"").join(" ");
    return ((book.title||"")+" "+(book.subtitle||"")+" "+stagesText).toLowerCase().includes(query);
  }

  function renderBooks(){
    const shelf=$("bookshelf");
    const query=$("catalogSearch").value.trim().toLowerCase();
    shelf.innerHTML="";
    let visible=0;

    books.forEach((book,index)=>{
      if(!matchesBook(book,index,query))return;
      visible++;
      const stats=bookStats(book);
      const range=chapterRange(book);
      const card=document.createElement("article");
      card.className="book-card"+(selectedBook===index?" selected":"");
      const tags=tagsForBook(book).map(tag=>'<span class="tag">'+escapeHtml(tag)+'</span>').join("");

      card.innerHTML=
        '<div class="book-banner" role="button" tabindex="0">'+
          '<span class="book-badge">Book '+(index+1)+'</span>'+
          '<h2>'+escapeHtml(shortText(book.title,42))+'</h2>'+
          '<p>Chapters '+range.start+'–'+range.end+' · '+stats.steps+' continuous steps</p>'+
          '<span class="book-art" aria-hidden="true"></span>'+
        '</div>'+
        '<div class="book-body">'+
          '<h3 class="book-title">'+escapeHtml(book.title||("Book "+(index+1)))+'</h3>'+
          '<div class="book-meta">'+stats.chapters+' chapters · '+stats.steps+' steps</div>'+
          '<div class="book-footer"><div class="book-tags">'+tags+'</div><button class="open-book" type="button" title="Open chapters">↗</button></div>'+
        '</div>';

      const open=()=>selectBook(index);
      card.querySelector(".book-banner").onclick=open;
      card.querySelector(".book-banner").onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}};
      card.querySelector(".open-book").onclick=open;
      shelf.appendChild(card);
    });

    $("emptyState").classList.toggle("hidden",visible>0);
  }

  function selectBook(index){
    selectedBook=index;
    const book=books[index];
    const stats=bookStats(book);
    const panel=$("selectedBookPanel");
    panel.classList.remove("hidden");
    panel.innerHTML=
      '<div class="selected-head">'+
        '<div class="selected-title"><small>Book '+(index+1)+' · '+stats.chapters+' chapters</small><h2>'+escapeHtml(book.title||("Book "+(index+1)))+'</h2></div>'+
        '<button class="close-panel" type="button" aria-label="Close chapter list">×</button>'+
      '</div>'+
      '<div class="chapter-grid"></div>';

    const grid=panel.querySelector(".chapter-grid");
    stats.indices.forEach(stageIndex=>{
      const stage=stages[stageIndex];
      const first=stepStarts[stageIndex]+1;
      const count=(stage.steps||[]).length;
      const last=first+count-1;
      const btn=document.createElement("button");
      btn.type="button";
      btn.className="chapter-row"+(stageIndex===currentStage?" current":"");
      btn.innerHTML='<strong>Ch '+(stageIndex+1)+' · '+escapeHtml(stage.title.replace(/^\d+:\s*/,""))+'</strong><span>Steps '+first+'–'+last+' · '+count+' steps</span>';
      btn.onclick=()=>go(first);
      grid.appendChild(btn);
    });

    panel.querySelector(".close-panel").onclick=()=>{
      selectedBook=-1;
      panel.classList.add("hidden");
      renderBooks();
    };

    renderBooks();
    panel.scrollIntoView({block:"nearest",behavior:"smooth"});
  }

  function escapeHtml(value){
    return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }

  renderBooks();
})();