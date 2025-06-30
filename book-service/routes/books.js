const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const verifyToken = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

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
    const { title, author, publishedYear, genre, summary, __v } = req.body;

    if (__v === undefined) {
      return res.status(400).json({ message: 'Version (__v) is required for concurrency control' });
    }

    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id, __v: __v },  
      { title, author, publishedYear, genre, summary, $inc: { __v: 1 } }, 
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(409).json({ message: 'Conflict: Book was updated by someone else. Please reload and try again.' });
    }

    res.json(updatedBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


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
