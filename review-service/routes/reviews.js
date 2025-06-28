const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const Review = require('../models/Review');
const verifyToken = require('../middleware/auth');

const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://localhost:5001';

// GET /api/reviews?bookId=BOOK_ID
// routes/reviews.js (GET /api/reviews)
router.get('/', async (req, res) => {
    try {
      const { bookId } = req.query;
      if (!bookId) return res.status(400).json({ message: 'bookId query parameter required' });
  
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(bookId)) {
        return res.status(400).json({ message: 'Invalid bookId format' });
      }
  
      const objectId = new mongoose.Types.ObjectId(bookId);
  
      // **Pa populate**
      const reviews = await Review.find({ bookId: objectId });
  
      res.json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  

// POST /api/reviews — krijon recension, kërkon token
router.post('/', verifyToken, async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.user.userId;

    // Opsionale: Kontrollo në Book Service nëse libri ekziston
    try {
      await axios.get(`${BOOK_SERVICE_URL}/api/books/${bookId}`);
    } catch (error) {
      return res.status(400).json({ message: 'Book not found in Book Service' });
    }

    const newReview = new Review({ bookId, userId, rating, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/reviews/:id — Përditëson një recension
router.put('/:id', verifyToken, async (req, res) => {
    try {
      const { rating, comment } = req.body;
  
      const review = await Review.findById(req.params.id);
      if (!review) return res.status(404).json({ message: 'Review not found' });
  
      // Siguro që vetëm autori mund të ndryshojë recensionin
      if (review.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized to update this review' });
      }
  
      review.rating = rating;
      review.comment = comment;
      await review.save();
  
      res.json(review);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // DELETE /api/reviews/:id — Fshin një recension
  router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) return res.status(404).json({ message: 'Review not found' });
  
      // Siguro që vetëm autori mund ta fshijë recensionin
      if (review.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Unauthorized to delete this review' });
      }
  
      await review.deleteOne();
      res.json({ message: 'Review deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
