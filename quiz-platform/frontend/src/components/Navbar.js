import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <span className="brand">Online Quiz App</span>
      <div>
        {user ? (
          <>
            <Link to="/dashboard">Home</Link>
            <Link to="/quizzes">Quizzes</Link>
            <Link to="/my-results">My Results</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <span style={{ color: '#bdc3c7', marginLeft: 16, fontSize: 14 }}>
              Hi, {user.name}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
