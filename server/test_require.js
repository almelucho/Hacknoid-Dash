try {
    const CisTemplate = require('./models/CisTemplate');
    console.log('✅ Loaded CisTemplate:', CisTemplate.modelName);
} catch (err) {
    console.error('❌ Error loading module:', err);
}
