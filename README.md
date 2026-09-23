# JUANES · ONCE — Sitio + Tienda

Sitio de artista con servidor Node.js/Express. Página principal con fondo
desvanecido y botón de reproducir (va a YouTube), y una tienda de ropa
dinámica (fotos, precio, tallas y stock) que se alimenta de una API propia.

## Cómo correrlo

```bash
npm install
npm start
```

Abre http://localhost:3000

## Estructura

```
server.js              → servidor Express + API
data/products.json      → catálogo (edítalo para cambiar precios/stock/tallas)
public/index.html        → página principal (hero + redes)
public/ropa.html          → catálogo de ropa
public/css/style.css       → estilos
public/js/ropa.js           → lógica del catálogo (filtros, tallas, WhatsApp)
public/assets/               → imágenes (placeholders, reemplázalas)
public/assets/products/       → fotos de cada prenda (placeholders, reemplázalas)
```

## Cómo poner tus imágenes reales

Reemplaza estos archivos por tus fotos (mismo nombre, o cambia la ruta en
`data/products.json` / `index.html`):

- `public/assets/hero-bg.jpg` (o .png) → foto de fondo de la página principal
- `public/assets/products/*.jpg` → foto de cada prenda, referenciada en
  `data/products.json` bajo el campo `"imagen"`

## Cómo agregar / editar productos

Edita `data/products.json`. Cada producto:

```json
{
  "id": "identificador-unico",
  "name": "Nombre del producto",
  "categoria": "Hoodies",
  "precio": 145000,
  "imagen": "/assets/products/mi-foto.jpg",
  "tallas": [
    { "talla": "S", "stock": 4 },
    { "talla": "M", "stock": 0 }
  ],
  "descripcion": "Texto corto"
}
```

Un `stock` en 0 marca la talla como agotada automáticamente en la tienda.


Railway, un VPS, etc.). Solo necesita correr `npm install && npm start`.
