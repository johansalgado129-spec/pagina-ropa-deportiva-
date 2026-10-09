'use strict';

const photo = (id, width = 750) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;

const products = [
  { id: 'legging-alto-ritmo', name: 'Legging Alto Ritmo', category: 'mujer', type: 'Leggings', price: 119900, oldPrice: null, badge: 'NUEVO', image: photo(28774694), sizes: ['XS', 'S', 'M', 'L'], colors: ['#181b1b', '#c2bcb0'], description: 'Una silueta cómoda para entrenar, caminar o seguir tu día sin parar.' },
  { id: 'top-esencia', name: 'Top Esencia', category: 'mujer', type: 'Tops deportivos', price: 89900, oldPrice: null, badge: '', image: photo(6453528), sizes: ['XS', 'S', 'M', 'L'], colors: ['#1d1d1d', '#b9859e'], description: 'Ligero, versátil y listo para acompañarte en cada movimiento.' },
  { id: 'camiseta-motion', name: 'Camiseta Motion', category: 'hombre', type: 'Camisetas', price: 99900, oldPrice: null, badge: 'MÁS VENDIDO', image: photo(5878697), sizes: ['S', 'M', 'L', 'XL'], colors: ['#1d2926', '#b7b9b0'], description: 'Un básico funcional con actitud deportiva para todos los días.' },
  { id: 'short-core', name: 'Short Core', category: 'hombre', type: 'Shorts', price: 109900, oldPrice: 139900, badge: '-21%', image: photo(20367859), sizes: ['S', 'M', 'L', 'XL'], colors: ['#1b1e1b', '#9b9c91'], description: 'Movimiento libre y comodidad para cada nueva rutina.' },
  { id: 'set-studio', name: 'Set Studio', category: 'mujer', type: 'Conjuntos', price: 179900, oldPrice: null, badge: 'NUEVO', image: photo(8483358), sizes: ['XS', 'S', 'M', 'L'], colors: ['#3a3433', '#bbaeb1'], description: 'Coordinado de líneas limpias pensado para ir más allá del entrenamiento.' },
  { id: 'hoodie-tempo', name: 'Hoodie Tempo', category: 'hombre', type: 'Buzos', price: 189900, oldPrice: null, badge: '', image: photo(19790236), sizes: ['S', 'M', 'L', 'XL'], colors: ['#212121', '#777972'], description: 'Un extra de comodidad con una estética urbana y deportiva.' },
  { id: 'top-pulse', name: 'Top Pulse', category: 'mujer', type: 'Tops deportivos', price: 94900, oldPrice: null, badge: '', image: photo(8523574), sizes: ['XS', 'S', 'M', 'L'], colors: ['#696080', '#171719'], description: 'Una prenda versátil que combina fácil con tus looks favoritos.' },
  { id: 'camiseta-training', name: 'Camiseta Training', category: 'hombre', type: 'Camisetas', price: 109900, oldPrice: null, badge: '', image: photo(14756459), sizes: ['S', 'M', 'L', 'XL'], colors: ['#222423', '#eeeae4'], description: 'Inspirada en el entrenamiento y lista para la vida diaria.' },
  { id: 'bolso-daily', name: 'Bolso Daily Move', category: 'accesorios', type: 'Bolsos', price: 129900, oldPrice: null, badge: 'NUEVO', image: photo(9391902), sizes: ['Única'], colors: ['#292a27', '#a17b5a'], description: 'Espacio para lo esencial antes, durante y después del entrenamiento.' }
];

const categoryLabel = { mujer: 'MUJER', hombre: 'HOMBRE', accesorios: 'ACCESORIOS' };
const currency = value => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value).replace(/\s/g, '');
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function loadStorage(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
  catch { return fallback; }
}
function saveStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* La navegación privada puede bloquear el almacenamiento. */ }
}

const state = {
  category: 'all',
  sort: 'featured',
  query: '',
  favoritesOnly: false,
  favorites: loadStorage('pulso-favorites-v1', []).filter(id => products.some(p => p.id === id)),
  cart: loadStorage('pulso-cart-v1', []).filter(item => products.some(p => p.id === item.id) && typeof item.qty === 'number' && item.qty > 0),
  currentProduct: null,
  selectedSize: null,
  toastTimer: null,
  focusBeforeDialog: null
};

const heartIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.3a5.5 5.5 0 0 0 0-7.8Z"/></svg>';

function toast(message) {
  const element = $('#toast');
  clearTimeout(state.toastTimer);
  element.textContent = message;
  element.classList.add('visible');
  state.toastTimer = setTimeout(() => element.classList.remove('visible'), 3000);
}

function countItems() { return state.cart.reduce((total, item) => total + item.qty, 0); }

