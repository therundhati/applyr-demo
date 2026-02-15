const swipeScreen = document.getElementById("swipe-screen");
const dashboardScreen = document.getElementById("dashboard-screen");
const profileScreen = document.getElementById("profile-screen");

const cardStack = document.getElementById("card-stack");
const aiModal = document.getElementById("ai-modal");
const aiTextarea = document.getElementById("ai-textarea");
const aiAccept = document.getElementById("ai-accept");
const aiEdit = document.getElementById("ai-edit");
const aiReject = document.getElementById("ai-reject");

const aiPromptModal = document.getElementById("ai-prompt-modal");
const promptYes = document.getElementById("prompt-yes");
const promptNo = document.getElementById("prompt-no");
const promptCancel = document.getElementById("prompt-cancel");

const undoBtn = document.getElementById("undo-btn");

const appliedCountEl = document.getElementById("applied-count");
const skippedCountEl = document.getElementById("skipped-count");
const appliedList = document.getElementById("applied-list");
const skippedList = document.getElementById("skipped-list");
const dashboardBack = document.getElementById("dashboard-back");

const tabDashboard = document.getElementById("tab-dashboard");
const tabProfile = document.getElementById("tab-profile");
const tabPayment = document.getElementById("tab-payment");
const profileBack = document.getElementById("profile-back");

let appliedJobs = [];
let skippedJobs = [];
let cardElements = [];
let lastAction = null;
let currentJobPrompt = null;

// ---------------------------
// Render Cards
// ---------------------------
function createCard(job, index){
  const card = document.createElement("div");
  card.className="job-card";
  card.style.zIndex = jobs.length - index;
  card.innerHTML=`
    <h2>${job.title}</h2>
    <h3>${job.company} - ${job.location} (${job.source})</h3>
    <p>${job.description.replace(/\n/g,"<br>")}</p>
    <p class="perks">${job.perks.join(" | ")}</p>
    <div class="swipe-overlay green"></div>
    <div class="swipe-overlay red"></div>
  `;
  cardStack.appendChild(card);
  addDrag(card, job);
  cardElements.push(card);
}

function renderCards(){
  cardStack.innerHTML="";
  cardElements=[];
  jobs.forEach((job,i)=>createCard(job,i));
}

// ---------------------------
// Drag & Swipe
// ---------------------------
function addDrag(card,job){
  let startX,startY,isDragging=false,offsetX=0,offsetY=0;
  const green = card.querySelector(".swipe-overlay.green");
  const red = card.querySelector(".swipe-overlay.red");

  function onMove(e){
    if(!isDragging) return;
    const x = e.type.includes("mouse")? e.clientX:e.touches[0].clientX;
    const y = e.type.includes("mouse")? e.clientY:e.touches[0].clientY;
    offsetX = x - startX;
    offsetY = y - startY;
    card.style.transform = `translate(${offsetX}px,${offsetY}px) rotate(${offsetX/20}deg)`;
    green.style.opacity = offsetX>0?Math.min(offsetX/100,1):0;
    red.style.opacity = offsetX<0?Math.min(-offsetX/100,1):0;
  }

  function endDrag(){
    isDragging=false;
    document.removeEventListener("mousemove",onMove);
    document.removeEventListener("mouseup",endDrag);
    document.removeEventListener("touchmove",onMove);
    document.removeEventListener("touchend",endDrag);

    if(offsetX>100) swipeCard(card,job,"right");
    else if(offsetX<-100) swipeCard(card,job,"left");
    else card.style.transform="translate(0,0) rotate(0deg)";
    green.style.opacity=0; red.style.opacity=0;
  }

  function startDrag(e){
    isDragging=true;
    startX = e.type==="mousedown"? e.clientX:e.touches[0].clientX;
    startY = e.type==="mousedown"? e.clientY:e.touches[0].clientY;
    document.addEventListener("mousemove",onMove);
    document.addEventListener("mouseup",endDrag);
    document.addEventListener("touchmove",onMove);
    document.addEventListener("touchend",endDrag);
  }

  card.addEventListener("mousedown",startDrag);
  card.addEventListener("touchstart",startDrag);
}

