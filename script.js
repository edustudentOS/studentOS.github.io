
const data = {
  "1": {
    "Chemistry": {
      notes: "https://drive.google.com/drive/folders/1YkGnUUEm1QwP8A258wwwir4KkKRYVEhQ?usp=drive_link",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
        "M1": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
        "English for Communication": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
        "Basic Electrical & Electronics Engineering ": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
    "Engineering Drawing": {
      notes: "JAVA_NOTES",
      pyqs: "JAVA_PYQS",
      syllabus: "JAVA_SYLLABUS"
    }
  },
  "2": {
    "cn": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
        "cn": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
        "cn": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
        "cn": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
    "java": {
      notes: "JAVA_NOTES",
      pyqs: "JAVA_PYQS",
      syllabus: "JAVA_SYLLABUS"
    }
  },
  "3": {
    "Discrete Mathematics": {
      notes: "https://drive.google.com/drive/folders/1Z8U2IaluGHGV3CkiYlqq5oKK_y1NYFoW?usp=drive_link",
      pyqs: "https://drive.google.com/drive/folders/1WqMEYLj1oeJjo-t0PXgC30gxTb6VYGHa?usp=drive_link",
      syllabus: "https://drive.google.com/drive/folders/M2_SYLLABUS"
    },
    "dsa": {
      notes: "https://drive.google.com/drive/folders/1P2xL4HBrCTkS7M_F5HErfkTHZgqAQQma?usp=drive_link",
      pyqs: "https://drive.google.com/drive/folders/1LDuDsBJ6ONqr9tFUrmHaO8uIwC6-2ZuI?usp=drive_link",
      syllabus: "DSA_SYLLABUS"
    },
    "EEEs": {
      notes: "https://drive.google.com/drive/folders/1ZQ6QoaLmGiZvaIbCaY6LwpcTlxweEqI7?usp=drive_link",
      pyqs: "https://drive.google.com/drive/folders/12FtuXxGJKQJXWsXGVfb2uVSuelyLzzLh?usp=drive_link",
      syllabus: "DBMS_SYLLABUS"
    },
    "Digital System": {
      notes: "https://drive.google.com/drive/folders/10lYhVryrHRTU7wcHVhlNzkIR9XKvjim0?usp=drive_link",
      pyqs: "https://drive.google.com/drive/folders/1LaTLi_9iU6tPJKV6oLe9J97c8Mpo8KT2?usp=drive_link",
      syllabus: "CN_SYLLABUS"
    },
    "OOPM": {
      notes: "https://drive.google.com/drive/folders/16ZVPO38l6EVrp_lesQWkfxIOvgXmKb4m?usp=drive_link",
      pyqs: "https://drive.google.com/drive/folders/1KHBfLUKwdBMg8qyxY0qXUITU8fQljDlb?usp=drive_link",
      syllabus: "CN_SYLLABUS"
    }
  },
  "4": {
    "cn": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
        "cn": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
        "cn": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
        "cn": {
      notes: "CN_NOTES",
      pyqs: "CN_PYQS",
      syllabus: "CN_SYLLABUS"
    },
    "java": {
      notes: "JAVA_NOTES",
      pyqs: "JAVA_PYQS",
      syllabus: "JAVA_SYLLABUS"
    }
  }
};

const semesterSelect = document.getElementById("semester");
const subjectSelect = document.getElementById("subject");

semesterSelect.addEventListener("change", loadSubjects);


function getBadges(materials) {
  const badges = [];

  if (materials.notes && materials.notes.startsWith("http"))
    badges.push("🟢 Notes");

  if (materials.pyqs && materials.pyqs.startsWith("http"))
    badges.push("🟡 PYQs");

  if (badges.length === 0)
    badges.push("🔴 Coming Soon");

  return " — " + badges.join(" | ");
}

//------------ LOAD SUBJECT BY SEMESTER-----
function loadSubjects() {
  subjectSelect.innerHTML = '<option value="">Select Subject</option>';

  document.getElementsByID("chipContainer").innerHTML="";

  const semester = semesterSelect.value;
  const showAvailableOnly = document.getElementById("availableOnly").checked;

  if (!semester || !data[semester]) return;

  Object.keys(data[semester]).forEach(subject => {
    const materials = data[semester][subject];

    let hasAny = false;
    for (let key in materials) {
      if (materials[key] && materials[key].startsWith("http")) {
        hasAny = true;
        break;
      }
    }

    if (showAvailableOnly && !hasAny) return;

    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject + getBadges(materials);
    subjectSelect.appendChild(option);
  });
}

semesterSelect.addEventListener("change", loadSubjects);
document.getElementById("availableOnly").addEventListener("change", loadSubjects);


///-------- Chips --------

function renderChips(materials) {
  const chipBox = document.getElementById("chipContainer");
  chipBox.innerHTML = "";

  let added = false;

  if (materials.notes && materials.notes.startsWith("http")) {
    const chip = document.createElement("div");
    chip.className = "status-chip chip-notes";
    chip.innerHTML = "✅ Notes Available";
    chipBox.appendChild(chip);
    added = true;
  }

  if (materials.pyqs && materials.pyqs.startsWith("http")) {
    const chip = document.createElement("div");
    chip.className = "status-chip chip-pyqs";
    chip.innerHTML = "📄 PYQs Available";
    chipBox.appendChild(chip);
    added = true;
  }

  if (!added) {
    const chip = document.createElement("div");
    chip.className = "status-chip chip-coming";
    chip.innerHTML = "⏳ Coming Soon";
    chipBox.appendChild(chip);
  }
}

// Show chips when subject changes
subjectSelect.addEventListener("change", () => {
  const semester = semesterSelect.value;
  const subject = subjectSelect.value;

  if (!semester || !subject) {
    document.getElementById("chipContainer").innerHTML = "";
    return;
  }

  const materials = data[semester][subject];
  renderChips(materials);
});


//--------- Open study Pack
function openStudyPack() {
  const semester = semesterSelect.value;
  const subject = subjectSelect.value;
  const material = document.getElementById("material").value;

  if (!semester || !subject || !material) {
    alert("Please select Semester, Subject & Material");
    return;
  }

  const pack = data[semester]?.[subject]?.[material];

  if (!pack) {
    alert("This material is not uploaded yet.");
    return;
  }

  localStorage.setItem(
  "lastDownload",
  `${subject} - ${material} (Sem ${semester})`
);

updateDashboard();

  //---------FAVORITES BUTTON________
document.getElementById("favBtn").addEventListener("click", () => {
  const subject = subjectSelect.value;
  if (!subject) {
    alert("Select a subject first!");
    return;
  }

  let favs = JSON.parse(localStorage.getItem("favourites") || "[]");

  if (!favs.includes(subject)) {
    favs.push(subject);
    localStorage.setItem("favourites", JSON.stringify(favs));
    updateDashboard();
  } else {
    alert("Already in favourites!");
  }
});

// -------- DASHBOARD LOGIC --------
function updateDashboard() {
  const name = localStorage.getItem("studentName");
  const email = localStorage.getItem("studentEmail");

  if (!name) return;

  document.getElementById("dashboard").style.display = "block";
  document.getElementById("dashName").textContent = name;

  const sem = semesterSelect.value || "Not selected";
  document.getElementById("dashSem").textContent = sem;

  const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
  const favBox = document.getElementById("favList");
  favBox.innerHTML = "";

  favs.forEach(sub => {
    const chip = document.createElement("div");
    chip.textContent = "⭐ " + sub;
    chip.style.cssText =
      "background:#e0f2fe;padding:6px 10px;border-radius:999px;font-size:0.85rem;";
    favBox.appendChild(chip);
  });

  const last = localStorage.getItem("lastDownload") || "None";
  document.getElementById("lastDownload").textContent = last;
}


  // ---- NEW: Save last download ----
  localStorage.setItem(
    "lastDownload",
    `${subject} → ${material.toUpperCase()}`
  );

  window.open(pack, "_blank");

  // Update dashboard instantly
  showUser = function () {
  const name = localStorage.getItem("studentName");

  if (name) {
    loginBtn.style.display = "none";
    userInfo.style.display = "block";

    updateDashboard();   // IMPORTANT
  }
};
  updateDashboard();
}

function updateDashboard() {
  const name = localStorage.getItem("studentName");
  if (!name) return;

  // Show dashboard if visible
  const dash = document.getElementById("dashboard");
  if (dash) dash.style.display = "block";

  document.getElementById("dashName").textContent = name;

  // Semester
  const sem = document.getElementById("semester").value || "Not selected";
  document.getElementById("dashSem").textContent = sem;

  // Favourites
  const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
  const favBox = document.getElementById("favList");
  if (favBox) {
    favBox.innerHTML = "";
    favs.forEach(sub => {
      const chip = document.createElement("div");
      chip.textContent = "⭐ " + sub;
      chip.style.cssText = "background:#e0f2fe;padding:6px 10px;border-radius:999px;font-size:0.85rem;";
      favBox.appendChild(chip);
    });
  }

  // Last download
  const last = localStorage.getItem("lastDownload") || "None";
  const lastEl = document.getElementById("lastDownload");
  if (lastEl) lastEl.textContent = last;
}

//-----Google Login------
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");

function handleCredentialResponse(response) {
  const userObject = JSON.parse(atob(response.credential.split(".")[1]));

  localStorage.setItem("studentName", userObject.name);
  localStorage.setItem("studentEmail", userObject.email);

  showUser();
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

window.onload = function () {
  google.accounts.id.initialize({
    client_id: "596258765969-gg9u20m1phalc6fhke70ur2mogdnqci9.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });
};

loginBtn.addEventListener("click", () => {
  google.accounts.id.initialize
  google.accounts.id.prompt();
});

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});

showUser();


//-------Admin pannel-------------
function checkAdmin() {
  const email = localStorage.getItem("studentEmail");

  // 👇 Replace with YOUR Gmail
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
    data[sem][sub] = { notes:"", pyqs:"", syllabus:"" };
  }

  data[sem][sub][mat] = link;

  document.getElementById("adminMsg").textContent =
    `✅ Saved: Sem ${sem} → ${sub} → ${mat}`;

  loadSubjects(); // refresh dropdown
}


// Override showUser so dashboard loads after login
showUser = function () {
  const name = localStorage.getItem("studentName");
  const email = localStorage.getItem("studentEmail");

  if (name) {
    loginBtn.style.display = "none";
    userInfo.style.display = "block";
    document.getElementById("userName").textContent = name;
    document.getElementById("userEmail").textContent = email;

    checkAdmin();
    updateDashboard();
  }
};

function exportData() {
  const data = {
    favourites: localStorage.getItem("favourites"),
    lastDownload: localStorage.getItem("lastDownload"),
    name: localStorage.getItem("studentName"),
    email: localStorage.getItem("studentEmail")
  };

  console.log("ADMIN DATA:", data);
  alert("Open Console (F12) to see data");
}

