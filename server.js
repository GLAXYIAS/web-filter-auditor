const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

app.get('/check', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL");

    try {
        const response = await axios.get(targetUrl, {
            timeout: 8000,
            maxRedirects: 10,
            validateStatus: false,
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
            }
        });

        const finalUrl = response.request.res.responseUrl || targetUrl;
        const pageContent = String(response.data).toLowerCase();

        // Check for Linewize signatures in the URL or the HTML content
        const isLinewize = 
            finalUrl.includes("linewize.net") || 
            pageContent.includes("linewize") || 
            pageContent.includes("familyzone") || // Linewize's parent company
            pageContent.includes("rule=");

        res.json({
            reachable: true,
            isBlockedByFilter: isLinewize,
            finalUrl: finalUrl,
            status: response.status
        });
    } catch (error) {
        res.json({ reachable: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
