
        Parse.initialize("G3gRNJc47l8pNJ2jbAtH2r9u96yjQRPbSdvad6kh", "beMfvL1rThqs5eI7nqig37M7soKPelVFlvPsr9or");
        Parse.serverURL = "https://parseapi.back4app.com/";


let selectedProduct = null;

async function fetchProducts() {
   const Product = Parse.Object.extend("Product");
   const query = new Parse.Query(Product);
   const results = await query.find();
   
   const productList = document.getElementById("product-list");
   productList.innerHTML = "";
   
   results.forEach(product => {
      const name = product.get("name");
      const price = product.get("price");
      const image = product.get("image");
      
      const card = document.createElement("div");
      card.className = "product-card";
      
      card.innerHTML = `
      <img src="${image}" alt="${name}" width="100%">
      <h3>${name}</h3>
      <p>Precio: $${price}</p>
      <button onclick='openPaymentModal("${product.id}", "${name}", ${price})'>Comprar</button>
    `;
      
      productList.appendChild(card);
   });
}

function openPaymentModal(id, name, price) {
   selectedProduct = { id, name, price };
   document.getElementById("product-info").innerText = `Producto: ${name} - $${price}`;
   document.getElementById("payment-modal").classList.remove("hidden");
}

function closePaymentModal() {
   document.getElementById("payment-modal").classList.add("hidden");
   selectedProduct = null;
}

function confirmPayment() {
   // Aquí podrías integrar PayPal, Stripe, etc.
   alert(`Compra realizada: ${selectedProduct.name} por $${selectedProduct.price}`);
   closePaymentModal();
}

fetchProducts();