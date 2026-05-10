import re
import json

# Original data
js_file = r'c:\Users\serco\Documents\Projects\valencia-nightclubs\data.js'
with open(js_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

# CSV data from user
csv_data = """ID,Club,Latitud,Longitud,Dirección / Referencia de Ubicación
1,Spook Club,39.4106,-0.3352,"Carrer del Riu, 399 (Pinedo)"
2,Barraca,39.2547,-0.2665,Carrer Via Sant Roc (Les Palmeres)
3,Latex Club,39.4615,-0.3727,"Carrer de Carles Cervera, 23 (Ruzafa)"
4,Miniclub,39.4736,-0.3447,"Av. de Blasco Ibáñez, 111"
5,Next Club,39.4962,-0.4013,"Av. de les Corts Valencianes, 58"
6,Gora,39.4754,-0.3512,"Carrer de l'Explorador Andrés, 19"
8,Mya Valencia,39.4552,-0.3534,"Av. del Professor López Piñero, 5"
9,L'Umbracle,39.4547,-0.3527,Terraza superior (CAC)
10,Indiana,39.4719,-0.3705,"Calle de San Vicente Mártir, 95"
11,Rumbo 144,39.4724,-0.3446,"Av. de Blasco Ibáñez, 144"
12,Committee,39.4714,-0.3687,"Calle de San Vicente Mártir, 55"
13,Sala Canal,39.4262,-0.3644,"Carretera del Saler, km 7"
14,High Cube,39.4601,-0.3224,Marina de Valencia (Pantalán central)
15,Gold Valencia,39.4665,-0.3732,"Calle de San Vicente Mártir, 36"
16,Le Premier,39.4664,-0.3582,"Calle de Eduardo Boscá, 27"
17,Azza,39.4649,-0.3592,"Paseo de la Alameda, 30 (Palau de la Música)"
18,TBClub,39.4678,-0.3745,"Calle de San Vicente Mártir, 23"
19,Santoory,39.4646,-0.3748,"Gran Via de les Germanies, 31"
20,Fox Congo,39.4746,-0.3761,"Calle de los Caballeros, 35"
21,Jauja Port,39.4594,-0.3262,Marina de Valencia
23,Guru Dance Club,39.4578,-0.3734,"Calle de San Vicente Mártir, 305"
24,Docks,39.4611,-0.3250,Edificio Docks (Marina)
25,Akuarela Playa,39.4764,-0.3228,"Calle de Eugenia Viñes, 152"
26,Agenda Club,39.4782,-0.3448,"Av. de Blasco Ibáñez, 111"
27,Moon Valencia,39.4674,-0.3774,"Calle de San Vicente Mártir, 200"
28,Salomé,39.4744,-0.3768,"Calle de los Caballeros, 38"
29,Play Club,39.4619,-0.3758,"Calle de Cuba, 8"
30,La3 Club,39.4695,-0.3463,"Carrer del Pare Porta, 2"
31,Piccadilly,39.4614,-0.3756,"Calle de los Centelles, 17"
32,Jerusalem,39.4658,-0.3785,"Calle de Jerusalén, 6"
33,Nylon Club,39.4623,-0.3759,"Av. de Ausiàs March, 1"
34,Xtra Lrge,39.4641,-0.3746,"Gran Via de les Germanies, 21"
35,Bowie,39.4625,-0.3751,"Calle de Cádiz, 63"
36,Oven Club,39.4622,-0.3757,"Gran Via de les Germanies, 31 (Sótano)"
37,Marina Beach,39.4616,-0.3235,Marina de Valencia
38,Unic,39.4765,-0.3762,"Plaza de Sant Jaume, 1"
40,Radio City,39.4767,-0.3792,"Calle de Santa Teresa, 19"
41,Black Note,39.4727,-0.3546,"Calle de Polo y Peyrolón, 15"
42,16 Toneladas,39.4824,-0.3809,"Calle de Ricardo Micó, 3"
43,Loco Club,39.4775,-0.3857,"Calle de Erudito Orellana, 12"
44,Repvblicca,39.4727,-0.4268,"Carrer Baix Vinalopó, 2 (Mislata)"
45,Café del Duende,39.4795,-0.3862,"Calle de Turia, 62"
46,Jimmy Glass,39.4778,-0.3795,"Calle de la Baja, 28"
47,Volander,39.4761,-0.3495,"Calle de Navarro Cabanes, 25"
48,Matisse Club,39.4759,-0.3496,"Calle de Ramón Campoamor, 60"
49,Deseo 54,39.4815,-0.3798,"Calle de Pepita, 15"
50,Veles e Vents,39.4608,-0.3238,Edificio Veles e Vents (Marina)"""

import csv
import io

lines = csv_data.strip().split('\n')
reader = csv.reader(lines)
next(reader) # skip header

updates = {}
for row in reader:
    if len(row) >= 5:
        name = row[1].strip()
        lat = row[2].strip()
        lng = row[3].strip()
        updates[name.lower()] = (lat, lng)

def replace_lat_lng(match):
    full_block = match.group(0)
    name_match = re.search(r'name:\s*"([^"]+)"', full_block)
    if name_match:
        name = name_match.group(1)
        name_lower = name.lower()
        
        # Exact match or partial match
        match_key = None
        if name_lower in updates:
            match_key = name_lower
        else:
            for k in updates:
                if k in name_lower or name_lower in k:
                    match_key = k
                    break
        
        if match_key:
            lat, lng = updates[match_key]
            # Replace lat
            full_block = re.sub(r'lat:\s*[\d\.\-]+', f'lat: {lat}', full_block)
            # Replace lng
            full_block = re.sub(r'lng:\s*[\d\.\-]+', f'lng: {lng}', full_block)
            print(f"Updated {name} to {lat}, {lng}")
    return full_block

# Find each object block and replace
new_js_content = re.sub(r'\{[^\}]*name:\s*"[^"]*"[^\}]*\}', replace_lat_lng, js_content)

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(new_js_content)
print("Done")
