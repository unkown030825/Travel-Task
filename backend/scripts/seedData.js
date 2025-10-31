// require('dotenv').config();
// const mongoose = require('mongoose');
// const Experience = require('../models/Experience');
// const Slot = require('../models/Slot');
// const PromoCode = require('../models/PromoCode');

// const connectDB = require('../config/database');
// connectDB();

// const seedData = async () => {
//   try {
//     // Clear existing data
//     await Experience.deleteMany({});
//     await Slot.deleteMany({});
//     await PromoCode.deleteMany({});

//     // Create experiences
//     const experiences = await Experience.insertMany([
//       {
//         title: 'Sunset Yoga Session',
//         description: 'A relaxing yoga session during sunset at the beach',
//         image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
//         price: 25,
//         location: 'Miami Beach'
//       },
//       {
//         title: 'Wine Tasting Tour',
//         description: 'Guided tour through local vineyards with wine tasting',
//         image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
//         price: 45,
//         location: 'Napa Valley'
//       },
//       {
//         title: 'Cooking Masterclass',
//         description: 'Learn to cook authentic Italian cuisine with master chefs',
//         image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
//         price: 35,
//         location: 'Little Italy'
//       }
//     ]);

//     // Create slots for each experience
//     const slots = [];
//     const today = new Date();
    
//     experiences.forEach(experience => {
//       for (let i = 1; i <= 7; i++) {
//         const date = new Date(today);
//         date.setDate(today.getDate() + i);
        
//         slots.push({
//           experience_id: experience._id,
//           date: date,
//           time: '10:00 AM',
//           available_count: 20,
//           total_count: 20
//         });
        
//         slots.push({
//           experience_id: experience._id,
//           date: date,
//           time: '02:00 PM',
//           available_count: 15,
//           total_count: 15
//         });
//       }
//     });

//     await Slot.insertMany(slots);

//     // Create promo codes
//     await PromoCode.insertMany([
//       {
//         code: 'SAVE10',
//         type: 'percent',
//         value: 10,
//         active: true
//       },
//       {
//         code: 'FLAT100',
//         type: 'flat',
//         value: 100,
//         active: true
//       },
//       {
//         code: 'WELCOME20',
//         type: 'percent',
//         value: 20,
//         active: true
//       }
//     ]);

//     console.log('✅ Seed data created successfully!');
//     console.log(`📊 Created ${experiences.length} experiences`);
//     console.log(`📅 Created ${slots.length} slots`);
//     console.log(`🎫 Created 3 promo codes`);
    
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error seeding data:', error);
//     process.exit(1);
//   }
// };

// seedData();