const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText:  { type: String, required: true },
  options:       [{ type: String, required: true }],   // 4 options
  correctOption: { type: Number, required: true }       // index 0-3
});

const quizSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  timeLimit:   { type: Number, default: 10 },  // minutes
  questions:   [questionSchema],
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
