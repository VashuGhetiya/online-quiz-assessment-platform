import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/quizzes`)
      .then(r => setQuizzes(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p>Loading quizzes...</p></div>;

  return (
    <div className="container">
      <h2>Available Quizzes</h2>

      {quizzes.length === 0 ? (
        <div className="card">
          <p className="text-gray">No quizzes available right now. Check back later.</p>
        </div>
      ) : (
        quizzes.map(quiz => (
          <div className="card" key={quiz._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ marginBottom: 6 }}>{quiz.title}</h3>
                <p className="text-gray">{quiz.description || 'No description'}</p>
                <p className="text-gray" style={{ marginTop: 6 }}>
                  {quiz.questions?.length} questions &nbsp;|&nbsp; {quiz.timeLimit} minutes
                </p>
              </div>
              <Link to={`/quiz/${quiz._id}`}>
                <button className="btn-blue">Start Quiz</button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}