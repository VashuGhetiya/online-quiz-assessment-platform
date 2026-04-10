import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function AdminPanel() {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [tab, setTab] = useState('quizzes');

  const loadData = () => {
    axios.get(`${API_BASE_URL}/api/quizzes/admin/list`).then(r => setQuizzes(r.data)).catch(() => {});
    axios.get(`${API_BASE_URL}/api/results`).then(r => setResults(r.data)).catch(() => {});
  };

  useEffect(() => { loadData(); }, []);

  const deleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    await axios.delete(`${API_BASE_URL}/api/quizzes/` + id);
    loadData();
  };

  const toggleActive = async (quiz) => {
    await axios.put(`${API_BASE_URL}/api/quizzes/` + quiz._id, { isActive: !quiz.isActive });
    loadData();
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Admin Panel</h2>
        <Link to="/admin/create">
          <button className="btn-green">+ Create New Quiz</button>
        </Link>
      </div>
      <div className="stats">
        <div className="stat-box">
          <div className="num">{quizzes.length}</div>
          <div className="lbl">Total Quizzes</div>
        </div>
        <div className="stat-box">
          <div className="num">{results.length}</div>
          <div className="lbl">Total Submissions</div>
        </div>
        <div className="stat-box">
          <div className="num">
            {results.length
              ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
              : 0}%
          </div>
          <div className="lbl">Overall Avg Score</div>
        </div>
      </div>
      <div className="flex-row mb-16">
        <button className={tab === 'quizzes' ? 'btn-blue' : 'btn-gray'} onClick={() => setTab('quizzes')}>Quizzes</button>
        <button className={tab === 'results' ? 'btn-blue' : 'btn-gray'} onClick={() => setTab('results')}>All Submissions</button>
      </div>
      {tab === 'quizzes' && (
        <>
          {quizzes.length === 0 ? (
            <div className="card"><p className="text-gray">No quizzes yet. <Link to="/admin/create">Create one →</Link></p></div>
          ) : (
            <table>
              <thead>
                <tr><th>Title</th><th>Questions</th><th>Time Limit</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {quizzes.map(q => (
                  <tr key={q._id}>
                    <td>{q.title}</td>
                    <td>{q.questions.length}</td>
                    <td>{q.timeLimit} min</td>
                    <td><span className={`badge ${q.isActive ? 'badge-green' : 'badge-red'}`}>{q.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="flex-row">
                        <Link to={`/admin/edit/${q._id}`}><button className="btn-blue" style={{ padding: '5px 10px', fontSize: 12 }}>Edit</button></Link>
                        <button className="btn-orange" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => toggleActive(q)}>{q.isActive ? 'Deactivate' : 'Activate'}</button>
                        <button className="btn-red" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => deleteQuiz(q._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      {tab === 'results' && (
        <>
          {results.length === 0 ? (
            <div className="card"><p className="text-gray">No submissions yet.</p></div>
          ) : (
            <table>
              <thead>
                <tr><th>Student</th><th>Email</th><th>Quiz</th><th>Score</th><th>Result</th><th>Date</th></tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r._id}>
                    <td>{r.student?.name}</td>
                    <td>{r.student?.email}</td>
                    <td>{r.quiz?.title}</td>
                    <td>{r.score} / {r.total} ({r.percentage}%)</td>
                    <td><span className={`badge ${r.percentage >= 50 ? 'badge-green' : 'badge-red'}`}>{r.percentage >= 50 ? 'Pass' : 'Fail'}</span></td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}