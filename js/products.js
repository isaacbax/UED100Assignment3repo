/* PRODUCT DATA */
const kits = [
  { name: "Widebody Kit BMW E31", price: "$4,999", img: "Euro/V1.0_8_SERIES_E31_PIMG_no_bg.jpg", brand: "BMW", category: "euro", use: "show" },
  { name: "Widebody Kit Mercedes W201", price: "$4,999", img: "Euro/V1.0_190E_W201_PIMG.webp", brand: "Mercedes", category: "euro", use: "street" },
  { name: "Widebody Kit BMW E46", price: "$4,999", img: "Euro/V1.0_E46_M3_PIMG.webp", brand: "BMW", category: "euro", use: "track" },
  { name: "Widebody Kit BMW E92", price: "$4,999", img: "Euro/V1.0_E92_M3_PIMG.webp", brand: "BMW", category: "euro", use: "street" },
  { name: "Widebody Kit VW GOLF MK7", price: "$4,999", img: "Euro/V1.0_MK7_GOLF_GTi_PIMG.webp", brand: "VW", category: "euro", use: "street" },
  { name: "Widebody Kit BMW E30", price: "$4,999", img: "Euro/V1.5_E30_M3_PIMG.webp", brand: "BMW", category: "euro", use: "show" },
  { name: "Widebody Kit PORSCHE 987.1", price: "$4,999", img: "Euro/V2.0_987.1_CAYMEN_PIMG.webp", brand: "Porsche", category: "euro", use: "track" },
  { name: "Widebody Kit BMW E46 V2", price: "$4,999", img: "Euro/V2.0_E46_M3_PIMG.webp", brand: "BMW", category: "euro", use: "track" },
  { name: "Widebody Kit Nissan R32", price: "$1,299", img: "JDM/V1.0_R32_GTR_PIMG.webp", brand: "Nissan", category: "jdm", use: "track" },
  { name: "Widebody Kit Toyota AE86", price: "$499", img: "JDM/V1.0_AE86_LEVIN_PIMG.webp", brand: "Toyota", category: "jdm", use: "street" },
  { name: "Widebody Kit NISSAN S14 BOSS", price: "$499", img: "JDM/V1.0_BOSS_SILVIA_S14_PIMG.webp", brand: "Nissan", category: "jdm", use: "show" },
  { name: "Widebody Kit HONDA S2000 AP1", price: "$499", img: "JDM/V1.0_S2000_AP1_AP2_PIMG.webp", brand: "Honda", category: "jdm", use: "track" },
  { name: "Widebody Kit NISSAN R33", price: "$499", img: "JDM/V1.0_TYPE_M_GTST_GTR_R33_PIMG.webp", brand: "Nissan", category: "jdm", use: "street" },
  { name: "Widebody Kit NISSAN R32", price: "$499", img: "JDM/V1.5_R32_GTR_PIMG.webp", brand: "Nissan", category: "jdm", use: "show" }
];

const parts = [
  { name: "Parking sensor kit", price: "$299", img: "Parts/Photoroom_20250109_225935.webp", brand: "Universal", category: "parts", use: "street" },
  { name: "Vent kit black", price: "$899", img: "Parts/Photoroom_20250109_230012.webp", brand: "Universal", category: "parts", use: "street" },
  { name: "Vent kit carbon fibre", price: "$1,200", img: "Parts/Photoroom_20250109_230140.webp", brand: "Universal", category: "parts", use: "show" },
  { name: "Mirror housing", price: "$1,200", img: "Parts/Photoroom_20250109_231341.webp", brand: "Universal", category: "parts", use: "street" },
  { name: "6 point seat belt", price: "$1,200", img: "Parts/Photoroom_20250109_231642.webp", brand: "Universal", category: "parts", use: "track" },
  { name: "Rocket bunny x nardi wheel", price: "$1,200", img: "Parts/Photoroom_20250109_232321.webp", brand: "Universal", category: "parts", use: "show" },
  { name: "Lip brace kit", price: "$1,200", img: "Parts/Photoroom_20250109_232756.webp", brand: "Universal", category: "parts", use: "track" },
  { name: "Pandem x sparco bucket seat", price: "$1,200", img: "Parts/Photoroom_20250109_232851.webp", brand: "Universal", category: "parts", use: "track" },
  { name: "Window net", price: "$1,200", img: "Parts/Photoroom_20250109_233007.webp", brand: "Universal", category: "parts", use: "track" },
  { name: "Clear side marker", price: "$1,200", img: "Parts/Photoroom_20250109_234045.webp", brand: "Universal", category: "parts", use: "street" },
  { name: "Clear side marker (boss kit)", price: "$1,200", img: "Parts/Photoroom_20250109_234439.webp", brand: "Universal", category: "parts", use: "show" }
];

