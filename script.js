/****************************************************
 * ============  STUDENT OS — FINAL CLEAN SCRIPT  =========
 * - No duplicates
 * - Works with your HTML
 * - App-like Home ↔ Profile switching
 * - Student Dashboard
 * - Admin panel with LocalStorage save
 * - Tracks opened materials
 * - Google login support
 ****************************************************/

/* ================= DEFAULT DATA ================= */

const defaultData = {
  "1": {
    "Chemistry": {
      notes: "https://drive.google.com/drive/folders/1YkGnUUEm1QwP8A258wwwir4KkKRYVEhQ?usp=drive_link",
      pyqs: "",
      syllabus: ""
    },
    "M1": { notes: "", pyqs: "", syllabus: "" },
    "English for Communication": { notes: "", pyqs: "", syllabus: "" },
    "Basic Electrical & Electronics Engineering": { notes: "", pyqs: "", syllabus: "" },
    "Engineering Drawing": { notes: "", pyqs: "", syllabus: "" }
  },

  "3": {
    "Discrete Mathematics": {
      notes: "https://drive.google.com/drive/folders/1Z8U2IaluGHGV3CkiYlqq5oKK_y1NYFoW?usp=drive_link",
      pyqs: "https://drive.google.com/drive/folders/1WqMEYLj1oeJjo-t0PXgC30gxTb6VYGHa?usp=drive_link",
      syllabus: ""
    },
    "DSA": {
      notes: "https://drive.google.com/drive/folders/1P2xL4HBrCTkS7M_F5HErfkTHZgqAQQma?usp=drive_link",
      pyqs: "https://drive.google.com/drive/folders/1LDuDsBJ6ONqr9tFUrmHaO8uIwC6-2ZuI?usp=drive_link",
      syllabus: ""
    },
    "EEE": {
      notes: "https://drive.google.com/drive/folders/1ZQ6QoaLmGiZvaIbCaY6LwpcTlxweEqI7?usp=drive_link",
      pyqs: "https://drive.google.com/drive/folders/12FtuXxGJKQJXWsXGVfb2uVSuelyLzzLh?usp=drive_link",
      syllabus: ""
    },
    "Digital System": {
      notes: "https://drive.google.com/drive/folders/10lYhVryrHRTU7wcHVhlNzkIR9XKvjim0?usp=drive_link",
      pyqs: "https://drive.google.com/drive/folders/1LaTLi_9iU6tPJKV6oLe9J97c8Mpo8KT2?usp=drive_link",
      syllabus: ""
    },
    "OOPM": {
      notes: "https://drive.google.com/drive/folders/16ZVPO38l6EVrp_lesQWkfxIOvgXmKb4m?usp=drive_link",
      pyqs: "https://drive.google.com/drive/folders/1KHBfLUKwdBMg8qyxY0qXUITU8fQljDlb?usp=drive_link",
      syllabus: ""
    }
  }
};

/* ================= LOCAL STORAGE DB ================= */

const STORAGE_KEY = "studentOS_data";
let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;

function saveDB() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ================= DOM ELEMENTS ================= */

const semesterSelect = document.getElementById("semester");
const subjectSelect = document.getElementById("subject");
const chipBox = document.getElementById("chipContainer");
const homeScreen = document.getElementById("homeScreen");
const profileScreen = document.getElementById("profile");
const homeNav = document.getElementById("homeNav");
const profileNav = document.getElementById("profileNav");

/* ================= UTIL ================= */

function isLink(url) {
  return url && url.startsWith("http");
}

/* ================= LOAD SUBJECTS ================= */

function loadSubjects() {
  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  chipBox.innerHTML = "";

  const semester = semesterSelect.value;
  const showAvailableOnly = document.getElementById("availableOnly").checked;

  if (!semester || !data[semester]) return;

  Object.keys(data[semester]).forEach(subject => {
    const materials = data[semester][subject];
    const hasAny = Object.values(materials).some(isLink);

    if (showAvailableOnly && !hasAny) return;

    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
  });
}

