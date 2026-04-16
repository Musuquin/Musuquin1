async function loadSiteHeader() {
  const placeholder = document.getElementById('site-header');
  if (!placeholder) return;

  try {
    const response = await fetch('header.html');
    if (!response.ok) throw new Error('No se pudo cargar el encabezado');
    const html = await response.text();
    placeholder.innerHTML = html;
    setActiveHeaderLink();
    setupMobileMenu();
  } catch (error) {
    console.error(error);
  }
}

function setActiveHeaderLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => link.classList.remove('active'));

  const routeMap = {
    'index.html': 'index.html',
    '': 'index.html',
    'categorias.html': 'categorias.html',
    'componentes.html': 'componentes.html',
    'configurador.html': 'configurador.html',
    'ofertas.html': 'ofertas.html',
    'TechCore.html': 'index.html',
    'login.html': null,
    'checkout.html': null,
    'usuario.html': null
  };

  const activeHref = routeMap[page];
  if (!activeHref) return;

  const activeLink = document.querySelector(`.nav-links a[href="${activeHref}"]`);
  if (activeLink) activeLink.classList.add('active');
}

function setupMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuBtn.classList.toggle('open');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980 && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      menuBtn.classList.remove('open');
    }
  });
}

window.addEventListener('DOMContentLoaded', loadSiteHeader);

// CART FUNCTIONALITY
let cart = [];
let cartDiscount = false;

function loadCart() {
  cart = JSON.parse(localStorage.getItem('techcore_cart') || '[]');
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('techcore_cart', JSON.stringify(cart));
}

function addToCart(name, price, icon) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, icon, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`${icon} ${name} añadido`, '✅');
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  saveCart();
  updateCartUI();
}

function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(name);
  else {
    saveCart();
    updateCartUI();
  }
}

function getCartSubtotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const cc = document.getElementById('cartCount');
  if (cc) {
    cc.textContent = count;
    cc.classList.toggle('visible', count > 0);
  }

  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (!container || !footer) return;

  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><div class="empty-icon">🛒</div><p>Tu carrito está vacío</p></div>`;
    footer.style.display = 'none';
    cartDiscount = false;
    const coupon = document.getElementById('cartCoupon');
    const msg = document.getElementById('cartDiscountMsg');
    if (coupon) coupon.value = '';
    if (coupon) coupon.className = '';
    if (msg) msg.classList.remove('visible');
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
          <button class="qty-btn" onclick="changeQty('${i.name}', -1)">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty('${i.name}', 1)">+</button>
        </div>
      </div>
      <button class="ci-remove" onclick="removeFromCart('${i.name}')">🗑</button>
    </div>
  `).join('');

  updateCartTotal();
}

function updateCartTotal() {
  const totalEl = document.getElementById('cartTotal');
  if (!totalEl) return;
  let subtotal = getCartSubtotal();
  let total = cartDiscount ? subtotal * 0.85 : subtotal;
  totalEl.textContent = total.toLocaleString('es-ES') + '€';
}

function applyCartDiscount() {
  const input = document.getElementById('cartCoupon');
  const msg = document.getElementById('cartDiscountMsg');
  if (!input || !msg) return;
  const val = input.value.trim().toUpperCase();
  if (val === 'DESCUENTO15') {
    cartDiscount = true;
    input.className = 'valid';
    msg.classList.add('visible');
    updateCartTotal();
    showToast('¡Descuento del 20% aplicado!', '🎉');
  } else {
    input.className = 'invalid';
    cartDiscount = false;
    msg.classList.remove('visible');
    updateCartTotal();
    showToast('Código no válido', '❌');
    setTimeout(() => { input.className = ''; }, 2000);
  }
}

function checkout() {
  window.location.href = 'checkout.html';
}

function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  if (overlay) overlay.classList.toggle('open');
}

function closeCart() {
  const overlay = document.getElementById('cartOverlay');
  if (overlay) overlay.classList.remove('open');
}

function closeCartOnBg(event) {
  if (event.target.id === 'cartOverlay') closeCart();
}

function showToast(msg, icon='✅') {
  const t = document.getElementById('toast');
  const iconEl = document.getElementById('toastIcon');
  const msgEl = document.getElementById('toastMsg');
  if (!t || !iconEl || !msgEl) return;
  iconEl.textContent = icon;
  msgEl.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// Initialize cart on load
window.addEventListener('load', loadCart);
