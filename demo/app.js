let currentIndex = 0;
let appliedJobs = [];
let skippedJobs = [];

const container = document.getElementById("cardContainer");

function createCard(job, index) {
  const card = document.createElement("div");
  card.className = "card";
  card.style.zIndex = jobs.length - index;

  card.innerHTML = `
    <h2>${job.title}</h2>
    <p><strong>Company:</strong> ${job.company}</p>
    <p><strong>Location:</strong> ${job.location}</p>
    <p><strong>Source:</strong> ${job.source}</p>
    <p>${job.description}</p>
    <div>
      ${job.perks.map(p => `<span class="perk">${p}</span>`).join("")}
    </div>
  `;

  addSwipe(card, job);
  return card;
}

function loadCards() {
  container.innerHTML = "";
  for (let i = currentIndex; i < jobs.length; i++) {
    container.appendChild(createCard(jobs[i], i));
  }
}

function addSwipe(card, job) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  card.addEventListener("mousedown", startDrag);
  card.addEventListener("touchstart", startDrag);

  function startDrag(e) {
    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", drag);
    document.addEventListener("touchend", endDrag);
  }

  function drag(e) {
    if (!isDragging) return;
    currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX/15}deg)`;

    let intensity = Math.min(Math.abs(currentX) / 150, 1);
    if (currentX > 0) {
      card.style.backgroundColor = `rgba(34,197,94,${intensity * 0.35})`;
    } else {
      card.style.backgroundColor = `rgba(239,68,68,${intensity * 0.35})`;
    }
  }

  function endDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("touchend", endDrag);

    if (currentX > 120) {
      handleDecision(job, "right");
    } else if (currentX < -120) {
      handleDecision(job, "left");
    } else {
      card.style.transform = "";
      card.style.backgroundColor = "";
    }
  }
}

function handleDecision(job, direction) {
  if (direction === "right") {
    if (job.coverLetterSuggestions || job.askForCoverLetter) {
      showModal(job);
      return;
    }
    appliedJobs.push(job);
  } else {
    skippedJobs.push(job);
  }

  currentIndex++;
  loadCards();
  updateDashboard();
}

function showModal(job) {
  const overlay = document.getElementById("modalOverlay");
  const text = document.getElementById("coverLetterText");

  text.value = job.coverLetterSuggestions?.[0] ||
    `Dear ${job.company},\n\nI am excited to apply for the ${job.title} position.\n\nSincerely,\nArundhati Dixit`;

  overlay.classList.remove("hidden");

  document.getElementById("applyWithout").onclick = () => {
    appliedJobs.push(job);
    closeModal();
  };

  document.getElementById("submitLetter").onclick = () => {
    appliedJobs.push(job);
    closeModal();
  };

  document.getElementById("modifyLetter").onclick = () => {
    text.value += "\n\n[AI refinement applied]";
  };
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
  currentIndex++;
  loadCards();
  updateDashboard();
}

function updateDashboard() {
  document.getElementById("appliedList").innerHTML =
    appliedJobs.map(j => `<li>${j.title}</li>`).join("");

  document.getElementById("skippedList").innerHTML =
    skippedJobs.map(j => `<li>${j.title}</li>`).join("");
}

function switchView(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");

  document.querySelectorAll(".bottom-nav button")
    .forEach(b => b.classList.remove("activeTab"));

  if (viewId === "jobsView") document.getElementById("jobsTab").classList.add("activeTab");
  if (viewId === "dashboardView") document.getElementById("dashboardTab").classList.add("activeTab");
  if (viewId === "profileView") document.getElementById("profileTab").classList.add("activeTab");
}

loadCards();
