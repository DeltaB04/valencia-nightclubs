// ─── Configuration ────────────────────────────────────────────────────────────
// Proxy URL: replace with your Cloud Run service URL after deployment
const PROXY_URL = 'https://valencia-nightlife-proxy-XXXXXXXX-ew.a.run.app';

// Google Sheets CSV export URL:
// 1. Create a Google Sheet with columns: clubName,title,date,hype,description,instagram,url
// 2. File → Share → Publish to web → Sheet1 → CSV → Copy URL
// 3. Paste that URL here:
const SHEETS_CSV_URL = '';
// ───────────────────────────────────────────────────────────────────────────────

// Initialize map centered on Valencia (Using Google Maps)
let map;
let markers = [];
const valenciaCenter = { lat: 39.4699, lng: -0.3763 };

const darkStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

const lightStyle = [
    { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] }
];

function initMap() {
    console.log("Google Maps API callback triggered.");
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error("Critical Error: Map element #map not found in the DOM.");
        return;
    }

    try {
        if (typeof google === 'undefined' || !google.maps) {
            throw new Error('google.maps is not available — the Maps API failed to load.');
        }
        map = new google.maps.Map(mapElement, {
            center: valenciaCenter,
            zoom: 14,
            disableDefaultUI: true,
            styles: darkStyle
        });
        console.log("Google Map instance created successfully.");
        renderMarkers();
        initMapControls();
    } catch (error) {
        console.error("Google Maps Initialization Failed:", error);
        // Surface the failure in the UI (index.html may have already shown an error;
        // this guards against silent failures where the API loads but Map() throws).
        if (mapElement && !mapElement.querySelector('.map-error')) {
            const err = document.createElement('div');
            err.className = 'map-error';
            err.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;color:#f8fafc;padding:20px;text-align:center;background:#0f172a;';
            err.innerHTML = `<h2 style="margin:0 0 12px 0;font-family:'Outfit',sans-serif;">⚠️ No se pudo inicializar el mapa</h2><p style="margin:0 0 8px 0;max-width:520px;line-height:1.5;">${error.message || error}</p>`;
            mapElement.appendChild(err);
        }
    }
}
window.initMap = initMap;

// Custom Marker rendering using OverlayView for custom HTML markers
function renderMarkers() {
    clubsData.forEach(club => {
        const marker = new google.maps.Marker({
            position: { lat: club.lat, lng: club.lng },
            map: map,
            title: club.name,
            icon: {
                path: "M12,2C8.1,2,5,5.1,5,9c0,5.2,7,13,7,13s7-7.8,7-13C19,5.1,15.9,2,12,2z",
                fillColor: '#8b5cf6',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                scale: 1.5,
                anchor: new google.maps.Point(12, 22)
            }
        });

        marker.addListener('click', () => {
            showClubDetails(club);
            map.panTo({ lat: club.lat, lng: club.lng });
            map.setZoom(17);
        });

        markers.push(marker);
    });
}

// State
const sidebar = document.getElementById('club-details');
const detailsContent = document.getElementById('details-content');
const closeBtn = document.getElementById('close-sidebar');
let directionsService;
let directionsRenderer;
let routePolylines = [];
let routeMarkers = [];
let userLocation = null;
let currentProfile = 'foot';
let activeClub = null;
let routeRequestId = 0;

// Utils
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestStation(lat, lng) {
    let nearest = null;
    let minDist = Infinity;
    for (const station of metroStations) {
        const dist = getDistance(lat, lng, station.lat, station.lng);
        if (dist < minDist) {
            minDist = dist;
            nearest = station;
        }
    }
    return { station: nearest, distance: minDist };
}

function getPathMidpoint(path) {
    if (!path || path.length === 0) return null;
    const midIdx = Math.floor(path.length / 2);
    const mid = path[midIdx];
    return mid.lat && mid.lng ? mid : { lat: mid[0], lng: mid[1] };
}

