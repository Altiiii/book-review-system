const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('../models/Book');

const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL || 'https://review-service-url/api/reviews';

const axios = require('axios');

router.get('/popular', async (req, res) => {
  try {
    const books = await Book.find();

    const { data: allReviews } = await axios.get(`${REVIEW_SERVICE_URL}/all`);

    const bookStats = books.map(book => {
      const reviewsForBook = allReviews.filter(r => r.bookId === book._id.toString());
      const totalReviews = reviewsForBook.length;
      const avgRating = reviewsForBook.reduce((sum, r) => sum + r.rating, 0) / (totalReviews || 1);

      return {
        book,
        totalReviews,
        avgRating: avgRating.toFixed(1),
      };
    });

    const sorted = bookStats.sort((a, b) => b.totalReviews - a.totalReviews || b.avgRating - a.avgRating);

    res.json(sorted);
  } catch (err) {
    console.error('Popular Books Error:', err);
    res.status(500).json({ message: 'Failed to fetch popular books' });
  }
});

module.exports = router;
