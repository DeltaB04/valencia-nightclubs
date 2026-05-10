const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Allow requests from GitHub Pages and localhost (for development)
const allowedOrigins = [
    /^https:\/\/.*\.github\.io$/,
    /^http:\/\/localhost(:\d+)?$/,
    /^http:\/\/127\.0\.0\.1(:\d+)?$/
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (curl, mobile apps)
        if (!origin) return callback(null, true);
        const allowed = allowedOrigins.some(pattern => pattern.test(origin));
        if (allowed) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin not allowed — ${origin}`));
        }
    }
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'Valencia Nightlife Proxy v1.0' });
});

// GET /api/reviews?name=Spook%20Club
app.get('/api/reviews', async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Missing ?name= parameter', reviews: [] });
    }

    if (!API_KEY) {
        console.error('GOOGLE_MAPS_API_KEY environment variable not set');
        return res.status(500).json({ error: 'Server misconfigured', reviews: [] });
    }

    try {
        // Step 1: Find the place ID
        const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
            `?input=${encodeURIComponent(name + ' Valencia')}` +
            `&inputtype=textquery` +
            `&fields=place_id` +
            `&key=${API_KEY}`;

        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (!searchData.candidates || searchData.candidates.length === 0) {
            return res.json({ reviews: [] });
        }

        const placeId = searchData.candidates[0].place_id;

        // Step 2: Get reviews from place details
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json` +
            `?place_id=${placeId}` +
            `&fields=reviews` +
            `&language=es` +
            `&key=${API_KEY}`;

        const detailsRes = await fetch(detailsUrl);
        const detailsData = await detailsRes.json();

        const reviews = (detailsData.result?.reviews || [])
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);

        return res.json({ reviews });

    } catch (err) {
        console.error('Error fetching reviews:', err.message);
        return res.status(500).json({ error: 'Failed to fetch reviews', reviews: [] });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Valencia Nightlife Proxy running on port ${PORT}`);
});
