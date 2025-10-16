const mongoose = require('mongoose');

const instansiSchema = new mongoose.Schema({
  namaInstansi: {
    type: String,
    required: true
  },
  alamat: {
    type: String,
    required: true
  },
  telepon: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  kepalaDinas: {
    type: String,
    required: true
  },
  nipKepala: {
    type: String,
    required: true
  },
  logo: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Instansi', instansiSchema);