function updateCounters() {
  $('#cart-count').textContent = countItems();
  $('#drawer-count').textContent = `(${countItems()})`;
  const count = $('#favorites-count');
  count.textContent = state.favorites.length;
  count.hidden = state.favorites.length === 0;
  $('#favorites-toggle').setAttribute('aria-pressed', String(state.favoritesOnly));
}

function filteredProducts() {
  const text = state.query.trim().toLocaleLowerCase('es');
  const visible = products.filter(p =>
    (state.category === 'all' || p.category === state.category) &&
    (!state.favoritesOnly || state.favorites.includes(p.id)) &&
    (!text || `${p.name} ${p.type} ${p.category}`.toLocaleLowerCase('es').includes(text))
  );
  if (state.sort === 'asc') visible.sort((a, b) => a.price - b.price);
  if (state.sort === 'desc') visible.sort((a, b) => b.price - a.price);
  if (state.sort === 'az') visible.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return visible;
}

function renderProducts() {
  const list = filteredProducts();
  const grid = $('#product-grid');
  grid.innerHTML = list.map(p => {
    const favorite = state.favorites.includes(p.id);
    const sale = Boolean(p.oldPrice);
    return `<article class="product-card">
      <div class="product-image">
        <img src="${p.image}" width="700" height="850" alt="Fotografía de referencia: ${p.name}" loading="lazy" referrerpolicy="no-referrer">
        ${p.badge ? `<span class="product-tag ${sale ? 'sale' : ''}">${p.badge}</span>` : ''}
        <button type="button" class="favorite-button ${favorite ? 'is-favorite' : ''}" data-favorite="${p.id}" aria-label="${favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}: ${p.name}" aria-pressed="${favorite}">${heartIcon}</button>
        <button type="button" class="quick-add" data-open-product="${p.id}" aria-label="Elegir talla para ${p.name}">ELEGIR TALLA <span aria-hidden="true">↗</span></button>
      </div>
      <div class="product-detail"><div class="product-meta">${categoryLabel[p.category]} / ${p.type.toUpperCase()}</div>
        <div class="product-title-row"><span class="product-title">${p.name}</span><span class="product-price">${currency(p.price)}${sale ? `<span class="original-price">${currency(p.oldPrice)}</span>` : ''}</span></div>
        <div class="product-swatches" aria-label="Colores de referencia">${p.colors.map(color => `<span class="product-swatch" style="background:${color}"></span>`).join('')}</div>
      </div>
    </article>`;
  }).join('');
  $('#empty-products').hidden = list.length > 0;
  grid.hidden = list.length === 0;
  const active = $('#active-search');
  if (state.favoritesOnly || state.query) {
    active.hidden = false;
    active.innerHTML = `${state.favoritesOnly ? 'Tus favoritos' : `Resultados para «${escapeHtml(state.query)}»`} · ${list.length} producto${list.length !== 1 ? 's' : ''}<button type="button" id="clear-search">Limpiar filtros ×</button>`;
  } else active.hidden = true;
  $$('.filter-tab').forEach(button => {
    const activeTab = button.dataset.category === state.category;
    button.classList.toggle('active', activeTab);
    button.setAttribute('aria-pressed', String(activeTab));
  });
  updateCounters();
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function clearFilters() {
  state.category = 'all';
  state.query = '';
  state.favoritesOnly = false;
  $('#search-input').value = '';
  $('#sort-select').value = 'featured';
  state.sort = 'featured';
  renderProducts();
}

function setCategory(category) {
  state.category = category;
  state.favoritesOnly = false;
  renderProducts();
  closeMobileMenu();
  closeSearch();
}

function toggleFavorite(id) {
  const index = state.favorites.indexOf(id);
  if (index === -1) { state.favorites.push(id); toast('Guardado en tus favoritos'); }
  else { state.favorites.splice(index, 1); toast('Eliminado de favoritos'); }
  saveStorage('pulso-favorites-v1', state.favorites);
  renderProducts();
}

function closeMobileMenu() {
  $('#mobile-menu').hidden = true;
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
  $('#menu-toggle').setAttribute('aria-label', 'Abrir menú');
}
function closeSearch() { $('#search-panel').hidden = true; }
function openSearch() {
  closeMobileMenu();
  const panel = $('#search-panel');
  panel.hidden = false;
  $('#search-input').focus();
}

function showScrim() { $('#scrim').hidden = false; document.body.classList.add('locked'); }
function hideScrim() { $('#scrim').hidden = true; document.body.classList.remove('locked'); }

function closeDialogs() {
  $('#cart-drawer').classList.remove('open');
  $('#cart-drawer').setAttribute('aria-hidden', 'true');
  $('#cart-drawer').inert = true;
  $('#quick-view').classList.remove('open');
  $('#quick-view').setAttribute('aria-hidden', 'true');
  $('#quick-view').inert = true;
  hideScrim();
  if (state.focusBeforeDialog && document.contains(state.focusBeforeDialog)) state.focusBeforeDialog.focus();
  state.focusBeforeDialog = null;
}
function openCart() {
  if (!state.focusBeforeDialog) state.focusBeforeDialog = document.activeElement;
  const quick = $('#quick-view');
  quick.classList.remove('open'); quick.inert = true; quick.setAttribute('aria-hidden', 'true');
  renderCart();
  const drawer = $('#cart-drawer');
  drawer.inert = false; drawer.setAttribute('aria-hidden', 'false');
  showScrim();
  requestAnimationFrame(() => drawer.classList.add('open'));
  $('#cart-close').focus();
}
function openProduct(id) {
  const p = products.find(product => product.id === id);
  if (!p) return;
  state.focusBeforeDialog = document.activeElement;
  state.currentProduct = p;
  state.selectedSize = p.sizes.length === 1 ? p.sizes[0] : null;
  $('#quick-photo').innerHTML = `<img src="${p.image}" alt="Fotografía de referencia: ${p.name}" referrerpolicy="no-referrer">`;
  $('#quick-title').textContent = p.name.toUpperCase();
  $('#quick-category').textContent = `${categoryLabel[p.category]} / ${p.type.toUpperCase()}`;
  $('#quick-price').textContent = currency(p.price);
  $('#quick-description').textContent = p.description;
  $('#size-helper').textContent = p.sizes.length === 1 ? 'TALLA ÚNICA' : 'ELIGE UNA OPCIÓN';
  $('#size-options').innerHTML = p.sizes.map(size => `<button type="button" class="size-option ${state.selectedSize === size ? 'selected' : ''}" data-size="${size}" aria-pressed="${state.selectedSize === size}">${size}</button>`).join('');
  $('#add-to-cart').disabled = !state.selectedSize;
  const dialog = $('#quick-view');
  dialog.inert = false; dialog.setAttribute('aria-hidden', 'false');
  showScrim();
  requestAnimationFrame(() => dialog.classList.add('open'));
  $('#quick-close').focus();
}
function addToCart() {
  if (!state.currentProduct || !state.selectedSize) { toast('Selecciona una talla'); return; }
  const p = state.currentProduct;
  const item = state.cart.find(item => item.id === p.id && item.size === state.selectedSize);
  if (item) item.qty = Math.min(item.qty + 1, 12);
  else state.cart.push({ id: p.id, size: state.selectedSize, qty: 1 });
  saveStorage('pulso-cart-v1', state.cart);
  updateCounters();
  openCart();
  toast('Producto añadido al carrito');
}
function changeQuantity(id, size, delta) {
  const item = state.cart.find(entry => entry.id === id && entry.size === size);
  if (!item) return;
  item.qty = Math.min(12, Math.max(0, item.qty + delta));
  state.cart = state.cart.filter(entry => entry.qty > 0);
  saveStorage('pulso-cart-v1', state.cart);
  renderCart(); updateCounters();
}
function removeFromCart(id, size) {
  state.cart = state.cart.filter(item => !(item.id === id && item.size === size));
  saveStorage('pulso-cart-v1', state.cart);
  renderCart(); updateCounters();
}
function renderCart() {
  const target = $('#cart-items');
  if (!state.cart.length) {
    target.innerHTML = `<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 8h14l1 12H4L5 8ZM9 9V6a3 3 0 0 1 6 0v3"/></svg><strong>TU CARRITO ESTÁ VACÍO.</strong><p>Encuentra las prendas que van con tu próximo movimiento.</p></div>`;
  } else {
    target.innerHTML = state.cart.map(item => {
      const p = products.find(product => product.id === item.id);
      return `<article class="cart-item"><img src="${p.image}" alt="${p.name}" width="90" height="113" referrerpolicy="no-referrer"><div><div class="cart-item-top"><div><div class="cart-item-name">${p.name}</div><div class="cart-item-size">Talla: ${item.size}</div><div class="cart-item-price">${currency(p.price * item.qty)}</div></div><button type="button" class="cart-item-remove" data-remove="${p.id}" data-size="${item.size}" aria-label="Eliminar ${p.name} talla ${item.size}">×</button></div><div class="qty-control"><button type="button" data-qty="-1" data-id="${p.id}" data-size="${item.size}" aria-label="Restar una unidad de ${p.name}">−</button><span>${item.qty}</span><button type="button" data-qty="1" data-id="${p.id}" data-size="${item.size}" aria-label="Sumar una unidad de ${p.name}">+</button></div></div></article>`;
    }).join('');
  }
  const subtotal = state.cart.reduce((total, item) => total + products.find(p => p.id === item.id).price * item.qty, 0);
  $('#cart-subtotal').textContent = currency(subtotal);
  $('#checkout-button').disabled = !state.cart.length;
  updateCounters();
}

function buildOrderText() {
  const items = state.cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return `- ${product.name} | talla: ${item.size} | ${item.qty} ud. | ${currency(product.price * item.qty)}`;
  }).join('\n');
  const subtotal = state.cart.reduce((sum, item) => sum + products.find(p => p.id === item.id).price * item.qty, 0);
  return `Hola, quiero consultar la disponibilidad de este pedido en PULSO Active:\n\n${items}\n\nSubtotal estimado: ${currency(subtotal)}\n\nQuedo atento/a a la disponibilidad, el envío y las formas de pago.`;
}

