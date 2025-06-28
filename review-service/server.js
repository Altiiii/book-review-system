const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const reviewRoutes = require('./routes/reviews');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB (Review Service)'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('Review Service is running');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Review Service running on port ${PORT}`));
