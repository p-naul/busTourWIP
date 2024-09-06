// const version = "1.12.1";
const iframe = document.getElementById("api-frame");
// var client = new window.Sketchfab(version, iframe);
var client = new Sketchfab( iframe );
// var client = new Sketchfab("1.12.1", iframe);
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
  [50, 30, -.4806, 0, -.7379 ],
  [270, 30, -.4806, 0, -.7379 ],
  [160, 30, -.4806, 0, -.7379 ],
  //boitier 2
  [137, 135,-.3017, 0, -.7228 ],
  [145, 135,-.3017, 0, -.7228 ],
  [157, 135,-.3017, 0, -.7228 ],
  [168, 135,-.3017, 0, -.7228 ],
  //boitier 3
  [500, 300, -.1130, 0, -.7295 ],
  [27, 3,-.1130, 0, -.7295 ],
  [16, 3,-.1130, 0, -.7295 ],
  // faces avant
  [5, 3,-.8675, 0, -.308 ],
  [500, 300,-.6924, 0, -.3063 ],
  [1600, 300, -.539, 0, -.3225 ]
];
const ObjetsScenario = [ 
  //scénario 1
  [1, 51 ],   //face avant
  [1, 3 ], //boitier
  [1, 184 ], //harnais sur table (212 sur console)
  
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
function openPopup() { // Fonction pour ouvrir le popup
  var popup = document.getElementById("popup3");
  popup.style.display = "block";
}
function closePopup() {  // Fonction pour fermer le popup
  var popup = document.getElementById("popup3");
  popup.style.display = "none";
}
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
        api.hide (381, function(err) {}); //381
        api.hide (373, function(err) {}); //381
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
      // affiche du contenu d'annotation en hover par une fenêtre popup
      // api.addEventListener('annotationMouseEnter', function(index) {
      //   window.console.log('Hovering on annotation', index);
        // setTimeout(openPopup, 100); //ouvrir le popup après 2 milisecondes
        // document.getElementById("openPopup3").addEventListener("click", function () {
        //   document.getElementById("popup3").style.display = "flex";
        // });
      // });

      //---------------------------------------------
      api.addEventListener('click',function(info) { 
        window.console.log('clicked node', info.instanceID);
        // window.console.log(info);
        if (info.instanceID) {  // le clic se fait effectivement sur un objet 
          if (info.instanceID != 1065) { //clic d'autre chose que la scène   
            api.setCameraLookAt([0, -1, 1], [0, -.2, .3], 4.3, function(err) {});
            if (info.position3D[1] < 0 ) { // l'objet est sur la table (position Y < 0) alors retour à sa position initiale
              if (info.instanceID == 186 ) {
                api.hide (186, function(err) {}); //186
                api.hide (178, function(err) {});
                api.show (212, function(err) {}); //212
              };
              for (let i = 0; i < ObjetsGroup.length; i++) {
                if (info.instanceID == ObjetsGroup[i][0]) {
                  api.translate(ObjetsGroup[i][1], [ObjetsGroup[i][2], ObjetsGroup[i][3], ObjetsGroup[i][4]], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
                  tableAssy = tableAssy.filter((element) => element !== ObjetsGroup[i][1]);
                  window.console.log("objets sur la table :", tableAssy)
                };
              };
            } else { // l'objet n'est pas sur la table
              if (info.instanceID == 212 ) {
                api.hide (212, function(err) {}); //212
                api.hide (204, function(err) {}); 
                api.show (186, function(err) {}); //186
              };
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
          if (info.instanceID == 913) { //clic sur le buzzer => vérification de la correspondance entre les objets sur table et la consigne
            window.console.log("objets sur la table :", tableAssy)
            sontEgaux = consigne.length ===
             tableAssy.length && consigne.every((valeur, index) => valeur === tableAssy[index]);
            if (sontEgaux == true) {showBanner(true)
            } else {showBanner(false)}
          }
          //---------------------------------------------
        }
      }); 

    //   api.showAnnotationTooltips(function(err) {
    //     if (!err) {
    //         window.console.log('Showing annotation tooltip');
    //     }
    // });


    });
  });
};
