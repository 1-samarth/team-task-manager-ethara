// ================= CONFIG =================

const BASE_URL =
  localStorage.getItem("apiUrl") ||
  "https://p01--team-task-manager-ethara--g2pc7f5phyjn.code.run";

// ================= HELPERS =================

function getToken() {
  return localStorage.getItem("token");
}

function getRole() {
  return localStorage.getItem("role");
}

function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Bearer " + token } : {})
  };
}

// ================= LOADER =================

function showLoader() {
  document.body.classList.add("loading");
}

function hideLoader() {
  document.body.classList.remove("loading");
}

// ================= SAFE FETCH =================

async function safeFetch(url, options = {}) {
  try {
    showLoader();

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

    showToast(err.message, "error");

    return null;

  } finally {
    hideLoader();
  }
}

// ================= TOAST =================

function showToast(message, type = "success") {

  const toast = document.createElement("div");

  toast.className = `toast ${type}`;

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);

  }, 3000);
}

// ================= AUTH =================

function showLogin() {

  document
    .getElementById("loginForm")
    .classList.remove("hidden");

  document
    .getElementById("signupForm")
    .classList.add("hidden");
}

function showSignup() {

  document
    .getElementById("signupForm")
    .classList.remove("hidden");

  document
    .getElementById("loginForm")
    .classList.add("hidden");
}

// ================= SIGNUP =================

async function signup() {

  const body = {

    name:
      document.getElementById("signupName").value,

    email:
      document.getElementById("signupEmail").value,

    password:
      document.getElementById("signupPassword").value,

    role:
      document.getElementById("signupRole").value
  };

  const data = await safeFetch(
    `${BASE_URL}/api/auth/signup`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(body)
    }
  );

  if (data) {

    showToast("Account created successfully");

    handleAuthResponse(data);
  }
}

// ================= LOGIN =================

