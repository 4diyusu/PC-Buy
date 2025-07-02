const loginForm = document.getElementById("loginForm");
const loginModal = document.getElementById("loginModal");
const openLoginBtn = document.getElementById("openLoginBtn");
const closeModal = document.getElementById("closeModal");
const errorLabel = document.getElementById("loginError");

if (loginForm) {
  // Open modal
  openLoginBtn?.addEventListener("click", () => {
    loginModal.style.display = "flex";
  });

  // Close modal
  closeModal?.addEventListener("click", () => {
    loginModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.style.display = "none";
  });

  // Submit login
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    errorLabel.style.color = "red";

    if (!email || !password) {
      errorLabel.textContent = "Please enter both email and password.";
      return;
    }

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const msg = await res.text();

      if (res.ok) {
        errorLabel.style.color = "green";
        errorLabel.textContent = "Login successful! Redirecting...";
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        errorLabel.textContent = msg || "Login failed.";
      }
    } catch (err) {
      console.error("Login error:", err);
      errorLabel.textContent = "Server error. Please try again later.";
    }
  });
}
