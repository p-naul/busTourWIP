const version = "1.12.1";
const iframe = document.getElementById("api-frame");
var client = new window.Sketchfab(version, iframe);
let api;
const uid = "3c97912b6c0d4193a963f253ade24749";

const error = () => window.console.error("Sketchfab API error");
const success = (apiClient) => {
  api = apiClient;

  var hours = 0;
  var minutes = 0;
  var seconds = 0;
  var timerStarted = false;
  var timerInterval;

  function addLeadingZero(number) {
    return number < 10 ? "0" + number : number;
  }

  function startTimer() {
    if (!timerStarted) {
      timerStarted = true;
      timerInterval = setInterval(function () {
        seconds++;
        if (seconds == 60) {
          minutes++;
          seconds = 0;
        }
        if (minutes == 60) {
          hours++;
          minutes = 0;
        }
        document.getElementById("timer").textContent =
          addLeadingZero(hours) +
          ":" +
          addLeadingZero(minutes) +
          ":" +
          addLeadingZero(seconds);
      }, 1000);
    }
  }

  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    saveTimeToLocalStorage();
    displayPopup();
    hours = 0;
    minutes = 0;
    seconds = 0;
    timerStarted = false;
    document.getElementById("timer").textContent = "00:00:00";
  }

  function saveTimeToLocalStorage() {
    const currentTime =
      addLeadingZero(hours) +
      ":" +
      addLeadingZero(minutes) +
      ":" +
      addLeadingZero(seconds);
    let scores = JSON.parse(localStorage.getItem("timerScores")) || [];
    scores.push(currentTime);
    localStorage.setItem("timerScores", JSON.stringify(scores));
  }

  function displayPopup() {
    const currentTime =
      addLeadingZero(hours) +
      ":" +
      addLeadingZero(minutes) +
      ":" +
      addLeadingZero(seconds);
    document.getElementById("popupTimer").textContent = currentTime;
    document.getElementById("timerPopup").style.display = "block";
  }

  function closePopup() {
    document.getElementById("timerPopup").style.display = "none";
  }

  document.querySelectorAll(".favorite").forEach((button) => {
    button.addEventListener("click", startTimer);
  });

  document.getElementById("resetButton").addEventListener("click", resetTimer);
  document.getElementById("closePopup").addEventListener("click", closePopup);

  window.onclick = function (event) {
    if (event.target == document.getElementById("timerPopup")) {
      closePopup();
    }
  };

  api.start(function () {
    api.addEventListener("viewerready", () => {
      api.addEventListener("click", function (info) {
        if (info.instanceID) {
          const id = info.instanceID;
          const camX = info.position3D[0];
          const camY = info.position3D[1];
          const camZ = info.position3D[2];
          api.setCameraLookAt(
            [0, -1, 1],
            [camX, camY, camZ],
            2,
            function (err) {}
          );
          if (id == 560 || id == 582 || id == 534) {
            moveToZero(id);
          }
          if (id == 474 || id == 490 || id == 482) {
            moveToZero(474);
          }
          if (id == 512 || id == 518) {
            moveToZero(512);
          }
        }
      });
    });
  });
};
