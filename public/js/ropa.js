const WHATSAPP_NUMBER = '573208930028';

const grid = document.getElementById('grid');
const filtersEl = document.getElementById('filters');

let products = [];
let activeCategory = 'Todo';
const selectedSizes = {}; // { productId: talla }

function money(n){
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

function totalStock(product){
  return product.tallas.reduce((sum, t) => sum + t.stock, 0);
}

function stockBadge(product){
  const total = totalStock(product);
  if (total === 0) return { text: 'Agotado', cls: 'out' };
  if (total <= 5) return { text: `Quedan ${total}`, cls: 'low' };
  return { text: 'Disponible', cls: 'ok' };
}

function renderFilters(){
  const cats = ['Todo', ...new Set(products.map(p => p.categoria))];
  filtersEl.innerHTML = cats.map(cat => `
    <button class="filter-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>
  `).join('');

  filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      renderFilters();
      renderGrid();
    });
  });
}

function renderGrid(){
  const list = activeCategory === 'Todo'
    ? products
    : products.filter(p => p.categoria === activeCategory);

  grid.innerHTML = list.map(p => cardTemplate(p)).join('');

  list.forEach(p => {
    // selección de talla
    grid.querySelectorAll(`[data-product="${p.id}"] .size-pill`).forEach(pill => {
      pill.addEventListener('click', () => {
        if (pill.dataset.out === 'true') return;
        selectedSizes[p.id] = pill.dataset.talla;
        renderGrid();
      });
    });

    // botón de compra
    const buyBtn = grid.querySelector(`[data-product="${p.id}"] .buy-btn`);
    if (buyBtn && buyBtn.dataset.disabled !== 'true') {
      buyBtn.addEventListener('click', () => {
        const talla = selectedSizes[p.id];
        const msg = talla
          ? `Hola! Quiero comprar: ${p.name} - Talla ${talla} (${money(p.precio)})`
          : `Hola! Quiero comprar: ${p.name} (${money(p.precio)})`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
      });
    }
  });
}

function cardTemplate(p){
  const badge = stockBadge(p);
  const total = totalStock(p);
  const selected = selectedSizes[p.id];

  const sizesHtml = p.tallas.map(t => `
    <button class="size-pill ${selected === t.talla ? 'selected' : ''}"
      data-talla="${t.talla}" data-out="${t.stock === 0}">
      ${t.talla}
    </button>
  `).join('');

  return `
    <article class="card" data-product="${p.id}">
      <div class="card__media">
        <span class="card__stock ${badge.cls}">${badge.text}</span>
        <img src="${p.imagen}" alt="${p.name}" loading="lazy">
      </div>
      <div class="card__body">
        <div class="card__cat">${p.categoria}</div>
        <h3 class="card__name">${p.name}</h3>
        <div class="card__price">${money(p.precio)}</div>
        <div class="sizes">${sizesHtml}</div>
        <button class="buy-btn" data-disabled="${total === 0}">
          ${total === 0 ? 'Agotado' : 'Comprar por WhatsApp'}
        </button>
      </div>
    </article>
  `;
}

async function init(){
  grid.innerHTML = `<p style="color:var(--cream-dim)">Cargando catálogo…</p>`;
  try{
    const res = await fetch('/api/products');
    products = await res.json();
    renderFilters();
    renderGrid();
  }catch(err){
    grid.innerHTML = `<p style="color:var(--cream-dim)">No se pudo cargar el catálogo. Intenta de nuevo.</p>`;
    console.error(err);
  }
}

init();
