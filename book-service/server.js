const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/books');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB (Book Service)'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
  res.send('Book Service Running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Book Service running on port ${PORT}`));
