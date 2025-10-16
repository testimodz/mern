const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const SuratMasuk = require('../models/SuratMasuk');
const SuratKeluar = require('../models/SuratKeluar');
const Disposisi = require('../models/Disposisi');

router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate, jenis } = req.query;
    let filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let data = {};
    
    if (!jenis || jenis === 'all' || jenis === 'masuk') {
      data.suratMasuk = await SuratMasuk.countDocuments(filter);
    }
    
    if (!jenis || jenis === 'all' || jenis === 'keluar') {
      data.suratKeluar = await SuratKeluar.countDocuments(filter);
    }
    
    if (!jenis || jenis === 'all' || jenis === 'disposisi') {
      data.disposisi = await Disposisi.countDocuments(filter);
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/export', auth, async (req, res) => {
  try {
    const { startDate, endDate, jenis } = req.query;
    let filter = {};
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let data = {};
    
    if (jenis === 'masuk') {
      data = await SuratMasuk.find(filter).populate('klasifikasi');
    } else if (jenis === 'keluar') {
      data = await SuratKeluar.find(filter).populate('klasifikasi');
    } else if (jenis === 'disposisi') {
      data = await Disposisi.find(filter).populate('suratMasuk').populate('tujuan');
    } else {
      data = {
        suratMasuk: await SuratMasuk.find(filter).populate('klasifikasi'),
        suratKeluar: await SuratKeluar.find(filter).populate('klasifikasi'),
        disposisi: await Disposisi.find(filter).populate('suratMasuk').populate('tujuan')
      };
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
