import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { config } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const projectCards = document.querySelectorAll('.project-card');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-button');

  // Hamburger menu functionality
  hamburgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // Theme toggle functionality
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
      themeIcon.src = '/img/icons8-sun-64.png'; // Moon icon
    } else {
      themeIcon.src = '/img/Picsart_25-03-20_19-27-49-582.png'; // Sun icon
    }
  });

  // Modal functionality
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.dataset.modal;
      const modal = document.getElementById(modalId);
      modal.style.display = 'block';
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      modal.style.display = 'none';
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
});

