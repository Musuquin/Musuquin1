
/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const products = [
  { id:1, name:'ASUS ROG Zephyrus G14', cat:'laptop', img:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop', price:1449, oldPrice:1699, spec:'Ryzen 9 / RTX 4060 / 32GB DDR5', badge:'sale', badgeText:'−15%' },
  { id:2, name:'MacBook Pro M4 16"', cat:'laptop', img:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop', price:2199, spec:'M4 Pro / 24GB / 512GB SSD', badge:'new', badgeText:'NUEVO' },
  { id:3, name:'Lenovo Legion Pro 7i', cat:'laptop', img:'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&h=200&fit=crop', price:1899, oldPrice:2099, spec:'Core i9-14900HX / RTX 4080', badge:'hot', badgeText:'HOT' },
  { id:4, name:'ASUS ROG Strix Tower', cat:'desktop', img:'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&h=200&fit=crop', price:2349, spec:'Ryzen 9 7950X / RTX 4090 / 64GB', badge:'top', badgeText:'TOP' },
  { id:5, name:'MSI Codex X Plus', cat:'desktop', img:'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&h=200&fit=crop', price:1199, oldPrice:1499, spec:'Core i7-14700F / RTX 4070 / 32GB', badge:'sale', badgeText:'−20%' },
  { id:6, name:'Samsung Odyssey G9 49"', cat:'monitor', img:'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop', price:1149, spec:'DQHD / 240Hz / OLED / 0.03ms', badge:'new', badgeText:'NUEVO' },
  { id:7, name:'LG UltraGear 27GR95QE', cat:'monitor', img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop', price:699, oldPrice:849, spec:'QHD / 240Hz / OLED', badge:'sale', badgeText:'−18%' },
  { id:8, name:'ASUS ROG Delta S Animate', cat:'audio', img:'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=200&fit=crop', price:249, spec:'THX Spatial / USB-C / Mic integrado', badge:'hot', badgeText:'HOT' },
  { id:9, name:'SteelSeries Arctis Nova Pro', cat:'audio', img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', price:329, spec:'Inalámbrico / ANC / Hi-Res Audio', badge:'top', badgeText:'TOP' },
  { id:10, name:'Shure MV7+ USB/XLR', cat:'audio', img:'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&h=200&fit=crop', price:299, spec:'Cardioide / USB + XLR / 24-bit', badge:'new', badgeText:'NUEVO' },
  { id:11, name:'NVIDIA RTX 5090', cat:'gpu', img:'https://images.unsplash.com/photo-1555617117-08fbf1ffa6ad?w=300&h=200&fit=crop', price:2199, spec:'24 GB GDDR7 / 512-bit / DLSS 4', badge:'new', badgeText:'NUEVO' },
  { id:12, name:'AMD Radeon RX 9070 XT', cat:'gpu', img:'https://images.unsplash.com/photo-1555617117-08fbf1ffa6ad?w=300&h=200&fit=crop', price:649, oldPrice:799, spec:'16 GB GDDR6 / RDNA 4 / FSR 4', badge:'sale', badgeText:'−19%' },
];

/* ═══════════════════════════════════════════════
   RENDER PRODUCTS
═══════════════════════════════════════════════ */
let activeFilter = 'all';

function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  const list = filter === 'all' ? products : products.filter(p => p.cat === filter);
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="img-area">
        ${p.badge ? `<div class="p-badge ${p.badge}">${p.badgeText}</div>` : ''}
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="p-info">
        <div class="p-cat">${catLabel(p.cat)}</div>
        <div class="p-name">${p.name}</div>
        <div class="p-spec">${p.spec}</div>
        <div class="p-price-row">
          <div>
            ${p.oldPrice ? `<span class="p-old">${p.oldPrice.toLocaleString('es-ES')}€</span>` : ''}
            <span class="p-price">${p.price.toLocaleString('es-ES')}€</span>
          </div>
          <button class="add-cart-btn" onclick="addToCart('${p.name}', ${p.price}, '🛒')" title="Añadir al carrito">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function catLabel(cat) {
  return { laptop:'Portátiles', desktop:'Torre', monitor:'Monitor', audio:'Audio', gpu:'Gráfica' }[cat] || cat;
}

function filterProducts(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

renderProducts('all');

/* ═══════════════════════════════════════════════
   CART
═══════════════════════════════════════════════ */
let cart = JSON.parse(localStorage.getItem('techcore_cart') || '[]');
let cartDiscount = JSON.parse(localStorage.getItem('techcore_cart_discount') || 'false');

function saveCart() {
  localStorage.setItem('techcore_cart', JSON.stringify(cart));
  localStorage.setItem('techcore_cart_discount', JSON.stringify(cartDiscount));
}

function addToCart(name, price, icon, discounted = false) {
  const existing = cart.find(i => i.name === name && i.discounted === discounted);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, icon, qty: 1, discounted });
  }
  saveCart();
  updateCartUI();
  showToast(`${icon} ${name} añadido`, '✅');
}

function removeFromCart(name, discounted = false) {
  cart = cart.filter(i => !(i.name === name && i.discounted === discounted));
  saveCart();
  updateCartUI();
}

function changeQty(name, delta, discounted = false) {
  const item = cart.find(i => i.name === name && i.discounted === discounted);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(name, discounted);
  else {
    saveCart();
    updateCartUI();
  }
}

function getCartSubtotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function getDiscountableSubtotal() {
  return cart.filter(i => !i.discounted).reduce((s, i) => s + i.price * i.qty, 0);
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const cc = document.getElementById('cartCount');
  cc.textContent = count;
  cc.classList.toggle('visible', count > 0);

  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><div class="empty-icon">🛒</div><p>Tu carrito está vacío</p></div>`;
    footer.style.display = 'none';
    cartDiscount = false;
    document.getElementById('cartCoupon').value = '';
    document.getElementById('cartCoupon').className = '';
    document.getElementById('cartDiscountMsg').classList.remove('visible');
    saveCart();
    return;
  }

  footer.style.display = 'block';
  container.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div class="ci-icon">${i.icon}</div>
      <div class="ci-info">
        <div class="ci-name">${i.name}</div>
        <div class="ci-price">${(i.price * i.qty).toLocaleString('es-ES')}€</div>
        <div class="ci-qty">
          <button class="qty-btn" onclick="changeQty('${i.name}', -1, ${i.discounted})">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty('${i.name}', 1, ${i.discounted})">+</button>
        </div>
      </div>
      <button class="ci-remove" onclick="removeFromCart('${i.name}', ${i.discounted})">🗑</button>
    </div>
  `).join('');

  updateCartTotal();
}

function updateCartTotal() {
  let subtotal = getCartSubtotal();
  let discountable = getDiscountableSubtotal();
  let total = subtotal - (cartDiscount ? discountable * 0.15 : 0);
  document.getElementById('cartTotal').textContent = total.toLocaleString('es-ES') + '€';
}

function applyCartDiscount() {
  const val = document.getElementById('cartCoupon').value.trim().toUpperCase();
  const input = document.getElementById('cartCoupon');
  const msg = document.getElementById('cartDiscountMsg');
  if (val === 'OFERTA15') {
    cartDiscount = true;
    input.className = 'valid';
    msg.classList.add('visible');
    updateCartTotal();
    showToast('¡Descuento del 15% aplicado!', '🎉');
  } else {
    input.className = 'invalid';
    cartDiscount = false;
    msg.classList.remove('visible');
    updateCartTotal();
    showToast('Código no válido', '❌');
    setTimeout(() => { input.className = ''; }, 2000);
  }
}

function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
}