function getStationLabelIcon(name) {
    const width = name.length * 8 + 20;
    const svg = `<svg width="${width}" height="24" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" rx="12" fill="rgba(0,0,0,0.8)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="10" font-weight="bold">${name}</text>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function findMetroPath(startId, endId) {
    if (startId === endId) return [];
    const getCoords = (pathIds) => pathIds.map(id => {
        const s = metroStations.find(st => st.id === id);
        return [s.lat, s.lng];
    });
    const getDirectPath = (sId, eId) => {
        for (const line of metroLines) {
            const sIdx = line.path.indexOf(sId);
            const eIdx = line.path.indexOf(eId);
            if (sIdx !== -1 && eIdx !== -1) {
                return sIdx < eIdx ? line.path.slice(sIdx, eIdx + 1) : line.path.slice(eIdx, sIdx + 1).reverse();
            }
        }
        return null;
    };
    const direct = getDirectPath(startId, endId);
    if (direct) return getCoords(direct);
    const hubs = ["guimera", "colon", "alameda", "xativa", "benimaclet", "maritim"];
    for (const hub of hubs) {
        if (startId === hub || endId === hub) continue;
        const p1 = getDirectPath(startId, hub);
        const p2 = getDirectPath(hub, endId);
        if (p1 && p2) return getCoords([...p1, ...p2.slice(1)]);
    }
    const s1 = metroStations.find(st => st.id === startId);
    const s2 = metroStations.find(st => st.id === endId);
    return [[s1.lat, s1.lng], [s2.lat, s2.lng]];
}

async function getWalkingRoute(start, end) {
    return new Promise((resolve) => {
        directionsService.route({
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                resolve(result.routes[0]);
            } else {
                resolve(null);
            }
        });
    });
}

function removeRoute() {
    if (directionsRenderer) directionsRenderer.setMap(null);
    routePolylines.forEach(p => p.setMap(null));
    routeMarkers.forEach(m => m.setMap(null));
    routePolylines = [];
    routeMarkers = [];
}


function showClubDetails(club) {
    activeClub = club;
    removeRoute();
    sidebar.classList.remove('hidden');
    document.getElementById('news-btn').style.display = 'none'; // Hide news button

    const t = translations[currentLanguage];

    const stars = "⭐".repeat(Math.round(club.drinkQuality)) + "☆".repeat(5 - Math.round(club.drinkQuality));

    detailsContent.innerHTML = `
        <div class="club-hero" style="background-image: url('${club.image}')"></div>
        <div class="club-header-info">
            <h2 class="club-name">${club.name}</h2>
            <p class="club-meta">🎵 ${club.type}</p>
            <p class="club-address">📍 ${club.address}</p>
            ${club.description ? `<p class="club-description" style="margin-top: 10px; font-size: 0.95rem; line-height: 1.5; color: #d1d5db;">${club.description}</p>` : ''}
        </div>


        <div class="section route-section">
            <button class="route-btn" id="calculate-route-btn">📍 ${t.routeTo}</button>
            <div class="route-options" id="route-options" style="display: none; margin-top: 10px; display: flex; gap: 5px;">
                <button class="route-option-btn active" data-profile="car">🚗 ${t.driving}</button>
                <button class="route-option-btn" data-profile="foot">🚶 ${t.walking}</button>
                <button class="route-option-btn" data-profile="transit">🚇 ${t.metro}</button>
            </div>
            <div id="route-status" class="route-status"></div>
        </div>

        <div class="section">
            <h3>🕒 ${t.schedule}</h3>
            <p>${club.schedule}</p>
        </div>

        <div class="section">
            <h3>🛡️ ${t.additionalInfo}</h3>
            <div class="info-grid">
                <div class="info-card">
                    <span class="info-label">${t.minors}:</span>
                    <span class="badge ${club.minorsAllowed ? 'success' : 'danger'}">
                        ${club.minorsAllowed ? t.allowed : t.prohibited}
                    </span>
                </div>
                ${club.minorsCondition ? `<div class="info-card"><span class="info-label">Nota:</span><span class="info-value">${club.minorsCondition}</span></div>` : ''}
                <div class="info-card">
                    <span class="info-label">${t.drinkQuality}:</span>
                    <div class="rating-container">
                        <span class="rating-stars">${stars}</span>
                        <span class="info-value">${club.drinkQuality}/5</span>
                    </div>
                </div>
                <div class="info-card">
                    <span class="info-label">${t.reviews}:</span>
                    <span class="info-value">${club.reviewsCount} opinions</span>
                </div>
            </div>
        </div>

        <div class="section">
            <h3>🎉 ${t.events}</h3>
            <div class="events-list">
                ${club.events.map(event => `
                    <div class="event-item">
                        <div class="event-date">${event.date}</div>
                        <div class="event-title">${event.title}</div>
                        <div class="event-dj">🎧 ${event.dj}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h3>💬 ${t.topReviews}</h3>
            <div id="reviews-container" class="reviews-list">
                <p class="loading-text">${t.loadingReviews}</p>
            </div>
        </div>
    `;
    fetchClubReviews(club);
    const routeBtn = document.getElementById('calculate-route-btn');
    const routeOptions = document.getElementById('route-options');
    routeBtn.addEventListener('click', () => {
        if (!userLocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                routeBtn.style.display = 'none';
                routeOptions.style.display = 'flex';
                calculateRoute(club, currentProfile);
            });
        } else {
            routeBtn.style.display = 'none';
            routeOptions.style.display = 'flex';
            calculateRoute(club, currentProfile);
        }
    });
    document.querySelectorAll('.route-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.route-option-btn').forEach(b => b.classList.remove('active'));
            e.target.closest('.route-option-btn').classList.add('active');
            currentProfile = e.target.closest('.route-option-btn').dataset.profile;
            calculateRoute(club, currentProfile);
        });
    });
}

