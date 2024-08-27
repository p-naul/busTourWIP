const version = '1.12.1';
const iframe = document.getElementById('api-frame');
var client = new window.Sketchfab(version, iframe);
let api;
const uid = '3c97912b6c0d4193a963f253ade24749';

// var boutonAide = document.querySelector("input");

const error = () => window.console.error('Sketchfab API error');
const success = apiClient => {
api = apiClient; 

var hours = 0;
var minutes = 0;
var seconds = 0;
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

// var btn = document.querySelector("input");
// btn.addEventListener("click", setInterval)
// function scenario() {

// }

//------------------------------------------------
api.start(function () {
api.addEventListener('viewerready', () => {
    // api.getNodeMap(function(err, nodes) {
    //     if (!err) {window.console.log(nodes); }
    // });

// 'console0': '205e32e4-4952-4b1a-bae2-1dcad1f494c3' 
    

    api.addEventListener('click',function(info) { 
    if (info.instanceID) {  // le clic se fait effectivement sur un objet 
      const id =  info.instanceID;
      window.console.log('clicked node', info.instanceID);
      const camX = info.position3D[0];
      const camY = info.position3D[1];
      const camZ = info.position3D[2];
      api.setCameraLookAt([0, -1, 1], [camX, camY, camZ], 2, function(err) {}); //position cam, target,
      if ((id == 560) || (id == 582 ) || (id == 534 ) ) { moveToZero(id) } // composants
      if ((id == 474) || (id == 490) || (id == 482 ) ) { moveToZero(474) } // assemblage pcb
      if ((id == 512) || (id == 518) ) { moveToZero(512) } // face avant
    }
    }); 

}); // api.addEventListener('viewerready'
}); // api.start(
};


