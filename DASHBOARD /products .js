document.addEventListener('DOMContentLoaded', async function () {
    await Back4App.initialize('G3gRNJc47l8pNJ2jbAtH2r9u96yjQRPbSdvad6kh', 'beMfvL1rThqs5eI7nqig37M7soKPelVFlvPsr9or');
    Parse.serverURL = "https://parseapi.back4app.com/";

    const productForm = document.getElementById('productForm');
    const formTitle = document.getElementById('formTitle');
    const productIdInput = document.getElementById('productId');

    productForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const id = productIdInput.value;
        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const tags = document.getElementById('productTags').value.split(',').map(tag => tag.trim());
        const collection = document.getElementById('productCollection').value;
        const imageFiles = Array.from(document.getElementById('productImage').files);

        try {
            const Product = Back4App.Object.extend("Product");
            let product;

            if (id) {
                const query = new Back4App.Query(Product);
                product = await query.get(id);
            } else {
                product = new Product();
            }

            product.set("name", name);
            product.set("description", description);
            product.set("tags", tags);
            product.set("collection", collection);

            if (imageFiles.length > 0) {
                const uploadedImages = [];
                for (const file of imageFiles) {
                    const parseFile = new Back4App.File(`${Date.now()}-${file.name}`, file);
                    await parseFile.save();
                    uploadedImages.push(parseFile);
                }
                product.set("images", uploadedImages);
            }

            await product.save();
            alert(id ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
            productForm.reset();
            productIdInput.value = '';
            formTitle.textContent = 'Crear Nuevo Producto';
            fetchProducts();
        } catch (error) {
            console.error("Error guardando producto:", error);
            alert('Error al guardar producto.');
        }
    });

    async function fetchProducts() {
        const Product = Back4App.Object.extend("Product");
        const query = new Back4App.Query(Product);
        const results = await query.find();
        const container = document.getElementById('productList');
        container.innerHTML = '';

        results.forEach(product => {
            const data = product.toJSON();
            const div = document.createElement('div');
            div.className = 'border p-3 mb-3';

            div.innerHTML = `
                <h4>${data.name}</h4>
                <p>${data.description}</p>
                <p><strong>Colección:</strong> ${data.collection}</p>
                <p><strong>Etiquetas:</strong> ${data.tags.join(', ')}</p>
                <div>${data.images?.map(img => `<img src="${img.url}" style="width:100px; margin-right:5px;" />`).join('')}</div>
                <button class="btn btn-sm btn-secondary mt-2 edit-btn" data-id="${product.id}">Editar</button>
            `;
            container.appendChild(div);
        });

        // Asignar eventos de edición
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                const Product = Back4App.Object.extend("Product");
                const query = new Back4App.Query(Product);
                const prod = await query.get(id);
                const data = prod.toJSON();

                productIdInput.value = prod.id;
                document.getElementById('productName').value = data.name;
                document.getElementById('productDescription').value = data.description;
                document.getElementById('productTags').value = data.tags.join(', ');
                document.getElementById('productCollection').value = data.collection;
                formTitle.textContent = 'Editar Producto';
                alert('Puedes editar el producto ahora. Las imágenes nuevas reemplazarán las anteriores si subes nuevas.');
            });
        });
    }

    fetchProducts();
});