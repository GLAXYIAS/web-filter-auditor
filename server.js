const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your GitHub site can access this server
app.use(cors());

app.get('/check', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: "Missing URL parameter" });
    }

    try {
        // We use axios to fetch the headers of the target site
        const response = await axios.get(targetUrl, {
            timeout: 5000, // 5 second timeout
            maxRedirects: 5,
            validateStatus: false, // Don't throw error on 404s/403s
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // Send back the results to your Chromebook
        res.json({
            reachable: true,
            status: response.status,
            finalUrl: response.request.res.responseUrl || targetUrl
        });

    } catch (error) {
        // If the site is actually down on the real internet
        res.json({
            reachable: false,
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
