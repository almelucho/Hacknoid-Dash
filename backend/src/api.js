const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, '../data.json');

app.use(cors());
app.use(express.json());

// Helper to read data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return { projects: [] };
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Audit Dashboard API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
