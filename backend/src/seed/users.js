const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // adjust path

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️ Existing users removed');

    // Hash passwords
    const hashedHR = await bcrypt.hash('Hr@123456', 10);
    const hashedManager = await bcrypt.hash('Manager@123', 10);
    const hashedEmp = await bcrypt.hash('Emp@123456', 10);

    // Seed users with correct role values
    const users = await User.insertMany([
      {
        orgId: 'org1',
        email: 'hr@example.com',
        name: 'HR',
        role: 'HR_ADMIN',
        passwordHash: hashedHR,
      },
      {
        orgId: 'org1',
        email: 'manager@example.com',
        name: 'Manager',
        role: 'MANAGER',
        passwordHash: hashedManager,
      },
      {
        orgId: 'org1',
        email: 'emp@example.com',
        name: 'Employee',
        role: 'EMPLOYEE',
        passwordHash: hashedEmp,
        hourlyRate: 12,
      },
    ]);

    console.log(`✅ ${users.length} users seeded successfully`);

    await mongoose.disconnect();
    console.log('🔌 MongoDB Disconnected');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
