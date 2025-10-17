// public/js/payment.js

document.addEventListener("DOMContentLoaded", () => {
  const paymentRadios = document.querySelectorAll("input[name='paymentMethod']");
  const cardDetails = document.getElementById("cardDetails");
  const gcashDetails = document.getElementById("gcashDetails");

  function toggleDetails() {
    cardDetails.style.display = "none";
    gcashDetails.style.display = "none";

    const selected = document.querySelector("input[name='paymentMethod']:checked").value;

    if (selected === "Credit/Debit Card") {
      cardDetails.style.display = "block";
    } else if (selected === "GCash") {
      gcashDetails.style.display = "block";
    }
  }

  paymentRadios.forEach(radio => radio.addEventListener("change", toggleDetails));
  toggleDetails(); // initialize
});
