console.log("Main.js loaded");

document.addEventListener('DOMContentLoaded', () => {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
  }
});

function toggleMode() {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

// Show login modal
document.getElementById("openLoginBtn").addEventListener("click", function () {
  document.getElementById("loginModal").style.display = "flex"; 
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
      const onMainPage =
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/pcbuy/index.html"); 

      if (onMainPage) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
});

// main.js
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) return;

  fetch("products.json")
    .then((res) => res.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);

      if (!product) {
        document.querySelector("main").innerHTML = "<p>Product not found.</p>";
        return;
      }

      document.getElementById("product-title").textContent = product.title;
      document.getElementById("product-description").textContent = product.description;
      document.getElementById("product-price").textContent = `Price: ${product.price}`;
      document.getElementById("product-stock").textContent = product.inStock ? "In Stock ✅" : "Out of Stock ❌";
      document.getElementById("product-image").src = product.image;
    })
    .catch((err) => {
      console.error("Error loading product:", err);
    });
});

const stockElement = document.getElementById("product-stock");
stockElement.textContent = product.inStock ? "In Stock ✅" : "Out of Stock ❌";
if (!product.inStock) {
  stockElement.classList.add("out-of-stock");
}
