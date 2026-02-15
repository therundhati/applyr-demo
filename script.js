const jobs = [
  {title:"Software Engineer", company:"TechCorp", location:"Remote", description:"Work on AI products.", coverLetter:null, aiVersions:["I am excited to apply for Software Engineer at TechCorp."]},
  {title:"Data Analyst", company:"DataInc", location:"New York, NY", description:"Analyze business data.", coverLetter:null, aiVersions:["Looking forward to contributing as a Data Analyst at DataInc."]},
  {title:"Product Manager", company:"InnovateX", location:"San Francisco, CA", description:"Lead product development.", coverLetter:"Ready to lead innovative products at InnovateX.", aiVersions:["Excited to join InnovateX as Product Manager."]}
];

let index = 0;
let applied = [];

const cardContainer = document.getElementById("job-card-container");
const aiPopup = document.getElementById("ai-popup");
const aiText = document.getElementById("ai-text");
const aiEdit = document.getElementById("ai-edit");
const summary = document.getElementById("summary");
const appliedList = document.getElementById("applied-list");

function showJob() {
  if(index >= jobs.length) {
    cardContainer.innerHTML = "";
    summary.classList.remove("hidden");
    applied.forEach(j => {
      const li = document.createElement("li");
      li.textContent = `${j.title} @ ${j.company}`;
      appliedList.appendChild(li);
    });
    return;
  }
  const job = jobs[index];
  cardContainer.innerHTML = `
    <div class="job-card">
      <h3>${job.title} @ ${job.company}</h3>
      <p><strong>Location:</strong> ${job.location}</p>
      <p>${job.description}</p>
    </div>`;
}

function showAI(job) {
  aiText.textContent = job.coverLetter || job.aiVersions[0];
  aiPopup.classList.remove("hidden");
}

document.getElementById("apply-btn").onclick = () => {
  const job = jobs[index];
  if(!job.coverLetter) {
    showAI(job);
  } else {
    applied.push(job);
    index++;
    showJob();
  }
};

document.getElementById("skip-btn").onclick = () => {
  index++;
  showJob();
};

document.getElementById("accept-btn").onclick = () => {
  jobs[index].coverLetter = aiText.textContent;
  applied.push(jobs[index]);
  aiPopup.classList.add("hidden");
  index++;
  showJob();
};

document.getElementById("edit-btn").onclick = () => {
  aiEdit.value = aiText.textContent;
  aiEdit.classList.remove("hidden");
  aiText.classList.add("hidden");
};

document.getElementById("reject-btn").onclick = () => {
  aiPopup.classList.add("hidden");
  index++;
  showJob();
};

// initialize first card
showJob();
