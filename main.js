

  document.getElementById("resetButton").addEventListener("click", resetTimer);
  document.getElementById("closePopup").addEventListener("click", closePopup);

  window.onclick = function (event) {
    if (event.target == document.getElementById("timerPopup")) {
      closePopup();
    }
  };



