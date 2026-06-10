const clubsData = [
    {
        id: 1, name: "Mya Valencia",
        // Corregido: estaba ~200m al este; la entrada real es en Av. del Professor López Piñero, 5
        lat: 39.455170, lng: -0.353365,
        address: "Av. del Professor López Piñero, 5, Ciudad de las Artes y las Ciencias",
        type: "EDM / Comercial / Reggaeton",
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Domingo: 22:30 - 07:30", minorsAllowed: false, drinkQuality: 4.2, reviewsCount: 1245,
        style: "pijos",
        atmosphere: "glamour",
        description: "Una de las 100 mejores discotecas del mundo según Resident Advisor. Tres salas subterráneas —electrónica, reggaeton y urbano— bajo los jardines de la Ciudad de las Artes. Entrada con piscina artificial y fachada iluminada. Dress code estricto, precios de Ibiza y público de influencers. Los viernes se conecta directamente con la terraza de L'Umbracle arriba.",
        events: [{ date: "Próx. Viernes", title: "Mya Fridays", dj: "Resident DJ" }]
    },
    {
        id: 2, name: "Akuarela Playa",
        // Corregido: coordenadas ajustadas ~300m al sur
        lat: 39.472845, lng: -0.325366,
        address: "C/ d'Eugènia Viñes, 152, Malvarrosa",
        type: "Reggaeton / Hits",
        image: "https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Sábado: 00:00 - 07:30", minorsAllowed: true, minorsCondition: "Sesión light +16",
        drinkQuality: 3.8, reviewsCount: 890,
        style: "canis",
        atmosphere: "fiesta",
        description: "Discoteca de playa en primera línea de Malvarrosa, terraza al aire libre con ambiente festivo y mucho reggaeton. Uno de los pocos clubs que permite sesión +16 en horario específico. Ideal para grupos grandes y despedidas de soltera. Ambiente joven, informal y muy animado en verano. Acceso en coche o taxi desde el centro en 10 minutos.",
        events: [{ date: "Sábado", title: "Fuego Fridays", dj: "Alvama Ice" }]
    },
    {
        id: 3, name: "Spook Club",
        // Coordenadas correctas: Pinedo (Pobles del Sud, al sur del centro)
        lat: 39.410591, lng: -0.335169,
        address: "Carr. del Río, 399, Pinedo (Pobles del Sud)",
        type: "Techno / Electrónica Underground",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes: 17:00 - 04:30 / Sábados: 22:00 - 07:30", minorsAllowed: false, drinkQuality: 4.5, reviewsCount: 1893,
        style: "del rollo",
        atmosphere: "underground",
        description: "Templo del techno valenciano desde los años 80, enclavado en Pinedo junto a la Albufera. Con capacidad para 2.500 personas y uno de los sistemas de sonido más potentes de España —lleva earplugs—. Escenario de fiestas míticas como Spook Factory y Sound Factory. Frecuentado por la escena electrónica auténtica: poco postureo, mucha pista. Aparcamiento propio, imprescindible el coche o taxi.",
        events: [{ date: "Sábado", title: "Waxxx", dj: "Amelie Lens" }]
    },
    {
        id: 4, name: "Barraca",
        // ⚠️ ERROR CRÍTICO CORREGIDO: los datos originales la situaban en Valencia ciudad.
        // Barraca está en Les Palmeres (Sueca), a ~25 km al sur de Valencia.
        lat: 39.254742, lng: -0.266542,
        address: "Carrer Via Sant Roc, S/N, Les Palmeres, Sueca (46419)",
        type: "Techno / House / Minimal — Electrónica",
        image: "https://images.unsplash.com/photo-1558317714-f77e23114fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Sábados (eventos): 23:00 - 08:00", minorsAllowed: false, drinkQuality: 4.8, reviewsCount: 2100,
        style: "del rollo",
        atmosphere: "legendario",
        description: "La discoteca más icónica de España, inaugurada en 1965 en Les Palmeres (Sueca), a 200 metros de la playa. Cuna de la Ruta Destroy y de la movida valenciana. Cuatro salas —Barraca, Circo, Showroom y Terraza— con programación mensual de DJs internacionales (Richie Hawtin, Ricardo Villalobos, Marco Carola…). No se abre todas las semanas: consulta agenda antes de ir. Coche o autobús lanzadera desde Valencia.",
        events: [{ date: "Sábado", title: "Aniversario", dj: "Paco Osuna" }]
    },
    {
        id: 5, name: "Oven Club Centro",
        // Coordenadas ajustadas ligeramente (~120m)
        lat: 39.463724, lng: -0.375994,
        address: "Gran Via de les Germanies, 31 (Sótano), L'Eixample",
        type: "House / Deep House",
        image: "https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Sábado: 23:30 - 07:00", minorsAllowed: false, drinkQuality: 4.0, reviewsCount: 340,
        style: "del rollo",
        atmosphere: "intimo",
        description: "Club underground en un sótano del Eixample con una sala pequeña y una selección musical de house profundo y deep house. La decoración es mínima y el foco está en el sonido. Dress code relajado pero se aplica política de puerta. Sin fumadero exterior propio (cobran por salir). Perfecto para amantes del house que prefieren un ambiente menos masificado que los macroclubs.",
        events: [{ date: "Viernes", title: "House Sessions", dj: "Local Hero" }]
    },
    {
        id: 6, name: "L'Umbracle",
        // Coordenadas corregidas; también se corrige el estilo: es pijos, no cayetanos
        lat: 39.454673, lng: -0.352682,
        address: "Av. del Professor López Piñero, s/n, Ciudad de las Artes y las Ciencias",
        type: "Comercial / Reggaeton / Electronic Hits",
        image: "https://images.unsplash.com/photo-1572111504021-392088c4225d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Domingo: 23:00 - 07:00 (temporada verano)", minorsAllowed: false, drinkQuality: 4.3, reviewsCount: 1500,
        // Corregido: era "cayetanos", pero el ambiente y dress code es claramente "pijos"
        style: "pijos",
        atmosphere: "elegante",
        description: "Terraza espectacular de 4.000 m² sobre los jardines de la Ciudad de las Artes y las Ciencias. Ambiente abierto con palmeras, esculturas y vistas nocturnas de la arquitectura de Calatrava. Música comercial y reggaeton. Dress code chic obligatorio: sin chanclas, sin camisetas de tirantes. Conectada con Mya los viernes. Solo abre en temporada de verano. Cócteles premium y listas de espera habituales.",
        events: [{ date: "Viernes", title: "Noches Mágicas", dj: "Resident DJ" }]
    },
    {
        id: 7, name: "Marina Beach Club",
        // Coordenadas correctas (ajuste mínimo de ~10m)
        lat: 39.462888, lng: -0.320446,
        address: "Marina de Valencia, Passeig de la Remor, Poblats Marítims",
        type: "House / Comercial — Beach Club",
        image: "https://images.unsplash.com/photo-1596423736561-1c586111fdb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Todos los días: 11:00 - 03:30", minorsAllowed: true, minorsCondition: "Hasta las 21:00", drinkQuality: 4.1, reviewsCount: 3200,
        style: "pijos",
        atmosphere: "verano",
        description: "El referente de ocio diurno-nocturno de Valencia. Piscina, soláriums, cócteles y DJs internacionales con vistas al Mediterráneo. De día es beach club de lujo (tumbonas 130€/dos personas); de noche se transforma en discoteca con programación electrónica y comercial. Ambiente de verano ibicenco sin salir de Valencia. Reserva mesa con antelación en temporada alta.",
        events: [{ date: "Sábado", title: "Sunset Party", dj: "Guest DJ" }]
    },
    {
        id: 8, name: "Play Club",
        // Coordenadas correctas
        lat: 39.462595, lng: -0.377555,
        address: "C. de Cuba, 8, L'Eixample",
        type: "Indie / Alternativo / Electrónica",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes: 20:00 - 07:00 / Sábados: 17:00 - 07:00", minorsAllowed: false, drinkQuality: 3.9, reviewsCount: 780,
        style: "del rollo",
        atmosphere: "alternativo",
        description: "Dos plantas con músicas distintas: electrónica no mainstream abajo, más comercial arriba. Vibe de local de barrio con clientela estudiantil y artística. Se programa también música en directo (funk, soul) con entrada de 5€ y cerveza. Dress code muy relajado. El tardeísmo del sábado es especialmente popular entre universitarios y Erasmus. Precios asequibles para el Eixample.",
        events: [{ date: "Viernes", title: "Indie Rock", dj: "Play DJs" }]
    },
    {
        id: 9, name: "La3 Club",
        // ⚠️ CORREGIDO: los datos originales situaban el club en el barrio de Russafa.
        // La3 está en Av. de Blasco Ibáñez, 111, en el barrio de Algirós.
        lat: 39.473577, lng: -0.344485,
        address: "Av. de Blasco Ibáñez, 111, Algirós",
        type: "Techno / House / Electrónica",
        image: "https://images.unsplash.com/photo-1470229722913-7c090be5f524?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Todos los días: 23:59 - 07:00", minorsAllowed: false, drinkQuality: 4.0, reviewsCount: 920,
        style: "del rollo",
        atmosphere: "urbano",
        description: "El único club de Valencia que abre siete días a la semana, lo que lo convierte en refugio de los que salen entre semana. Programación ecléctica que va del techno al house según el día. Público mixto: universitarios locales, Erasmus y amantes de la electrónica. Política de fumar en el interior (cobran sello para salir). Dos copas incluidas con la entrada en muchos eventos.",
        events: [{ date: "Sábado", title: "La3 Nights", dj: "Ley DJ" }]
    },
    {
        id: 10, name: "Indiana",
        // ⚠️ ERROR CRÍTICO CORREGIDO: los datos originales situaban el club en lat 39.66 (zona Sagunto),
        // cuando en realidad está en el centro de Valencia, en Sant Vicent Màrtir, 95.
        lat: 39.466329, lng: -0.381069,
        address: "Carrer de Sant Vicent Màrtir, 95, Extramurs",
        type: "Comercial / Urbano / Multi-sala",
        image: "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Domingo: 00:00 - 07:30", minorsAllowed: false, drinkQuality: 3.7, reviewsCount: 1100,
        style: "cayetanos",
        atmosphere: "clasico",
        description: "Club multisala de referencia en el centro histórico de Valencia. Varias pistas con ambientes distintos: hits internacionales, R&B y urbano. Aforo grande, ambiente heterogéneo con mezcla de locales, universitarios y turistas. Noches Erasmus muy populares los jueves. Dress code relativamente estricto (sin zapatillas rotas ni pantalones cortos). Política de puerta variable según la noche.",
        events: [{ date: "Jueves", title: "Erasmus Party", dj: "Resident DJ" }]
    },
    {
        id: 11, name: "Deseo 54",
        // Coordenadas correctas; se corrige la dirección
        lat: 39.484922, lng: -0.375852,
        address: "C/ de Pepita, 13-15, La Saïdia",
        type: "Pop / Hits / LGTBI+",
        image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Sábados y Domingos: 01:00 - 07:30", minorsAllowed: false, drinkQuality: 4.4, reviewsCount: 650,
        style: "del rollo",
        atmosphere: "divertido",
        description: "El club LGTBI+ de referencia de Valencia, con espacio amplio, dos alturas y shows de drag queen los fines de semana. Ambiente inclusivo y muy festivo donde la pista de baile se llena de hits del pop y dance. Público diverso y acogedor. Muy recomendable ir a través de 'The Muse' (el bar de al lado) para conseguir entrada gratuita antes de las 3h. Entrada con copa incluida.",
        events: [{ date: "Sábado", title: "Diva's Night", dj: "Guest Queen" }]
    },
    {
        id: 12, name: "Piccadilly Downtown Club",
        // Coordenadas corregidas (~30m); dirección corregida
        lat: 39.461630, lng: -0.372471,
        address: "Carrer dels Tomasos, 12, L'Eixample (Ruzafa)",
        type: "Indie / Pop / Silent Disco",
        image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes y Sábado: 23:00 - 07:30", minorsAllowed: false, drinkQuality: 3.9, reviewsCount: 450,
        style: "del rollo",
        atmosphere: "alternativo",
        description: "Club de dos plantas en el corazón de Ruzafa con ambiente indie y alternativo. Conocido por sus sesiones de silent disco (auriculares con distintos canales) y una clientela entre creativa y universitaria. Ambiente inclusivo y friendly con mezcla de locales, Erasmus e internacionales. Las críticas destacan la simpatía del personal. Entrada a partir de 18€ con copa.",
        events: [{ date: "Sábado", title: "Silent Disco", dj: "Varios" }]
    },
    {
        id: 13, name: "Rumbo 144",
        // Coordenadas correctas; se corrige la dirección
        lat: 39.472453, lng: -0.344595,
        address: "Av. de Blasco Ibáñez, 144, Algirós",
        type: "Comercial / Universitario",
        image: "https://images.unsplash.com/photo-1571266028243-cb40fce75737?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Miércoles a Domingo: 00:30 - 07:30", minorsAllowed: false, drinkQuality: 3.5, reviewsCount: 880,
        style: "canis",
        atmosphere: "universitario",
        description: "El clásico 'botellon con techo' de la zona universitaria de Blasco Ibáñez. Público muy joven —muchos menores de 22— con música comercial y reggaeton a todo volumen. Precios bajos y ambiente masificado los fines de semana. Política de seguridad muy cuestionada en reseñas. Abrir entre semana lo hace popular entre estudiantes que salen cualquier noche. Fácil acceso en metro (línea 5, Benimaclet).",
        events: [{ date: "Jueves", title: "Jueves Universitario", dj: "Resident" }]
    },
    {
        id: 14, name: "Committee",
        // Coordenadas corregidas (~1km al sur de donde estaban)
        lat: 39.458813, lng: -0.383429,
        address: "Carrer de Sant Vicent Màrtir, 200, Jesús",
        type: "Comercial / Reggaeton / Erasmus",
        image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Sábado: 23:59 - 07:30", minorsAllowed: false, drinkQuality: 3.8, reviewsCount: 520,
        style: "cayetanos",
        atmosphere: "selecto",
        description: "Club comercial con política de puerta selectiva y ambiente de fiesta universitaria con toque aspiracional. Muy frecuentado por Erasmus gracias a las fiestas temáticas con entrada gratuita previa reserva online (atención: cobran pasada la hora gratuita). Interior moderno y bien equipado. La música mezcla reggaeton con hits internacionales. Dress code cuidado pero no extremo.",
        events: [{ date: "Sábado", title: "Committee Nights", dj: "Resident" }]
    },
    {
        id: 15, name: "Latex Club",
        // Coordenadas correctas
        lat: 39.461507, lng: -0.372717,
        address: "C/ de Carles Cervera, 23, L'Eixample (Ruzafa)",
        type: "Techno / Tech-House",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Viernes y Sábado: 23:00 - 07:30", minorsAllowed: false, drinkQuality: 4.1, reviewsCount: 310,
        style: "del rollo",
        atmosphere: "oscuro",
        description: "Sala pequeña e intimista en Ruzafa dedicada al techno y tech-house, con estética oscura y sonido potente. Frecuentada por la escena local más purista. DJs residentes y pinchadas de calidad. Sin zona de fumadores exterior (cobran por salir). Entrada muy asequible. Algunas reseñas advierten de problemas de seguridad en baños —asegurar las puertas—. Llega tarde: antes de la 1h está vacío.",
        events: [{ date: "Viernes", title: "Dark Room", dj: "Local Techno" }]
    },
    {
        id: 16, name: "Jerusalem Pop & Rock",
        // Coordenadas corregidas (~250m); dirección y estilo corregidos
        lat: 39.464623, lng: -0.380214,
        address: "C/ del Convent de Jerusalem, 55, Extramurs",
        type: "Pop / Rock en Directo",
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        schedule: "Jueves a Sábado: 00:30 - 07:00", minorsAllowed: false, drinkQuality: 4.3, reviewsCount: 600,
        // Corregido: era "pijos" pero la audiencia de rock/indie es claramente "del rollo"
        style: "del rollo",
        atmosphere: "retro",
        description: "Uno de los pocos clubs de Valencia que programa música rock y pop en directo con regularidad. Sala con balcón circular, buena acústica y ambiente de concierto. También conocida como 'Convento' en modo discoteca. Frecuentada por amantes del rock clásico, los 80s y 90s y el indie. Bebidas caras según reseñas. Ideal para quienes se aburren del reggaeton y la electrónica mainstream.",
        events: [{ date: "Viernes", title: "Tributo 80s", dj: "Band + DJ" }]
    }
];