import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config';

export default function Dashboard() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/results/my`).then(r => setResults(r.data)).catch(() => {});
  }, []);

  const avg = results.length
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
    : 0;

  return (
    <div className="container">
      <h2>Welcome, {user.name}!</h2>
      <p className="text-gray" style={{ marginBottom: 20 }}>
        Role: {user.role} &nbsp;|&nbsp; Email: {user.email}
      </p>

      <div className="stats">
        <div className="stat-box">
          <div className="num">{results.length}</div>
          <div className="lbl">Quizzes Taken</div>
        </div>
        <div className="stat-box">
          <div className="num">{avg}%</div>
          <div className="lbl">Average Score</div>
        </div>
        <div className="stat-box">
          <div className="num">
            {results.length ? Math.max(...results.map(r => r.percentage)) : 0}%
          </div>
          <div className="lbl">Best Score</div>
        </div>
      </div>

      <div className="flex-row mb-16">
        <Link to="/quizzes"><button className="btn-blue">Take a Quiz</button></Link>
        <Link to="/my-results"><button className="btn-gray">My Results</button></Link>
        {user.role === 'admin' && (
          <Link to="/admin"><button className="btn-orange">Admin Panel</button></Link>
        )}
      </div>

      <h3 style={{ marginBottom: 12 }}>Recent Results</h3>
      {results.length === 0 ? (
        <div className="card">
          <p className="text-gray">You haven't taken any quiz yet. <Link to="/quizzes">Start now →</Link></p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.slice(0, 5).map(r => (
              <tr key={r._id}>
                <td>{r.quiz?.title}</td>
                <td>{r.score} / {r.total}</td>
                <td>
                  <span className={`badge ${r.percentage >= 60 ? 'badge-green' : 'badge-red'}`}>
                    {r.percentage}%
                  </span>
                </td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}