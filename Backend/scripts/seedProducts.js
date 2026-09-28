import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import products from '../data/products.js';

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();

    console.log('🗑️  Deleting existing products...');
    await Product.deleteMany();

    console.log(`📦 Inserting ${products.length} products...`);
    await Product.insertMany(products);

    console.log('✅ Products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedProducts();