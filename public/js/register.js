document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorLabel = document.getElementById("registerError");

  errorLabel.style.color = "red";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;

  // Client-side validation
  if (!emailRegex.test(email)) {
    errorLabel.textContent = "Invalid email format.";
    return;
  }

  if (!phoneRegex.test(phone)) {
    errorLabel.textContent = "Invalid phone number. Use 10–15 digits.";
    return;
  }

  if (password !== confirmPassword) {
    errorLabel.textContent = "Passwords do not match.";
    return;
  }
  
  // Clear error if all pass
  errorLabel.textContent = "";

  // Prepare form data
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.text();

    if (response.ok) {
      alert("✅ " + result);
      form.reset();
    } else {
      alert("❌ " + result);
    }
  } catch (err) {
    console.error("Registration fetch error:", err);
    alert("Server error. Please try again.");
  }
});
