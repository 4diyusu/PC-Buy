document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errorLabel = document.getElementById("loginError");
  errorLabel.style.color = "red";

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.text();

    if (response.ok) {
      alert("✅ " + result);
      errorLabel.textContent = "";
      document.getElementById("loginModal").style.display = "none";
    } else {
      errorLabel.textContent = result;
    }
  } catch (err) {
    console.error("Login fetch error:", err);
    errorLabel.textContent = "Server error. Try again.";
  }
});
