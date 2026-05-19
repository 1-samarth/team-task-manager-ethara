// ================= CONFIG =================

// 🔥 Backend URL (Railway)
const BASE_URL =
  localStorage.getItem("apiUrl") ||
  "https://team-task-manager-ethara-production.up.railway.app";

// ================= HELPERS =================

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Bearer " + token } : {})
  };
}

// ================= SAFE FETCH (IMPROVED) =================

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);

    const contentType = res.headers.get("content-type");

    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      throw new Error(data?.message || data || "API Error");
    }

    return data;
  } catch (err) {
    console.error("API Error:", err.message);
    alert(err.message);
    return null;
  }
}

// ================= AUTH =================

function showLogin() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("signupForm").classList.add("hidden");
}

function showSignup() {
  document.getElementById("signupForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
}

async function signup() {
  const body = {
    name: document.getElementById("signupName").value,
    email: document.getElementById("signupEmail").value,
    password: document.getElementById("signupPassword").value,
    role: document.getElementById("signupRole").value
  };

  const data = await safeFetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (data) handleAuthResponse(data);
}

async function login() {
  const body = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };

  const data = await safeFetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (data) handleAuthResponse(data);
}

function handleAuthResponse(data) {
  if (!data || !data.token) {
    alert("Login failed: invalid response");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role || "MEMBER");
  localStorage.setItem("name", data.name || "");

  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ================= DASHBOARD =================

async function loadDashboard() {
  if (!getToken()) {
    window.location.href = "index.html";
    return;
  }

  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    document.querySelectorAll(".admin-only").forEach(e => {
      e.style.display = "none";
    });
  }

  await loadStats();
  await loadProjects();
  await loadUsers();
  await loadTasks();
}

// ================= STATS =================

async function loadStats() {
  const data = await safeFetch(`${BASE_URL}/api/tasks/dashboard`, {
    headers: authHeaders()
  });

  if (!data) return;

  document.getElementById("total").innerText = data.total || 0;
  document.getElementById("todo").innerText = data.todo || 0;
  document.getElementById("progress").innerText = data.inProgress || 0;
  document.getElementById("done").innerText = data.done || 0;
  document.getElementById("overdue").innerText = data.overdue || 0;
}

// ================= PROJECTS =================

async function loadProjects() {
  const projects = await safeFetch(`${BASE_URL}/api/projects`, {
    headers: authHeaders()
  });

  if (!projects) return;

  const select = document.getElementById("projectSelect");
  if (!select) return;

  select.innerHTML = projects
    .map(p => `<option value="${p.id}">${p.title}</option>`)
    .join("");
}

async function createProject() {
  await safeFetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      title: document.getElementById("projectTitle").value,
      description: document.getElementById("projectDesc").value
    })
  });

  document.getElementById("projectTitle").value = "";
  document.getElementById("projectDesc").value = "";

  await loadProjects();
}

// ================= USERS =================

async function loadUsers() {
  const users = await safeFetch(`${BASE_URL}/api/users`, {
    headers: authHeaders()
  });

  if (!users) return;

  const select = document.getElementById("userSelect");
  if (!select) return;

  select.innerHTML = users
    .map(u => `<option value="${u.id}">${u.name} (${u.role})</option>`)
    .join("");
}

// ================= TASKS =================

async function createTask() {
  await safeFetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      title: document.getElementById("taskTitle").value,
      description: document.getElementById("taskDesc").value,
      projectId: document.getElementById("projectSelect").value,
      assignedToId: document.getElementById("userSelect").value,
      dueDate: document.getElementById("dueDate").value
    })
  });

  await loadStats();
  await loadTasks();
}

async function loadTasks() {
  const tasks = await safeFetch(`${BASE_URL}/api/tasks`, {
    headers: authHeaders()
  });

  if (!tasks) return;

  const box = document.getElementById("taskList");
  if (!box) return;

  box.innerHTML = tasks
    .map(
      t => `
    <div class="task">
      <h4>${t.title}</h4>
      <p>${t.description || "No description"}</p>

      <span class="badge">${t.status}</span>
      <span class="badge">Due: ${t.dueDate || "No date"}</span>

      <p>Assigned to: ${t.assignedTo?.name || "Unassigned"}</p>

      <select onchange="updateTaskStatus(${t.id}, this.value)">
        <option value="TODO" ${t.status === "TODO" ? "selected" : ""}>TODO</option>
        <option value="IN_PROGRESS" ${t.status === "IN_PROGRESS" ? "selected" : ""}>IN_PROGRESS</option>
        <option value="DONE" ${t.status === "DONE" ? "selected" : ""}>DONE</option>
      </select>
    </div>
  `
    )
    .join("");
}

async function updateTaskStatus(id, status) {
  await safeFetch(`${BASE_URL}/api/tasks/${id}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });

  await loadStats();
  await loadTasks();
}