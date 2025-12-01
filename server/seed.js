const mongoose = require('mongoose');
const CisTemplate = require('./models/CisTemplate');
require('dotenv').config();

const seedData = [
    {
        controlNumber: 1,
        title: "Inventory and Control of Enterprise Assets",
        safeguards: [
            { originalId: "1.1", title: "Establish and Maintain Detailed Enterprise Asset Inventory", description: "...", implementationGroups: { ig1: true, ig2: true, ig3: true } },
            { originalId: "1.2", title: "Address Unauthorized Assets", description: "...", implementationGroups: { ig1: false, ig2: true, ig3: true } }
        ]
    },
    {
        controlNumber: 2,
        title: "Inventory and Control of Software Assets",
        safeguards: [
            { originalId: "2.1", title: "Establish and Maintain Software Inventory", description: "...", implementationGroups: { ig1: true, ig2: true, ig3: true } }
        ]
    }
    // Add more controls as needed
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('🌱 Seeding Database...');
        await CisTemplate.deleteMany({});
        await CisTemplate.insertMany(seedData);
        console.log('✅ Database Seeded!');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