async function fetchClubReviews(club) {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    // If no proxy is configured yet, fall back silently
    if (!PROXY_URL || PROXY_URL.includes('XXXXXXXX')) {
        container.innerHTML = `<p class="no-results">🔧 Proxy no configurado aún — ver instrucciones de despliegue.</p>`;
        return;
    }

    try {
        const res = await fetch(`${PROXY_URL}/api/reviews?name=${encodeURIComponent(club.name)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const reviews = data.reviews || [];

        if (reviews.length === 0) {
            container.innerHTML = `<p class="no-results">${translations[currentLanguage].noResults}</p>`;
            return;
        }

        container.innerHTML = reviews.map(r => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${r.author_name}</span>
                    <span class="review-rating">${'⭐'.repeat(r.rating)}</span>
                </div>
                <p class="review-text">"${r.text.substring(0, 150)}${r.text.length > 150 ? '...' : ''}"</p>
            </div>
        `).join('');

    } catch (err) {
        console.error('Error fetching reviews via proxy:', err);
        container.innerHTML = `<p class="no-results">${translations[currentLanguage].noResults}</p>`;
    }
}

async function calculateRoute(club, profile) {
    removeRoute();
    const requestId = ++routeRequestId;
    const statusEl = document.getElementById('route-status');
    const t = translations[currentLanguage];

    if (!directionsService) directionsService = new google.maps.DirectionsService();
    if (!directionsRenderer) {
        directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#8b5cf6',
                strokeWeight: 5,
                strokeOpacity: 0.8
            }
        });
    }
    directionsRenderer.setMap(map);

    if (profile === 'transit') {
        statusEl.innerHTML = t.calculatingMetro;
        const userNearest = findNearestStation(userLocation.lat, userLocation.lng);
        const clubNearest = findNearestStation(club.lat, club.lng);

        const walk1 = await getWalkingRoute(userLocation, userNearest.station);
        if (requestId !== routeRequestId) return;
        const walk2 = await getWalkingRoute(clubNearest.station, club);
        if (requestId !== routeRequestId) return;

        if (walk1 && walk2) {
            const metroCoords = findMetroPath(userNearest.station.id, clubNearest.station.id);
            if (requestId !== routeRequestId) return;

            const p1 = new google.maps.Polyline({
                path: walk1.overview_path,
                strokeColor: '#8b5cf6',
                strokeOpacity: 0.6,
                strokeWeight: 4,
                icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 }, offset: '0', repeat: '10px' }],
                map: map
            });

            const metroLine = new google.maps.Polyline({
                path: metroCoords.map(c => ({ lat: c[0], lng: c[1] })),
                strokeColor: '#FF0000',
                strokeOpacity: 0.9,
                strokeWeight: 6,
                map: map
            });

            const p2 = new google.maps.Polyline({
                path: walk2.overview_path,
                strokeColor: '#8b5cf6',
                strokeOpacity: 0.6,
                strokeWeight: 4,
                icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 }, offset: '0', repeat: '10px' }],
                map: map
            });

            routePolylines.push(p1, metroLine, p2);

            // Labels on Route
            const mid1 = getPathMidpoint(walk1.overview_path);
            const w1Time = Math.round(walk1.legs[0].duration.value / 60);
            const l1 = new google.maps.Marker({
                position: mid1,
                map: map,
                label: { text: `🚶 ${w1Time} min`, color: "white", fontSize: "11px", fontWeight: "bold" },
                icon: { path: google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#8b5cf6', fillOpacity: 0.9, strokeColor: '#FFFFFF', strokeWeight: 1 }
            });

            const lStation = new google.maps.Marker({
                position: userNearest.station,
                map: map,
                icon: {
                    url: getStationLabelIcon(userNearest.station.name.toUpperCase()),
                    anchor: new google.maps.Point((userNearest.station.name.length * 8 + 20) / 2, 12)
                },
                zIndex: 1000
            });

            const metroPath = metroCoords.map(c => ({ lat: c[0], lng: c[1] }));
            const midM = getPathMidpoint(metroPath);
            const mTime = metroCoords.length * 3;
            const lMetro = new google.maps.Marker({
                position: midM,
                map: map,
                label: { text: `🚇 ${mTime} min`, color: "white", fontSize: "11px", fontWeight: "bold" },
                icon: { path: google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#FF0000', fillOpacity: 0.9, strokeColor: '#FFFFFF', strokeWeight: 1 }
            });

            const m1 = new google.maps.Marker({
                position: userNearest.station,
                map: map,
                icon: { path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: '#FF0000', fillOpacity: 1, strokeColor: '#FFFFFF', strokeWeight: 2 },
                title: `${t.entry}: ${userNearest.station.name}`
            });
            const m2 = new google.maps.Marker({
                position: clubNearest.station,
                map: map,
                icon: { path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: '#FF0000', fillOpacity: 1, strokeColor: '#FFFFFF', strokeWeight: 2 },
                title: `${t.exit}: ${clubNearest.station.name}`
            });

            // Labels on Route (Continuation)
            const mid2 = getPathMidpoint(walk2.overview_path);
            const w2Time = Math.round(walk2.legs[0].duration.value / 60);
            const l2 = new google.maps.Marker({
                position: mid2,
                map: map,
                label: { text: `🚶 ${w2Time} min`, color: "white", fontSize: "11px", fontWeight: "bold" },
                icon: { path: google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#8b5cf6', fillOpacity: 0.9, strokeColor: '#FFFFFF', strokeWeight: 1 }
            });

            const lStationExit = new google.maps.Marker({
                position: clubNearest.station,
                map: map,
                icon: {
                    url: getStationLabelIcon(clubNearest.station.name.toUpperCase()),
                    anchor: new google.maps.Point((clubNearest.station.name.length * 8 + 20) / 2, 12)
                },
                zIndex: 1000
            });
            
            routeMarkers.push(l1, lStation, lMetro, l2, lStationExit, m1, m2);

            const walkTime = Math.round((walk1.legs[0].duration.value + walk2.legs[0].duration.value) / 60);
            const totalTime = walkTime + (metroCoords.length * 3);
            statusEl.innerHTML = `⏱️ ${t.estTime}: ${totalTime} min (${t.walking} + ${t.metro})`;
        }
        return;
    }

    const mode = profile === 'car' ? google.maps.TravelMode.DRIVING : google.maps.TravelMode.WALKING;

    directionsService.route({
        origin: userLocation,
        destination: { lat: club.lat, lng: club.lng },
        travelMode: mode
    }, (result, status) => {
        if (requestId !== routeRequestId) return;
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            const route = result.routes[0].legs[0];
            statusEl.innerHTML = `⏱️ ${route.duration.text} (${route.distance.text})`;

            const uMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: '#3b82f6',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 8
                }
            });
            routeMarkers.push(uMarker);
        }
    });
}

