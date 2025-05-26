// This will be for loading products dynamically or cart logic later
console.log("Main.js loaded");

function toggleMode() {
  document.body.classList.toggle("dark-mode");
}

// Open login modal (trigger manually for now)
document.getElementById("openLoginBtn").addEventListener("click", function () {
  document.getElementById("loginModal").style.display = "block";
});

// Close modal
document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("loginModal").style.display = "none";
});

// Optional: Close when clicking outside the modal
window.addEventListener("click", function (event) {
  const modal = document.getElementById("loginModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
