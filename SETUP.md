# 🚀 Guía de Lanzamiento — Valencia Nightlife

Sigue estos pasos **en orden**. Tardas menos de 30 minutos.

---

## Paso 1 — Publicar en GitHub Pages

### 1.1 Crear el repositorio
1. Ve a [github.com/new](https://github.com/new)
2. Nombre del repo: `valencia-nightclubs` (o el que prefieras)
3. Visibilidad: **Public** (necesario para GitHub Pages gratis)
4. **No** inicialices con README

### 1.2 Subir el código
Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
git init
git add .
git commit -m "feat: initial beta release"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/valencia-nightclubs.git
git push -u origin main
```

> Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

### 1.3 Activar GitHub Pages
1. En tu repo → **Settings** → **Pages**
2. En *Source* selecciona: **GitHub Actions**
3. El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente
4. En 1-2 minutos tu app estará en:
   ```
   https://TU_USUARIO.github.io/valencia-nightclubs/
   ```

---

## Paso 2 — Proteger la API Key de Google Maps

> ⚠️ Esto es **crítico**. Sin este paso cualquiera puede usar tu key.

1. Ve a [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
2. Haz clic en tu API Key (`AIzaSyBsAOo...`)
3. En **Application restrictions** → selecciona **HTTP referrers (web sites)**
4. En **Website restrictions** → añade estas dos entradas:
   ```
   https://TU_USUARIO.github.io/valencia-nightclubs/*
   https://TU_USUARIO.github.io/
   ```
5. En **API restrictions** → selecciona **Restrict key** → marca solo:
   - Maps JavaScript API
   - Directions API
6. Guarda los cambios ✅

Con esto, la key solo funciona desde tu dominio de GitHub Pages.

---

## Paso 3 — Desplegar el Proxy en Cloud Run

El proxy mantiene la API key de Places **oculta** en el servidor.

### 3.1 Requisitos previos
- Tener [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) instalado
- Estar autenticado: `gcloud auth login`

### 3.2 Desplegar
Ejecuta en PowerShell desde la carpeta del proyecto:

```powershell
# Navega a la carpeta del servidor
cd server

# Despliega en Cloud Run (reemplaza TU_API_KEY con tu clave real)
gcloud run deploy valencia-nightlife-proxy `
  --source . `
  --region europe-west1 `
  --allow-unauthenticated `
  --set-env-vars GOOGLE_MAPS_API_KEY=TU_API_KEY
```

> Cloud Run tiene un **free tier generoso** (~2 millones de requests/mes gratis).

### 3.3 Copiar la URL del proxy
Al terminar el deploy verás algo como:
```
Service URL: https://valencia-nightlife-proxy-abc123-ew.a.run.app
```

Abre `app.js` y reemplaza la línea de `PROXY_URL`:
```javascript
const PROXY_URL = 'https://valencia-nightlife-proxy-abc123-ew.a.run.app';
```

### 3.4 Haz commit y push
```powershell
cd ..
git add app.js
git commit -m "feat: connect to Cloud Run proxy"
git push
```

---

## Paso 4 — Conectar Google Sheets para Eventos en Vivo

Con esto puedes actualizar eventos sin tocar código.

### 4.1 Crear la hoja de cálculo
1. Ve a [sheets.new](https://sheets.new)
2. Ponle de nombre: `Valencia Nightlife - Eventos`
3. En la **fila 1** escribe exactamente estas cabeceras:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| clubName | title | date | hype | description | instagram | url |

4. Añade tus eventos a partir de la fila 2. Ejemplo:

| Spook Club | 10º Aniversario | 2026-05-10 | 99 | El evento del mes | @spookclub | https://spook-club.com |

> **`hype`** es un número del 1 al 100 que determina el orden en que aparecen los eventos.

### 4.2 Publicar como CSV
1. **Archivo** → **Compartir** → **Publicar en la web**
2. En la primera lista desplegable: **Hoja 1**
3. En la segunda: **Valores separados por comas (.csv)**
4. Haz clic en **Publicar** → copia la URL que aparece

### 4.3 Pegar la URL en app.js
```javascript
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/XXXXXXXX/pub?gid=0&single=true&output=csv';
```

### 4.4 Commit y push
```powershell
git add app.js
git commit -m "feat: connect Google Sheets events"
git push
```

---

## Resumen de URLs a completar en `app.js`

```javascript
// Línea 3 — URL del proxy de Cloud Run:
const PROXY_URL = 'https://valencia-nightlife-proxy-XXXX-ew.a.run.app';

// Línea 9 — URL CSV de Google Sheets:
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/XXXXX/pub?...&output=csv';
```

---

## Flujo de trabajo para actualizar eventos

Una vez todo configurado, para añadir o editar un evento:
1. Abre la Google Sheet
2. Añade o edita una fila
3. **Listo** — la app carga los eventos en vivo al abrirse ✅

No hace falta tocar código ni hacer deploy.

---

## Checklist final

- [ ] App publicada en GitHub Pages
- [ ] API Key restringida por dominio en Google Cloud Console
- [ ] Proxy desplegado en Cloud Run
- [ ] `PROXY_URL` actualizado en `app.js`
- [ ] Google Sheet creada y publicada como CSV
- [ ] `SHEETS_CSV_URL` actualizado en `app.js`
- [ ] Todo commiteado y pusheado → GitHub Actions despliega automáticamente 🎉
