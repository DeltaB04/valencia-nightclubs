const metroColors = {
    1: '#FFD700', // Yellow
    2: '#FF69B4', // Pink
    3: '#FF0000', // Red
    4: '#0000FF', // Blue
    5: '#008000', // Green
    6: '#800080', // Purple
    7: '#FFA500', // Orange
    8: '#00FFFF', // Teal/Cyan
    9: '#8B4513', // Brown
    10: '#90EE90' // Light Green
};

const metroStations = [
    { id: "xativa", name: "Xàtiva", lat: 39.4674, lng: -0.3776, lines: [3, 5, 9] },
    { id: "colon", name: "Colón", lat: 39.4705, lng: -0.3713, lines: [3, 5, 7, 9] },
    { id: "alameda", name: "Alameda", lat: 39.4735, lng: -0.3606, lines: [3, 5, 7, 9] },
    { id: "guimera", name: "Àngel Guimerà", lat: 39.4695, lng: -0.3846, lines: [1, 2, 3, 5, 9] },
    { id: "espanya", name: "Pl. Espanya", lat: 39.4658, lng: -0.3807, lines: [1, 2] },
    { id: "turia", name: "Túria", lat: 39.4812, lng: -0.3887, lines: [1, 2] },
    { id: "facultats", name: "Facultats - Manuel Broseta", lat: 39.4777, lng: -0.3644, lines: [3, 9] },
    { id: "benimaclet", name: "Benimaclet", lat: 39.4842, lng: -0.3592, lines: [3, 4, 6, 9] },
    { id: "amistat", name: "Amistat - Casa de la Salud", lat: 39.4705, lng: -0.3475, lines: [5, 7] },
    { id: "ayora", name: "Ayora", lat: 39.4665, lng: -0.3406, lines: [5, 7] },
    { id: "maritim", name: "Marítim-Serrería", lat: 39.4641, lng: -0.3344, lines: [5, 7, 8] },
    { id: "marina", name: "Marina Reial Joan Carles I", lat: 39.4623, lng: -0.3297, lines: [8] },
    { id: "neptu", name: "Neptú", lat: 39.4622, lng: -0.3241, lines: [8] },
    { id: "tarongers", name: "Tarongers - Ernest Lluch", lat: 39.4800, lng: -0.3392, lines: [4, 6] },
    { id: "carrasca", name: "La Carrasca", lat: 39.4806, lng: -0.3435, lines: [4, 6] },
    { id: "campanar", name: "Campanar", lat: 39.4851, lng: -0.3929, lines: [1, 2] },
    { id: "nou_octubre", name: "Nou d'Octubre", lat: 39.4716, lng: -0.4045, lines: [3, 5, 9] },
    { id: "av_cid", name: "Avinguda del Cid", lat: 39.4687, lng: -0.3962, lines: [3, 5, 9] },
    { id: "alacant", name: "Alacant", lat: 39.4642, lng: -0.3756, lines: [10] },
    { id: "amado", name: "Amado Granell - Montolivet", lat: 39.4533, lng: -0.3622, lines: [10] },
    { id: "quatre", name: "Quatre Carreres", lat: 39.4503, lng: -0.3541, lines: [10] },
    { id: "ciutat", name: "Ciutat Arts i Ciències - Justícia", lat: 39.4519, lng: -0.3524, lines: [10] }
];

// Defined sequences for metro lines (simplified main segments)
const metroLines = [
    { line: 3, path: ["nou_octubre", "av_cid", "guimera", "xativa", "colon", "alameda", "facultats", "benimaclet"] },
    { line: 5, path: ["nou_octubre", "av_cid", "guimera", "xativa", "colon", "alameda", "amistat", "ayora", "maritim"] },
    { line: 7, path: ["espanya", "guimera", "xativa", "colon", "alameda", "amistat", "ayora", "maritim"] },
    { line: 1, path: ["campanar", "turia", "guimera", "espanya"] },
    { line: 2, path: ["campanar", "turia", "guimera", "espanya"] },
    { line: 10, path: ["alacant", "amado", "quatre", "ciutat"] }
];
