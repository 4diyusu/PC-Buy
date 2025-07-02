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

document.getElementById("openLoginBtn").addEventListener("click", function () {
  document.getElementById("loginModal").style.display = "block";
});

window.addEventListener("click", function (e) {
  const modal = document.getElementById("loginModal");
  if (e.target === modal) modal.style.display = "none";
});