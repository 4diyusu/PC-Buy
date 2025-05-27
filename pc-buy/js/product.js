document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  fetch("product.json")
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      document.getElementById("product-title").textContent = product.title;
      document.getElementById("product-short-description").textContent = product.shortDescription;
      document.getElementById("product-price").textContent = product.price.toFixed(2);
      document.getElementById("product-img").src = product.image;
      document.getElementById("product-specs").textContent = product.fullSpecs;
      document.getElementById("product-stock").textContent = product.inStock ? "In Stock" : "Out of Stock";
      document.getElementById("product-stock").style.color = product.inStock ? "green" : "red";
    });
});
