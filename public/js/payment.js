document.addEventListener("DOMContentLoaded", () => {
  const paymentForm = document.getElementById("paymentForm");
  const paymentMethod = document.getElementById("paymentMethod");
  const proceedBtn = document.getElementById("proceedBtn");

  const gcashSection = document.getElementById("gcashSection");
  const codSection = document.getElementById("codSection");
  const cardSection = document.getElementById("cardSection");

  function hideAllSections() {
    [gcashSection, codSection, cardSection].forEach(sec => sec.classList.add("hidden"));
  }

  function showSection(section) {
    section.classList.remove("hidden");
  }

  // Handle dropdown change
  paymentMethod.addEventListener("change", () => {
    hideAllSections();
    const selected = paymentMethod.value;
    if (selected === "gcash") showSection(gcashSection);
    else if (selected === "cod") showSection(codSection);
    else if (selected === "card") showSection(cardSection);

    checkFormValidity();
  });

  // Validate input fields before enabling Proceed
  const inputs = paymentForm.querySelectorAll("input");
  inputs.forEach(input => {
    input.addEventListener("input", checkFormValidity);
  });

  function checkFormValidity() {
    const selected = paymentMethod.value;
    let valid = false;

    if (selected === "gcash") {
      valid =
        gcashSection.querySelector("#gcashName").value.trim() !== "" &&
        gcashSection.querySelector("#gcashNumber").value.trim() !== "";
    } else if (selected === "cod") {
      valid = true; // COD needs no extra input
    } else if (selected === "card") {
      valid =
        cardSection.querySelector("#cardNumber").value.trim() !== "" &&
        cardSection.querySelector("#cardName").value.trim() !== "" &&
        cardSection.querySelector("#expiry").value.trim() !== "" &&
        cardSection.querySelector("#cvv").value.trim() !== "";
    }

    proceedBtn.disabled = !valid;
  }

  // Prevent reload & redirect properly
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selected = paymentMethod.value;
    if (!selected) return;

    // COD → pending approval
    if (selected === "cod") {
      window.location.href = "/checkout-success?status=pending";
    } 
    // GCash / Card → approved instantly
    else {
      window.location.href = "/checkout-success?status=approved";
    }
  });
});
