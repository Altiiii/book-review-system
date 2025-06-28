const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const verifyToken = require('../middleware/auth');

// GET /api/books — kthen të gjitha librat (publik)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/books/:id — kthen libër sipas id-së
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/books — krijon libër të ri (vetëm përdorues të autorizuar)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, author, publishedYear, genre, summary } = req.body;
    const newBook = new Book({ title, author, publishedYear, genre, summary });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, author, publishedYear, genre, summary } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, publishedYear, genre, summary },
      { new: true, runValidators: true }
    );

    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });

    res.json(updatedBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/books/:id — Fshin një libër
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
