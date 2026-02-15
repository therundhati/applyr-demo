// =========================
// Applyr Demo Script.js
// =========================

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {

  // --- DOM Elements ---
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

  // Dashboard
  const appliedCountEl = document.getElementById("applied-count");
  const skippedCountEl = document.getElementById("skipped-count");
  const appliedList = document.getElementById("applied-list");
  const skippedList = document.getElementById("skipped-list");
  const dashboardBack = document.getElementById("dashboard-back");

  // Tabs
  const tabDashboard = document.getElementById("tab-dashboard");
  const tabProfile = document.getElementById("tab-profile");
  const tabPayment = document.getElementById("tab-payment");
  const profileBack = document.getElementById("profile-back");

  // --- State ---
  let appliedJobs = [];
  let skippedJobs = [];
  let cardElements = [];
  let lastAction = null;
  let currentJobPrompt = null;

  // --- Ensure modals hidden on load ---
  aiModal.classList.add("hidden");
  aiPromptModal.classList.add("hidden");
  currentJobPrompt = null;

  // =========================
  // Render Cards
  // =========================
  function createCard(job, index) {
    const card = document.createElement("div");
    card.className = "job-card";
    card.style.zIndex = jobs.length - index;
    card.innerHTML = `
      <h2>${job.title}</h2>
      <h3>${job.company} - ${job.location} (${job.source})</h3>
      <p>${job.description.replace(/\n/g, "<br>")}</p>
      <p class="perks">${job.perks.join(" | ")}</p>
      <div class="swipe-overlay green"></div>
      <div class="swipe-overlay red"></div>
    `;
    cardStack.appendChild(card);
    addDragListeners(card, job);
    cardElements.push(card);
  }

  function renderCards() {
    cardStack.innerHTML = "";
    cardElements = [];
    jobs.forEach((job, i) => createCard(job, i));
  }

  // =========================
  // Drag & Swipe Logic
  // =========================
  function addDragListeners(card, job) {
    let offsetX = 0,
      offsetY = 0,
      startX,
      startY,
      isDragging = false;

    const greenOverlay = card.querySelector(".swipe-overlay.green");
    const redOverlay = card.querySelector(".swipe-overlay.red");

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

      const threshold = 100;
      if (offsetX > 0) {
        if (greenOverlay) greenOverlay.style.opacity = Math.min(offsetX / threshold, 1);
        if (redOverlay) redOverlay.style.opacity = 0;
      } else if (offsetX < 0) {
        if (redOverlay) redOverlay.style.opacity = Math.min(Math.abs(offsetX) / threshold, 1);
        if (greenOverlay) greenOverlay.style.opacity = 0;
      } else {
        if (redOverlay) redOverlay.style.opacity = 0;
        if (greenOverlay) greenOverlay.style.opacity = 0;
      }
    }

    function endDrag() {
      isDragging = false;
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchmove", onDrag);
      document.removeEventListener("touchend", endDrag);

      const threshold = 100;
      if (offsetX > threshold) handleSwipe(card, job, "right");
      else if (offsetX < -threshold) handleSwipe(card, job, "left");
      else card.style.transform = "translate(0px,0px) rotate(0deg)";

      if (greenOverlay) greenOverlay.style.opacity = 0;
      if (redOverlay) redOverlay.style.opacity = 0;
    }
  }

  // =========================
  // Swipe Handling
  // =========================
  function handleSwipe(card, job, direction) {
    const flyX = direction === "right" ? 1000 : -1000;
    card.style.transition = "transform 0.5s ease";
    card.style.transform = `translate(${flyX}px,0) rotate(${direction === "right" ? 20 : -20}deg)`;

    setTimeout(() => card.remove(), 500);
    lastAction = { job, direction };

    if (direction === "right") {
      if (job.coverLetterSuggestions && job.coverLetterSuggestions.length > 0) {
        showAIModal(job);
      } else if (job.askForCoverLetter) {
        // Only trigger AI prompt after swipe
        setTimeout(() => showAIPrompt(job), 50);
      } else {
        appliedJobs.push(job);
      }
    } else {
      skippedJobs.push(job);
    }
  }

  // =========================
  // AI Modal
  // =========================
  function showAIModal(job, generatedText = null) {
    aiModal.classList.remove("hidden");
    aiTextarea.value = generatedText || (job.coverLetterSuggestions ? job.coverLetterSuggestions[0] : "");

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

  // =========================
  // AI Prompt Modal
  // =========================
  function showAIPrompt(job) {
    currentJobPrompt = job;
    aiPromptModal.classList.remove("hidden");
  }

  promptYes.addEventListener("click", () => {
    if (!currentJobPrompt) return;
    aiPromptModal.classList.add("hidden");
    showAIModal(
      currentJobPrompt,
      `Generated AI cover letter for ${currentJobPrompt.title} at ${currentJobPrompt.company}.`
    );
    currentJobPrompt = null;
  });

  promptNo.addEventListener("click", () => {
    if (!currentJobPrompt) return;
    aiPromptModal.classList.add("hidden");
    appliedJobs.push(currentJobPrompt);
    currentJobPrompt = null;
  });

  promptCancel.addEventListener("click", () => {
    if (!currentJobPrompt) return;
    aiPromptModal.classList.add("hidden");
    skippedJobs.push(currentJobPrompt);
    currentJobPrompt = null;
  });

  // =========================
  // Undo
  // =========================
  undoBtn.onclick = () => {
    if (!lastAction) return;
    const job = lastAction.job;
    if (lastAction.direction === "right") appliedJobs = appliedJobs.filter((j) => j !== job);
    else skippedJobs = skippedJobs.filter((j) => j !== job);
    createCard(job, 0);
    lastAction = null;
  };

  // =========================
  // Bottom Tabs
  // =========================
  tabDashboard.onclick = () => {
    swipeScreen.classList.remove("active");
    dashboardScreen.classList.add("active");
    updateDashboard();
  };
  dashboardBack.onclick = () => {
    dashboardScreen.classList.remove("active");
    swipeScreen.classList.add("active");
  };
  tabProfile.onclick = () => {
    swipeScreen.classList.remove("active");
    profileScreen.classList.add("active");
  };
  profileBack.onclick = () => {
    profileScreen.classList.remove("active");
    swipeScreen.classList.add("active");
  };
  tabPayment.onclick = () => alert("Payment Plan: demo only");

  // =========================
  // Dashboard Update
  // =========================
  function deduplicateJobs(jobsArray) {
    const seen = new Set();
    return jobsArray.filter((job) => {
      const key = job.title + "|" + job.company + "|" + job.source;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function updateDashboard() {
    appliedJobs = deduplicateJobs(appliedJobs);
    skippedJobs = deduplicateJobs(skippedJobs);

    appliedCountEl.textContent = appliedJobs.length;
    skippedCountEl.textContent = skippedJobs.length;

    appliedList.innerHTML = appliedJobs
      .map((j) => `<li>${j.title} - ${j.company} (${j.source})</li>`)
      .join("");
    skippedList.innerHTML = skippedJobs
      .map((j) => `<li>${j.title} - ${j.company} (${j.source})</li>`)
      .join("");
  }

  // =========================
  // Initialize Demo
  // =========================
  renderCards();
  swipeScreen.classList.add("active");

});
