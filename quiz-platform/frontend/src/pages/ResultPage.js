import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/results/` + id).then(r => setResult(r.data)).catch(() => {});
  }, [id]);

  if (!result) return <div className="container"><p>Loading result...</p></div>;

  const { quiz, answers, score, total, percentage } = result;
  const passed = percentage >= 50;

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <div className="card result-box">
        <div className="score-big" style={{ color: passed ? '#27ae60' : '#e74c3c' }}>{percentage}%</div>
        <div className="score-label">
          {score} out of {total} correct &nbsp;|&nbsp;
          <strong style={{ color: passed ? '#27ae60' : '#e74c3c' }}>{passed ? 'PASSED ✓' : 'FAILED ✗'}</strong>
        </div>
        <h3 style={{ marginBottom: 16 }}>{quiz.title}</h3>
        <div className="flex-row" style={{ justifyContent: 'center' }}>
          <Link to="/quizzes"><button className="btn-blue">Take Another Quiz</button></Link>
          <Link to="/my-results"><button className="btn-gray">All My Results</button></Link>
        </div>
      </div>

      <h3 style={{ margin: '24px 0 12px' }}>Answer Review</h3>

      {quiz.questions.map((q, i) => {
        const selected = answers[i];
        const correct = q.correctOption;
        const isCorrect = selected === correct;

        return (
          <div className="card" key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <strong>Q{i + 1}. {q.questionText}</strong>
              <span className={`badge ${isCorrect ? 'badge-green' : 'badge-red'}`}>
                {isCorrect ? '✓ Correct' : '✗ Wrong'}
              </span>
            </div>
            {q.options.map((opt, j) => (
              <div key={j} className={`option ${j === correct ? 'correct' : j === selected && !isCorrect ? 'wrong' : ''}`} style={{ cursor: 'default' }}>
                <strong>{String.fromCharCode(65 + j)}.</strong> {opt}
                {j === correct && <span style={{ marginLeft: 'auto', color: '#27ae60', fontSize: 12 }}>✓ Correct Answer</span>}
                {j === selected && !isCorrect && <span style={{ marginLeft: 'auto', color: '#e74c3c', fontSize: 12 }}>Your Answer</span>}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}