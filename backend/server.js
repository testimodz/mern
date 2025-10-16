const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware - FIX CORS!
app.use(cors({
  origin: [
    'http://localhost:3000',                      // Frontend development
    'http://127.0.0.1:3000',                      // Alternative localhost
    'https://shiny-biscuit-967eb3.netlify.app'   // 🚀 NETLIFY PRODUCTION
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
  }
};

// Connect DB on startup
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ E-Letter API Running',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'API Endpoint',
    status: 'healthy'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: isConnected ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/disposisi', require('./routes/disposisi'));
app.use('/api/instansi', require('./routes/instansi'));
app.use('/api/klasifikasi', require('./routes/klasifikasi'));
app.use('/api/laporan', require('./routes/laporan'));
app.use('/api/surat-keluar', require('./routes/suratKeluar'));
app.use('/api/surat-masuk', require('./routes/suratMasuk'));
app.use('/api/users', require('./routes/users'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    message: 'Server error', 
    error: err.message 
  });
});

// Export for Vercel
module.exports = app;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
