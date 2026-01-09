import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@company.com' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin',
      leaveBalance: 30
    });

    console.log('Admin user created successfully:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123`);
    console.log(`Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
