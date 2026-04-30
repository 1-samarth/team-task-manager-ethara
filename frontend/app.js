function apiBase() {
  return localStorage.getItem("apiUrl") || document.getElementById("apiUrl")?.value || "http://localhost:8080";
}

function authHeaders() {
  return { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("token") };
}

function showLogin() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("signupForm").classList.add("hidden");
}

function showSignup() {
  document.getElementById("signupForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
}

async function signup() {
  localStorage.setItem("apiUrl", document.getElementById("apiUrl").value.trim());
  const body = {
    name: document.getElementById("signupName").value,
    email: document.getElementById("signupEmail").value,
    password: document.getElementById("signupPassword").value,
    role: document.getElementById("signupRole").value
  };
  const res = await fetch(apiBase() + "/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  handleAuthResponse(res);
}

async function login() {
  localStorage.setItem("apiUrl", document.getElementById("apiUrl").value.trim());
  const body = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };
  const res = await fetch(apiBase() + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  handleAuthResponse(res);
}

async function handleAuthResponse(res) {
  if (!res.ok) {
    document.getElementById("message").innerText = await res.text();
    return;
  }
  const data = await res.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("name", data.name);
  location.href = "dashboard.html";
}

function logout() {
  localStorage.clear();
  location.href = "index.html";
}

async function loadDashboard() {
  if (!localStorage.getItem("token")) location.href = "index.html";
  const role = localStorage.getItem("role");
  if (role !== "ADMIN") document.querySelectorAll(".admin-only").forEach(e => e.style.display = "none");
  await loadStats();
  await loadProjects();
  await loadUsers();
  await loadTasks();
}

async function loadStats() {
  const res = await fetch(apiBase() + "/api/tasks/dashboard", { headers: authHeaders() });
  const data = await res.json();
  document.getElementById("total").innerText = data.total;
  document.getElementById("todo").innerText = data.todo;
  document.getElementById("progress").innerText = data.inProgress;
  document.getElementById("done").innerText = data.done;
  document.getElementById("overdue").innerText = data.overdue;
}

async function loadProjects() {
  const res = await fetch(apiBase() + "/api/projects", { headers: authHeaders() });
  const projects = await res.json();
  const select = document.getElementById("projectSelect");
  if (!select) return;
  select.innerHTML = projects.map(p => `<option value="${p.id}">${p.title}</option>`).join("");
}

async function loadUsers() {
  const res = await fetch(apiBase() + "/api/users", { headers: authHeaders() });
  const users = await res.json();
  const select = document.getElementById("userSelect");
  if (!select) return;
  select.innerHTML = users.map(u => `<option value="${u.id}">${u.name} - ${u.role}</option>`).join("");
}

async function createProject() {
  const body = {
    title: document.getElementById("projectTitle").value,
    description: document.getElementById("projectDesc").value
  };
  await fetch(apiBase() + "/api/projects", { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
  document.getElementById("projectTitle").value = "";
  document.getElementById("projectDesc").value = "";
  await loadProjects();
}

async function createTask() {
  const body = {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDesc").value,
    projectId: document.getElementById("projectSelect").value,
    assignedToId: document.getElementById("userSelect").value,
    dueDate: document.getElementById("dueDate").value
  };
  await fetch(apiBase() + "/api/tasks", { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
  await loadStats();
  await loadTasks();
}

async function loadTasks() {
  const res = await fetch(apiBase() + "/api/tasks", { headers: authHeaders() });
  const tasks = await res.json();
  const box = document.getElementById("taskList");
  box.innerHTML = tasks.map(t => `
    <div class="task">
      <h4>${t.title}</h4>
      <p>${t.description || "No description"}</p>
      <span class="badge">${t.status}</span>
      <span class="badge">Due: ${t.dueDate || "No date"}</span>
      <p>Assigned to: ${t.assignedTo.name}</p>
      <select onchange="updateTaskStatus(${t.id}, this.value)">
        <option ${t.status === "TODO" ? "selected" : ""}>TODO</option>
        <option ${t.status === "IN_PROGRESS" ? "selected" : ""}>IN_PROGRESS</option>
        <option ${t.status === "DONE" ? "selected" : ""}>DONE</option>
      </select>
    </div>`).join("");
}

async function updateTaskStatus(id, status) {
  await fetch(apiBase() + `/api/tasks/${id}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });
  await loadStats();
  await loadTasks();
}
