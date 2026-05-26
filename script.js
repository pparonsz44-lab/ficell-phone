let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

const products = [
  { id: 1, name: "iPhone 16 Pro Max", price: 28999000, img: 'gambar/iphone 16 pm.jpeg' },
  { id: 2, name: "iPhone 16 Pro", price: 25999000, img: "gambar/download 2.jpeg" },
  { id: 3, name: "iPhone 16 Plus", price: 21999000, img: "gambar/download 3.jpeg" },
  { id: 4, name: "iPhone 15 Pro Max", price: 21999000, img: "gambar/download 4.jpeg" },
  { id: 5, name: "iPhone 15 Pro", price: 18999000, img: "gambar/download 5.jpeg" },
  { id: 6, name: "iPhone 14 Pro Max", price: 16999000, img: "gambar/download 7.jpeg" }
];

function updateUserUI() {
  const usernameEl = document.getElementById('username');
  if (usernameEl) {
    usernameEl.textContent = currentUser ? currentUser.username : "Guest";
  }
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = cart.length;
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  cart.push({...product, quantity: 1});
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  const notif = document.createElement('div');
  notif.style.cssText = `position:fixed;bottom:30px;right:30px;background:#ffd700;color:#000;padding:16px 24px;border-radius:12px;font-weight:600;z-index:10000;`;
  notif.textContent = `${product.name} ditambahkan ke keranjang`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2200);
}

// ==================== AUTH ====================
function showAuthModal() {
  const modal = document.createElement('div');
  modal.id = "auth-modal";
  modal.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:2000;display:flex;align-items:center;justify-content:center;`;
  modal.innerHTML = `
    <div style="background:#111;padding:3rem 2.5rem;border-radius:20px;width:420px;border:1px solid #ffd700;text-align:center;">
      <h2 style="color:#ffd700;margin-bottom:1.5rem;">Masuk ke Ficell Phone</h2>
      <input type="text" id="username-input" placeholder="Username" style="width:100%;padding:14px;margin:10px 0;background:#222;border:none;color:white;border-radius:10px;">
      <input type="password" id="password-input" placeholder="Password" style="width:100%;padding:14px;margin:10px 0;background:#222;border:none;color:white;border-radius:10px;">
      <button onclick="login()" style="width:100%;padding:14px;background:#ffd700;color:#000;border:none;border-radius:50px;margin:15px 0 8px;font-weight:700;">Login</button>
      <button onclick="register()" style="width:100%;padding:14px;background:transparent;border:2px solid #ffd700;color:#ffd700;border-radius:50px;">Register Akun Baru</button>
      <button onclick="closeModal()" style="margin-top:15px;background:none;border:none;color:#888;">Tutup</button>
    </div>`;
  document.body.appendChild(modal);
}

function closeModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.remove();
}

function login() {
  const username = document.getElementById('username-input').value.trim();
  if (!username) return alert("Masukkan username!");

  currentUser = { username: username };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateUserUI();
  closeModal();
  alert(`✅ Selamat datang kembali, ${username}!`);
}

function register() {
  const username = document.getElementById('username-input').value.trim();
  if (!username) return alert("Masukkan username!");

  currentUser = { username: username };
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateUserUI();
  closeModal();
  alert(`✅ Registrasi berhasil! Selamat datang, ${username}`);
}

// ==================== PAYMENT ====================
function processPayment() {
  if (cart.length === 0) return alert("Keranjang kosong!");

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const orderId = "FICELL-" + Date.now().toString().slice(-8);

  const order = {
    orderId: orderId,
    user: currentUser ? currentUser.username : "Guest",
    items: cart,
    total: total,
    date: new Date().toLocaleString('id-ID')
  };

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  alert(`✅ PEMBAYARAN BERHASIL!\n\nOrder ID: ${orderId}\nTotal: Rp ${total.toLocaleString('id-ID')}\n\nTerima kasih telah berbelanja di Ficell Phone!`);

  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  setTimeout(() => window.location.href = "index.html", 1800);
}

// ==================== OTHER FUNCTIONS ====================
function viewProduct(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

function renderProducts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="price">Rp ${p.price.toLocaleString('id-ID')}</div>
        <div style="display:flex; gap:12px; margin-top:15px;">
          <button class="add-to-cart" onclick="addToCart(${p.id}); event.stopImmediatePropagation()">+ Keranjang</button>
          <button class="btn-primary" onclick="viewProduct(${p.id}); event.stopImmediatePropagation()" style="flex:1">Detail</button>
        </div>
      </div>
    </div>
  `).join('');
}

function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const product = products.find(p => p.id === id);
  if (!product) return;
  document.getElementById('product-detail').innerHTML = `
    <div style="flex:1"><img src="${product.img}" style="width:100%;border-radius:24px;"></div>
    <div style="flex:1">
      <h1 style="color:#ffd700;font-size:3rem;">${product.name}</h1>
      <div style="font-size:2.4rem;font-weight:700;margin:1.5rem 0;">Rp ${product.price.toLocaleString('id-ID')}</div>
      <p style="color:#aaa;line-height:1.8;">iPhone premium dengan kualitas terbaik dan garansi resmi.</p>
      <button onclick="addToCart(${product.id})" class="btn-primary" style="width:100%;margin-top:2.5rem;font-size:1.4rem;padding:1.5rem;">Tambah ke Keranjang</button>
    </div>`;
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  let total = 0;
  let html = cart.map((item, i) => {
    total += item.price;
    return `
      <div style="display:flex;background:#111;padding:1.5rem;border-radius:16px;margin-bottom:1.5rem;">
        <img src="${item.img}" style="width:140px;height:140px;object-fit:cover;border-radius:12px;">
        <div style="margin-left:2rem;flex:1;">
          <h3>${item.name}</h3>
          <p style="font-size:1.5rem;margin:1rem 0;">Rp ${item.price.toLocaleString('id-ID')}</p>
          <button onclick="removeFromCart(${i})" style="color:#ff6666;background:none;border:none;cursor:pointer;">Hapus</button>
        </div>
      </div>`;
  }).join('');
  container.innerHTML = html || '<p style="text-align:center;color:#666;padding:4rem;font-size:1.3rem;">Keranjang kosong</p>';
  const totalEl = document.getElementById('total-price');
  if (totalEl) totalEl.textContent = total.toLocaleString('id-ID');
}

function removeFromCart(i) {
  cart.splice(i, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function goToCheckout() {
  if (cart.length === 0) return alert("Keranjang kosong!");
  window.location.href = "checkout.html";
}

function submitSell() {
  alert("✅ Penawaran berhasil dikirim! Tim Ficell Phone akan menghubungi Anda segera.");
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateUserUI();
  updateCartCount();
  if (document.getElementById('featured-products')) renderProducts('featured-products');
  if (document.getElementById('shop-products')) renderProducts('shop-products');
  if (document.getElementById('product-detail')) loadProductDetail();
  if (document.getElementById('cart-items')) renderCart();
});