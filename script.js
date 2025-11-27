// Data arrays
const kits = [
  { name: "Widebody Kit BMW E31", price: "$4,999", img: "Euro/V1.0_8_SERIES_E31_PIMG_no_bg.jpg" },
  { name: "Widebody Kit Mercedes W201", price: "$4,999", img: "Euro/V1.0_190E_W201_PIMG.webp" },
  { name: "Widebody Kit BMW E46", price: "$4,999", img: "Euro/V1.0_E46_M3_PIMG.webp" },
  { name: "Widebody Kit BMW E92", price: "$4,999", img: "Euro/V1.0_E92_M3_PIMG.webp" },
  { name: "Widebody Kit VW GOLF MK7", price: "$4,999", img: "Euro/V1.0_MK7_GOLF_GTi_PIMG.webp" },
  { name: "Widebody Kit BMW E30", price: "$4,999", img: "Euro/V1.5_E30_M3_PIMG.webp" },
  { name: "Widebody Kit PORSCHE 987.1", price: "$4,999", img: "Euro/V2.0_987.1_CAYMEN_PIMG.webp" },
  { name: "Widebody Kit BMW E46 V2", price: "$4,999", img: "Euro/V2.0_E46_M3_PIMG.webp" },
  { name: "Widebody Kit Nissan R32", price: "$1,299", img: "JDM/V1.0_R32_GTR_PIMG.webp" },
  { name: "Widebody Kit Toyota AE86", price: "$499", img: "JDM/V1.0_AE86_LEVIN_PIMG.webp" },
  { name: "Widebody Kit NISSAN S14 BOSS", price: "$499", img: "JDM/V1.0_BOSS_SILVIA_S14_PIMG.webp" },
  { name: "Widebody Kit HONDA S2000 AP1", price: "$499", img: "JDM/V1.0_S2000_AP1_AP2_PIMG.webp" },
  { name: "Widebody Kit NISSAN R33", price: "$499", img: "JDM/V1.0_TYPE_M_GTST_GTR_R33_PIMG.webp" },
  { name: "Widebody Kit NISSAN R32", price: "$499", img: "JDM/V1.5_R32_GTR_PIMG.webp" },
];

const parts = [
  { name: "Parking sensor kit", price: "$299", img: "Parts/Photoroom_20250109_225935.webp" },
  { name: "Vent kit black", price: "$899", img: "Parts/Photoroom_20250109_230012.webp" },
  { name: "Vent kit carbon fibre", price: "$1,200", img: "Parts/Photoroom_20250109_230140.webp" },
  { name: "Mirror housing", price: "$1,200", img: "Parts/Photoroom_20250109_231341.webp" },
  { name: "6 point seat belt", price: "$1,200", img: "Parts/Photoroom_20250109_231642.webp" },
  { name: "Rocket bunny x nardi wheel", price: "$1,200", img: "Parts/Photoroom_20250109_232321.webp" },
  { name: "Lip brace kit", price: "$1,200", img: "Parts/Photoroom_20250109_232756.webp" },
  { name: "Pandem x sparco bucket seat", price: "$1,200", img: "Parts/Photoroom_20250109_232851.webp" },
  { name: "Window net", price: "$1,200", img: "Parts/Photoroom_20250109_233007.webp" },
  { name: "Clear side marker", price: "$1,200", img: "Parts/Photoroom_20250109_234045.webp" },
  { name: "Clear side marker (boss kit)", price: "$1,200", img: "Parts/Photoroom_20250109_234439.webp" },
];

// Utility: parse price string like "$4,999" to numeric value
function parsePrice(priceStr) {
  const cleaned = priceStr.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned);
}

// Cart logic
const cart = [];

function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const stored = localStorage.getItem('cart');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        cart.length = 0;
        cart.push(...parsed);
      }
    } catch (e) {
      console.error("Failed to parse cart from storage", e);
    }
  }
}

function addToCart(product) {
  const priceNum = parsePrice(product.price);
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: product.name, price: priceNum, qty: 1, img: product.img });
  }
  saveCartToStorage();
  updateCartUI();
}

function updateCartUI() {
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartPanel = document.getElementById('cart-panel');
  const cartItemsUl = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartToggleBtn) {
    cartToggleBtn.innerText = `Cart (${ totalQty })`;
  }

  if (cartItemsUl) {
    cartItemsUl.innerHTML = "";
    let total = 0;
    cart.forEach((item, idx) => {
      const li = document.createElement('li');
      li.innerText = `${ item.name } x${ item.qty } — $${ (item.price * item.qty).toFixed(2) }`;
      const rem = document.createElement('button');
      rem.innerText = "×";
      rem.onclick = () => {
        cart.splice(idx, 1);
        saveCartToStorage();
        updateCartUI();
      };
      li.appendChild(rem);
      cartItemsUl.appendChild(li);
      total += item.price * item.qty;
    });
    if (cartTotalSpan) {
      cartTotalSpan.innerText = total.toFixed(2);
    }
  }
}

