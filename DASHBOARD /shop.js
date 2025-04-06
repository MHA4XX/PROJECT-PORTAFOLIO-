function toggleMenu() {
   document.querySelector('.nav-links').classList.toggle('active');
}


   // Tab to edit

function openNav() {
  document.getElementById("mySidenav").style.display = "block";
}

function closeNav() {
  document.getElementById("mySidenav").style.display = "none";
}





document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Desactiva todos los botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Oculta todos los contenidos
            tabContents.forEach(content => content.classList.remove('active'));

            // Activa el botón actual
            button.classList.add('active');
            // Muestra el contenido correspondiente
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
});
