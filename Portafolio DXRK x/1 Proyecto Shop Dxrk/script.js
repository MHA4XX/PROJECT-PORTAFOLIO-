import config from 'config';
import {
  getProducts
} from 'utils';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu functionality
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const body = document.body;
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  const themeSwitch = document.getElementById('theme-switch');
  const dashboardThemeSwitch = document.getElementById('dashboard-theme-switch');
  const sidebarBackdrop = document.createElement('div');
  sidebarBackdrop.classList.add('sidebar-backdrop');
  document.body.appendChild(sidebarBackdrop);
  const productContainer = document.querySelector('.grid');
  const loadMoreButton = document.getElementById('load-more');
  let currentPage = 1;
  const productsPerPage = config.productsPerPage;
  const dashboardEnabled = config.dashboardEnabled;
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  // Toggle sidebar and backdrop
  function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarBackdrop.classList.toggle('active');
  }

  // Event listener for menu toggle
  if (menuToggle && sidebar && sidebarBackdrop) {
    menuToggle.addEventListener('click', toggleSidebar);
    sidebarBackdrop.addEventListener('click', toggleSidebar);
  }

  // Close sidebar when clicking outside
  sidebarBackdrop.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarBackdrop.classList.remove('active');
  });

  // Tab functionality
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Deactivate all tabs and content
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.add('hidden'));

      // Activate the clicked tab and its content
      button.classList.add('active');
      const tabId = button.dataset.tab;
      document.getElementById(tabId).classList.remove('hidden');
    });
  });

  // Initialize the first tab as active
  tabButtons[0].classList.add('active');
  tabContents[0].classList.remove('hidden');

  // Hero Swiper
  const heroSwiper = new Swiper('.heroSwiper', {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  // Product listing functionality

  async function loadProducts(page) {
    const products = await getProducts(page, productsPerPage);

    products.forEach(product => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3 class="text-lg font-semibold">${product.title}</h3>
            <p class="text-gray-400">${product.description}</p>
            <p class="text-blue-500">$${product.price}</p>
            <a href="#" class="inline-block mt-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md">Ver Detalles</a>
          `;
      productContainer.appendChild(productItem);
    });
  }

  loadProducts(currentPage);

  loadMoreButton.addEventListener('click', () => {
    currentPage++;
    loadProducts(currentPage);
  });

  // Initial load of products for tabs
  loadProductsForTab('featured');
  loadProductsForTab('new');
  loadProductsForTab('sale');

  async function loadProductsForTab(tabId) {
    const products = await getProducts(1, 3);
    const tabContent = document.getElementById(tabId);

    products.forEach(product => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3 class="text-lg font-semibold">${product.title}</h3>
            <p class="text-gray-400">${product.description}</p>
            <p class="text-blue-500">$${product.price}</p>
            <a href="#" class="inline-block mt-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md">Ver Detalles</a>
          `;
      tabContent.appendChild(productItem);
    });
  }

  // Function to apply a theme
  function applyTheme(theme) {
    body.classList.remove('light-theme', 'dark-theme');
    header.classList.remove('light-theme', 'dark-theme');
    sidebar.classList.remove('light-theme', 'dark-theme');
    themeSwitch.classList.remove('light-theme', 'dark-theme');
    footer.classList.remove('light-theme', 'dark-theme');

    body.classList.add(theme);
    header.classList.add(theme);
    sidebar.classList.add(theme);
    themeSwitch.classList.add(theme);
    footer.classList.add(theme);

    tabButtons.forEach(button => {
      button.classList.remove('light-theme', 'dark-theme');
      button.classList.add(theme);
    });

    tabContents.forEach(content => {
      content.classList.remove('light-theme', 'dark-theme');
      content.classList.add(theme);
    });

    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(item => {
      item.classList.remove('light-theme', 'dark-theme');
      item.classList.add(theme);
    });
  }

  // Theme Switch functionality
  themeSwitch.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
  });

  // Function to apply theme to dashboard
  function applyDashboardTheme(theme) {
    body.classList.remove('light-theme', 'dark-theme', 'dashboard-theme');
    header.classList.remove('light-theme', 'dark-theme', 'dashboard-theme');
    footer.classList.remove('light-theme', 'dark-theme', 'dashboard-theme');

    body.classList.add('dashboard-theme', theme);
    header.classList.add('dashboard-theme', theme);
    footer.classList.add('dashboard-theme', theme);

    const dashboardSections = document.querySelectorAll('.dashboard-section');
    dashboardSections.forEach(section => {
      section.classList.remove('light-theme', 'dark-theme');
      section.classList.add('dashboard-theme', theme);
    });

    const dashboardLists = document.querySelectorAll('.dashboard-list');
    dashboardLists.forEach(list => {
      list.classList.remove('light-theme', 'dark-theme');
      list.classList.add('dashboard-theme', theme);
    });

    const dashboardForms = document.querySelectorAll('.dashboard-form input, .dashboard-form textarea, .dashboard-form select');
    dashboardForms.forEach(formElement => {
      formElement.classList.remove('light-theme', 'dark-theme');
      formElement.classList.add('dashboard-theme', theme);
    });
  }

  // Dashboard theme switch functionality
  if (dashboardThemeSwitch) {
    dashboardThemeSwitch.addEventListener('click', () => {
      const currentTheme = body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
      const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme'; // Toggle theme
      localStorage.setItem('dashboard-theme', newTheme); // Save preference

      applyDashboardTheme(newTheme);
    });

    // Load saved dashboard theme
    const savedDashboardTheme = localStorage.getItem('dashboard-theme') || 'light-theme';
    applyDashboardTheme(savedDashboardTheme);
  }

  // Check local storage for theme preference on page load
  const savedTheme = localStorage.getItem('theme') || 'light-theme'; 
  applyTheme(savedTheme);

  // Product filtering
  const filterSelect = document.getElementById('product-filter');

  filterSelect.addEventListener('change', () => {
    const filterValue = filterSelect.value;
    filterProducts(filterValue);
  });

  async function filterProducts(filterValue) {
    const allProducts = await getProducts(1, 100); 
    let filteredProducts = allProducts;

    if (filterValue !== 'all') {
      filteredProducts = allProducts.filter(product => product.category === filterValue);
    }

    // Clear existing products
    productContainer.innerHTML = '';

    // Display filtered products
    filteredProducts.forEach(product => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');
      productItem.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <h3 class="text-lg font-semibold">${product.title}</h3>
          <p class="text-gray-400">${product.description}</p>
          <p class="text-blue-500">$${product.price}</p>
          <a href="#" class="inline-block mt-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md">Ver Detalles</a>
        `;
      productContainer.appendChild(productItem);
    });
  }
});