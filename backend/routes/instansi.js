const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Instansi = require('../models/Instansi');

router.get('/', auth, async (req, res) => {
  try {
    const instansi = await Instansi.findOne();
    res.json({ success: true, data: instansi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/', auth, checkRole('super_admin'), async (req, res) => {
  try {
    let instansi = await Instansi.findOne();
    if (!instansi) {
      instansi = new Instansi(req.body);
    } else {
      Object.assign(instansi, req.body);
    }
    await instansi.save();
    res.json({ success: true, message: 'Data instansi berhasil diupdate', data: instansi });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
