const router = require('express').Router();
const Quiz = require('../models/Quiz');
const { protect, adminOnly } = require('../middleware/auth');

// GET all active quizzes (students see this - no correct answers)
router.get('/', protect, async (req, res) => {
  const quizzes = await Quiz.find({ isActive: true }).select('-questions.correctOption');
  res.json(quizzes);
});

// GET single quiz for attempting (no correct answers)
router.get('/:id', protect, async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).select('-questions.correctOption');
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  res.json(quiz);
});

// Admin: GET all quizzes with answers
router.get('/admin/list', protect, adminOnly, async (req, res) => {
  const quizzes = await Quiz.find().populate('createdBy', 'name');
  res.json(quizzes);
});

// Admin: CREATE quiz
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(quiz);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin: UPDATE quiz
router.put('/:id', protect, adminOnly, async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(quiz);
});

// Admin: DELETE quiz
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
