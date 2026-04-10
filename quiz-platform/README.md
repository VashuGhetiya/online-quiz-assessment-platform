# Online Quiz & Assessment Platform (MERN Stack)

A simple full-stack quiz app built with MongoDB, Express, React, and Node.js.

---

## Setup Instructions

### Step 1 — Make sure MongoDB is running
Open MongoDB Compass and connect to: `mongodb://localhost:27017`
(Or run `mongod` in a terminal if using the CLI)

### Step 2 — Run the Backend
Open a terminal in VS Code and run:
```
cd backend
npm install
npm run dev
```
Backend starts at: https://online-quiz-backend-wcf9.onrender.com

### Step 3 — Run the Frontend
Open a second terminal in VS Code and run:
```
cd frontend
npm install
npm start
```
Frontend starts at: http://localhost:3000

---

## How to Use

### As a Student:
1. Go to http://localhost:3000
2. Click Register → fill in name, email, password, select role = Student
3. After login, click "Take a Quiz"
4. Attempt the quiz within the time limit
5. Submit → see your score and answer review

### As an Admin:
1. Register with role = Admin
2. Go to Admin Panel from the navbar
3. Click "+ Create New Quiz"
4. Fill in title, time limit, add questions with 4 options, mark the correct answer
5. Save — the quiz is now visible to students
6. View all student submissions in the "All Submissions" tab

---

## Project Structure
```
quiz-platform/
├── backend/
│   ├── models/
│   │   ├── User.js       ← stores name, email, hashed password, role
│   │   ├── Quiz.js       ← stores title, questions, options, correct answer
│   │   └── Result.js     ← stores student answers, score, percentage
│   ├── routes/
│   │   ├── auth.js       ← /api/auth/register, /login, /me
│   │   ├── quizzes.js    ← /api/quizzes (CRUD)
│   │   └── results.js    ← /api/results/submit, /my, /:id
│   ├── middleware/
│   │   └── auth.js       ← JWT verification, admin check
│   ├── .env              ← PORT, MONGO_URI, JWT_SECRET
│   └── server.js         ← Express app entry point
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js   ← login, register, logout state
        ├── components/
        │   └── Navbar.js
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── Dashboard.js     ← shows stats + recent results
            ├── QuizList.js      ← all available quizzes
            ├── TakeQuiz.js      ← quiz attempt with timer
            ├── ResultPage.js    ← score + answer review
            ├── MyResults.js     ← history of all attempts
            ├── AdminPanel.js    ← manage quizzes + view submissions
            └── CreateQuiz.js    ← create / edit quiz form
```

---

## Tech Used
- **MongoDB** — database (local)
- **Express.js** — backend framework
- **React.js** — frontend
- **Node.js** — runtime
- **JWT** — authentication tokens
- **bcryptjs** — password hashing
- **axios** — HTTP requests from React
- **react-router-dom** — page routing
