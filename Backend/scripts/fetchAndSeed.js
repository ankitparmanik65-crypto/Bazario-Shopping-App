import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config();

const fetchAndSeed = async () => {
  try {
    await connectDB();
    console.log('📡 Fetching products from DummyJSON...');

    // 194 products fetch karo
    const response = await fetch('https://dummyjson.com/products?limit=194');
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      throw new Error('No products fetched from DummyJSON');
    }

    console.log(`✅ Fetched ${data.products.length} products`);

    // ⭐ Format convert karo (with images)
    const formattedProducts = data.products.map((p) => ({
      name: p.title,
      description: p.description,
      price: Math.round(p.price * 83),
      category: p.category.toLowerCase().replace(/\s+/g, '-'),
      brand: p.brand || 'Bazario',
      image: p.thumbnail,
      images: p.images || [],   // ⭐ Multiple images
      stock: p.stock || 100,
      rating: p.rating || 0,
      numReviews: p.reviews?.length || 0,
      discountPercentage: p.discountPercentage || 0,
    }));

    console.log('🗑️  Deleting existing products...');
    await Product.deleteMany();

    console.log(`📦 Inserting ${formattedProducts.length} products...`);
    await Product.insertMany(formattedProducts);

    console.log('✅ Products seeded successfully!');
    console.log(`📊 Total: ${formattedProducts.length} products`);
    console.log(`📸 Each product has multiple images now!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

fetchAndSeed();