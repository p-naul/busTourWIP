const version = "1.12.1";
const iframe = document.getElementById("api-frame");
var client = new window.Sketchfab(version, iframe);
let api;
const uid = "3c97912b6c0d4193a963f253ade24749";

var hours = 0;
var minutes = 0;
var seconds = 0;
var number = 0;
function addLeadingZero(number) {
    if (number < 10) {
      return "0" + number;
    } else {
      return number;
    }
}
setInterval(function() {  // Mise à jour du timer toutes les secondes
    seconds++;
    if (seconds == 60) {
      minutes++;
      seconds = 0;
    }
    if (minutes == 60) {
      hours++;
      minutes = 0;
    }
    document.getElementById('timer').textContent = addLeadingZero(hours) + ":" + addLeadingZero(minutes) + ":" + addLeadingZero(seconds);
}, 1000);

const error = () => window.console.error("Sketchfab API error");
const success = (apiClient) => {
  api = apiClient;
  api.start(function () {
    api.addEventListener("viewerready", () => {
      //---------------------------------------------
      url = getNewPastilleURL('rgba(200,200,200,.2)', 'rgba(200,200,200,.4)', 'none', 'none', 0, 50, 512, 256); // Couleurs: intérieur, cercle, texte, texte
      api.setAnnotationsTexture(url, function () {});
      api.getAnnotationList(function(err, annotations) {
          var Nbannot = annotations.length;
          for (var i = 0; i < Nbannot; i++) {
              annotations[i].content = ' ';
              api.updateAnnotation(i, {
                  content: annotations[i].content,
              });
          }
      });

      //------------------------
      api.addEventListener('click', function (info) {
        // if (info.instanceID == 809) {  api.gotoAnnotation(0, function(err, index) {});  };
      });
      //------------------------

    });
  });
};
