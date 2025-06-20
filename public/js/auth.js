// Login Modal Logic
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");

loginBtn.addEventListener("click", () => {
  loginModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  loginModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target == loginModal) {
    loginModal.style.display = "none";
  }
});
