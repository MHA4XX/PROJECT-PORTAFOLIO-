
        Parse.initialize("G3gRNJc47l8pNJ2jbAtH2r9u96yjQRPbSdvad6kh", "beMfvL1rThqs5eI7nqig37M7soKPelVFlvPsr9or");
        Parse.serverURL = "https://parseapi.back4app.com/";


// Función para alternar pestañas
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        const targetTab = button.getAttribute("data-tab");

        // Activa el botón seleccionado
        tabButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        // Muestra el contenido correspondiente
        tabContents.forEach(content => {
            content.classList.remove("active");
            if (content.id === targetTab) {
                content.classList.add("active");
            }
        });

        // Si cambia a productos o colecciones, actualiza listas
        if (targetTab === "productos") {
            fetchProductos();
            fetchColeccionesSelect();
        } else if (targetTab === "colecciones") {
            fetchColecciones();
        } else if (targetTab === "pedidos") {
            fetchPedidos();
        }
    });
});

// === PRODUCTOS ===

// Crear producto
document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const desc = document.getElementById("productDescription").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const tags = document.getElementById("productTags").value.split(",");
    const collectionId = document.getElementById("productCollection").value;

    const imageFiles = document.getElementById("productImage").files;
    const imageUrls = [];

    for (let file of imageFiles) {
        const parseFile = new Parse.File(file.name, file);
        await parseFile.save();
        imageUrls.push(parseFile.url());
    }

    const Producto = Parse.Object.extend("Producto");
    const producto = new Producto();

    producto.set("name", name);
    producto.set("description", desc);
    producto.set("price", price);
    producto.set("images", imageUrls);
    producto.set("tags", tags);

    if (collectionId) {
        const Coleccion = Parse.Object.extend("Coleccion");
        const coleccion = new Coleccion();
        coleccion.id = collectionId;
        producto.set("coleccion", coleccion);
    }

    await producto.save();
    alert("Producto guardado");
    document.getElementById("productForm").reset();
    fetchProductos();
});

// Obtener productos
async function fetchProductos() {
    const Producto = Parse.Object.extend("Producto");
    const query = new Parse.Query(Producto);
    query.include("coleccion");
    const results = await query.find();

    const container = document.getElementById("productList");
    container.innerHTML = "";

    results.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("card", "mb-3");
        div.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${p.get("name")}</h5>
                <p>${p.get("description")}</p>
                <p><strong>Precio:</strong> $${p.get("price")}</p>
                <p><strong>Etiquetas:</strong> ${p.get("tags")?.join(", ")}</p>
                <p><strong>Colección:</strong> ${p.get("coleccion")?.get("name") || "Ninguna"}</p>
                <div class="d-flex flex-wrap">
                    ${p.get("images")?.map(url => `<img src="${url}" class="img-thumbnail me-2 mb-2" style="width: 100px; height: 100px;">`).join("")}
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// === COLECCIONES ===

// Crear colección
document.getElementById("collectionForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("collectionName").value;

    const Coleccion = Parse.Object.extend("Coleccion");
    const coleccion = new Coleccion();
    coleccion.set("name", name);

    await coleccion.save();
    alert("Colección guardada");
    document.getElementById("collectionForm").reset();
    fetchColecciones();
});

// Obtener colecciones para vista
async function fetchColecciones() {
    const Coleccion = Parse.Object.extend("Coleccion");
    const query = new Parse.Query(Coleccion);
    const results = await query.find();

    const container = document.getElementById("collectionList");
    container.innerHTML = "";

    results.forEach(c => {
        const div = document.createElement("div");
        div.classList.add("card", "mb-2", "p-2");
        div.innerHTML = `<strong>${c.get("name")}</strong>`;
        container.appendChild(div);
    });
}

// Llenar select de colecciones
async function fetchColeccionesSelect() {
    const select = document.getElementById("productCollection");
    select.innerHTML = `<option value="">Sin colección</option>`;

    const Coleccion = Parse.Object.extend("Coleccion");
    const query = new Parse.Query(Coleccion);
    const results = await query.find();

    results.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.get("name");
        select.appendChild(option);
    });
}

// === PEDIDOS (Opcional) ===
async function fetchPedidos() {
    const Pedido = Parse.Object.extend("Pedido");
    const query = new Parse.Query(Pedido);
    query.include("producto");
    const results = await query.find();

    const container = document.getElementById("orderList");
    container.innerHTML = "";

    results.forEach(p => {
        const div = document.createElement("div");
        const producto = p.get("producto");
        div.classList.add("card", "mb-2", "p-2");
        div.innerHTML = `
            <p><strong>Producto:</strong> ${producto?.get("name") || "Desconocido"}</p>
            <p><strong>Cantidad:</strong> ${p.get("cantidad")}</p>
            <p><strong>Total:</strong> $${p.get("total")}</p>
        `;
        container.appendChild(div);
    });
}

// Carga inicial
document.addEventListener("DOMContentLoaded", () => {
    fetchProductos();
    fetchColeccionesSelect();
});