// ---------------------------
// Swipe Actions
// ---------------------------
function swipeCard(card,job,direction){
  card.style.transition="transform 0.5s ease";
  card.style.transform = `translate(${direction==="right"?1000:-1000}px,0) rotate(${direction==="right"?20:-20}deg)`;
  setTimeout(()=>card.remove(),500);
  lastAction={job,direction};

  if(direction==="right"){
    if(job.coverLetterSuggestions && job.coverLetterSuggestions.length>0){
      showAIModal(job);
    } else if(job.askForCoverLetter){
      setTimeout(()=>showAIPrompt(job),50);
    } else appliedJobs.push(job);
  } else skippedJobs.push(job);
}

// ---------------------------
// AI Modals
// ---------------------------
function showAIModal(job,genText=null){
  aiModal.style.display="flex";
  aiTextarea.value = genText || (job.coverLetterSuggestions?job.coverLetterSuggestions[0]:"");
  aiAccept.onclick=()=>{
    appliedJobs.push(job); aiModal.style.display="none";
  }
  aiEdit.onclick=()=>{
    appliedJobs.push(job); aiModal.style.display="none";
  }
  aiReject.onclick=()=>{
    skippedJobs.push(job); aiModal.style.display="none";
  }
}

function showAIPrompt(job){
  currentJobPrompt = job;
  aiPromptModal.style.display="flex";
}

promptYes.onclick=()=>{
  if(!currentJobPrompt) return;
  aiPromptModal.style.display="none";
  showAIModal(currentJobPrompt,`Generated AI cover letter for ${currentJobPrompt.title} at ${currentJobPrompt.company}.`);
  currentJobPrompt=null;
}
promptNo.onclick=()=>{
  if(!currentJobPrompt) return;
  aiPromptModal.style.display="none";
  appliedJobs.push(currentJobPrompt);
  currentJobPrompt=null;
}
promptCancel.onclick=()=>{
  if(!currentJobPrompt) return;
  aiPromptModal.style.display="none";
  skippedJobs.push(currentJobPrompt);
  currentJobPrompt=null;
}

// ---------------------------
// Undo
// ---------------------------
undoBtn.onclick=()=>{
  if(!lastAction) return;
  const job = lastAction.job;
  if(lastAction.direction==="right") appliedJobs = appliedJobs.filter(j=>j!==job);
  else skippedJobs = skippedJobs.filter(j=>j!==job);
  createCard(job,0);
  lastAction=null;
}

// ---------------------------
// Bottom Tabs
// ---------------------------
tabDashboard.onclick=()=>{
  swipeScreen.classList.remove("active");
  dashboardScreen.classList.add("active");
  updateDashboard();
}
dashboardBack.onclick=()=>{
  dashboardScreen.classList.remove("active");
  swipeScreen.classList.add("active");
}
tabProfile.onclick=()=>{
  swipeScreen.classList.remove("active");
  profileScreen.classList.add("active");
}
profileBack.onclick=()=>{
  profileScreen.classList.remove("active");
  swipeScreen.classList.add("active");
}
tabPayment.onclick=()=>alert("Payment Plan: demo only");

// ---------------------------
// Dashboard
// ---------------------------
function deduplicate(arr){
  const seen=new Set();
  return arr.filter(j=>{
    const k = j.title+"|"+j.company+"|"+j.source;
    if(seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
function updateDashboard(){
  appliedJobs = deduplicate(appliedJobs);
  skippedJobs = deduplicate(skippedJobs);
  appliedCountEl.textContent=appliedJobs.length;
  skippedCountEl.textContent=skippedJobs.length;
  appliedList.innerHTML=appliedJobs.map(j=>`<li>${j.title} - ${j.company} (${j.source})</li>`).join("");
  skippedList.innerHTML=skippedJobs.map(j=>`<li>${j.title} - ${j.company} (${j.source})</li>`).join("");
}

// ---------------------------
// Init
// ---------------------------
renderCards();
