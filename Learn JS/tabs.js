function openTab(event, tabId) {
   let tabs = document.querySelectorAll(".tabs-content");
   let buttons = document.querySelectorAll(".tab-btn");
   
   // Ocultar todas las pestañas
   tabs.forEach(tab => tab.classList.remove("active"));
   
   // Remover clase activa de los botones
   buttons.forEach(btn => btn.classList.remove("active"));
   
   // Mostrar la pestaña activa
   document.getElementById(tabId).classList.add("active");
   event.currentTarget.classList.add("active");
}