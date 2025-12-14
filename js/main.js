console.log("main.js loaded OK");

const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
