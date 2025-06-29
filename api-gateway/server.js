const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const verifyTokenIfNeeded = require('./middleware/auth');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


// Rrugët e auth (publike)
app.use('/api/auth', authRoutes);

// Rrugët e librave (me middleware që kontrollon token vetëm për POST/PUT/DELETE)
app.use('/api/books', verifyTokenIfNeeded, bookRoutes);

// Rrugët e recensioneve (me middleware që kontrollon token vetëm për POST/PUT/DELETE)
app.use('/api/reviews', verifyTokenIfNeeded, reviewRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚪 API Gateway running on port ${PORT}`);
});
