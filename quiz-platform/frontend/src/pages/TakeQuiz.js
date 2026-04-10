import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Submit answers
  const submitQuiz = useCallback(async (finalAnswers) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await axios.post('/api/results/submit', { quizId: id, answers: finalAnswers });
      navigate('/result/' + res.data.resultId);
    } catch (err) {
      alert('Submit failed: ' + (err.response?.data?.message || 'Error'));
      setSubmitting(false);
    }
  }, [id, navigate, submitting]);

  // Load quiz
  useEffect(() => {
    axios.get('/api/quizzes/' + id)
      .then(r => {
        setQuiz(r.data);
        setAnswers(new Array(r.data.questions.length).fill(null));
        setTimeLeft(r.data.timeLimit * 60);
      })
      .catch(() => navigate('/quizzes'));
  }, [id, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      submitQuiz(answers);
      return;
    }
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, answers, submitQuiz]);

  const selectOption = (optIndex) => {
    const updated = [...answers];
    updated[current] = optIndex;
    setAnswers(updated);
  };

  if (!quiz) return <div className="container"><p>Loading quiz...</p></div>;

  const question = quiz.questions[current];
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const isLow = timeLeft < 60;
  const answered = answers.filter(a => a !== null).length;

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      {/* Header */}
      <div className="quiz-header">
        <div>
          <h2 style={{ marginBottom: 2 }}>{quiz.title}</h2>
          <span className="text-gray">Question {current + 1} of {quiz.questions.length}</span>
        </div>
        <div className={`timer ${isLow ? 'low' : ''}`}>
          ⏱ {mins}:{secs}
        </div>
      </div>

      {/* Progress bar */}
      <progress value={current + 1} max={quiz.questions.length} />

      {/* Question */}
      <div className="card">
        <p style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 18 }}>
          Q{current + 1}. {question.questionText}
        </p>

        {question.options.map((opt, i) => (
          <div
            key={i}
            className={`option ${answers[current] === i ? 'selected' : ''}`}
            onClick={() => selectOption(i)}
          >
            <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <button
          className="btn-gray"
          onClick={() => setCurrent(c => c - 1)}
          disabled={current === 0}
        >
          ← Previous
        </button>

        <span className="text-gray">{answered} / {quiz.questions.length} answered</span>

        {current < quiz.questions.length - 1 ? (
          <button className="btn-blue" onClick={() => setCurrent(c => c + 1)}>
            Next →
          </button>
        ) : (
          <button className="btn-green" onClick={() => submitQuiz(answers)} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>

      {/* Question number dots */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 20 }}>
        {quiz.questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 34,
              height: 34,
              borderRadius: 4,
              background: i === current ? '#2980b9' : answers[i] !== null ? '#27ae60' : '#ddd',
              color: i === current || answers[i] !== null ? 'white' : '#333',
              fontWeight: 'bold',
              fontSize: 12,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
