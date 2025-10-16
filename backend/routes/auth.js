const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: username },
        { username: username },
        { nip: username }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Username/Email atau password salah' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username/Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user._id, level: user.level },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, nama, email, password, jabatan } = req.body;

    // Validasi (HAPUS nip dari required)
    if (!username || !nama || !email || !password || !jabatan) {
      return res.status(400).json({ 
        message: 'Username, nama, email, password, dan jabatan harus diisi' 
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email atau Username sudah terdaftar' 
      });
    }

    // Create user (NIP optional)
    const user = new User({
      username,
      nama,
      email,
      password,
      jabatan,
      nip: req.body.nip || '', // Optional
      level: 'user'
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil. Silakan login.'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
