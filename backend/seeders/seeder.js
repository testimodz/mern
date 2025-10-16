const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('../models/User');
const Klasifikasi = require('../models/Klasifikasi');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Data
const klasifikasiData = [
  { kode: 'UM', nama: 'Umum', deskripsi: 'Surat Umum' },
  { kode: 'KP', nama: 'Kepegawaian', deskripsi: 'Surat Kepegawaian' },
  { kode: 'KU', nama: 'Keuangan', deskripsi: 'Surat Keuangan' },
  { kode: 'PD', nama: 'Pendidikan', deskripsi: 'Surat Pendidikan' },
  { kode: 'PR', nama: 'Perlengkapan', deskripsi: 'Surat Perlengkapan' }
];

const usersData = [
  {
    username: 'admin',
    nama: 'Super Administrator',
    email: 'admin@eletter.com',
    password: 'admin',
    nip: '199001012020011001',
    jabatan: 'Administrator Sistem',
    level: 'super_admin',
    foto: ''
  },
  {
    username: 'pimpinan',
    nama: 'Kepala Dinas',
    email: 'pimpinan@eletter.com',
    password: 'pimpinan',
    nip: '198501012019011001',
    jabatan: 'Kepala Dinas',
    level: 'pimpinan',
    foto: ''
  },
  {
    username: 'user',
    nama: 'Staff Administrasi',
    email: 'user@eletter.com',
    password: 'user',
    nip: '199501012021011001',
    jabatan: 'Staff Administrasi',
    level: 'user',
    foto: ''
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear database
    console.log('🗑️  Clearing database...');
    await User.deleteMany({});
    await Klasifikasi.deleteMany({});
    console.log('✅ Database cleared');

    // Seed Klasifikasi
    console.log('📂 Seeding klasifikasi...');
    await Klasifikasi.insertMany(klasifikasiData);
    console.log('✅ Klasifikasi seeded');

    // Hash passwords & seed users
    console.log('👤 Seeding users...');
    for (let userData of usersData) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    await User.insertMany(usersData);
    console.log('✅ Users seeded');

    console.log('\n🎉 Seeding complete!');
    console.log('\n📋 Login credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin:');
    console.log('  Username: admin');
    console.log('  Password: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Pimpinan:');
    console.log('  Username: pimpinan');
    console.log('  Password: pimpinan');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('User:');
    console.log('  Username: user');
    console.log('  Password: user');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
