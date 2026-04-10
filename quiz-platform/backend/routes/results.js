const router = require('express').Router();
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const { protect, adminOnly } = require('../middleware/auth');

// POST submit quiz answers
router.post('/submit', protect, async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // Get quiz WITH correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctOption) score++;
    });

    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);

    const result = await Result.create({
      student: req.user._id,
      quiz: quizId,
      answers,
      score,
      total,
      percentage
    });

    res.json({ resultId: result._id, score, total, percentage });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// GET my results
router.get('/my', protect, async (req, res) => {
  const results = await Result.find({ student: req.user._id })
    .populate('quiz', 'title')
    .sort('-createdAt');
  res.json(results);
});

// GET one result (with quiz details for review)
router.get('/:id', protect, async (req, res) => {
  const result = await Result.findById(req.params.id).populate('quiz');
  if (!result) return res.status(404).json({ message: 'Not found' });
  res.json(result);
});

// Admin: GET all results
router.get('/', protect, adminOnly, async (req, res) => {
  const results = await Result.find()
    .populate('student', 'name email')
    .populate('quiz', 'title')
    .sort('-createdAt');
  res.json(results);
});

module.exports = router;
