const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const SuratMasuk = require('../models/SuratMasuk');
const upload = require('../middleware/upload');

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? {
      $or: [
        { nomorAgenda: { $regex: search, $options: 'i' } },
        { nomorSurat: { $regex: search, $options: 'i' } },
        { asalSurat: { $regex: search, $options: 'i' } },
        { perihal: { $regex: search, $options: 'i' } }
      ]
    } : {};
    const total = await SuratMasuk.countDocuments(query);
    const data = await SuratMasuk.find(query)
      .populate('klasifikasi')
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
    const surat = await SuratMasuk.findById(req.params.id).populate('klasifikasi');
    if (!surat) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    res.json({ success: true, data: surat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const suratData = { ...req.body, fileSurat: req.file ? req.file.filename : null };
    const surat = new SuratMasuk(suratData);
    await surat.save();
    res.status(201).json({ success: true, message: 'Surat masuk berhasil ditambahkan', data: surat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.fileSurat = req.file.filename;
    const surat = await SuratMasuk.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!surat) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    res.json({ success: true, message: 'Surat masuk berhasil diupdate', data: surat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const surat = await SuratMasuk.findByIdAndDelete(req.params.id);
    if (!surat) return res.status(404).json({ message: 'Surat tidak ditemukan' });
    res.json({ success: true, message: 'Surat masuk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
