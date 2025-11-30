
document.addEventListener("DOMContentLoaded", () => {
  const allProducts = [...kits, ...parts];

  const gallery = document.getElementById("rollingGalleryUnified");
  if (gallery) {
    gallery.innerHTML = "";
    allProducts.forEach(prod => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${prod.img}">
        <div class="info">
          <h3>${prod.name}</h3>
          <div class="price">${prod.price}</div>
        </div>`;
      card.addEventListener("click", () => openProductPopup(prod));
      gallery.appendChild(card);
    });
  }
});
