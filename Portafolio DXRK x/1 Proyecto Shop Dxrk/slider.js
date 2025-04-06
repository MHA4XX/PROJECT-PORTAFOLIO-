// Abrir y cerrar el menú
const openMenuBtn = document.getElementById("openMenu");
const closeMenuBtn = document.getElementById("closeMenu");
const sliderMenu = document.getElementById("sliderMenu");

openMenuBtn.addEventListener("click", () => {
    sliderMenu.classList.add("show");
});

closeMenuBtn.addEventListener("click", () => {
    sliderMenu.classList.remove("show");
});

// Función de búsqueda
document.getElementById("searchInput").addEventListener("input", function () {
    let filter = this.value.toLowerCase();
    let collections = document.querySelectorAll(".collection");

    collections.forEach(collection => {
        let text = collection.textContent.toLowerCase();
        collection.style.display = text.includes(filter) ? "block" : "none";
    });
});