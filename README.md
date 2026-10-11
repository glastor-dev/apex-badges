# Apex Badges 🛡️

Generador de badges vectoriales (SVG) dinámicos de **nivel Pro**, ultra-rápidos (< 5ms), 100% compatibles con **GitHub Camo Proxy** y optimizados para despliegue en **Vercel**.

---

## ✨ Características Principales

- **⚡ Rendimiento Extremo (< 5ms)**: Motor de renderizado SVG nativo en TypeScript sin dependencias pesadas de Canvas ni navegadores headless. Cero tiempo de arranque en frío.
- **🛡️ 100% Compatible con GitHub Camo**: Cabeceras HTTP estrictas (`Cache-Control: no-cache, no-store, must-revalidate`, `Surrogate-Control: no-store`) para evitar que las visitas y métricas se queden congeladas en la caché de GitHub.
- **🎨 Estética Pro Split**: Bordes sutiles de 1px, profundidad de texto con doble capa, radios de esquina ajustados y gradientes fluidos.
- **🌐 Simple Icons Integrado**: Soporte para más de 3,000 marcas y herramientas de desarrollo (Docker, Deno, GitHub, Lefthook, TypeScript, React, Python, etc.).
- **👁️ Contador de Visitas en Vivo**: Endpoint `/api/badge/views?id=...` con incremento atómico y compatibilidad opcional con Upstash Redis o Vercel KV.
- **📊 Conectores Dinámicos Oficiales**:
  - Métricas de repositorios de GitHub (estrellas, forks, última release, licencia, tamaño).
  - Versión en vivo de paquetes de NPM.
  - Extractor de APIs JSON personalizadas con notación por punto.
- **🛠️ Interactive Web Studio**: Interfaz web moderna (Next.js 16 + Tailwind CSS v4) para diseñar, previsualizar y copiar Markdown con 1 clic.

---

## 🚀 Inicio Rápido

### 1. Clonar e Instalar
```bash
git clone https://github.com/glastor-dev/apex-badges.git
cd apex-badges
npm install
```

### 2. Ejecutar en Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) para ver el Web Studio interactivo.

### 3. Compilar para Producción
```bash
npm run build
npm run start
```

### 4. Microservicio Autónomo (Sub-milisegundo en Bun o Deno)
Puedes correr el servidor HTTP ultraligero sin sobrecarga de Next.js en el puerto 3001:
```bash
# Con Bun
npm run serve:bun     # o bun server.ts

# Con Deno
npm run serve:deno    # o deno task serve
```

### 5. Generador CLI para CI/CD (Sin levantar servidor)
Genera badges SVG directamente en disco durante pipelines de GitHub Actions:
```bash
bun cli.ts --label Docker --status ready --color 007ec6 --logo docker --out ./badges/docker.svg
```

### 6. Suite de Testing y Cobertura
```bash
npm test                 # Ejecuta 21 pruebas en < 400 ms con Bun
npm run test:coverage    # Reporte de cobertura detallado
npm run test:deno        # Validación cruzada en motor Deno 2.x
npm run test:ci          # Pipeline integral (Tests + Linter + Build)
```

---

## 📡 Referencia de Endpoints API

### 1. Badge Universal Estático / Personalizado
```http
GET /api/badge?label=Docker&status=ready&color=007ec6&logo=docker&style=pro
```
**Parámetros:**
- `label`: Texto del lado izquierdo (ej. `Docker`, `Deno`, `Code License`).
- `status`: Texto del lado derecho (ej. `ready`, `^1.40.0`, `GPLv3`).
- `color`: Color de fondo del status (nombre predefinido como `docker`, `passing`, `blue`, `green`, o HEX como `007ec6`).
- `labelColor`: Color de fondo del lado izquierdo (por defecto `#1f2328`).
- `logo`: Nombre del icono (ej. `docker`, `deno`, `lefthook`, `github`, `visitas`, `license`, `react`, `python`).
- `style`: `pro` (predeterminado), `flat`, `pill`, `glass`, `cyber`, `gradient`.
- `height`: Altura en píxeles (`20` o `24`).

### 2. Contador de Visitas en Vivo
```http
GET /api/badge/views?id=mi-repositorio&label=Visitas&color=8a2be2&logo=visitas
```
> **Nota de GitHub Camo:** Este endpoint responde con cabeceras `Surrogate-Control: no-store` para garantizar que cada recarga del README incremente el contador.

### 3. Métricas de Repositorios de GitHub
```http
GET /api/badge/github/:owner/:repo/:metric
```
**Métricas soportadas:**
- `release`: Último tag de release publicado.
- `stars`: Cantidad de estrellas (ej. `1.4k`).
- `forks`: Cantidad de forks.
- `issues`: Cantidad de issues abiertos.
- `license`: Licencia del repositorio (identificador SPDX).
- `size`: Tamaño del repositorio.
- `language`: Lenguaje principal.

### 4. Versión de Paquetes en NPM
```http
GET /api/badge/npm/:package
```
Ejemplo: `/api/badge/npm/next` o paquetes con scope `/api/badge/npm/@types/node`.

### 5. API JSON Personalizada
```http
GET /api/badge/dynamic?url=https://api.ejemplo.com/status&query=version&label=API&color=blue
```

---

## ⚙️ Variables de Entorno (Opcional)

Crea un archivo `.env.local` para activar funciones persistentes avanzadas:

```env
# Upstash Redis (Para persistir contador de visitas globalmente)
UPSTASH_REDIS_REST_URL="https://tu-instancia.upstash.io"
UPSTASH_REDIS_REST_TOKEN="tu-token"

# GitHub Token (Para evitar rate-limiting en repositorios públicos)
GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
```

---

## 🚢 Despliegue en Vercel

1. Sube tu código a GitHub.
2. Importa el repositorio en [Vercel](https://vercel.com/new).
3. Vercel detectará automáticamente Next.js.
4. Haz clic en **Deploy**. ¡Listo en menos de 1 minuto!

---

## 📄 Licencia

Este proyecto está bajo el modelo de **Licencia Dual (GPLv3 & CC BY 4.0)**.
