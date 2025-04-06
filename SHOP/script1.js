// JavaScript for ElectroShop
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
    
    // Hamburger menu toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav');
    
    hamburgerMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const bars = this.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.toggle('active'));
        
        if (navMenu.classList.contains('active')) {
            bars[0].style.transform = 'translateY(9px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-9px) rotate(-45deg)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const bars = hamburgerMenu.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // Shopping cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-icon span');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    let itemCount = 0;
    let cartProducts = [];
    let totalPrice = 0;
    
    // Load cart from localStorage if available
    if (localStorage.getItem('cart')) {
        cartProducts = JSON.parse(localStorage.getItem('cart'));
        itemCount = cartProducts.reduce((sum, product) => sum + product.quantity, 0);
        cartCount.textContent = itemCount;
        updateCartDisplay();
    }
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering product modal
            
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const numericPrice = parseFloat(productPrice.replace('$', '').replace(',', ''));
            const productSvg = productCard.querySelector('svg').outerHTML;
            
            // Check if product already in cart
            const existingProduct = cartProducts.find(p => p.name === productName);
            
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cartProducts.push({
                    name: productName,
                    price: numericPrice,
                    image: productSvg,
                    quantity: 1
                });
            }
            
            // Update cart count
            itemCount++;
            cartCount.textContent = itemCount;
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cartProducts));
            
            // Update cart display
            updateCartDisplay();
            
            // Animation for button
            button.textContent = 'Added!';
            button.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '';
            }, 1500);
            
            // Create floating notification
            showNotification('Item added to cart!');
        });
    });
    
    // Open Cart Modal
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(cartModal);
    });
    
    // Update Cart Display
    function updateCartDisplay() {
        cartItems.innerHTML = '';
        totalPrice = 0;
        
        if (cartProducts.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartProducts.forEach((product, index) => {
                const itemTotal = product.price * product.quantity;
                totalPrice += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        ${product.image}
                    </div>
                    <div class="cart-item-details">
                        <h3>${product.name}</h3>
                        <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <span class="quantity-value">${product.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div class="remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
        }
        
        cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
        
        // Add event listeners for quantity buttons and remove buttons
        addCartItemEventListeners();
    }
    
    function addCartItemEventListeners() {
        // Plus buttons
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.dataset.index;
                cartProducts[index].quantity += 1;
                itemCount++;
                cartCount.textContent = itemCount;
                updateCartDisplay();
                localStorage.setItem('cart', JSON.stringify(cartProducts));
            });
        });
        
        // Minus buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.dataset.index;
                if (cartProducts[index].quantity > 1) {
                    cartProducts[index].quantity -= 1;
                    itemCount--;
                    cartCount.textContent = itemCount;
                    updateCartDisplay();
                    localStorage.setItem('cart', JSON.stringify(cartProducts));
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.dataset.index;
                itemCount -= cartProducts[index].quantity;
                cartCount.textContent = itemCount;
                cartProducts.splice(index, 1);
                updateCartDisplay();
                localStorage.setItem('cart', JSON.stringify(cartProducts));
            });
        });
    }
    
    // Favorites functionality
    const favoritesIcon = document.getElementById('favorites-icon');
    const favoritesModal = document.getElementById('favorites-modal');
    const favoritesItems = document.getElementById('favorites-items');
    const favoritesCount = favoritesIcon.querySelector('span');
    
    let favoritesProducts = [];
    
    // Load favorites from localStorage if available
    if (localStorage.getItem('favorites')) {
        favoritesProducts = JSON.parse(localStorage.getItem('favorites'));
        favoritesCount.textContent = favoritesProducts.length;
        updateFavoritesDisplay();
    }
    
    favoritesIcon.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(favoritesModal);
    });
    
    function updateFavoritesDisplay() {
        favoritesItems.innerHTML = '';
        
        if (favoritesProducts.length === 0) {
            favoritesItems.innerHTML = '<p class="empty-favorites">You have no favorites yet</p>';
        } else {
            favoritesProducts.forEach((product, index) => {
                const favItem = document.createElement('div');
                favItem.className = 'favorites-item';
                favItem.innerHTML = `
                    <div class="favorites-item-image">
                        ${product.image}
                    </div>
                    <div class="favorites-item-details">
                        <h3>${product.name}</h3>
                        <div class="favorites-item-price">$${product.price.toFixed(2)}</div>
                    </div>
                    <div class="favorites-actions">
                        <button class="btn add-to-cart-from-fav" data-index="${index}">Add to Cart</button>
                        <div class="remove-favorite" data-index="${index}">
                            <i class="fas fa-heart-broken"></i>
                        </div>
                    </div>
                `;
                
                favoritesItems.appendChild(favItem);
            });
        }
        
        // Add event listeners for favorites actions
        addFavoritesEventListeners();
    }
    
    function addFavoritesEventListeners() {
        // Add to cart from favorites
        document.querySelectorAll('.add-to-cart-from-fav').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.dataset.index;
                const product = favoritesProducts[index];
                
                // Check if product already in cart
                const existingProduct = cartProducts.find(p => p.name === product.name);
                
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cartProducts.push({
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                
                // Update cart count
                itemCount++;
                cartCount.textContent = itemCount;
                
                // Save to localStorage
                localStorage.setItem('cart', JSON.stringify(cartProducts));
                
                // Notification
                showNotification('Added to cart from favorites!');
            });
        });
        
        // Remove from favorites
        document.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.dataset.index;
                favoritesProducts.splice(index, 1);
                favoritesCount.textContent = favoritesProducts.length;
                updateFavoritesDisplay();
                localStorage.setItem('favorites', JSON.stringify(favoritesProducts));
            });
        });
    }
    
    // Product detail modal
    const productCards = document.querySelectorAll('.product-card');
    const productModal = document.getElementById('product-modal');
    const productDetailContent = document.getElementById('product-detail-content');
    
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.add-to-cart')) {
                const productName = this.querySelector('h3').textContent;
                const productPrice = this.querySelector('.price').textContent;
                const productSvg = this.querySelector('svg').outerHTML;
                const productRating = this.querySelector('.product-rating').innerHTML;
                
                productDetailContent.innerHTML = `
                    <div class="product-detail">
                        <div class="product-detail-image">
                            ${productSvg}
                        </div>
                        <div class="product-detail-info">
                            <h2>${productName}</h2>
                            <div class="product-rating">${productRating}</div>
                            <div class="product-detail-price">${productPrice}</div>
                            <div class="product-description">
                                <p>Experience the latest technology with this premium device. Featuring cutting-edge specifications and sleek design, this product offers exceptional performance for all your needs.</p>
                                <p>Key features include high-quality materials, long battery life, and advanced functionality.</p>
                            </div>
                            <div class="product-actions">
                                <button class="btn add-to-cart-detail">Add to Cart</button>
                                <button class="btn add-favorite">Add to Favorites</button>
                            </div>
                        </div>
                    </div>
                `;
                
                openModal(productModal);
                
                // Add event listeners for product detail actions
                const addToCartBtn = productDetailContent.querySelector('.add-to-cart-detail');
                const addFavoriteBtn = productDetailContent.querySelector('.add-favorite');
                
                addToCartBtn.addEventListener('click', function() {
                    const numericPrice = parseFloat(productPrice.replace('$', '').replace(',', ''));
                    
                    // Check if product already in cart
                    const existingProduct = cartProducts.find(p => p.name === productName);
                    
                    if (existingProduct) {
                        existingProduct.quantity += 1;
                    } else {
                        cartProducts.push({
                            name: productName,
                            price: numericPrice,
                            image: productSvg,
                            quantity: 1
                        });
                    }
                    
                    // Update cart count
                    itemCount++;
                    cartCount.textContent = itemCount;
                    
                    // Save to localStorage
                    localStorage.setItem('cart', JSON.stringify(cartProducts));
                    
                    // Notification
                    showNotification('Item added to cart!');
                    
                    // Close modal
                    closeModal(productModal);
                });
                
                addFavoriteBtn.addEventListener('click', function() {
                    const numericPrice = parseFloat(productPrice.replace('$', '').replace(',', ''));
                    
                    // Check if product already in favorites
                    const existingFavorite = favoritesProducts.find(p => p.name === productName);
                    
                    if (!existingFavorite) {
                        favoritesProducts.push({
                            name: productName,
                            price: numericPrice,
                            image: productSvg
                        });
                        
                        favoritesCount.textContent = favoritesProducts.length;
                        localStorage.setItem('favorites', JSON.stringify(favoritesProducts));
                        
                        addFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Favorites';
                        addFavoriteBtn.style.backgroundColor = '#4CAF50';
                        
                        // Notification
                        showNotification('Added to favorites!');
                        
                        setTimeout(() => {
                            closeModal(productModal);
                        }, 1500);
                    }
                });
            }
        });
        
        // Hover effect for product cards
        card.addEventListener('mouseenter', () => {
            const svg = card.querySelector('svg');
            if (svg) {
                svg.style.transform = 'scale(1.1)';
                svg.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const svg = card.querySelector('svg');
            if (svg) {
                svg.style.transform = 'scale(1)';
            }
        });
    });
    
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    function openModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    window.addEventListener('click', function(e) {
        modals.forEach(modal => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('cart-notification');
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                // Show success message
                const formContainer = this.parentNode;
                this.style.display = 'none';
                
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you for subscribing!</p>
                    <p>We've sent a confirmation to ${email}</p>
                `;
                
                formContainer.appendChild(successMessage);
                
                // Reset form
                emailInput.value = '';
            }
        });
    }
    
    // Add CSS for notifications and success message
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .cart-notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .success-message {
            text-align: center;
            animation: fadeIn 0.5s ease;
        }
        
        .success-message i {
            font-size: 3rem;
            color: #4CAF50;
            margin-bottom: 15px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .empty-cart, .empty-favorites {
            text-align: center;
            padding: 30px;
            color: #999;
            font-style: italic;
        }
    `;
    
    document.head.appendChild(style);
});