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

document.addEventListener("DOMContentLoaded", () => {
  const logoLink = document.getElementById("logo-link");

  if (logoLink) {
    logoLink.addEventListener("click", function (event) {
      // Check if current page is index.html (main menu)
      const onMainPage =
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/pcbuy/index.html"); // adjust path if hosted in a folder

      if (onMainPage) {
        // Prevent default link behavior
        event.preventDefault();
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      // Else, default behavior takes user to index.html
    });
  }
});
