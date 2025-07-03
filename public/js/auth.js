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

  if (openLoginBtn) openLoginBtn.addEventListener("click", openModal);
  if (loginBtn) loginBtn.addEventListener("click", openModal);
  if (closeModal) closeModal.addEventListener("click", closeModalFunc);

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) closeModalFunc();
  });

  // ✅ Login form logic
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailOrUsername = loginForm.emailOrUsername.value.trim().toLowerCase();
      const password = loginForm.password.value;
      const loginError = document.getElementById("loginError");

      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailOrUsername, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          loginError.textContent = data.error || "Login failed.";
          loginError.style.color = "red";
        } else {
          window.location.reload(); // ✅ Successful login
        }
      } catch (err) {
        console.error("❌ Login request failed:", err);
        loginError.textContent = "Something went wrong. Try again later.";
        loginError.style.color = "red";
      }
    });
  }
});
