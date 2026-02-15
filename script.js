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

const dashboardOverlay = document.getElementById("dashboard-overlay");
const dashboardClose = document.getElementById("dashboard-close");
const statsEl = document.getElementById("stats");
const appliedList = document.getElementById("applied-list");

const undoBtn = document.getElementById("undo-btn");

let appliedJobs = [];
let skippedJobs = [];
let cardElements = [];
let currentIndex = 0;
let lastAction = null; // store last swipe

function createCard(job, index) {
  const card = document.createElement("div");
  card.className = "job-card";
  card.style.zIndex = jobs.length - index;
  card.innerHTML = `
    <h2>${job.title}</h2>
    <h3>${job.company} - ${job.location} (${job.source})</h3>
    <p>${job.description.replace(/\n/g,'<br>')}</p>
    <p class="perks">${job.perks.join(" | ")}</p>
  `;
  cardStack.appendChild(card);
  addDragListeners(card, job);
  cardElements.push(card);
}

function renderCards() {
  jobs.forEach((job, i) => createCard(job, i));
}

function addDragListeners(card, job) {
  let offsetX = 0, offsetY = 0, startX, startY, isDragging = false;

  card.addEventListener("mousedown", startDrag);
  card.addEventListener("touchstart", startDrag);

  function startDrag(e) {
    isDragging = true;
    startX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
    startY = e.type === "mousedown" ? e.clientY : e.touches[0].clientY;
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", endDrag);
  }

  function onDrag(e) {
    if (!isDragging) return;
    const x = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    const y = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
    offsetX = x - startX;
    offsetY = y - startY;
    const rotate = offsetX / 20;
    card.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
  }

  function endDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("touchend", endDrag);

    if (offsetX > 100) {
      handleSwipe(card, job, "right");
    } else if (offsetX < -100) {
      handleSwipe(card, job, "left");
    } else {
      card.style.transform = "translate(0px,0px) rotate(0deg)";
    }
  }
}

function handleSwipe(card, job, direction) {
  const flyX = direction === "right" ? 1000 : -1000;
  card.style.transition = "transform 0.5s ease";
  card.style.transform = `translate(${flyX}px, 0px) rotate(${direction === "right" ? 20 : -20}deg)`;

  setTimeout(() => card.remove(), 500);

  lastAction = {job, direction};
  
  if (direction === "right") {
    if (job.coverLetterSuggestions) {
      showAIModal(job);
    } else {
      showAIPrompt(job);
    }
  } else {
    skippedJobs.push(job);
  }
}

function showAIModal(job, generatedText=null) {
  aiModal.classList.remove("hidden");
  aiTextarea.value = generatedText || job.coverLetterSuggestions[0];
  
  aiAccept.onclick = () => {
    appliedJobs.push(job);
    aiModal.classList.add("hidden");
  };

  aiEdit.onclick = () => {
    appliedJobs.push(job);
    aiModal.classList.add("hidden");
  };

  aiReject.onclick = () => {
    skippedJobs.push(job);
    aiModal.classList.add("hidden");
  };
}

function showAIPrompt(job) {
  aiPromptModal.classList.remove("hidden");
  
  promptYes.onclick = () => {
    aiPromptModal.classList.add("hidden");
    // generate dummy AI suggestion
    showAIModal(job, `Generated AI cover letter for ${job.title} at ${job.company}.`);
  };

  promptNo.onclick = () => {
    aiPromptModal.classList.add("hidden");
    appliedJobs.push(job);
  };

  promptCancel.onclick = () => {
    aiPromptModal.classList.add("hidden");
    skippedJobs.push(job); // or could leave on top
  };
}

undoBtn.onclick = () => {
  if (!lastAction) return;
  const job = lastAction.job;
  if (lastAction.direction === "right") {
    appliedJobs = appliedJobs.filter(j => j !== job);
  } else {
    skippedJobs = skippedJobs.filter(j => j !== job);
  }
  createCard(job, 0); // restore on top
  lastAction = null;
};

document.getElementById("tab-dashboard").onclick = () => {
  dashboardOverlay.classList.remove("hidden");
  statsEl.textContent = `Applied: ${appliedJobs.length} | Skipped: ${skippedJobs.length}`;
  appliedList.innerHTML = appliedJobs.map(j => `<li>${j.title} - ${j.company} (${j.source})</li>`).join("");
};

dashboardClose.onclick = () => {
  dashboardOverlay.classList.add("hidden");
};

// Profile and Payment Plan demo buttons
document.getElementById("tab-profile").onclick = () => alert("Profile: Upload resume / prefill attributes (demo only)");
document.getElementById("tab-payment").onclick = () => alert("Payment Plan: Demo option only");

renderCards();
