const mongoose = require('mongoose');
const CisTemplate = require('./models/CisTemplate');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const count = await CisTemplate.countDocuments();
        console.log(`📊 CisTemplates count: ${count}`);
        const templates = await CisTemplate.find();
        console.log('Templates found:', templates);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
