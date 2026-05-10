const fs = require('fs');
const path = require('path');
const https = require('https');

// --- CONFIGURATION ---
const jsFile = path.join(__dirname, 'data.js');
const VALENCIA_CENTER = { lat: 39.4699, lng: -0.3763 };
const MAX_DISTANCE_KM = 40; // Only accept results within 40km of Valencia

/**
 * Calculates distance between two points in km
 */
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

/**
 * Fetches coordinates for a given club using Nominatim (OpenStreetMap)
 */
async function getNominatimCoordinates(query) {
    const encodedQuery = encodeURIComponent(query);
    const options = {
        hostname: 'nominatim.openstreetmap.org',
        path: `/search?q=${encodedQuery}&format=json&limit=5&addressdetails=1`,
        headers: {
            'User-Agent': 'ValenciaNightlifeApp_' + Math.random().toString(36).substring(7)
        }
    };

    return new Promise((resolve, reject) => {
        https.get(options, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode}`));
                return;
            }
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    if (!data.trim().startsWith('[')) { resolve(null); return; }
                    const results = JSON.parse(data);
                    
                    // Find the best match within Valencia area
                    for (const res of results) {
                        const lat = parseFloat(res.lat);
                        const lng = parseFloat(res.lon);
                        const dist = getDistance(VALENCIA_CENTER.lat, VALENCIA_CENTER.lng, lat, lng);
                        
                        if (dist < MAX_DISTANCE_KM) {
                            return resolve({ lat, lng, address: res.display_name });
                        }
                    }
                    resolve(null);
                } catch (e) { reject(e); }
            });
        }).on('error', (err) => reject(err));
    });
}

async function updateAllClubs() {
    console.log('🚀 Updating club data with improved search logic...');
    let jsContent = fs.readFileSync(jsFile, 'utf8');
    const clubRegex = /\{[^}]*name:\s*"([^"]+)"[^}]*\}/g;
    const matches = [...jsContent.matchAll(clubRegex)];

    for (const match of matches) {
        const fullMatch = match[0];
        const name = match[1];
        
        console.log(`🔍 Searching: ${name}...`);
        await new Promise(r => setTimeout(r, 1200)); // Respect rate limit
        
        // Try different search variations
        const variations = [
            `${name}, Valencia, Spain`,
            name,
            name.replace(/ Club| Downtown| Pop & Rock/g, '') + ', Valencia'
        ];

        let result = null;
        for (const v of variations) {
            try {
                result = await getNominatimCoordinates(v);
                if (result) break;
            } catch (e) { console.error(`Error with "${v}": ${e.message}`); }
        }
        
        if (result) {
            let updatedMatch = fullMatch.replace(/lat:\s*[\d.-]+/, `lat: ${result.lat.toFixed(6)}`);
            updatedMatch = updatedMatch.replace(/lng:\s*[\d.-]+/, `lng: ${result.lng.toFixed(6)}`);
            
            const shortAddress = result.address.split(',').slice(0, 2).join(',').trim();
            if (updatedMatch.includes('address:')) {
                updatedMatch = updatedMatch.replace(/address:\s*"[^"]*"/, `address: "${shortAddress}"`);
            }
            
            jsContent = jsContent.replace(fullMatch, updatedMatch);
            console.log(`✅ ${name} -> ${result.lat}, ${result.lng} (${shortAddress})`);
        } else {
            console.log(`❌ No reliable location found for ${name}.`);
        }
    }

    fs.writeFileSync(jsFile, jsContent, 'utf8');
    console.log('✨ Done! data.js updated.');
}

updateAllClubs();