// Logic for Panels
function initNewsPanel() {
    const newsBtn = document.getElementById('news-btn');
    const newsPanel = document.getElementById('news-panel');
    const closeNews = document.getElementById('close-news');
    const eventsList = document.getElementById('events-list');
    if (!newsBtn || !newsPanel || !eventsList) return;
    newsBtn.addEventListener('click', () => {
        newsPanel.classList.toggle('hidden');
        if (!newsPanel.classList.contains('hidden')) renderEvents();
    });
    closeNews.addEventListener('click', () => newsPanel.classList.add('hidden'));
    function renderEvents() {
        const sortedEvents = [...eventsData].sort((a, b) => b.hype - a.hype);
        eventsList.innerHTML = sortedEvents.map(event => `
            <a href="${event.url}" target="_blank" class="event-link">
                <div class="event-card">
                    <span class="event-club">${event.clubName}</span>
                    <span class="event-title">${event.title}</span>
                    <p class="event-desc">${event.description}</p>
                    <div class="event-footer">
                        <span class="event-date">📅 ${event.date}</span>
                        <span class="event-insta">📸 ${event.instagram}</span>
                    </div>
                </div>
            </a>
        `).join('');
    }
}

function initSettingsPanel() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.getElementById('close-settings');
    const languageSelect = document.getElementById('language-select');
    if (!settingsBtn || !settingsPanel) return;
    settingsBtn.addEventListener('click', () => settingsPanel.classList.toggle('hidden'));
    closeSettings.addEventListener('click', () => settingsPanel.classList.add('hidden'));
    languageSelect.addEventListener('change', (e) => updateLanguage(e.target.value));
}