/* ================= STATUS CHIPS ================= */

function renderChips(materials) {
  chipBox.innerHTML = "";

  let added = false;

  if (isLink(materials.notes)) {
    chipBox.innerHTML +=
      `<div class="status-chip chip-notes">✅ Notes Available</div>`;
    added = true;
  }

  if (isLink(materials.pyqs)) {
    chipBox.innerHTML +=
      `<div class="status-chip chip-pyqs">📄 PYQs Available</div>`;
    added = true;
  }

  if (!added) {
    chipBox.innerHTML =
      `<div class="status-chip chip-coming">⏳ Coming Soon</div>`;
  }
}

subjectSelect.addEventListener("change", () => {
  const sem = semesterSelect.value;
  const sub = subjectSelect.value;

  if (!sem || !sub) {
    chipBox.innerHTML = "";
    return;
  }

  renderChips(data[sem][sub]);
});

/* ================= OPEN STUDY PACK + TRACK ================= */

function openStudyPack() {
  const sem = semesterSelect.value;
  const sub = subjectSelect.value;
  const material = document.getElementById("material").value;

  if (!sem || !sub || !material) {
    alert("Please select Semester, Subject & Material");
    return;
  }

  const link = data[sem]?.[sub]?.[material];

  if (!isLink(link)) {
    alert("This material is not uploaded yet.");
    return;
  }

  window.open(link, "_blank");

  trackOpen(sem, sub, material);
  trackGlobalOpen();

}

function trackOpen(sem, sub, material) {
  let count = Number(localStorage.getItem("openedCount") || 0);
  count++;
  localStorage.setItem("openedCount", count);

  let recent = JSON.parse(localStorage.getItem("recentActivity") || "[]");
  recent.unshift(`Opened ${material} of ${sub} (Sem ${sem})`);

  if (recent.length > 5) recent.pop();

  localStorage.setItem("recentActivity", JSON.stringify(recent));
}

/* ================= GOOGLE LOGIN ================= */

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

function handleCredentialResponse(response) {
  const user = JSON.parse(atob(response.credential.split(".")[1]));

  localStorage.setItem("studentName", user.name);
  localStorage.setItem("studentEmail", user.email);

  showUser();
  checkAdmin();
}

function showUser() {
  const name = localStorage.getItem("studentName");
  const email = localStorage.getItem("studentEmail");

  if (name) {
    loginBtn.style.display = "none";
    userInfo.style.display = "block";
    document.getElementById("userName").textContent = name;
    document.getElementById("userEmail").textContent = email;
  }
}

loginBtn.addEventListener("click", () => {
  google.accounts.id.prompt();
});

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

/* ================= ADMIN PANEL ================= */

function checkAdmin() {
  const email = localStorage.getItem("studentEmail");

  if (email === "kori626892@gmail.com") {
    document.getElementById("adminPanel").style.display = "block";
  }
}

function saveAdminData() {
  const sem = document.getElementById("adminSemester").value;
  const sub = document.getElementById("adminSubject").value.trim();
  const mat = document.getElementById("adminMaterial").value;
  const link = document.getElementById("adminLink").value.trim();

  if (!sem || !sub || !link) {
    alert("Fill all fields!");
    return;
  }

  if (!data[sem]) data[sem] = {};
  if (!data[sem][sub]) {
    data[sem][sub] = { notes: "", pyqs: "", syllabus: "" };
  }

  data[sem][sub][mat] = link;
  saveDB();

  document.getElementById("adminMsg").textContent =
    `✅ Saved: Sem ${sem} → ${sub} → ${mat}`;

  loadSubjects();
}

/* ================= DASHBOARD ================= */

