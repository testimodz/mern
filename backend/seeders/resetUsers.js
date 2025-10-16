const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // DELETE ALL USERS
    await User.deleteMany({});
    console.log('All users deleted!');
    
    // CREATE NEW ADMIN with username
    const admin = new User({
      username: 'admin',
      nama: 'Super Administrator',
      email: 'admin@admin.com',
      password: '123456',
      jabatan: 'Administrator',
      level: 'super_admin',
      nip: 'ADMIN001'
    });

    await admin.save();
    console.log('\n✅ Admin created successfully!');
    console.log('═══════════════════════════════');
    console.log('Username: admin');
    console.log('Email: admin@admin.com');
    console.log('Password: 123456');
    console.log('═══════════════════════════════\n');
    
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
