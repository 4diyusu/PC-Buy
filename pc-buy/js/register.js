document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorLabel = document.getElementById("registerError");

  errorLabel.style.color = "red";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;

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

  // If all validations pass
  errorLabel.textContent = ""; // clear errors

  // You can now proceed to send the data to the server or show a success message
  alert("Registration successful!"); // Replace with actual logic
});