function showProfilePage() {
  document.getElementById("pName").textContent =
    localStorage.getItem("studentName") || "Not Logged In";

  document.getElementById("pEmail").textContent =
    localStorage.getItem("studentEmail") || "Not Logged In";

  document.getElementById("college").value =
    localStorage.getItem("college") || "";

  document.getElementById("branch").value =
    localStorage.getItem("branch") || "";

  document.getElementById("year").value =
    localStorage.getItem("year") || "";

  document.getElementById("statOpened").textContent =
    localStorage.getItem("openedCount") || 0;

  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  document.getElementById("statFav").textContent = favs.length;

  renderRecentActivity();
}

function renderRecentActivity() {
  const list = document.getElementById("recentList");
  list.innerHTML = "";

  const recent = JSON.parse(localStorage.getItem("recentActivity") || "[]");

  if (recent.length === 0) {
    list.innerHTML = "<li>No activity yet.</li>";
    return;
  }

  recent.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function saveProfile() {
  const college = document.getElementById("college").value.trim();
  const branch = document.getElementById("branch").value;
  const year = document.getElementById("year").value;

  if (!college || !branch || !year) {
    alert("Please fill all profile details!");
    return;
  }

  localStorage.setItem("college", college);
  localStorage.setItem("branch", branch);
  localStorage.setItem("year", year);

  document.getElementById("profileMsg").textContent =
    "✅ Profile saved successfully!";
}

/* ================= APP-LIKE SCREEN SWITCHING ================= */

function showHome() {
  homeScreen.classList.remove("hidden");
  profileScreen.classList.add("hidden");

  document.querySelectorAll(".nav-item")
    .forEach(i => i.classList.remove("active"));

  homeNav.classList.add("active");
}

function showProfile() {
  homeScreen.classList.add("hidden");
  profileScreen.classList.remove("hidden");

  document.querySelectorAll(".nav-item")
    .forEach(i => i.classList.remove("active"));

  profileNav.classList.add("active");

  showProfilePage();
}

homeNav.addEventListener("click", showHome);
profileNav.addEventListener("click", showProfile);

/* ================= INIT ================= */

window.onload = function () {
  google.accounts.id.initialize({
    client_id:
      "596258765969-gg9u20m1phalc6fhke70ur2mogdnqci9.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });

  showUser();
  checkAdmin();
  loadSubjects();
  showHome();      // start on Home screen
};

semesterSelect.addEventListener("change", loadSubjects);
document.getElementById("availableOnly")
  .addEventListener("change", loadSubjects);

  // ===== LIVE STUDENT COUNTER =====
function animateCounter() {
  let count = 30; // start from 30
  const target = 120; // pretend live users
  const el = document.getElementById("studentCount");

  const interval = setInterval(() => {
    if (count >= target) {
      el.textContent = target + "+";
      clearInterval(interval);
    } else {
      count += 2;
      el.textContent = count + "+";
    }
  }, 50);
}

// ===== SCROLL TO NOTES BUTTON =====
function scrollToNotes() {
  document.getElementById("notes").scrollIntoView({ behavior: "smooth" });
}

// Run counter on page load
window.addEventListener("load", animateCounter);

// ===== GLOBAL ANALYTICS =====

// Track site visits
function trackVisit() {
  let visits = Number(localStorage.getItem("totalVisits") || 0);
  visits++;
  localStorage.setItem("totalVisits", visits);
}

// Track total materials opened
function trackGlobalOpen() {
  let total = Number(localStorage.getItem("totalOpened") || 0);
  total++;
  localStorage.setItem("totalOpened", total);
}

// Load analytics in dashboard
function loadAnalytics() {
  document.getElementById("statVisits").textContent =
    localStorage.getItem("totalVisits") || 0;

  document.getElementById("statOpenedGlobal").textContent =
    localStorage.getItem("totalOpened") || 0;
}

// Call on every visit
window.addEventListener("load", () => {
  trackVisit();
});

function loadAdminAnalytics() {
  document.getElementById("adminVisits").textContent =
    localStorage.getItem("totalVisits") || 0;

  document.getElementById("adminOpened").textContent =
    localStorage.getItem("totalOpened") || 0;
}

// ===== USAGE CHARTS =====

// Track opens per semester
function trackSemOpen(sem) {
  let stats = JSON.parse(localStorage.getItem("semStats") || "{}");
  stats[sem] = (stats[sem] || 0) + 1;
  localStorage.setItem("semStats", JSON.stringify(stats));
}

// Track daily activity
function trackDaily() {
  const today = new Date().toISOString().slice(0, 10);
  let days = JSON.parse(localStorage.getItem("dailyActivity") || "{}");
  days[today] = (days[today] || 0) + 1;
  localStorage.setItem("dailyActivity", JSON.stringify(days));
}

// Modify your existing openStudyPack()
// Add inside openStudyPack() AFTER trackOpen():
trackSemOpen(sem);
trackDaily();

// ---- Render charts ----
function renderCharts() {
  renderSemChart();
  renderWeekChart();
}

function renderSemChart() {
  const stats = JSON.parse(localStorage.getItem("semStats") || "{}");
  const box = document.getElementById("semChart");
  box.innerHTML = "";

  for (let sem in stats) {
    const row = document.createElement("div");
    row.className = "bar-row";

    row.innerHTML = `
      <div class="bar-label">Sem ${sem}</div>
      <div class="bar" style="width:${Math.min(stats[sem]*10, 100)}%"></div>
      <span style="margin-left:6px; font-size:0.8rem;">${stats[sem]}</span>
    `;
    box.appendChild(row);
  }
}

function renderWeekChart() {
  const days = JSON.parse(localStorage.getItem("dailyActivity") || "{}");
  const box = document.getElementById("weekChart");
  box.innerHTML = "";

  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = days[key] || 0;

    const row = document.createElement("div");
    row.className = "bar-row";

    const label = d.toLocaleDateString("en-GB", { weekday: "short" });

    row.innerHTML = `
      <div class="bar-label">${label}</div>
      <div class="bar" style="width:${Math.min(count*20, 100)}%"></div>
      <span style="margin-left:6px; font-size:0.8rem;">${count}</span>
    `;
    box.appendChild(row);
  }
}

// Call charts when dashboard opens
const oldShowProfile = showProfilePage;
showProfilePage = function() {
  oldShowProfile();
  renderCharts();
};

// ===== LEADERBOARD (MOCK + REAL) =====

// Save contributor when admin adds link
function trackContributor(email) {
  let board = JSON.parse(localStorage.getItem("contributors") || "{}");
  board[email] = (board[email] || 0) + 1;
  localStorage.setItem("contributors", JSON.stringify(board));
}

// Add inside saveAdminData(), AFTER saveDB():
trackContributor(localStorage.getItem("studentEmail"));

// ---- Render leaderboard ----
function renderLeaderboard() {
  const contrib = JSON.parse(localStorage.getItem("contributors") || "{}");
  const users = JSON.parse(localStorage.getItem("userOpens") || "{}");

  // Top contributors
  const cList = document.getElementById("contribList");
  cList.innerHTML = "";

  Object.entries(contrib)
    .sort((a,b) => b[1]-a[1])
    .slice(0,5)
    .forEach(([email, count]) => {
      const li = document.createElement("li");
      li.textContent = `${email} — ${count} uploads`;
      cList.appendChild(li);
    });

  // Top users by opens
  const uList = document.getElementById("userList");
  uList.innerHTML = "";

  const myEmail = localStorage.getItem("studentEmail");
  let opens = Number(localStorage.getItem("openedCount") || 0);

  const li = document.createElement("li");
  li.textContent = `${myEmail} — ${opens} materials opened`;
  uList.appendChild(li);
}

// Hook into dashboard open
const oldDash = showProfilePage;
showProfilePage = function() {
  oldDash();
  renderCharts();
  renderLeaderboard();
};