client.init(uid, { autostart: 1, autospin: 0, success: success, error: error });
// Camera logs
// const cameraData = {
//   "useCameraConstraints": true,
//   "usePanConstraints": false,
//   "useZoomConstraints": true,
//   "usePitchConstraints": true,
//   "useYawConstraints": false,
//   "zoomIn": 50,
//   "zoomOut": 1500,
  // rotations horizontales et verticales
  // "left": -3.1416,
  // "right": 3.1416,
  // "up": 1.57,
  // "down": 0.1,
// };
// var annotInitiale = [];


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

  // document.getElementById("resetButton").addEventListener("click", resetTimer);
  // document.getElementById("closePopup").addEventListener("click", closePopup);

  window.onclick = function (event) {
    if (event.target == document.getElementById("timerPopup")) {
      closePopup();
    }
  };

function computePastilles(wCanvas, hCanvas, bgColor, bgBorderColor, fgColor, fgBorderColor, text, numHotspot, wPastille, hPastille) {
  var wSize = wPastille / 10.0;
  var col = wCanvas / wSize;
  var row = hCanvas / wSize;
  var padding = 2;
  var w = wSize - padding;
  var cx;
  var cy = w * 0.5;
  var ty = cy + 8;
  var pastille = '';
  var num = 0;
  for (var i = 0; i < row; i++) {
    cx = wSize * 0.5;
    for (var k = 0; k < col; k++) {
      num++;
      var letters = text === 0 ? num : text[num];
      var circle = "<circle cx=\"".concat(cx, "\"\n            cy=\"").concat(cy, "\"\n            r=\"20\"\n            fill=\"").concat(bgColor, "\"\n            stroke=\"").concat(bgBorderColor, "\"\n            stroke-width=\"2\"/>");
      var textVG = "<text font-size=\"26\"\n          stroke=\"".concat(fgBorderColor, "\"\n          fill=\"").concat(fgColor, "\"\n          font-family=\"sans-serif\"\n          text-anchor=\"middle\"\n          alignment-baseline=\"baseline\"\n          x=\"").concat(cx, "\"\n          y=\"").concat(ty, "\">").concat(letters, "</text>");
      pastille += circle + textVG;
      cx += wSize;
    }
    cy += wSize;
    ty += wSize;
  }
  var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('version', '1.1');
  s.setAttribute('baseProfile', 'full');
  s.setAttribute('width', wPastille);
  s.setAttribute('height', hPastille);
  s.setAttribute('viewBox', "0 0 ".concat(wPastille, " ").concat(hPastille));
  s.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  s.innerHTML = pastille;
  // make it base64
  var svg64 = btoa(s.outerHTML);
  var b64Start = 'data:image/svg+xml;base64,';
  var image64 = b64Start + svg64;
  var textureOptions = {
    url: image64,
    colNumber: col,
    padding: padding,
    iconSize: w
  };
  return textureOptions;
}

function getNewPastilleURL(bgColor, bgBorderColor, fgColor, fgBorderColor, text, numHotspot, w, h) {
  var imageData;
  imageData = computePastilles(w, h, bgColor, bgBorderColor, fgColor, fgBorderColor, text, numHotspot, w, h);
  return imageData;
}



client.init(uid, {
// annotation: 0, // Usage: Setting to [1 – 100] will automatically load that annotation when the viewer starts.
// annotations_visible: 1, // Usage: Setting to 0 will hide annotations by default.
//   annotation_cycle: 0, // Déroule les annotations avec le nombre de secondes indiquées.
autospin: 0, // Usage: Setting to any other number will cause the model to automatically spin around the z-axis after loading.
autostart: 1, // Usage: Setting to 1 will make the model load immediately once the page is ready, rather than waiting for a user to click the Play button.
camera: 1, // Usage: Setting to 0 will skip the initial animation that occurs when a model is loaded, and immediately show the model in its default position.
ui_stop: 0, // Usage: Setting to 0 will hide the "Disable Viewer" button in the top right so that users cannot stop the 3D render once it is started.
transparent: 0, // Usage: Setting to 1 will make the model's background transparent
ui_animations: 0, // Usage: Setting to 0 will hide the animation menu and timeline.
ui_annotations: 0, // Usage: Setting to 0 will hide the Annotation menu.
ui_controls: 1, // Usage: Setting to 0 will hide all the viewer controls at the bottom of the viewer (Help, Settings, Inspector, VR, Fullscreen, Annotations, and Animations).
ui_fullscreen: 0, // Usage: Setting to 0 will hide the Fullscreen button.
ui_general_controls: 1, // Usage: Setting to 0 will hide main control buttons in the bottom right of the viewer (Help, Settings, Inspector, VR, Fullscreen).
ui_help: 1, // Usage: Setting to 0 will hide the Help button.
ui_hint: 0, // Usage: Setting to 0 will always hide the viewer hint animation ("click & hold to rotate"). Setting to 1 will show the hint the first time per browser session (using a cookie). Setting to 2 will always show the hint.
ui_infos: 0, // Usage: Setting to 0 will hide the model info bar at the top of the viewer. Share sign etc.
ui_inspector: 0, // Usage: Setting to 0 will hide the inspector button.
ui_settings: 0, // Usage: Setting to 0 will hide the Settings button.
ui_vr: 0, // Usage: Setting to 0 will hide the View in VR button.
ui_watermark_link: 0, // Usage: Setting to 0 remove the link from the Sketchfab logo watermark.
ui_color: '00a8c0', // Usage: Setting to a hexidecimal color code (without the #) or a HTML color name will change the color of the viewer loading bar.
ui_watermark: 0, // Usage: Setting to 0 remove the Sketchfab logo watermark.

success: success,
error: error
});
