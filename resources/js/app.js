import './bootstrap';
import 'bootstrap';

let arrowUp = document.getElementById('arrow-up');
let arrowDown = document.getElementById('arrow-down');
let myButton = document.getElementById('nav-btn');

// evento che attiva/disattiva la freccia
myButton.addEventListener('click', function () {
    if (!arrowUp.classList.contains('hidden')) {
        arrowUp.classList.add('hidden');
        arrowDown.classList.remove('hidden');
    } else {
        arrowUp.classList.remove('hidden');
        arrowDown.classList.add('hidden');
    }
});

let nav = document.getElementById('nav');
let windowHeight = window.innerHeight;

// evento che attiva/disattiva la navbar
window.addEventListener('scroll', function () {
    let scrollPosition = window.scrollY;

    let threshold = windowHeight / 2; 

    if (scrollPosition > threshold) {
        nav.classList.remove('hidden'); 
    } else {
        nav.classList.add('hidden'); 
    }
});