function initWizard() {
    const wizardBtn = document.getElementById('wizard-btn');
    const wizardPanel = document.getElementById('wizard-panel');
    const closeWizard = document.getElementById('close-wizard');
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const optionBtns = wizardPanel.querySelectorAll('.option-btn');
    const resultsList = document.getElementById('wizard-results-list');
    const restartBtn = document.getElementById('restart-wizard');
    let selections = { music: '', style: '', atmosphere: '' };
    if (!wizardBtn || !wizardPanel) return;
    wizardBtn.addEventListener('click', () => {
        wizardPanel.classList.toggle('hidden');
        if (!wizardPanel.classList.contains('hidden')) resetWizard();
    });
    closeWizard.addEventListener('click', () => wizardPanel.classList.add('hidden'));
    optionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const step = parseInt(e.target.closest('.wizard-step').dataset.step);
            const value = e.target.dataset.value;
            if (step === 1) selections.music = value;
            if (step < 1) goToStep(step + 1);
            else showResults();
        });
    });
    restartBtn.addEventListener('click', resetWizard);
    function goToStep(step) {
        wizardSteps.forEach(s => s.classList.add('hidden'));
        const nextStep = wizardPanel.querySelector(`.wizard-step[data-step="${step}"]`);
        if (nextStep) nextStep.classList.remove('hidden');
    }
    function resetWizard() { selections = { music: '' }; goToStep(1); document.getElementById('wizard-results').classList.add('hidden'); }
    function showResults() {
        wizardSteps.forEach(s => s.classList.add('hidden'));
        document.getElementById('wizard-results').classList.remove('hidden');
        const scoredClubs = clubsData.map(club => {
            let score = 0;
            if (club.type.toLowerCase().includes(selections.music.toLowerCase())) score += 50;
            return { ...club, score };
        });
        scoredClubs.sort((a, b) => b.score - a.score);
        resultsList.innerHTML = scoredClubs.slice(0, 5).map(club => `
            <div class="wizard-result-card" onclick="window.focusClub(${club.id})">
                <div class="result-thumb" style="background-image: url('${club.image}')"></div>
                <div class="result-info">
                    <h4>${club.name}</h4>
                    <p>${club.type}</p>
                </div>
            </div>
        `).join('');
    }
}

const translations = {
    es: {
        headerSubtitle: "Descubre tu noche perfecta",
        searchPlaceholder: "Buscar discoteca o género...",
        newsBtn: "Novedades",
        newsTitle: "🔥 Próximos Eventos",
        settingsBtn: "Ajustes",
        settingsTitle: "⚙️ Ajustes",
        languageLabel: "Idioma",
        routeTo: "Cómo llegar",
        driving: "Coche",
        walking: "A pie",
        metro: "Metro",
        schedule: "Horario",
        calculatingMetro: "Calculando ruta en metro...",
        estTime: "Tiempo est",
        entry: "Entrada",
        exit: "Salida",
        noResults: "No hay resultados",
        additionalInfo: "Info Adicional",
        minors: "Menores",
        allowed: "Permitido",
        prohibited: "Prohibido",
        drinkQuality: "Calidad Copas",
        reviews: "Reseñas",
        events: "Eventos",
        topReviews: "Mejores Opiniones",
        loadingReviews: "Cargando opiniones reales..."
    },
    en: {
        headerSubtitle: "Discover your perfect night",
        searchPlaceholder: "Search club or genre...",
        newsBtn: "News",
        newsTitle: "🔥 Upcoming Events",
        settingsBtn: "Settings",
        settingsTitle: "⚙️ Settings",
        languageLabel: "Language",
        routeTo: "How to get there",
        driving: "Driving",
        walking: "Walking",
        metro: "Metro",
        schedule: "Schedule",
        calculatingMetro: "Calculating metro route...",
        estTime: "Est. time",
        entry: "Entry",
        exit: "Exit",
        noResults: "No results found",
        additionalInfo: "Additional Info",
        minors: "Minors",
        allowed: "Allowed",
        prohibited: "Prohibited",
        drinkQuality: "Drink Quality",
        reviews: "Reviews",
        events: "Events",
        topReviews: "Best Reviews",
        loadingReviews: "Loading real reviews..."
    }
};

