const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Disposisi = require('../models/Disposisi');

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { isi: { $regex: search, $options: 'i' } } : {};
    const total = await Disposisi.countDocuments(query);
    const data = await Disposisi.find(query)
      .populate('suratMasuk')
      .populate('tujuan')
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
    const disposisi = await Disposisi.findById(req.params.id).populate('suratMasuk').populate('tujuan');
    if (!disposisi) return res.status(404).json({ message: 'Disposisi tidak ditemukan' });
    res.json({ success: true, data: disposisi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const disposisi = new Disposisi(req.body);
    await disposisi.save();
    res.status(201).json({ success: true, message: 'Disposisi berhasil dibuat', data: disposisi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const disposisi = await Disposisi.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!disposisi) return res.status(404).json({ message: 'Disposisi tidak ditemukan' });
    res.json({ success: true, message: 'Disposisi berhasil diupdate', data: disposisi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/selesai', auth, async (req, res) => {
  try {
    const disposisi = await Disposisi.findByIdAndUpdate(req.params.id, { status: 'Selesai' }, { new: true });
    if (!disposisi) return res.status(404).json({ message: 'Disposisi tidak ditemukan' });
    res.json({ success: true, message: 'Disposisi ditandai selesai', data: disposisi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const disposisi = await Disposisi.findByIdAndDelete(req.params.id);
    if (!disposisi) return res.status(404).json({ message: 'Disposisi tidak ditemukan' });
    res.json({ success: true, message: 'Disposisi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
