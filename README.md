# Team Task Manager

A simple full-stack Team Task Manager app where admins can create projects, assign tasks to members, and track progress.

## Tech Stack

- Backend: Java 17, Spring Boot, Spring Security, Spring Data JPA
- Database: MySQL
- Frontend: HTML, CSS, JavaScript
- Deployment: Railway

## Features

- Signup and login
- Admin and Member roles
- Admin can create projects
- Admin can create and assign tasks
- Members can view assigned tasks
- Members can update task status
- Dashboard shows total, todo, in-progress, done and overdue tasks

## Database Tables

- users
- project
- project_member
- task

## Local Setup

### Backend

```bash
cd backend
mvn spring-boot:run
```

Local MySQL default config:

```properties
MYSQLHOST=localhost
MYSQLPORT=3306
MYSQLDATABASE=task_manager
MYSQLUSER=root
MYSQLPASSWORD=root
```

### Frontend

Open `frontend/index.html` in browser.

Backend URL field me local ke liye enter karo:

```text
http://localhost:8080
```

Railway deploy ke baad backend URL field me Railway backend URL paste karo:

```text
https://your-backend-name.up.railway.app
```

## API Endpoints

```text
GET  /
POST /api/auth/signup
POST /api/auth/login
GET  /api/users
POST /api/projects
GET  /api/projects
POST /api/projects/{projectId}/members
POST /api/tasks
GET  /api/tasks
PUT  /api/tasks/{taskId}/status
GET  /api/tasks/dashboard
```

## Railway Deployment With Existing MySQL Service

This project is already configured for Railway Trial Plan and Railway MySQL variables.

1. Push this project to GitHub.
2. Railway dashboard me **New Project** ya existing project open karo.
3. Backend service deploy karo from GitHub and select the `backend` folder.
4. Apne already-created Railway MySQL service ke variables backend service me add/link karo.
5. Backend service Variables me ye variables hone chahiye:

```text
MYSQLHOST
MYSQLPORT
MYSQLDATABASE
MYSQLUSER
MYSQLPASSWORD
PORT
```

`PORT` Railway automatically set kar deta hai. Manually set karna zaruri nahi.

Application already uses this connection format:

```properties
jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
```

6. Deploy complete hone ke baad backend URL open karo. Agar response me `Team Task Manager API` and `running` aaye, backend live hai.
7. Frontend ko Netlify/Vercel/Railway static hosting pe deploy karo.
8. Frontend login page me Railway backend URL paste karke signup/login test karo.

## Demo Flow

1. Signup as ADMIN.
2. Signup as MEMBER using another email.
3. Login as ADMIN.
4. Create project.
5. Create task and assign it to MEMBER.
6. Login as MEMBER.
7. Update task status.
8. Show dashboard counts.
