const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory storage (for simplicity). Replace with a database for production.
const storedData = {};

// Store form data for a domain
app.post('/store-data', (req, res) => {
    const { domain, formData } = req.body;

    if (!domain || !formData) {
        return res.status(400).json({ error: 'Domain and form data are required.' });
    }

    // Store the form data under the domain
    if (!storedData[domain]) {
        storedData[domain] = [];
    }

    storedData[domain].push(formData);
    console.log(`Stored data for domain: ${domain}`, formData);

    res.json({ status: 'success', domain, stored: formData });
});

// Retrieve form data for a domain
app.get('/fetch-data/:domain', (req, res) => {
    const domain = req.params.domain;

    if (!domain) {
        return res.status(400).json({ error: 'Domain is required.' });
    }

    const data = storedData[domain] || [];
    console.log(`Fetching data for domain: ${domain}`, data);

    res.json({ status: 'success', domain, data });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});