📌 Project Manager — Project & Time Tracking App (MERN)

A full-stack project management and time-tracking application built with the MERN stack.
Users can create projects, tasks, and multi-level subtasks, clock in/out to track work time, and view reports on how they spend their time. Designed for both individuals and teams.

🔥 Features
🗂 Project & Task Management
Create and manage projects
Add tasks and nested subtasks
Mark tasks or subtasks as complete

⏱ Time Tracking
Clock in and clock out
Automatic log creation with timestamps
View total time spent per project, task, subtask, or time period

📊 Analytics
Daily, weekly, and monthly breakdowns
Per-project and per-task reports
Total hours logged

👥 Users & Roles
JWT authentication
Admin panel to view all users (if implemented)
Responsive UI
Optimized REST API


🛠 Tech Stack
Frontend
React
React Router
Axios
Context API
Css
Backend
Node.js
Express
MongoDB (MongoDB Atlas)
Mongoose
JSON Web Tokens (JWT)
Deployed on AWS EC2
PM2 process manager
Nginx reverse proxy
Certbot SSL / HTTPS
Domain via Namecheap

🚀 Live Demo
todo

📁 Project Structure

root

├── backend

│   ├── controllers

│   ├── models

│   ├── routes

│   ├── middleware

│   └── server.js

│

└── frontend

    ├── public

    ├── src
    
    │   ├── components
    
    │   ├── pages
    
    │   ├── hooks
    
    │   └── context
    
    └── package.json
    

🧪 Installation & Setup
1. Clone the repo
git clone [https://github.com/Kylep55/MernProjectManager.git](https://github.com/KyleP55/MernProjectManager.git)
cd YOUR_REPO
2. Install dependencies

--Backend--
cd backend
npm install


--Frontend--
cd frontend
npm install

3. Set environment variables
Create .env files:

Frontend .env:
REACT_APP_BACKEND_URL=your_backend_url
PORT=your_port

Backend .env:
FRONTEND_UR=your_frontend_url
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
PORT=your_port

4. Run development servers

Backend:
npm run dev

Frontend:
npm start

🏗 Deployment (AWS EC2)
Build frontend:
cd frontend
npm run build


Start backend with PM2:
pm2 start server.js


Configure Nginx as a reverse proxy
Add SSL using Certbot
Ensure CORS allows your domain
