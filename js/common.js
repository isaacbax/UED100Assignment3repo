/* THEME TOGGLE (GLOBAL) */
const body = document.body;

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") body.classList.add("light-mode");

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("light-mode");
      localStorage.setItem(
        "theme",
        body.classList.contains("light-mode") ? "light" : "dark"
      );
    });
  }

  loadCartFromStorage();
  updateCartUI();

  // Safe: does nothing on pages without galleryModal
  initGalleryModal();
});


/* UTILITY FUNCTIONS */
function parsePrice(str) {
  return parseFloat(str.replace(/[^0-9.]/g, ""));
}


/* CART SYSTEM (GLOBAL) */
const cart = [];

function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  const stored = localStorage.getItem("cart");
  if (!stored) return;
  try {
    const parsed = JSON.parse(stored);
    cart.length = 0;
    cart.push(...parsed);
  } catch (e) {
    console.error("Bad cart JSON:", e);
  }
}

function addToCart(product) {
  const existing = cart.find(x => x.name === product.name);
  const priceNum = parsePrice(product.price);

  if (existing) existing.qty++;
  else cart.push({ ...product, price: priceNum, qty: 1 });

  saveCartToStorage();
  updateCartUI();

  showToast(`${product.name} added to cart`);
  openCartTemporarily();
}

function updateCartUI() {
  const btn = document.getElementById("cart-toggle-btn");
  const panel = document.getElementById("cart-panel");
  const items = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");

  if (!btn || !panel || !items || !total) return;

  const qty = cart.reduce((s, i) => s + i.qty, 0);
  btn.innerText = `Cart (${qty})`;

  items.innerHTML = "";
  let sum = 0;

  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x${item.qty} — $${(item.price * item.qty).toFixed(2)}`;
    const rem = document.createElement("button");
    rem.innerText = "×";
    rem.onclick = () => {
      cart.splice(idx, 1);
      saveCartToStorage();
      updateCartUI();
    };
    li.appendChild(rem);
    items.appendChild(li);
    sum += item.price * item.qty;
  });

  total.innerText = sum.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("cart-toggle-btn");
  const panel = document.getElementById("cart-panel");

  if (btn && panel) {
    btn.addEventListener("click", () => {
      panel.classList.toggle("open");
      panel.dataset.autoOpen = "false"; // user manually controlling it
    });
  }
});


/* TOAST + MINI CART */
let toastEl = null;
let toastTimeout = null;
let autoCartTimeout = null;

function ensureToastEl() {
  if (toastEl) return toastEl;
  toastEl = document.createElement("div");
  toastEl.className = "cart-toast";
  document.body.appendChild(toastEl);
  return toastEl;
}

function showToast(message) {
  const el = ensureToastEl();
  el.textContent = message;
  el.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    el.classList.remove("show");
  }, 2500);
}

function openCartTemporarily() {
  const panel = document.getElementById("cart-panel");
  if (!panel) return;

  panel.classList.add("open");
  panel.dataset.autoOpen = "true";

  if (autoCartTimeout) clearTimeout(autoCartTimeout);
  autoCartTimeout = setTimeout(() => {
    if (panel.dataset.autoOpen === "true") {
      panel.classList.remove("open");
      delete panel.dataset.autoOpen;
    }
  }, 2500);
}


/* PRODUCT POPUP (GLOBAL) */
function openProductPopup(product) {
  const popup = document.getElementById("productPopup");
  if (!popup) return;

  const content = popup.querySelector(".popup-content");
  content.innerHTML = `
    <span class="close">×</span>
    <div class="popup-left">
      <img src="${product.img}" alt="${product.name}">
    </div>
    <div class="popup-right">
      <h2>${product.name}</h2>

      <div class="rating-row">
        <span class="stars">★★★★★</span>
        <span class="rating-score">4.8 / 5 (23 reviews)</span>
      </div>
      <div class="trust-badges">
        <span>✔ Official distributor</span>
        <span>✔ Secure checkout</span>
        <span>✔ Fast shipping</span>
      </div>

      <h3>${product.price}</h3>

      <button class="add-to-cart">Add to Cart</button>
      <button class="notify-btn">Notify me about stock &amp; price</button>

      <div class="notify-block" style="display:none;">
        <label for="notify-email">Enter your email to be notified about stock or price changes:</label>
        <input type="email" id="notify-email" placeholder="you@example.com">
        <button class="notify-save">Save</button>
      </div>
    </div>
  `;

  popup.classList.add("show");
  document.body.classList.add("modal-open");

  const addBtn = content.querySelector(".add-to-cart");
  const closeBtn = content.querySelector(".close");
  const notifyBtn = content.querySelector(".notify-btn");
  const notifyBlock = content.querySelector(".notify-block");
  const emailInput = content.querySelector("#notify-email");
  const notifySave = content.querySelector(".notify-save");

  // Add to cart
  addBtn.addEventListener("click", () => {
    addToCart(product);
    closeProductPopup();
  });

  // Close popup
  closeBtn.addEventListener("click", closeProductPopup);

  // Show email field when “Notify” button is clicked
  notifyBtn.addEventListener("click", () => {
    notifyBlock.style.display = "block";
    if (emailInput) {
      emailInput.focus();
    }
  });

  // Save email to localStorage when “Save” is clicked
  notifySave.addEventListener("click", () => {
    if (!emailInput) return;
    const email = emailInput.value.trim();
    if (!email) {
      emailInput.focus();
      return;
    }

    try {
      const raw = localStorage.getItem("notifyList");
      const list = raw ? JSON.parse(raw) : [];
      list.push({
        product: product.name,
        email,
        time: new Date().toISOString()
      });
      localStorage.setItem("notifyList", JSON.stringify(list));

      if (typeof showToast === "function") {
        showToast("Notification preference saved");
      } else {
        alert("Notification preference saved");
      }
    } catch (e) {
      console.error("Failed to save notify entry", e);
      if (typeof showToast === "function") {
        showToast("Could not save notification preference");
      } else {
        alert("Could not save notification preference");
      }
    }
  });
}

function closeProductPopup() {
  const popup = document.getElementById("productPopup");
  if (!popup) return;
  popup.classList.remove("show");
  document.body.classList.remove("modal-open");
}


/* GALLERY MODAL (GLOBAL) */
function initGalleryModal() {
  const modal = document.getElementById("galleryModal");
  if (!modal) return;

  const modalImg = document.getElementById("modalImage");
  const caption = document.getElementById("modalCaption");
  const closeBtn = modal.querySelector(".close");

  document.querySelectorAll(".gallery-item img").forEach(img => {
    img.addEventListener("click", () => {
      modal.style.display = "block";
      modalImg.src = img.src;
      caption.innerText = img.alt;
      document.body.classList.add("modal-open");
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  });
}
