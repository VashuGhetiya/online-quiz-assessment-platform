import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import TakeQuiz from './pages/TakeQuiz';
import ResultPage from './pages/ResultPage';
import MyResults from './pages/MyResults';
import AdminPanel from './pages/AdminPanel';
import CreateQuiz from './pages/CreateQuiz';

function Private({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/quizzes" element={<Private><QuizList /></Private>} />
          <Route path="/quiz/:id" element={<Private><TakeQuiz /></Private>} />
          <Route path="/result/:id" element={<Private><ResultPage /></Private>} />
          <Route path="/my-results" element={<Private><MyResults /></Private>} />

          <Route path="/admin" element={<Private adminOnly><AdminPanel /></Private>} />
          <Route path="/admin/create" element={<Private adminOnly><CreateQuiz /></Private>} />
          <Route path="/admin/edit/:id" element={<Private adminOnly><CreateQuiz /></Private>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