// Render product grid
function renderSection(products, containerId) {
  const gridEl = document.getElementById(containerId);
  if (!gridEl) return;

  gridEl.innerHTML = "";
  products.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}" />
      <div class="info">
        <h3>${prod.name}</h3>
        <p>High-quality build, perfect fitment.</p>
        <div class="price">${prod.price}</div>
      </div>
    `;
    card.addEventListener('click', () => openProductPopup(prod));
    gridEl.appendChild(card);
  });
}

// Product Popup logic
function openProductPopup(product) {
  const popup = document.getElementById('productPopup');
  if (!popup) return;

  const content = popup.querySelector('.popup-content');
  content.innerHTML = `
    <span class="close">×</span>
    <div class="popup-left">
      <img src="${ product.img }" alt="${ product.name }">
    </div>
    <div class="popup-right">
      <h2>${ product.name }</h2>
      <p>This ${ product.name } is designed for perfect fitment and aggressive styling. Built from high-quality materials for durability.</p>
      <h3>${ product.price }</h3>
      <button class="add-to-cart">Add to Cart</button>
    </div>
  `;

  popup.classList.add('show');
  document.body.classList.add('modal-open');

  content.querySelector('.add-to-cart').addEventListener('click', () => {
    addToCart(product);
    closeProductPopup();
  });

  content.querySelector('.close').addEventListener('click', closeProductPopup);
}

function closeProductPopup() {
  const popup = document.getElementById('productPopup');
  if (popup) {
    popup.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
}

// Blog Popup logic
function initBlogPopups() {
  document.querySelectorAll(".news-item").forEach(item => {
    item.addEventListener("click", () => {
      const popupId = item.getAttribute("data-popup");
      const popup = document.getElementById(popupId);
      if (popup) {
        popup.classList.add("show");
        document.body.classList.add("modal-open");
      }
    });
  });

  document.querySelectorAll(".popup .close").forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
      const popup = closeBtn.closest(".popup");
      popup.classList.remove("show");
      document.body.classList.remove("modal-open");
    });
  });

  document.querySelectorAll(".popup").forEach(popup => {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.classList.remove("show");
        document.body.classList.remove("modal-open");
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".popup.show").forEach(popup => {
        popup.classList.remove("show");
        document.body.classList.remove("modal-open");
      });
    }
  });
}

// Gallery Image Modal logic
function initGalleryModal() {
  const modal = document.getElementById('galleryModal');
  if (!modal) return;

  const modalImg = document.getElementById('modalImage');
  const captionText = document.getElementById('modalCaption');
  const closeBtn = modal.querySelector('.close');

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = "block";
      modalImg.src = img.src;
      captionText.innerText = img.alt;
      document.body.classList.add('modal-open');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
    document.body.classList.remove('modal-open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove('modal-open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === "block") {
      modal.style.display = "none";
      document.body.classList.remove('modal-open');
    }
  });
}

// search function
function initSearch(products, containerId, searchInputId) {
  const input = document.getElementById(searchInputId);
  const resultsSection = document.getElementById('searchResults');
  if (!input || !resultsSection) return;

  function debounce(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  const handleSearch = () => {
    const query = input.value.trim().toLowerCase();
    const gridEl = document.getElementById(containerId);
    if (!gridEl) return;

    const filtered = products.filter(prod =>
      prod.name.toLowerCase().includes(query) ||
      prod.price.toLowerCase().includes(query)
    );

    if (query.length > 0) {
      resultsSection.style.display = 'block';
      if (filtered.length) {
        renderSection(filtered, containerId);
      } else {
        gridEl.innerHTML = `<p class="no-results">No products found for "${query}"</p>`;
      }
    } else {
      resultsSection.style.display = 'none';
    }
  };

  input.addEventListener('input', debounce(handleSearch, 200));
}

// home-page rolling section 
function renderRollingGallery(products, containerId) {
  const gallery = document.getElementById(containerId);
  if (!gallery) return;

  gallery.innerHTML = "";
  products.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}" />
      <div class="info">
        <h3>${prod.name}</h3>
        <div class="price">${prod.price}</div>
      </div>
    `;
    card.addEventListener('click', () => openProductPopup(prod));
    gallery.appendChild(card);
  });
}

// THEME TOGGLE LOGIC
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

document.addEventListener("DOMContentLoaded", () => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
  } else {
    body.classList.remove("light-mode");
  }

  // Now initialize everything else (product grids, cart etc)
  const allProducts = [...kits, ...parts];
  renderRollingGallery(allProducts, 'rollingGalleryUnified');

  loadCartFromStorage();
  updateCartUI();

  renderSection(kits, 'productGridKits');
  renderSection(parts, 'productGridParts');
  renderSection(kits, 'productGrid');
  renderSection(parts, 'partsGrid');
  renderSection(allProducts, 'productGrid');

  initSearch(allProducts, 'productGrid', 'searchInput');

  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartPanel = document.getElementById('cart-panel');
  if (cartToggleBtn && cartPanel) {
    cartToggleBtn.addEventListener('click', () => {
      cartPanel.classList.toggle('open');
    });
  }

  initGalleryModal();
  initBlogPopups();
});

// Attach toggleBtn listener
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}
