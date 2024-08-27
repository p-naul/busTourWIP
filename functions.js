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


//-----------------------------------------------------------
function dialogue1(phrase) {
  popup1.textContent = "";
  Go = 0;
  const mots = phrase.split(" ");
  let indexMot = 0;
  const intervalId = setInterval(() => {
    // window.console.log(indexMot, Go);
      if (indexMot < mots.length) {
          popup1.textContent += mots[indexMot] + " ";
          indexMot++;
      } else {
          clearInterval(intervalId); // Arrête l'affichage en fin de phrase
          setTimeout(() => { Go = 1;}, 2000);
      }
  }, 250); // Délai entre chaque mot (en millisecondes)
}
//-----------------------------------------------------------
function move(ID, TX, TY, TZ) {
  api.getMatrix(ID, function(err, matrix) {
    // window.console.log('matrix', matrix);
    matrix.local[12]=TX/1000;
    matrix.local[13]=TZ/1000;
    matrix.local[14]=TY/1000;
    matrice = matrix.local;
    // window.console.log('matrix', matrice);
    api.setMatrix(ID, matrice, function(err, matrix) {
    });
  });
}

function moveToZero(ID) {
  api.getMatrix(ID-2, function(err, matrix) {
    window.console.log('matrix', matrix);
    matrix.local[12]=0;
    matrix.local[13]=0;
    matrix.local[14]=0;
    matrix.world[12]=0;
    matrix.world[13]=0;
    matrix.world[14]=0;
    matrice = matrix.local;
    // window.console.log('matrix', matrice);
    api.setMatrix(ID-2, matrice, function(err, matrix) {});
    api.setCameraLookAt([0, -1, 1], [0, 0, .5], 2, function(err) {});
  });
}


function moveRotate(ID, vX1, vX2, vX3, vY1, vY2, vY3, vZ1, vZ2, vZ3, TX, TY, TZ) {
  api.getMatrix(ID, function(err, matrix) {
    // window.console.log('matrix', matrix);
    matrix.local[0]=vX1;
    matrix.local[1]=vX2;
    matrix.local[2]=vX3;
    matrix.local[4]=vY1;
    matrix.local[5]=vY2;
    matrix.local[6]=vY3;
    matrix.local[8]=vZ1;
    matrix.local[9]=vZ2;
    matrix.local[10]=vZ3;
    matrix.local[12]=TX/1000;
    matrix.local[13]=TZ/1000;
    matrix.local[14]=TY/1000;
    matrice = matrix.local;
    // window.console.log('matrix', matrice);
    api.setMatrix(ID, matrice, function(err, matrix) {
    });
  });
}
//-----------------------------------------------------------
function changerModeleSketchfab(nouvelIdentifiant) {
  // const iframe = document.getElementById('votre-iframe-id'); // Remplacez 'votre-iframe-id' par l'ID de votre balise <iframe>
  const nouvelleURL = `https://sketchfab.com/models/${nouvelIdentifiant}/embed`;
  iframe.src = nouvelleURL;
}



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
annotation: 0, // Usage: Setting to [1 – 100] will automatically load that annotation when the viewer starts.
annotations_visible: 1, // Usage: Setting to 0 will hide annotations by default.
//   annotation_cycle: 0, // Déroule les annotations avec le nombre de secondes indiquées.
autospin: 0, // Usage: Setting to any other number will cause the model to automatically spin around the z-axis after loading.
autostart: 1, // Usage: Setting to 1 will make the model load immediately once the page is ready, rather than waiting for a user to click the Play button.
camera: 1, // Usage: Setting to 0 will skip the initial animation that occurs when a model is loaded, and immediately show the model in its default position.
ui_stop: 0, // Usage: Setting to 0 will hide the "Disable Viewer" button in the top right so that users cannot stop the 3D render once it is started.
transparent: 1, // Usage: Setting to 1 will make the model's background transparent
ui_animations: 1, // Usage: Setting to 0 will hide the animation menu and timeline.
ui_annotations: 1, // Usage: Setting to 0 will hide the Annotation menu.
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
