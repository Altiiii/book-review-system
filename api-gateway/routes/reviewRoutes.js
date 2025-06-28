const express = require('express');
const axios = require('axios');
const router = express.Router();

const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL;

router.get('/', async (req, res) => {
  try {
    const bookId = req.query.bookId || '';
    const url = bookId ? `${REVIEW_SERVICE_URL}/api/reviews?bookId=${bookId}` : `${REVIEW_SERVICE_URL}/api/reviews`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('Gateway error /reviews GET:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${REVIEW_SERVICE_URL}/api/reviews`, req.body, {
      headers: { authorization: req.headers.authorization }
    });
    res.status(201).json(response.data);
  } catch (err) {
    console.error('Gateway error /reviews POST:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${REVIEW_SERVICE_URL}/api/reviews/${req.params.id}`, req.body, {
      headers: { authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Gateway error /reviews PUT:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${REVIEW_SERVICE_URL}/api/reviews/${req.params.id}`, {
      headers: { authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Gateway error /reviews DELETE:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

module.exports = router;
