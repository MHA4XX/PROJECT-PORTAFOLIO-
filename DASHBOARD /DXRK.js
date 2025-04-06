document.addEventListener('DOMContentLoaded', function() {
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

    // Show default tab (Analytics)
    showTab('analytics');

    // Product Form Submission
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent actual submission

            // Gather form data
            const productName = document.getElementById('productName').value;
            const productDescription = document.getElementById('productDescription').value;
            const productImageFiles = document.getElementById('productImage').files; // Get files
            const productTags = document.getElementById('productTags').value;
            const productCollection = document.getElementById('productCollection').value;

            console.log('productImageFiles :>> ', productImageFiles);

            // Check if Back4App is initialized
            if (typeof Back4App === 'undefined' || !Back4App.Core) {
                console.error('Back4App is not initialized.  Make sure you have replaced the placeholder values with your App ID and API Key in index.html, and that the script tag is correct.');
                alert('Back4App is not initialized. Check the console for details.');
                return; // Stop execution if Back4App is not ready
            }

            try {
                // Convert FileList to array for easier handling
                const imageArray = Array.from(productImageFiles);
                const imageFiles = [];

                // Upload images to Back4App and get URLs
                for (const imageFile of imageArray) {
                    const filename = `${uuid.v4()}-${imageFile.name}`; // Generate unique filename
                    const parseFile = new Back4App.File(filename, imageFile);
                    const savedFile = await parseFile.save();
                    imageFiles.push(savedFile);
                    console.log('savedFile :>> ', savedFile);
                }


                // Create a new Product object
                const Product = Back4App.Object.extend("Product");
                const product = new Product();

                // Set product properties
                product.set("name", productName);
                product.set("description", productDescription);
                product.set("tags", productTags.split(',').map(tag => tag.trim())); // Split tags into an array
                product.set("collection", productCollection);
                product.set("images", imageFiles); // Save array of Parse.Files

                // Save the product to Back4App
                const savedProduct = await product.save();

                console.log('Product saved successfully:', savedProduct);
                alert('Product saved successfully!');

                // Clear the form
                productForm.reset();


            } catch (error) {
                console.error('Error saving product:', error);
                alert('Failed to save product.');
            }
        });
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }
});