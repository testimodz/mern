const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, checkRole('super_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { nama: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};
    const total = await User.countDocuments(query);
    const data = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    res.json({ success: true, data, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, checkRole('super_admin'), async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({ success: true, message: 'User berhasil ditambahkan', data: userResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (!updateData.password) delete updateData.password;
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ success: true, message: 'User berhasil diupdate', data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/reset-password', auth, checkRole('super_admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    user.password = '123456';
    await user.save();
    res.json({ success: true, message: 'Password berhasil direset ke 123456' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, checkRole('super_admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ success: true, message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
