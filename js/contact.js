document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Message sent!");
    form.reset();
  });
});
