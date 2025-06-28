const express = require('express');
const axios = require('axios');
const router = express.Router();

const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL;

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BOOK_SERVICE_URL}/api/books`);
    res.json(response.data);
  } catch (err) {
    console.error('Gateway error /books GET:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${BOOK_SERVICE_URL}/api/books/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    console.error('Gateway error /books/:id GET:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

// POST me token
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${BOOK_SERVICE_URL}/api/books`, req.body, {
      headers: { authorization: req.headers.authorization }
    });
    res.status(201).json(response.data);
  } catch (err) {
    console.error('Gateway error /books POST:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${BOOK_SERVICE_URL}/api/books/${req.params.id}`, req.body, {
      headers: { authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Gateway error /books PUT:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${BOOK_SERVICE_URL}/api/books/${req.params.id}`, {
      headers: { authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Gateway error /books DELETE:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

module.exports = router;
