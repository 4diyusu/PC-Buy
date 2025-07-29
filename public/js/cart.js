document.addEventListener("DOMContentLoaded", () => {
  const formatPeso = (value) => {
    return `₱${Number(value).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  document.querySelectorAll(".qty-form").forEach((form) => {
    const input = form.querySelector("input[name='qty']");
    const plusBtn = form.querySelector(".btn-plus");
    const minusBtn = form.querySelector(".btn-minus");

    // Plus button click
    plusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      input.value = parseInt(input.value) + 1;
      form.requestSubmit();
    });

    // Minus button click
    minusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        form.requestSubmit();
      }
    });

    // Submit quantity form
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const action = form.getAttribute("action");
      const qty = parseInt(input.value);

      try {
        const res = await fetch(action, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qty }),
        });

        if (!res.ok) throw new Error("Failed request");

        const data = await res.json();

        if (data.success) {
          // ✅ Update item subtotal
          const subtotalElem = form
            .closest(".cart-item")
            .querySelector(".item-subtotal");
          subtotalElem.textContent = formatPeso(data.updatedSubtotal);

          // ✅ Update total price
          const totalElem = document.querySelector(".cart-summary h3");
          totalElem.textContent = `Total: ${formatPeso(data.total)}`;
        } else {
          alert("Error updating quantity.");
        }
      } catch (err) {
        console.error("Error updating cart:", err);
      }
    });
  });

  // Remove button
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const cartItemElem = btn.closest(".cart-item");
      const itemId = btn.dataset.cartItemId;

      try {
        const res = await fetch(`/cart/remove/${itemId}`, {
          method: "POST",
        });

        if (!res.ok) throw new Error("Remove failed");

        const data = await res.json();

        if (data.success) {
          // ✅ Remove item from DOM
          cartItemElem.remove();

          // ✅ Update total
          const totalElem = document.querySelector(".cart-summary h3");
          totalElem.textContent = `Total: ${formatPeso(data.total)}`;
        } else {
          alert("Failed to remove item.");
        }
      } catch (err) {
        console.error("Error removing cart item:", err);
      }
    });
  });
});