async function login() {

  const body = {

    email:
      document.getElementById("loginEmail").value,

    password:
      document.getElementById("loginPassword").value
  };

  const data = await safeFetch(
    `${BASE_URL}/api/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(body)
    }
  );

  if (data) {

    showToast("Login successful");

    handleAuthResponse(data);
  }
}

// ================= AUTH RESPONSE =================

function handleAuthResponse(data) {

  if (!data || !data.token) {

    showToast("Invalid login response", "error");

    return;
  }

  localStorage.setItem("token", data.token);

  localStorage.setItem("role", data.role || "MEMBER");

  localStorage.setItem("name", data.name || "");

  window.location.href = "dashboard.html";
}

// ================= LOGOUT =================

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

  const role = getRole();

  if (role !== "ADMIN") {

    document
      .querySelectorAll(".admin-only")
      .forEach(e => {
        e.style.display = "none";
      });
  }

  loadProfile();

  await loadStats();

  await loadProjects();

  await loadUsers();

  await loadTasks();
}

// ================= PROFILE =================

function loadProfile() {

  const name =
    localStorage.getItem("name") || "User";

  const avatar =
    document.querySelector(".profile-avatar");

  if (avatar) {

    avatar.innerText =
      name.charAt(0).toUpperCase();
  }
}

// ================= STATS =================

async function loadStats() {

  const data = await safeFetch(
    `${BASE_URL}/api/tasks/dashboard`,
    {
      headers: authHeaders()
    }
  );

  if (!data) return;

  document.getElementById("total").innerText =
    data.total || 0;

  document.getElementById("todo").innerText =
    data.todo || 0;

  document.getElementById("progress").innerText =
    data.inProgress || 0;

  document.getElementById("done").innerText =
    data.done || 0;

  document.getElementById("overdue").innerText =
    data.overdue || 0;
}

// ================= PROJECTS =================

async function loadProjects() {

  const projects = await safeFetch(
    `${BASE_URL}/api/projects`,
    {
      headers: authHeaders()
    }
  );

  if (!projects) return;

  const select =
    document.getElementById("projectSelect");

  if (!select) return;

  select.innerHTML = projects
    .map(
      p =>
        `<option value="${p.id}">
          ${p.title}
        </option>`
    )
    .join("");
}

// ================= CREATE PROJECT =================

async function createProject() {

  const title =
    document.getElementById("projectTitle").value;

  const description =
    document.getElementById("projectDesc").value;

  if (!title) {

    showToast(
      "Project title required",
      "error"
    );

    return;
  }

  const data = await safeFetch(
    `${BASE_URL}/api/projects`,
    {
      method: "POST",

      headers: authHeaders(),

      body: JSON.stringify({
        title,
        description
      })
    }
  );

  if (data) {

    showToast("Project created");

    document.getElementById(
      "projectTitle"
    ).value = "";

    document.getElementById(
      "projectDesc"
    ).value = "";

    await loadProjects();
  }
}

// ================= USERS =================

async function loadUsers() {

  const users = await safeFetch(
    `${BASE_URL}/api/users`,
    {
      headers: authHeaders()
    }
  );

  if (!users) return;

  const select =
    document.getElementById("userSelect");

  if (!select) return;

  select.innerHTML = users
    .map(
      u =>
        `<option value="${u.id}">
          ${u.name} (${u.role})
        </option>`
    )
    .join("");
}

// ================= CREATE TASK =================

async function createTask() {

  const body = {

    title:
      document.getElementById("taskTitle").value,

    description:
      document.getElementById("taskDesc").value,

    projectId:
      document.getElementById("projectSelect").value,

    assignedToId:
      document.getElementById("userSelect").value,

    dueDate:
      document.getElementById("dueDate").value
  };

  if (!body.title) {

    showToast("Task title required", "error");

    return;
  }

  const data = await safeFetch(
    `${BASE_URL}/api/tasks`,
    {
      method: "POST",

      headers: authHeaders(),

      body: JSON.stringify(body)
    }
  );

  if (data) {

    showToast("Task assigned");

    document.getElementById("taskTitle").value = "";

    document.getElementById("taskDesc").value = "";

    await loadStats();

    await loadTasks();
  }
}

// ================= LOAD TASKS =================

async function loadTasks() {

  const tasks = await safeFetch(
    `${BASE_URL}/api/tasks`,
    {
      headers: authHeaders()
    }
  );

  if (!tasks) return;

  const box =
    document.getElementById("taskList");

  if (!box) return;

  if (tasks.length === 0) {

    box.innerHTML = `
      <div class="empty-state">
        <h3>No Tasks Found</h3>
        <p>Create your first task.</p>
      </div>
    `;

    return;
  }

  box.innerHTML = tasks
    .map(
      t => `
      <div class="task">

        <div class="task-top">

          <h4>${t.title}</h4>

          <span class="badge">
            ${t.status}
          </span>

        </div>

        <p>
          ${t.description || "No description"}
        </p>

        <div class="task-meta">

          <span>
            📅 ${t.dueDate || "No due date"}
          </span>

          <span>
            👤 ${t.assignedTo?.name || "Unassigned"}
          </span>

        </div>

        <select
          onchange="updateTaskStatus(${t.id}, this.value)"
        >

          <option
            value="TODO"
            ${t.status === "TODO"
              ? "selected"
              : ""}
          >
            TODO
          </option>

          <option
            value="IN_PROGRESS"
            ${t.status === "IN_PROGRESS"
              ? "selected"
              : ""}
          >
            IN_PROGRESS
          </option>

          <option
            value="DONE"
            ${t.status === "DONE"
              ? "selected"
              : ""}
          >
            DONE
          </option>

        </select>

      </div>
    `
    )
    .join("");
}

// ================= UPDATE TASK =================

async function updateTaskStatus(id, status) {

  const data = await safeFetch(
    `${BASE_URL}/api/tasks/${id}/status`,
    {
      method: "PUT",

      headers: authHeaders(),

      body: JSON.stringify({ status })
    }
  );

  if (data) {

    showToast("Task updated");

    await loadStats();

    await loadTasks();
  }
}
async function handleGoogleLogin(response) {
  const data = await safeFetch(
    `${BASE_URL}/api/auth/google`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        credential: response.credential
      })
    }
  );

  if (data) {
    showToast("Google login successful");
    handleAuthResponse(data);
  }
}