function getAllProducts() {
  return [...kits, ...parts];
}

/* RENDERING */
function renderSection(products, target) {
  const grid = document.getElementById(target);
  if (!grid) return;

  grid.innerHTML = "";
  products.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}">
      <div class="info">
        <h3>${prod.name}</h3>
        <p>${prod.brand || ""}</p>
        <div class="price">${prod.price}</div>
      </div>
    `;
    card.addEventListener("click", () => openProductPopup(prod));
    grid.appendChild(card);
  });
}

/* SEARCH BAR (existing behaviour) */
function initSearch() {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  const all = getAllProducts();

  if (!input || !results) return;

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    if (!q) {
      results.style.display = "none";
      return;
    }

    const filtered = all.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q))
    );

    results.style.display = "block";
    renderSection(filtered, "productGrid");
  });
}

/* FILTER BAR */
function applyFilter(filter) {
  let filteredKits = [...kits];
  let filteredParts = [...parts];

  const applyToArray = (arr) => {
    return arr.filter(p => {
      const price = parsePrice(p.price);

      if (filter === "jdm") return p.category === "jdm";
      if (filter === "euro") return p.category === "euro";
      if (filter === "parts") return p.category === "parts";
      if (filter === "street") return p.use === "street";
      if (filter === "track") return p.use === "track";
      if (filter === "show") return p.use === "show";
      if (filter === "budget-low") return price < 1000;
      if (filter === "budget-mid") return price >= 1000 && price <= 3000;
      if (filter === "budget-high") return price > 3000;
      return true; // "all"
    });
  };

  if (filter !== "all") {
    filteredKits = applyToArray(filteredKits);
    filteredParts = applyToArray(filteredParts);
  }

  renderSection(filteredKits, "productGridKits");
  renderSection(filteredParts, "productGridParts");
}

function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter || "all";
      applyFilter(filter);
    });
  });
}

/* HELP ME CHOOSE WIZARD */
function initHelperWizard() {
  const chassisSelect = document.getElementById("helper-chassis");
  const useSelect = document.getElementById("helper-use");
  const budgetSelect = document.getElementById("helper-budget");
  const submitBtn = document.getElementById("helper-submit");
  const resultsGrid = document.getElementById("helper-results");
  if (!chassisSelect || !useSelect || !budgetSelect || !submitBtn || !resultsGrid) return;

  submitBtn.addEventListener("click", () => {
    const chassisVal = chassisSelect.value;
    const useVal = useSelect.value;
    const budgetVal = budgetSelect.value;

    const all = getAllProducts();
    const filtered = all.filter(p => {
      const price = parsePrice(p.price);

      // brand / chassis match
      if (chassisVal === "BMW" && p.brand !== "BMW") return false;
      if (chassisVal === "Nissan" && p.brand !== "Nissan") return false;
      if (chassisVal === "Toyota" && p.brand !== "Toyota") return false;
      if (chassisVal === "Honda" && p.brand !== "Honda") return false;
      if (chassisVal === "Other" && p.category !== "parts") return false;

      if (useVal && p.use !== useVal) return false;

      if (budgetVal === "low" && price >= 1000) return false;
      if (budgetVal === "mid" && (price < 1000 || price > 3000)) return false;
      if (budgetVal === "high" && price <= 3000) return false;

      return true;
    });

    if (!filtered.length) {
      resultsGrid.innerHTML = `<p class="no-results">No recommendations match those settings yet. Try widening your options.</p>`;
    } else {
      renderSection(filtered, "helper-results");
    }

    resultsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* PAGE INIT */
document.addEventListener("DOMContentLoaded", () => {
  // Default render
  renderSection(kits, "productGridKits");
  renderSection(parts, "productGridParts");

  initSearch();
  initFilters();
  initHelperWizard();
});
