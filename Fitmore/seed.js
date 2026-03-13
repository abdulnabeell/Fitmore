const mongoose = require('mongoose');
require('dotenv').config();

// Load Models
const Product = require('./src/models/productModel');
const Category = require('./src/models/Category');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitmore');
        console.log('MongoDB Connected...');

        // 1. Clear existing products and categories to avoid duplicates during seeding
        await Product.deleteMany();
        await Category.deleteMany();
        console.log('Cleared existing products and categories.');

        // 2. Create Categories
        const categories = [
            { name: 'Protein', slug: 'protein', description: 'High quality protein powders.' },
            { name: 'Creatine', slug: 'creatine', description: 'Muscle building and recovery.' },
            { name: 'Pre-Workout', slug: 'pre-workout', description: 'Energy and focus.' },
            { name: 'Vitamins & Health', slug: 'vitamins-health', description: 'Daily wellness essentials.' },
            { name: 'Accessories', slug: 'accessories', description: 'Training gear and apparel.' }
        ];

        const createdCategories = await Category.insertMany(categories);
        console.log('Categories created successfully.');

        // 3. Create Products mapping to the images available
        const seedProducts = [
            {
                name: '100% Whey Gold Standard',
                description: 'The industry standard for whey protein isolate. Fast digesting and great tasting.',
                price: 4500,
                category: 'Protein',
                stock: 120,
                images: ['/user/images/whey-gold.jpg'],
                rating: 4.8
            },
            {
                name: 'Elite Protein Blend',
                description: 'A slow and fast digesting protein matrix for sustained muscle recovery.',
                price: 3800,
                category: 'Protein',
                stock: 85,
                images: ['/user/images/protein-elite.jpg'],
                rating: 4.5
            },
            {
                name: 'BCAA Energy Splash',
                description: 'Branched-chain amino acids paired with natural caffeine for intra-workout focus.',
                price: 2200,
                category: 'Pre-Workout',
                stock: 200,
                images: ['/user/images/bcaa.jpg'],
                rating: 4.2
            },
            {
                name: 'Micronized Creatine Powder',
                description: '100% pure micronized creatine monohydrate for increased strength and power.',
                price: 1500,
                category: 'Creatine',
                stock: 300,
                images: ['/user/images/creatine-micronized.jpg'],
                rating: 4.9
            },
            {
                name: 'ON Creatine Monohydrate',
                description: 'Premium creatine monohydrate to support ATP production during intense training.',
                price: 1800,
                category: 'Creatine',
                stock: 150,
                images: ['/user/images/creatine-on.jpg'],
                rating: 4.7
            },
            {
                name: 'Creatine Detail Pack',
                description: 'A special bundle containing extra-strength creatine capsules.',
                price: 2000,
                category: 'Creatine',
                stock: 50,
                images: ['/user/images/creatine-on.jpg'],
                rating: 4.0
            },
            {
                name: 'High-Potency Fish Oil',
                description: 'Rich in EPA and DHA to support heart, brain, and joint health.',
                price: 1200,
                category: 'Vitamins & Health',
                stock: 400,
                images: ['/user/images/fish-oil-blace.jpg'],
                rating: 4.6
            },
            {
                name: 'Premium Gold Fish Oil',
                description: 'Enteric-coated fish oil softgels with zero fishy aftertaste.',
                price: 1600,
                category: 'Vitamins & Health',
                stock: 250,
                images: ['/user/images/fish-oil-gold.jpg'],
                rating: 4.8
            },
            {
                name: 'Omega 3 Daily',
                description: 'Essential daily Omega 3 complex to support overall athletic wellness.',
                price: 900,
                category: 'Vitamins & Health',
                stock: 500,
                images: ['/user/images/omega-3.jpg'],
                rating: 4.3
            },
            {
                name: 'Explosive Pre-Workout',
                description: 'Intense pump and energy formulation to crush your gym sessions.',
                price: 2500,
                category: 'Pre-Workout',
                stock: 180,
                images: ['/user/images/preworkout.png'],
                rating: 4.9
            },
            {
                name: 'VitaStrong Multivitamin',
                description: 'Comprehensive vitamin and mineral complex specifically dosed for athletes.',
                price: 1400,
                category: 'Vitamins & Health',
                stock: 220,
                images: ['/user/images/vitastrong.png'],
                rating: 4.5
            },
            {
                name: 'Shred & Cut Stack',
                description: 'Advanced thermogenic formula designed to support fat loss and preserve muscle.',
                price: 3200,
                category: 'Vitamins & Health',
                stock: 60,
                images: ['/user/images/supplements-cutting.png'],
                rating: 4.4
            },
            {
                name: 'Fitmore Signature Cap',
                description: 'Breathable, sweat-wicking baseball cap with the Fitmore embroidered logo.',
                price: 499,
                category: 'Accessories',
                stock: 1000,
                images: ['/user/images/nb-cap.jpg'],
                rating: 4.1
            },
            {
                name: 'Assorted Fitness Gear',
                description: 'Various lifestyle and training gear accessories from our collection.',
                price: 899,
                category: 'Accessories',
                stock: 450,
                images: ['/user/images/misc-download.jpg'],
                rating: 3.8
            }
        ];

        await Product.insertMany(seedProducts);
        console.log(`Successfully seeded ${seedProducts.length} products.`);

        process.exit(0);
    } catch (err) {
        console.error('Failed to seed database:', err);
        process.exit(1);
    }
};

seedDatabase();
