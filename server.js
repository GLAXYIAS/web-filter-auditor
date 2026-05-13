const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors()); // This handles the CORS issues

app.get('/check', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL");

    try {
        // We use axios to follow redirects and see the final URL
        const response = await axios.get(targetUrl, {
            timeout: 5000,
            maxRedirects: 5,
            validateStatus: false, // Don't throw error on 403/404
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        res.json({
            reachable: true,
            finalUrl: response.request.res.responseUrl || targetUrl,
            status: response.status
        });
    } catch (error) {
        res.json({ reachable: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
