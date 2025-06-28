const express = require('express');
const axios = require('axios');
const router = express.Router();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/auth/register`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('Gateway error /register:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/api/auth/login`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('Gateway error /login:', err.message, err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Internal error' });
  }
});

module.exports = router;