function checkout() {
  if (!state.cart.length) return;
  const text = buildOrderText();
  const number = String(window.PULSO_CONFIG?.whatsapp || '').replace(/\D/g, '');
  if (number.length >= 10 && number.length <= 15) {
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    toast('Se abrió WhatsApp con tu pedido');
    return;
  }
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'mi-pedido-pulso.txt';
  document.body.appendChild(anchor);
  anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast('Resumen de pedido descargado');
}

$('#current-year').textContent = new Date().getFullYear();
renderProducts();
renderCart();

$('#menu-toggle').addEventListener('click', () => {
  closeSearch();
  const menu = $('#mobile-menu');
  menu.hidden = !menu.hidden;
  const opened = !menu.hidden;
  $('#menu-toggle').setAttribute('aria-expanded', String(opened));
  $('#menu-toggle').setAttribute('aria-label', opened ? 'Cerrar menú' : 'Abrir menú');
});
$('#search-toggle').addEventListener('click', () => $('#search-panel').hidden ? openSearch() : closeSearch());
$('#search-close').addEventListener('click', closeSearch);
$('#search-input').addEventListener('input', event => { state.query = event.target.value; state.favoritesOnly = false; renderProducts(); });
$('#search-form').addEventListener('submit', event => { event.preventDefault(); closeSearch(); $('#coleccion').scrollIntoView({ behavior: 'smooth' }); });
$('#favorites-toggle').addEventListener('click', () => {
  state.favoritesOnly = !state.favoritesOnly;
  state.category = 'all';
  state.query = '';
  $('#search-input').value = '';
  renderProducts();
  closeSearch(); closeMobileMenu();
  $('#coleccion').scrollIntoView({ behavior: 'smooth' });
});
$$('[data-go-category]').forEach(link => link.addEventListener('click', () => setCategory(link.dataset.goCategory)));
$$('.filter-tab').forEach(button => button.addEventListener('click', () => setCategory(button.dataset.category)));
$('#sort-select').addEventListener('change', event => { state.sort = event.target.value; renderProducts(); });
$('#product-grid').addEventListener('click', event => {
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) return toggleFavorite(favorite.dataset.favorite);
  const open = event.target.closest('[data-open-product]');
  if (open) openProduct(open.dataset.openProduct);
});
$('#active-search').addEventListener('click', event => { if (event.target.id === 'clear-search') clearFilters(); });
$('#reset-filters').addEventListener('click', clearFilters);
$('#cart-toggle').addEventListener('click', openCart);
$('#cart-close').addEventListener('click', closeDialogs);
$('#quick-close').addEventListener('click', closeDialogs);
$('#scrim').addEventListener('click', closeDialogs);
$('#keep-shopping').addEventListener('click', closeDialogs);
$('#size-options').addEventListener('click', event => {
  const button = event.target.closest('[data-size]');
  if (!button) return;
  state.selectedSize = button.dataset.size;
  $$('.size-option').forEach(option => { const selected = option === button; option.classList.toggle('selected', selected); option.setAttribute('aria-pressed', String(selected)); });
  $('#add-to-cart').disabled = false;
});
$('#add-to-cart').addEventListener('click', addToCart);
$('#cart-items').addEventListener('click', event => {
  const remove = event.target.closest('[data-remove]');
  if (remove) return removeFromCart(remove.dataset.remove, remove.dataset.size);
  const qty = event.target.closest('[data-qty]');
  if (qty) changeQuantity(qty.dataset.id, qty.dataset.size, Number(qty.dataset.qty));
});
$('#checkout-button').addEventListener('click', checkout);
$('#footer-contact').addEventListener('click', () => { if (state.cart.length) openCart(); else $('#coleccion').scrollIntoView({ behavior: 'smooth' }); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeDialogs(); closeSearch(); closeMobileMenu(); }
  if (event.key !== 'Tab') return;
  const dialog = $('#cart-drawer').classList.contains('open') ? $('#cart-drawer') : ($('#quick-view').classList.contains('open') ? $('#quick-view') : null);
  if (!dialog) return;
  const focusable = [...dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])')];
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
