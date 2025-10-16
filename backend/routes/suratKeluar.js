const express = require('express');
const router = express.Router();

// DEBUG: Test import
console.log('=== DEBUG SURAT KELUAR ===');
const authModule = require('../middleware/auth');
console.log('authModule:', authModule);
console.log('auth type:', typeof authModule.auth);
console.log('auth:', authModule.auth);

const { auth } = authModule;
const SuratKeluar = require('../models/SuratKeluar');
const upload = require('../middleware/upload');

console.log('Final auth:', auth);
console.log('Final auth type:', typeof auth);
console.log('===========================');

// Get all - LINE 8
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search ? {
      $or: [
        { nomorAgenda: { $regex: search, $options: 'i' } },
        { nomorSurat: { $regex: search, $options: 'i' } },
        { tujuanSurat: { $regex: search, $options: 'i' } },
        { perihal: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const total = await SuratKeluar.countDocuments(query);
    const data = await SuratKeluar.find(query)
      .populate('klasifikasi')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Other routes...
router.get('/:id', auth, async (req, res) => {
  try {
    const surat = await SuratKeluar.findById(req.params.id).populate('klasifikasi');
    if (!surat) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }
    res.json({ success: true, data: surat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const suratData = {
      ...req.body,
      fileSurat: req.file ? req.file.filename : null
    };
    const surat = new SuratKeluar(suratData);
    await surat.save();
    res.status(201).json({
      success: true,
      message: 'Surat keluar berhasil ditambahkan',
      data: surat
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.fileSurat = req.file.filename;
    }
    const surat = await SuratKeluar.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!surat) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }
    res.json({
      success: true,
      message: 'Surat keluar berhasil diupdate',
      data: surat
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const surat = await SuratKeluar.findByIdAndDelete(req.params.id);
    if (!surat) {
      return res.status(404).json({ message: 'Surat tidak ditemukan' });
    }
    res.json({
      success: true,
      message: 'Surat keluar berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
