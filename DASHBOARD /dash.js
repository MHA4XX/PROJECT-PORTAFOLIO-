

document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar Back4App
    await Back4App.initialize('G3gRNJc47l8pNJ2jbAtH2r9u96yjQRPbSdvad6kh', 'beMfvL1rThqs5eI7nqig37M7soKPelVFlvPsr9or');
    Parse.serverURL = "https://parseapi.back4app.com/";

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabId) {
        tabContents.forEach(content => content.classList.remove('active'));
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            showTab(tabId);
        });
    });

    // Mostrar la pestaña por defecto (Analytics)
    showTab('analytics');

    // Manejo del formulario de productos
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevenir el envío real del formulario

            // Recoger datos del formulario
            const productName = document.getElementById('productName').value;
            const productDescription = document.getElementById('productDescription').value;
            const productImageFiles = document.getElementById('productImage').files; // Obtener archivos
            const productTags = document.getElementById('productTags').value;
            const productCollection = document.getElementById('productCollection').value;

            try {
                // Convertir FileList a array para un manejo más fácil
                const imageArray = Array.from(productImageFiles);
                const imageFiles = [];

                // Subir imágenes a Back4App y obtener URLs
                for (const imageFile of imageArray) {
                    const filename = `${uuid.v4()}-${imageFile.name}`; // Generar nombre de archivo único
                    const parseFile = new Back4App.File(filename, imageFile);
                    const savedFile = await parseFile.save();
                    imageFiles.push(savedFile);
                }

                // Crear un nuevo objeto Producto
                const Product = Back4App.Object.extend("Product");
                const product = new Product();

                // Establecer propiedades del producto
                product.set("name", productName);
                product.set("description", productDescription);
                product.set("tags", productTags.split(',').map(tag => tag.trim())); // Dividir etiquetas en un array
                product.set("collection", productCollection);
                product.set("images", imageFiles); // Guardar array de Parse.Files

                // Guardar el producto en Back4App
                const savedProduct = await product.save();
                alert('Producto guardado exitosamente!');

                // Limpiar el formulario
                productForm.reset();
                fetchProducts(); // Actualizar la lista de productos

            } catch (error) {
                console.error('Error al guardar el producto:', error);
                alert('Error al guardar el producto.');
            }
        });
    }

    // Función para mostrar productos
    async function fetchProducts() {
        const Product = Back4App.Object.extend("Product");
        const query = new Back4App.Query(Product);

        try {
            const results = await query.find();
            const productList = document.getElementById('productList');
            productList.innerHTML = ''; // Limpiar la lista antes de mostrar

            results.forEach(product => {
                const productData = product.toJSON();
                const productItem = document.createElement('div');
                productItem.classList.add('product-item');
                productItem.innerHTML = `
                    <h3>${productData.name}</h3>
                    <p>${productData.description}</p>
                    <p>Etiquetas: ${productData.tags.join(', ')}</p>
                    <p>Colección: ${productData.collection}</p>
                    <div class="product-images">
                        ${productData.images.map(image => `<img src="${image.url}" alt="${productData.name}" />`).join('')}
                    </div>
                `;
                productList.appendChild(productItem);
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    }

    // Cargar productos al inicio
    fetchProducts();
});