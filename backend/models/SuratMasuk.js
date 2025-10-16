const mongoose = require('mongoose');

const suratMasukSchema = new mongoose.Schema({
  nomorAgenda: {
    type: String,
    required: true,
    unique: true
  },
  nomorSurat: {
    type: String,
    required: true
  },
  tanggalSurat: {
    type: Date,
    required: true
  },
  tanggalDiterima: {
    type: Date,
    required: true,
    default: Date.now
  },
  asalSurat: {
    type: String,
    required: true
  },
  perihal: {
    type: String,
    required: true
  },
  klasifikasi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Klasifikasi',
    required: true
  },
  sifat: {
    type: String,
    enum: ['Biasa', 'Segera', 'Sangat Segera', 'Rahasia'],
    default: 'Biasa'
  },
  lampiran: {
    type: String
  },
  fileSurat: {
    type: String,
    required: true
  },
  keterangan: {
    type: String
  },
  status: {
    type: String,
    enum: ['Diterima', 'Diproses', 'Selesai', 'Arsip'],
    default: 'Diterima'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Auto increment nomor agenda
suratMasukSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  const year = new Date().getFullYear();
  const count = await this.constructor.countDocuments({
    createdAt: {
      $gte: new Date(year, 0, 1),
      $lt: new Date(year + 1, 0, 1)
    }
  });
  
  this.nomorAgenda = `${String(count + 1).padStart(4, '0')}/SM/${year}`;
  next();
});

module.exports = mongoose.model('SuratMasuk', suratMasukSchema);