let currentLanguage = 'es';
function updateLanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang];

    // Update main UI elements
    document.getElementById('header-subtitle').textContent = t.headerSubtitle;
    document.getElementById('search-input').placeholder = t.searchPlaceholder;
    document.getElementById('news-btn-text').textContent = t.newsBtn;
    document.getElementById('news-panel-title').textContent = t.newsTitle;
    document.getElementById('settings-btn-text').textContent = t.settingsBtn;
    document.getElementById('settings-panel-title').textContent = t.settingsTitle;
    document.getElementById('language-label').textContent = t.languageLabel;

    // Update sidebar if open
    if (activeClub) {
        showClubDetails(activeClub);
    }
}

// Map Controls Style Toggle — wired up only once the Map is ready, so it never
// races with Google Maps loading and never throws if the user clicks too early.
function initMapControls() {
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const style = e.target.closest('.style-btn').dataset.style;
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            e.target.closest('.style-btn').classList.add('active');

            if (!map) return;
            if (style === 'dark') {
                map.setOptions({ styles: darkStyle, mapTypeId: 'roadmap' });
            } else if (style === 'light') {
                map.setOptions({ styles: lightStyle, mapTypeId: 'roadmap' });
            } else if (style === 'satellite') {
                map.setOptions({ styles: lightStyle, mapTypeId: 'satellite' });
            }
        });
    });
}

closeBtn.addEventListener('click', () => {
    sidebar.classList.add('hidden');
    document.getElementById('news-btn').style.display = 'flex';
    activeClub = null;
    removeRoute();
});

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    if (!searchInput || !searchResults) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.classList.add('hidden');
            return;
        }

        const matches = clubsData.filter(club =>
            club.name.toLowerCase().includes(query) ||
            club.type.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            searchResults.innerHTML = matches.map(club => `
                <div class="search-result-item" onclick="window.focusClub(${club.id}); document.getElementById('search-results').classList.add('hidden');">
                    <span class="search-result-name">${club.name}</span>
                    <span class="search-result-type">${club.type}</span>
                </div>
            `).join('');
            searchResults.classList.remove('hidden');
        } else {
            searchResults.innerHTML = `<div class="search-no-results">${translations[currentLanguage].noResults}</div>`;
            searchResults.classList.remove('hidden');
        }
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.add('hidden');
        }
    });
}

// ─── Google Sheets Events Loader ───────────────────────────────────────────────
/**
 * Fetches events from a public Google Sheets CSV export.
 * Falls back to the static eventsData array if the URL is not set or the fetch fails.
 *
 * Sheet column order expected:
 *   clubName | title | date | hype | description | instagram | url
 */
async function fetchEventsFromSheets() {
    if (!SHEETS_CSV_URL) return; // No URL set, use static data

    try {
        const res = await fetch(SHEETS_CSV_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();

        const rows = text.trim().split('\n').slice(1); // Skip header row
        const parsed = rows.map((row, i) => {
            // Handle quoted fields with commas inside
            const cols = row.match(/(?:"([^"]*)"|([^,]*))/g)
                .map(c => c.replace(/^"|"$/g, '').trim());
            return {
                id: i + 100, // Avoid ID clash with static data
                clubName:    cols[0] || '',
                title:       cols[1] || '',
                date:        cols[2] || '',
                hype:        parseInt(cols[3], 10) || 50,
                description: cols[4] || '',
                instagram:   cols[5] || '',
                url:         cols[6] || '#'
            };
        }).filter(e => e.clubName && e.title);

        if (parsed.length > 0) {
            // Replace static data with live data
            eventsData.length = 0;
            parsed.forEach(e => eventsData.push(e));
            console.log(`✅ Eventos cargados desde Google Sheets: ${parsed.length}`);
        }
    } catch (err) {
        console.warn('⚠️ No se pudo cargar eventos desde Sheets, usando datos estáticos:', err.message);
    }
}
// ───────────────────────────────────────────────────────────────────────────────

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    await fetchEventsFromSheets(); // Load live events before rendering panels
    initSearch();
    initNewsPanel();
    initSettingsPanel();
    initWizard();
});

// Global for wizard search focus
window.focusClub = (id) => {
    const club = clubsData.find(c => c.id === id);
    if (club) {
        showClubDetails(club);
        map.panTo({ lat: club.lat, lng: club.lng });
        map.setZoom(17);
    }
};