function closeCartOnBg(e) {
  if (e.target === document.getElementById('cartOverlay')) toggleCart();
}

function checkout() {
  if (cart.length === 0) return;
  let subtotal = getCartSubtotal();
  let discountable = getDiscountableSubtotal();
  let total = subtotal - (cartDiscount ? discountable * 0.15 : 0);
  showToast(`✅ Pedido de ${total.toLocaleString('es-ES')}€ procesado. ¡Gracias!`, '🎉');
  cart = [];
  cartDiscount = false;
  saveCart();
  updateCartUI();
  toggleCart();
}

/* ═══════════════════════════════════════════════
   CONFIGURATOR
═══════════════════════════════════════════════ */
const configParts = { mobo:0, cpu:0, gpu:0, ram:0, storage:0, psu:0, case:0 };
const configNames = { mobo:'', cpu:'', gpu:'', ram:'', storage:'', psu:'', case:'' };
let configServices = { assemble: false, cable: false, ship: false }; // ship: false=sep, true=mont
let configDiscountApplied = false;

const summaryMap = { mobo:1, cpu:2, gpu:3, ram:4, storage:5, psu:6, case:7 };

function shortName(full) {
  const dash = full.indexOf(' —');
  return dash > -1 ? full.substring(0, dash) : full;
}

