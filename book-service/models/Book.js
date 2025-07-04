const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: Number,
  genre: String,
  summary: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
