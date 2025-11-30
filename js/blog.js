document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".news-item").forEach(item => {
    item.addEventListener("click", () => {
      const popup = document.getElementById(item.dataset.popup);
      popup.classList.add("show");
      document.body.classList.add("modal-open");
    });
  });

  document.querySelectorAll(".popup .close").forEach(close => {
    close.addEventListener("click", () => {
      close.closest(".popup").classList.remove("show");
      document.body.classList.remove("modal-open");
    });
  });
});
