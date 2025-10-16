const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/surat-masuk', require('./routes/suratMasuk'));
app.use('/api/surat-keluar', require('./routes/suratKeluar'));
app.use('/api/disposisi', require('./routes/disposisi'));
app.use('/api/klasifikasi', require('./routes/klasifikasi'));
app.use('/api/users', require('./routes/users'));
app.use('/api/instansi', require('./routes/instansi'));
app.use('/api/laporan', require('./routes/laporan'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
