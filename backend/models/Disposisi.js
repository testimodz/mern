const mongoose = require('mongoose');

const disposisiSchema = new mongoose.Schema({
  suratMasuk: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuratMasuk',
    required: true
  },
  dari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kepada: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  isiDisposisi: {
    type: String,
    required: true
  },
  instruksi: [{
    type: String
  }],
  sifat: {
    type: String,
    enum: ['Biasa', 'Segera', 'Sangat Segera'],
    default: 'Biasa'
  },
  batasWaktu: {
    type: Date,
    required: true
  },
  catatan: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Diproses', 'Selesai'],
    default: 'Pending'
  },
  tanggapan: {
    type: String
  },
  tanggalSelesai: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Disposisi', disposisiSchema);
