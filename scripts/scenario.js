const version = "1.12.1";
const iframe = document.getElementById("api-frame");
var client = new window.Sketchfab(version, iframe);
let api;
const uid = "3c97912b6c0d4193a963f253ade24749";
// client.init(uid, { autostart: 1, autospin: 0, success: success, error: error });

var sontEgaux = false;
var assyBoitier = 0;
var lastIDboitier = 0;
var IDavant = 0;
var XYZavant = [0, 0, 0];
const ObjetsGroup = [ //ID selectionnable, ID ref, XYZ ref, famille
  //boitier 1
  [399, 397, -.4806, 0, -.7379 ],
  [407, 397, -.4806, 0, -.7379 ],
  [415, 397, -.4806, 0, -.7379 ],
  [423, 397, -.4806, 0, -.7379 ],
  //boitier 2
  [137, 135,-.3017, 0, -.7228 ],
  [145, 135,-.3017, 0, -.7228 ],
  [157, 135,-.3017, 0, -.7228 ],
  [168, 135,-.3017, 0, -.7228 ],
  //boitier 3
  [249, 247,-.1130, 0, -.7295 ],
  [257, 247,-.1130, 0, -.7295 ],
  [265, 247,-.1130, 0, -.7295 ],
  // faces avant
  [5, 3,-.8675, 0, -.308 ],
  [287, 285,-.6924, 0, -.3063 ],
  [625, 623,-.539, 0, -.3225 ]
];
const ObjetsScenario = [ 
  //scénario 1
  [1, 3 ],   //face avant
  [1, 135 ], //boitier
  
  //scénario 2
  [2, 285 ], //face avant
  [2, 247 ], //boitier
  
  //scénario 3
  [3, 623 ], //face avant
  [3, 397]   //boitier
];
var tableAssy = [];
var total = 0;
var totalConsigne = 0;
var consigne = [];


//---------------------------------------------
const scenario = getScenario();
console.log("Scenario sélectionné :", scenario);
for (let i = 0; i < ObjetsScenario.length; i++) {
  if (scenario == ObjetsScenario[i][0]) {
    totalConsigne = consigne.push(ObjetsScenario[i][1]); 
  };
};
window.console.log("consigne :", consigne)
// if (scenario == "1") {
//   console.log("Scenario 1")

// } else if (scenario == "2") {
//   console.log("Scenario 2")
// } else if (scenario == "3") {
//   console.log("Scenario 3")
// } else {
//   console.log("Pas de scenario")
// };
function getScenario() {
  const params = new URLSearchParams(window.location.search);
  return params.get("scenario");
}


//---------------------------------------------
const error = () => window.console.error("Sketchfab API error");
const success = (apiClient) => {
  api = apiClient;
  api.start(function () {
    api.addEventListener("viewerready", () => {
        api.getNodeMap(function(err, nodes) {
          if (!err) {window.console.log(nodes); }
        });
      //---------------------------------------------
      // affiche les annotations sous forme de bulles semi transparentes
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
      //---------------------------------------------
      api.addEventListener('click',function(info) { 
        window.console.log('clicked node', info.instanceID);
        // window.console.log(info);
        if (info.instanceID) {  // le clic se fait effectivement sur un objet 
          if (info.instanceID != 829) { //clic d'autre chose que la scène   
            api.setCameraLookAt([0, -1, 1], [0, -.2, .3], 4.3, function(err) {});
            if (info.position3D[1] < 0 ) { // l'objet est sur la table (position Y < 0) alors retour à sa position initiale
              for (let i = 0; i < ObjetsGroup.length; i++) {
                if (info.instanceID == ObjetsGroup[i][0]) {
                  api.translate(ObjetsGroup[i][1], [ObjetsGroup[i][2], ObjetsGroup[i][3], ObjetsGroup[i][4]], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
                  tableAssy = tableAssy.filter((element) => element !== ObjetsGroup[i][1]);
                  window.console.log("objets sur la table :", tableAssy)
                };
              };
            } else { // l'objet n'est pas sur la table
              for (let i = 0; i < ObjetsGroup.length; i++) {
                if (info.instanceID == ObjetsGroup[i][0]) {
                  api.translate(ObjetsGroup[i][1], [0, 0, 0], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
                  total = tableAssy.push(ObjetsGroup[i][1]);
                  window.console.log("objets sur la table :", tableAssy)
                };
              };
            };
            //----Famille des boitiers electroniques-----------------------------------------
            // for (let i = 0; i < ObjetsGroup.length; i++) {
            //   if (ObjetsGroup[i][0] == info.instanceID) {
            //     api.translate(ObjetsGroup[i][1], [0, 0, 0], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
            //     api.translate(IDavant, XYZavant, {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
            //     IDavant = ObjetsGroup[i][1]; //sauvegarde de la position table composant
            //     XYZavant = [ObjetsGroup[i][2], ObjetsGroup[i][3], ObjetsGroup[i][4]];
            //   };
            // };
            //---------------------------------------------
          };
          //---------------------------------------------
          if (info.instanceID == 815) { //clic sur le buzzer => vérification de la correspondance entre les objets sur table et la consigne
            window.console.log("objets sur la table :", tableAssy)
            sontEgaux = consigne.length === tableAssy.length && consigne.every((valeur, index) => valeur === tableAssy[index]);
            if (sontEgaux == true) {showBanner(true)
            } else {showBanner(false)}
          }
          //---------------------------------------------
        }
      }); 
    });
  });
};
