const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Config
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  isAdmin: true,
};

// Import data
const importData = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      // Create admin user
      await User.create(adminUser);
      console.log('Admin user created successfully');
    }
    
    console.log('Data Import Success');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    // Delete admin user
    await User.deleteOne({ email: adminUser.email });
    
    console.log('Admin user removed');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 