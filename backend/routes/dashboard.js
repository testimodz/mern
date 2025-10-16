const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const SuratMasuk = require('../models/SuratMasuk');
const SuratKeluar = require('../models/SuratKeluar');
const Disposisi = require('../models/Disposisi');

router.get('/stats', auth, async (req, res) => {
  try {
    const suratMasuk = await SuratMasuk.countDocuments();
    const suratKeluar = await SuratKeluar.countDocuments();
    const disposisi = await Disposisi.countDocuments({ 
      status: { $ne: 'Selesai' } 
    });
    const selesai = await Disposisi.countDocuments({ 
      status: 'Selesai' 
    });

    res.json({
      success: true,
      data: {
        suratMasuk,
        suratKeluar,
        disposisi,
        selesai
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
