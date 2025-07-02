// Login Modal Logic (safe for partial-based modal)
document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");
  const openLoginBtn = document.getElementById("openLoginBtn");
  const loginBtn = document.getElementById("loginBtn");
  const closeModal = document.getElementById("closeModal");

  function openModal() {
    if (loginModal) loginModal.style.display = "block";
  }

  function closeModalFunc() {
    if (loginModal) loginModal.style.display = "none";
  }

  if (openLoginBtn) {
    openLoginBtn.addEventListener("click", openModal);
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", openModal);
  }

  if (closeModal) {
    closeModal.addEventListener("click", closeModalFunc);
  }

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      closeModalFunc();
    }
  });
});
