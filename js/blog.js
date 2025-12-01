document.addEventListener("DOMContentLoaded", () => {
  // Attach popup open logic to ANY element with a data-popup attribute
  document.querySelectorAll("[data-popup]").forEach(item => {
    item.addEventListener("click", () => {
      const popupId = item.dataset.popup;
      if (!popupId) return;

      const popup = document.getElementById(popupId);
      if (!popup) return;

      popup.classList.add("show");
      document.body.classList.add("modal-open");
    });
  });

  // Close buttons inside popups
  document.querySelectorAll(".popup .close").forEach(close => {
    close.addEventListener("click", () => {
      const popup = close.closest(".popup");
      if (!popup) return;

      popup.classList.remove("show");
      document.body.classList.remove("modal-open");
    });
  });
});
