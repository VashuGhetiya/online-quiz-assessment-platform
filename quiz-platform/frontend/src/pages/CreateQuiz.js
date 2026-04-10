import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

const blankQuestion = () => ({
  questionText: '',
  options: ['', '', '', ''],
  correctOption: 0
});

export default function CreateQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [questions, setQuestions] = useState([blankQuestion()]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    axios.get(`${API_BASE_URL}/api/quizzes/admin/list`).then(r => {
      const quiz = r.data.find(q => q._id === id);
      if (quiz) {
        setTitle(quiz.title);
        setDescription(quiz.description);
        setTimeLimit(quiz.timeLimit);
        setQuestions(quiz.questions);
      }
    });
  }, [id, isEdit]);

  const updateQ = (qi, field, value) => {
    const updated = [...questions];
    updated[qi] = { ...updated[qi], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qi, oi, value) => {
    const updated = [...questions];
    const opts = [...updated[qi].options];
    opts[oi] = value;
    updated[qi] = { ...updated[qi], options: opts };
    setQuestions(updated);
  };

  const addQuestion = () => setQuestions([...questions, blankQuestion()]);

  const removeQuestion = (qi) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== qi));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) { setError(`Question ${i + 1} text is empty`); return; }
      if (q.options.some(o => !o.trim())) { setError(`Question ${i + 1} has an empty option`); return; }
    }

    setSaving(true);
    try {
      const data = { title, description, timeLimit, questions };
      if (isEdit) {
        await axios.put(`${API_BASE_URL}/api/quizzes/` + id, data);
      } else {
        await axios.post(`${API_BASE_URL}/api/quizzes`, data);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 750 }}>
      <h2>{isEdit ? 'Edit Quiz' : 'Create New Quiz'}</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 14 }}>Quiz Details</h3>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. JavaScript Basics" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description (optional)" />
          </div>
          <div className="form-group">
            <label>Time Limit (minutes) *</label>
            <input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} min={1} max={180} style={{ maxWidth: 120 }} required />
          </div>
        </div>

        <h3 style={{ marginBottom: 14 }}>Questions ({questions.length})</h3>

        {questions.map((q, qi) => (
          <div key={qi} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 6, padding: 18, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <strong>Question {qi + 1}</strong>
              {questions.length > 1 && (
                <button type="button" className="btn-red" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => removeQuestion(qi)}>Remove</button>
              )}
            </div>
            <div className="form-group">
              <label>Question Text *</label>
              <input type="text" value={q.questionText} onChange={e => updateQ(qi, 'questionText', e.target.value)} placeholder="Type your question here" required />
            </div>
            <label style={{ display: 'block', marginBottom: 8 }}>Options — select the correct one using the radio button</label>
            {q.options.map((opt, oi) => (
              <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <input type="radio" name={`correct-${qi}`} checked={q.correctOption === oi} onChange={() => updateQ(qi, 'correctOption', oi)} title="Mark as correct answer" style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#27ae60' }} />
                <input type="text" value={opt} onChange={e => updateOption(qi, oi, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oi)}`} required />
              </div>
            ))}
            <p className="text-gray" style={{ marginTop: 6 }}>✓ Selected radio = correct answer</p>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <button type="button" className="btn-gray" onClick={addQuestion}>+ Add Question</button>
          <div className="flex-row">
            <button type="button" className="btn-gray" onClick={() => navigate('/admin')}>Cancel</button>
            <button type="submit" className="btn-green" disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update Quiz' : 'Create Quiz'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}