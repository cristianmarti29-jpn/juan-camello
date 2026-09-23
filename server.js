const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCTS_FILE = path.join(__dirname, 'public', 'data', 'products.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API: obtener todos los productos ---
app.get('/api/products', (req, res) => {
  fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo products.json:', err);
      return res.status(500).json({ error: 'No se pudo cargar el catálogo' });
    }
    try {
      const products = JSON.parse(data);
      res.json(products);
    } catch (parseErr) {
      res.status(500).json({ error: 'Catálogo inválido' });
    }
  });
});

// --- API: obtener un producto por id ---
app.get('/api/products/:id', (req, res) => {
  fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo cargar el catálogo' });
    const products = JSON.parse(data);
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  });
});

app.listen(PORT, () => {
  console.log(`🎤 Servidor corriendo en http://localhost:${PORT}`);
});
