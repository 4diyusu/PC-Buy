console.log("Main.js loaded");

function toggleMode() {
  document.body.classList.toggle("dark-mode");
}

// Show login modal
document.getElementById("openLoginBtn").addEventListener("click", function () {
  document.getElementById("loginModal").style.display = "flex"; // Make sure your CSS uses flex
});

// Stop click inside modal box from closing the modal
document.querySelector(".login-outer-box").addEventListener("click", (e) => {
  e.stopPropagation();
});

// Hide modal when clicking outside of modal-content
window.addEventListener("click", function (event) {
  const modal = document.getElementById("loginModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
