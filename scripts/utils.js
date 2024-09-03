// script.js

// Ouvrir la première pop-up
document.getElementById("openPopup1").addEventListener("click", function () {
  document.getElementById("popup1").style.display = "flex";
});

// Fermer la première pop-up
document.getElementById("closePopup1").addEventListener("click", function () {
  document.getElementById("popup1").style.display = "none";
});

// Ouvrir la deuxième pop-up
document.getElementById("openPopup2").addEventListener("click", function () {
  document.getElementById("popup2").style.display = "flex";
});

// Fermer la deuxième pop-up
document.getElementById("closePopup2").addEventListener("click", function () {
  document.getElementById("popup2").style.display = "none";
});

// Fermer les pop-ups si l'utilisateur clique en dehors
window.addEventListener("click", function (event) {
  if (event.target.classList.contains("popup")) {
    event.target.style.display = "none";
  }
});

function showBanner(isCorrect) {
  const banner = document.querySelector(".banner");
  const messageSpan = banner.querySelector("span");

  // Set the banner color and message based on the correctness
  if (isCorrect) {
    banner.style.backgroundColor = "#4ECB71"; // Green color for success
    messageSpan.textContent = "Bravo ! Votre configuration est correcte.";
  } else {
    banner.style.backgroundColor = "#ED7373"; // Red color for error
    messageSpan.textContent =
      "Bien essayé ! Malheureusement la configuration n'est pas tout à fait correcte.";
  }

  // Make the banner visible
  banner.style.visibility = "visible";

  // Hide the banner after a few seconds
  setTimeout(() => {
    banner.style.visibility = "hidden";
  }, 3000); // Adjust timing as needed
}
