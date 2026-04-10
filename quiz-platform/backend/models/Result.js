const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz:       { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers:    [Number],       // selected option index per question
  score:      { type: Number, required: true },
  total:      { type: Number, required: true },
  percentage: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
