const { Admin } = require('../models'); // Adjust the path as needed
const bcrypt = require('bcrypt');

const createAdmin = async () => {
  const name = 'Admin2';
  const email = 'admin@gmail.com';
  const password = 'admin123'; 

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await Admin.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log('Admin created successfully!');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

createAdmin();