function updateConfig(part, val, text, stepNum) {
  configParts[part] = parseFloat(val) || 0;
  configNames[part] = val ? shortName(text) : '';

  const numEl = document.getElementById('sn' + stepNum);
  const valEl = document.getElementById('sv' + stepNum);
  const smEl = document.getElementById('sm' + stepNum);

  if (val) {
    numEl.classList.add('done');
    numEl.textContent = '✓';
    valEl.textContent = configParts[part] + '€';
    smEl.textContent = configNames[part];
    smEl.classList.remove('empty');
  } else {
    numEl.classList.remove('done');
    numEl.textContent = stepNum;
    valEl.textContent = '—';
    smEl.textContent = 'Sin seleccionar';
    smEl.classList.add('empty');
  }

  updateConfigTotal();
}

function toggleService(type, el) {
  if (type === 'assemble') {
    configServices.assemble = !configServices.assemble;
    document.getElementById('assembleCheck').checked = configServices.assemble;
    document.getElementById('asmRow').style.display = configServices.assemble ? 'flex' : 'none';
  } else {
    configServices.cable = !configServices.cable;
    document.getElementById('cableCheck').checked = configServices.cable;
    document.getElementById('cblRow').style.display = configServices.cable ? 'flex' : 'none';
  }
  el.classList.toggle('active');
  updateConfigTotal();
}

function selectShip(mode, el) {
  configServices.ship = (mode === 'mont');
  document.querySelectorAll('#shipSep, #shipMont').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('shipVal').textContent = mode === 'mont' ? 'PC montado (+25€)' : 'Piezas por separado';
  updateConfigTotal();
}

function updateConfigTotal() {
  let subtotal = Object.values(configParts).reduce((a, b) => a + b, 0);
  if (configServices.assemble) subtotal += 89;
  if (configServices.cable) subtotal += 29;
  if (configServices.ship) subtotal += 25;

  let total = configDiscountApplied ? subtotal * 0.85 : subtotal;
  let discountAmt = subtotal * 0.15;

  document.getElementById('configTotal').textContent = total.toLocaleString('es-ES') + '€';

  if (configDiscountApplied) {
    document.getElementById('configDiscountRow').classList.remove('hidden');
    document.getElementById('configDiscountAmt').textContent = '−' + discountAmt.toLocaleString('es-ES', {maximumFractionDigits:2}) + '€';
  } else {
    document.getElementById('configDiscountRow').classList.add('hidden');
  }

  const allFilled = Object.values(configParts).every(v => v > 0);
  document.getElementById('configBuyBtn').disabled = !allFilled;
}

function applyConfigDiscount() {
  const val = document.getElementById('configCoupon').value.trim().toUpperCase();
  const input = document.getElementById('configCoupon');
  if (val === 'OFERTA15') {
    configDiscountApplied = true;
    input.classList.add('valid');
    updateConfigTotal();
    showToast('¡Descuento del 15% aplicado al configurador!', '🎉');
  } else {
    configDiscountApplied = false;
    input.classList.remove('valid');
    input.classList.add('invalid');
    updateConfigTotal();
    showToast('Código no válido', '❌');
    setTimeout(() => input.classList.remove('invalid'), 2000);
  }
}

function configAddToCart() {
  let subtotal = Object.values(configParts).reduce((a, b) => a + b, 0);
  if (configServices.assemble) subtotal += 89;
  if (configServices.cable) subtotal += 29;
  if (configServices.ship) subtotal += 25;
  let total = configDiscountApplied ? Math.round(subtotal * 0.85) : subtotal;
  addToCart('PC Personalizado TechCore', total, '⚙', configDiscountApplied);
  showToast('¡Configuración añadida al carrito!', '✅');
}

/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
let toastTimer;
function showToast(msg, icon='✅') {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toastIcon').textContent = icon;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ═══════════════════════════════════════════════
   COPY CODE
═══════════════════════════════════════════════ */
function copyCode() {
  const text = 'OFERTA15';
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('¡Código OFERTA15 copiado al portapapeles!', '📋');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, text.length);

  let successful = false;
  try {
    successful = document.execCommand('copy');
  } catch (err) {
    successful = false;
  }

  document.body.removeChild(textArea);

  if (successful) {
    showToast('¡Código OFERTA15 copiado al portapapeles!', '📋');
  } else {
    showToast('Error al copiar el código', '❌');
  }
}

document.getElementById('copyOfferBtn')?.addEventListener('click', copyCode);

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
