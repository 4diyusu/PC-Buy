console.log("Main.js loaded");

// ========== Main Initialization ==========
document.addEventListener("DOMContentLoaded", () => {
  // ========== Dark Mode ==========
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
  }

  const toggleBtn = document.querySelector("[onclick='toggleMode()']");
  toggleBtn?.addEventListener("click", toggleMode);

  function toggleMode() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  }

  // ========== Login Modal ==========
  const loginModal = document.getElementById("loginModal");
  const openLoginBtn = document.getElementById("openLoginBtn");
  const loginBox = document.querySelector(".login-box");

  openLoginBtn?.addEventListener("click", () => {
    loginModal.style.display = "flex";
  });

  loginModal?.addEventListener("click", (e) => {
    if (!loginBox.contains(e.target)) {
      loginModal.style.display = "none";
    }
  });

  // ========== Logo Scroll (Home) ==========
  const logoLink = document.getElementById("logo-link");
  if (logoLink) {
    logoLink.addEventListener("click", function (event) {
      const onMainPage =
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/index") ||
        window.location.pathname.endsWith("/index.html");

      if (onMainPage) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // ========== Hamburger Sidebar ==========
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
  });


  // Optional: Close sidebar if Escape key is pressed
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      sidebar?.classList.remove("show");
      overlay?.classList.remove("show");
    }
  });

  // ========== Product Page Population (Optional JSON fallback) ==========
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (productId) {
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
        document.getElementById("product-stock").textContent = product.inStock
          ? "In Stock ✅"
          : "Out of Stock ❌";
        document.getElementById("product-image").src = product.image;
      })
      .catch((err) => {
        console.error("Error loading product:", err);
      });
  }
});
