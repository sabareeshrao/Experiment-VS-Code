(() => {
  "use strict";
  const course=window.COURSE||{stages:[]};
  const stages=course.stages||[];
  const $=id=>document.getElementById(id);
  const stepStarts=[];
  let totalSteps=0;
  stages.forEach((stage,index)=>{stepStarts[index]=totalSteps;totalSteps+=(stage.steps||[]).length;});

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

  function go(step){ location.href="player.html?step="+Math.max(1,step); }

  $("bookCount").textContent=books.length;
  $("chapterCount").textContent=stages.length;
  $("stepCount").textContent=totalSteps;

  const currentStage=stageForStep(lastStep);
  const current=stages[currentStage];
  $("continueTitle").textContent=current?current.title.replace(/^\d+:\s*/,""):"Start the journey";
  $("continueMeta").textContent="Chapter "+(currentStage+1)+" · Step "+lastStep+" of "+totalSteps;
  $("continueBtn").onclick=()=>go(lastStep);

  const shelf=$("bookshelf");
  books.forEach((book,bookIndex)=>{
    const range=chapterRange(book);
    const chapterIndices=[];
    for(let chapter=range.start;chapter<=range.end;chapter++) if(stages[chapter-1]) chapterIndices.push(chapter-1);
    const bookSteps=chapterIndices.reduce((sum,i)=>sum+(stages[i].steps||[]).length,0);
    const containsCurrent=chapterIndices.includes(currentStage);

    const article=document.createElement("article");
    article.className="book"+(containsCurrent?" open":"");
    article.innerHTML=
      '<button class="book-cover" type="button" aria-expanded="'+(containsCurrent?"true":"false")+'">'+
        '<div class="book-visual"><span class="book-number">'+String(bookIndex+1).padStart(2,"0")+'</span></div>'+
        '<div class="book-info">'+
          '<span class="book-label">BOOK '+(bookIndex+1)+'</span>'+
          '<h3>'+escapeHtml(book.title||("Book "+(bookIndex+1)))+'</h3>'+
          '<p>'+escapeHtml(book.subtitle||("Chapters "+range.start+"–"+range.end))+'</p>'+
          '<div class="book-meta"><span>'+chapterIndices.length+' chapters</span><span>'+bookSteps+' steps</span></div>'+
        '</div>'+
        '<span class="book-chevron">⌄</span>'+
      '</button>'+
      '<div class="book-details"></div>';

    const cover=article.querySelector(".book-cover");
    const details=article.querySelector(".book-details");
    cover.onclick=()=>{
      const open=article.classList.toggle("open");
      cover.setAttribute("aria-expanded",String(open));
    };

    chapterIndices.forEach(stageIndex=>{
      const stage=stages[stageIndex];
      const first=stepStarts[stageIndex]+1;
      const count=(stage.steps||[]).length;
      const last=first+count-1;
      const btn=document.createElement("button");
      btn.type="button";
      btn.className="chapter"+(stageIndex===currentStage?" current":"");
      btn.innerHTML=
        '<span class="chapter-number">CH '+(stageIndex+1)+'</span>'+
        '<span class="chapter-title">'+escapeHtml(stage.title.replace(/^\d+:\s*/,""))+
          '<span class="chapter-sub">Global steps '+first+'–'+last+'</span></span>'+
        '<span class="chapter-steps">'+count+' steps →</span>';
      btn.onclick=()=>go(first);
      details.appendChild(btn);
    });

    shelf.appendChild(article);
  });

  function escapeHtml(value){
    return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }
})();
