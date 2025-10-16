const mongoose = require('mongoose');

const klasifikasiSchema = new mongoose.Schema({
  kode: {
    type: String,
    required: true,
    unique: true
  },
  nama: {
    type: String,
    required: true
  },
  uraian: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Klasifikasi', klasifikasiSchema);
