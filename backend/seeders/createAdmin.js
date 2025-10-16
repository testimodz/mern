const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    // DELETE ALL USERS
    await User.deleteMany({});
    console.log('🗑️  All old users deleted!\n');
    
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
    
    console.log('═══════════════════════════════════════');
    console.log('✅ ADMIN CREATED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('  Login Credentials:');
    console.log('  ├─ Username : admin');
    console.log('  ├─ Email    : admin@admin.com');
    console.log('  └─ Password : 123456');
    console.log('');
    console.log('═══════════════════════════════════════\n');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
