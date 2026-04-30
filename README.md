#  Team Task Manager

Hi, I am Samarth  
This is my full-stack Team Task Manager project where users can manage projects and tasks with role-based access (Admin / Member).

---

##  Project Overview

This application allows teams to:

- Create and manage projects
- Assign tasks to members
- Track task progress
- View overall status through dashboard

---

##  Tech Stack

**Backend**
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA

**Database**
- MySQL (Railway)

**Frontend**
- HTML
- CSS
- JavaScript

**Deployment**
- Backend: Railway  
- Frontend: Vercel  

---

##  Features

- User Signup & Login
- Role-based access (Admin / Member)
- Project creation (Admin)
- Task assignment (Admin)
- Dashboard (Todo / In Progress / Done / Overdue)
- Members can update task status

---

##  Database Tables

- users  
- project  
- project_member  
- task  

---

##  Run Locally

### Backend

```bash
cd backend
mvn spring-boot:run

Default MySQL config:
MYSQLHOST=localhost
MYSQLPORT=3306
MYSQLDATABASE=task_manager
MYSQLUSER=root
MYSQLPASSWORD=root

Frontend

Open:

frontend/index.html

For local:

http://localhost:8080

For deployed backend:

https://your-backend-name.up.railway.app

# API Endpoints
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

# Deployment (Railway + Vercel)
Backend (Railway)
Push project to GitHub
Deploy backend service (select backend folder)
Add MySQL variables:
MYSQLHOST
MYSQLPORT
MYSQLDATABASE
MYSQLUSER
MYSQLPASSWORD
Deploy and open backend URL
If response shows running, backend is live

Frontend (Vercel)
Import GitHub repo
Set Root Directory:
frontend
Deploy
Add backend URL in app.js

-- Demo Flow
Signup as Admin
Signup as Member
Login as Admin
Create Project
Assign Task
Login as Member
Update Task Status
Show Dashboard

#What I Learned
Building REST APIs using Spring Boot
Role-based authentication and authorization
Connecting backend with MySQL database
Full-stack integration (frontend + backend)
Deployment using Railway and Vercel

--Future Improvements
Better UI (React version)
Notifications system
File attachments in tasks
Role permissions improvement
-- Author

Samarth Chandel
B.Tech Data Science Student