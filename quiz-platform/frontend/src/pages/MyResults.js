import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/results/my`)
      .then(r => setResults(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h2>My Results</h2>

      {results.length === 0 ? (
        <div className="card">
          <p className="text-gray">No results yet. <Link to="/quizzes">Take a quiz →</Link></p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Result</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r._id}>
                <td>{r.quiz?.title}</td>
                <td>{r.score} / {r.total}</td>
                <td>{r.percentage}%</td>
                <td>
                  <span className={`badge ${r.percentage >= 50 ? 'badge-green' : 'badge-red'}`}>
                    {r.percentage >= 50 ? 'Pass' : 'Fail'}
                  </span>
                </td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/result/${r._id}`}>
                    <button className="btn-blue" style={{ padding: '5px 12px', fontSize: 12 }}>Review</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}