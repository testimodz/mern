const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Klasifikasi = require('../models/Klasifikasi');

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? {
      $or: [
        { kode: { $regex: search, $options: 'i' } },
        { nama: { $regex: search, $options: 'i' } }
      ]
    } : {};
    const total = await Klasifikasi.countDocuments(query);
    const data = await Klasifikasi.find(query)
      .sort({ kode: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    res.json({ success: true, data, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const klasifikasi = await Klasifikasi.findById(req.params.id);
    if (!klasifikasi) return res.status(404).json({ message: 'Klasifikasi tidak ditemukan' });
    res.json({ success: true, data: klasifikasi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const klasifikasi = new Klasifikasi(req.body);
    await klasifikasi.save();
    res.status(201).json({ success: true, message: 'Klasifikasi berhasil ditambahkan', data: klasifikasi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const klasifikasi = await Klasifikasi.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!klasifikasi) return res.status(404).json({ message: 'Klasifikasi tidak ditemukan' });
    res.json({ success: true, message: 'Klasifikasi berhasil diupdate', data: klasifikasi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const klasifikasi = await Klasifikasi.findByIdAndDelete(req.params.id);
    if (!klasifikasi) return res.status(404).json({ message: 'Klasifikasi tidak ditemukan' });
    res.json({ success: true, message: 'Klasifikasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
