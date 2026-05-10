const clubsData = [
    {
        id: 1, name: "Mya Valencia", lat: 39.454048, lng: -0.351492, address: "Mya, Pont de l'Assut de l'Or", type: "EDM / Comercial",
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Sábado: 00:00 - 07:30", minorsAllowed: false, drinkQuality: 4.2, reviewsCount: 1245,
        style: "pijos", atmosphere: "glamour",
        events: [{ date: "Próx. Viernes", title: "Mya Saturdays", dj: "Resident DJ" }]
    },
    {
        id: 2, name: "Akuarela Playa", lat: 39.4764, lng: -0.3228, address: "Calle de Eugenia Viñes, 152", type: "Reggaeton / Hits",
        image: "https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Sábado: 00:00 - 07:00", minorsAllowed: true, minorsCondition: "Sesión light +16", drinkQuality: 3.8, reviewsCount: 890,
        style: "canis", atmosphere: "fiesta",
        events: [{ date: "Sábado", title: "Fuego Fridays", dj: "Alvama Ice" }]
    },
    {
        id: 3, name: "Spook Club", lat: 39.410588, lng: -0.335184, address: "Spook Club, Carrera del Riu", type: "Techno / Underground",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Sábados: 23:00 - 07:30", minorsAllowed: false, drinkQuality: 4.5, reviewsCount: 560,
        style: "del rollo", atmosphere: "underground",
        events: [{ date: "Sábado", title: "Waxxx", dj: "Amelie Lens" }]
    },
    {
        id: 4, name: "Barraca", lat: 39.445189, lng: -0.371844, address: "Barraca, Avinguda de Fernando Abril Martorell", type: "Techno Clásico",
        image: "https://images.unsplash.com/photo-1558317714-f77e23114fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Sábados (eventos): 23:00 - 08:00", minorsAllowed: false, drinkQuality: 4.8, reviewsCount: 2100,
        style: "del rollo", atmosphere: "legendario",
        events: [{ date: "Sábado", title: "Aniversario", dj: "Paco Osuna" }]
    },
    {
        id: 5, name: "Oven Club Centro", lat: 39.4622, lng: -0.3757, address: "Gran Via de les Germanies, 31 (Sótano)", type: "House / Minimal",
        image: "https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Sábado: 23:30 - 07:00", minorsAllowed: false, drinkQuality: 4.0, reviewsCount: 340,
        style: "del rollo", atmosphere: "intimo",
        events: [{ date: "Viernes", title: "House Sessions", dj: "Local Hero" }]
    },
    {
        id: 6, name: "L'Umbracle", lat: 39.455603, lng: -0.354170, address: "L'Umbracle, Carrer de Ricardo Muñoz Suay", type: "Comercial / Hits",
        image: "https://images.unsplash.com/photo-1572111504021-392088c4225d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes y Sábado: 23:30 - 07:00", minorsAllowed: false, drinkQuality: 4.3, reviewsCount: 1500,
        style: "cayetanos", atmosphere: "elegante",
        events: [{ date: "Viernes", title: "Noches Mágicas", dj: "Resident DJ" }]
    },
    {
        id: 7, name: "Marina Beach Club", lat: 39.462953, lng: -0.321638, address: "Marina Beach Club, Passeig de la Remor", type: "House / Comercial",
        image: "https://images.unsplash.com/photo-1596423736561-1c586111fdb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Todos los días: 11:00 - 03:30", minorsAllowed: true, minorsCondition: "Hasta las 21:00", drinkQuality: 4.1, reviewsCount: 3200,
        style: "pijos", atmosphere: "verano",
        events: [{ date: "Sábado", title: "Sunset Party", dj: "Guest DJ" }]
    },
    {
        id: 8, name: "Play Club", lat: 39.462574, lng: -0.377590, address: "Play Club, Carrer de Cuba", type: "Indie / Electrónica",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes y Sábado: 01:00 - 07:30", minorsAllowed: false, drinkQuality: 3.9, reviewsCount: 780,
        style: "del rollo", atmosphere: "alternativo",
        events: [{ date: "Viernes", title: "Indie Rock", dj: "Play DJs" }]
    },
    {
        id: 9, name: "La3 Club", lat: 39.460442, lng: -0.335651, address: "La3, 3", type: "Indie / Techno",
        image: "https://images.unsplash.com/photo-1470229722913-7c090be5f524?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes y Sábado: 01:00 - 07:00", minorsAllowed: false, drinkQuality: 4.0, reviewsCount: 920,
        style: "del rollo", atmosphere: "urbano",
        events: [{ date: "Sábado", title: "La3 Nights", dj: "Ley DJ" }]
    },
    {
        id: 10, name: "Indiana", lat: 39.663299, lng: -0.226740, address: "Indiana Bill, Carrer de Teodoro Llorente", type: "Comercial / R&B",
        image: "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Sábado: 23:59 - 07:00", minorsAllowed: false, drinkQuality: 3.7, reviewsCount: 1100,
        style: "cayetanos", atmosphere: "clasico",
        events: [{ date: "Jueves", title: "Erasmus Party", dj: "Resident DJ" }]
    },
    {
        id: 11, name: "Deseo 54", lat: 39.484907, lng: -0.375870, address: "Deseo 54, 15", type: "Pop / Hits / LGTBI+",
        image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes y Sábado: 01:00 - 07:30", minorsAllowed: false, drinkQuality: 4.4, reviewsCount: 650,
        style: "del rollo", atmosphere: "divertido",
        events: [{ date: "Sábado", title: "Diva's Night", dj: "Guest Queen" }]
    },
    {
        id: 12, name: "Piccadilly Downtown Club", lat: 39.4614, lng: -0.3756, address: "Calle de los Centelles, 17", type: "Indie / Pop",
        image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Sábado: 01:00 - 07:00", minorsAllowed: false, drinkQuality: 3.9, reviewsCount: 450,
        style: "del rollo", atmosphere: "alternativo",
        events: [{ date: "Sábado", title: "Silent Disco", dj: "Varios" }]
    },
    {
        id: 13, name: "Rumbo 144", lat: 39.472302, lng: -0.344609, address: "Rumbo 144, 144", type: "Comercial / Universitario",
        image: "https://images.unsplash.com/photo-1571266028243-cb40fce75737?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Sábado: 23:30 - 07:00", minorsAllowed: false, drinkQuality: 3.5, reviewsCount: 880,
        style: "canis", atmosphere: "universitario",
        events: [{ date: "Jueves", title: "Jueves Universitario", dj: "Resident" }]
    },
    {
        id: 14, name: "Committee", lat: 39.4674, lng: -0.3774, address: "Calle de San Vicente Mártir, 200", type: "Comercial / Reggaeton",
        image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes y Sábado: 00:00 - 07:00", minorsAllowed: false, drinkQuality: 3.8, reviewsCount: 520,
        style: "cayetanos", atmosphere: "selecto",
        events: [{ date: "Sábado", title: "Committee Nights", dj: "Resident" }]
    },
    {
        id: 15, name: "Latex Club", lat: 39.4615, lng: -0.3727, address: "Carrer de Carles Cervera, 23 (Ruzafa)", type: "Techno / Tech-House",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes y Sábado: 01:00 - 07:30", minorsAllowed: false, drinkQuality: 4.1, reviewsCount: 310,
        style: "del rollo", atmosphere: "oscuro",
        events: [{ date: "Viernes", title: "Dark Room", dj: "Local Techno" }]
    },
    {
        id: 16, name: "Jerusalem Pop & Rock", lat: 39.466880, lng: -0.379340, address: "Carrer del Convent de Jerusalem, la Roqueta", type: "Pop / Rock",
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes y Sábado: 23:30 - 07:00", minorsAllowed: false, drinkQuality: 4.3, reviewsCount: 600,
        style: "pijos", atmosphere: "retro",
        events: [{ date: "Viernes", title: "Tributo 80s", dj: "Band + DJ" }]
    }
];
