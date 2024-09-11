// const version = "1.12.1";
const iframe = document.getElementById("api-frame");
var client = new Sketchfab( iframe );
let api;
// const uid = "3c97912b6c0d4193a963f253ade24749"; //busTour7
const uid = "cb264ca05beb4abfb696514612734112";

var tps = 0;
var resussite = 0;
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
    if (resussite == 0) {
      document.getElementById('timer').textContent = addLeadingZero(hours) + ":" + addLeadingZero(minutes) + ":" + addLeadingZero(seconds);
    };
}, 1000);




var sontEgaux = false;
var assyBoitier = 0;
var lastBoitier = [0, 0, 0, 0];
var lastFaceAvant = [0, 0, 0, 0];
var IDavant = 0;
var XYZavant = [0, 0, 0];

var tableAssy = [];
var total = 0;
var totalConsigne = 0;
var consigne = [];

var Scenario_1_A2 = [ ]; // A2 (1Uv1)
var Scenario_2_A3 = [ ]; // A3 (1Uv2)
var Scenario_3_A1 = [ ]; // A1 (2U)
var sliderSolution = 0;

//-----------------------------------------------------------------------------------------------------------------------
const Anot = [   // pour createAnnotationFromWorldPosition( annotation position, camera position (eye) and target, titleFR, textFR, titleEN, textEN, [callback] )
  [[0, -.2, .32], [0, -.5, .6], [0, -.2, .4], 'Votre configuration', 'Vérifiez-la en appuyant sur le buzzer', '', '' ],
  [[-.8, .08, .32], [-.4, 0, .6], [-.8, .1, .34], 'Face avant 2U', '', '', '' ],
  [[-.65, .08, .32], [-.25, 0, .6], [-.65, .1, .34], 'Face avant 1U version 1', '', '', '' ],
  [[-.5, .08, .32], [-.1, 0, .6], [-.5, .1, .34], 'Face avant 1U version 2', '', '', '' ],
  [[-.35, .08, .32], [.05, 0, .6], [-.35, .1, .34], 'Boutons', '', '', '' ],
  [[-.5, .5, .32], [-.1, .2, .6], [-.5, .52, .36], 'Boîtier 1U avec électronique version 2', '', '', '' ],
  [[-.3, .5, .32], [.1, .2, .6], [-.3, .52, .36], 'Boîtier au format 2U', '', '', '' ],
  [[-.1, .5, .32], [.3, .2, .6], [-.1, .52, .36], 'Boîtier 1U avec électronique version 1', '', '', '' ],
  [[.4, .5, .32], [.3, .12, .6], [.4, .5, .36], 'Harnais avec micro connecteurs CMM', '', '', '' ],
  [[.27, .62, .32], [0, .12, .6], [.27, .65, .36], 'AMM - Connecteur pas 1mm', 'Solution connectique pour les problématiques critiques d\'encombrement. L\'AMM propose de 10 à 50 contacts distribués sur 2 rangées. Il  est facile à configurer avec mâle et femelle traversant sur CI, mâle et femelle CMS sur CI et femelle sur câbles.', '', '' ],
  [[.4, .62, .32], [.1, .12, .6], [.4, .65, .36], 'Micro connecteurs CMM - Au pas de 2mm - MIL-DTL-55302F', 'Extrême modularité : contacts HF, HP, LF, de 1 à 3 rangées et jusqu\'à 120 contacts (+ de 20 million de configurations en standard). Architecture flexible pour carte à carte, carte à fil, et fil à fil. Gain important d\'espace', '', '' ],
  [[.6, .62, .32], [.4, .12, .6], [.6, .65, .36], 'Connecteurs Micro EMM - Pas de 1,27 mm MIL-DTL-83513', 'Intègre des caractéristiques clés telles que des contacts inversés, une protection arrière intégrée à 90° et des accessoires interchangeables. Adapté aux configurations carte-à-carte (grâce à sa longueur de contact sécurisée) et carte-à-fil (de la jauge 24 à la jauge 30), la sélection de broches EMM est disponible de 4 à 60 contacts de signal', '', '' ],
  [[.4, .15, .32], [.3, 0, .6], [.4, .15, .36], 'Backshell', '', '', '' ],
  [[.5, .25, .32], [.4, 0, .5], [.5, .25, .36], 'Connecteur cylindrique', 'Le connecteur Type 38999 Série 3 est une solution hautement configurable et personnalisable, conçue pour répondre aux besoins spécifiques des clients dans des environnements exigeants. Ce connecteur "vide" offre une flexibilité maximale, permettant à l\'utilisateur de créer des agencements internes adaptés à vos exigences en matière de câblage et d\'interconnexion. Grâce à ce niveau de personnalisation, les utilisateurs peuvent optimiser leurs solutions de connectivité afin de répondre aux contraintes techniques de leurs projets, tout en garantissant une performance fiable et durable.', '', '' ],
  [[.5, .18, .32], [.4, 0, .5], [.5, .18, .36],  'DMM connecteurs métalliques - Au pas de 2mm', 'Conformes aux performances de la norme MIL-DTL-83513G. Le DMM permet un gain d\'encombrement etune excellente réponse face à des problématiques d\'EMI-RFI et de protection mécanique. ', '', '' ],
  [[.55, .21, .32], [.4, 0, .5], [.55, .21, .36],  'OPTIMUS / EN4165 CONNECTEUR ETANCHE', ' ', '', '' ],
  [[.75, .15, .32], [.75, 0, .5], [.75, .15, .36], 'Harnais connecté au boîtier', 'Modulaire, étanche, répondant aux exigences EMI de ce standard, empilable, adapté aux panneaux ou aux fonds de paniers', '', '' ],
];

//-----------------------------------------------------------------------------------------------------------------------
const obj = [ //ID selectionnable, ID ref, XYZ ref, famille
  ['A3-01', -.4806, 0, -.7379, 845 , 853 ,869 ,861,0 ], //boitier 1U v2
  ['A1-01',-.3017, 0, -.7228, 115, 123, 135, 146,0 ],   // boitier 2U
  ['A2-01', -.1130, 0, -.7295, 569 ,585 ,577 ,0,0  ],   //boitier 1U v1
  // table devant à gauche
  ['A1-02',-.8675, 0, -.308, 5 ,0 ,0 ,0,0  ],     // face avant 2U
  ['A2-02',-.6924, 0, -.3063, 607 ,0 ,0 ,0,0  ], // face avant  1U v1
  ['A3-02', -.539, 0, -.3225, 939 ,879 ,0 ,0,0  ],  // face avant  1U v2

  ['A3-12',-.432, 0, -.2653, 917 ,0 ,0 ,0,0  ],     // bouton de gauche
  ['A1-14',-.4431, 0, -.27485, 37 ,0 ,0 ,0,0  ], // bouton de droite

  ['A2-13', -.411, 0, -.2974, 645 ,651 ,0 ,0,0  ],  // interrupteur
  ['A3-11', -.40166, 0, -.2764, 895 ,901 ,0 ,0,0  ],  // interrupteur

  ['A1-13', -.4497, -.04, -.3033, 71 ,0 ,0 ,0  ],  // potar
  ['A1-12', -.45595, 0, -.3212, 49 ,0 ,0 ,0,0  ],  // potar
  ['A1-11', -.4494, -.04, -.4228, 93 ,0 ,0 ,0,0  ],  // potar

  // table devant à droite
  ['A2-32',.4675, 0, -.3822, 715  ,0 ,0 ,0,0  ],     // backshell cylindrique était 'A3-32'
  ['A3-15',.4903, 0, -.33515, 1275 ,0 ,0 ,0,0  ],     // backshell  rectangulaire était 'A2-15'
  ['A2-14',.527, 0, -.3733, 741  ,747 ,0 ,0,0  ],     // connecteur cylindrique
  ['A1-34',.6328, -.05, -.3761, 527 ,539 ,0 ,0,0  ],     // connecteur optimus
  ['A3-34',.6176, 0, -.3164, 1289 ,1313 ,0 ,0,0  ],     // connecteur rectangulaire

  ['A1-33',.6328, .044, -.2958,     423,439,    477,493,0 ],     // harnais optimus à plat
  ['A1-23',.6328, -.3, -.3761,     477,493,    423,439,0],     // harnais optimus en forme
  ['A1-18',.7537, -.023, -.3752,   363,369,      0,0,0 ],     // connecteur A1-18

  ['A3-31',.6296, .044, -.2958,   1151,1167,1159,    1061,1069],    // harnais rectangulaire à plat
  ['A3-21',.6176, -.3, -.3164,  1053,1069,1061,       1159,1167],     // harnais rectangulaire en forme 1053
  ['A3-13',.7216, .0, -.3346,    1005,1011,    0,0,0 ],       // connecteur A3-13

  ['hhh',.7749, 0, -.3672,   1547,1553,   0,0,0],    // harnais fake
  ['hhh',.7749, 0, -.3672,   1569,1575,    0,0,0],    // harnais fake
  ['hhh',.7749, 0, -.3672,    1611,1617,    0,0,0],    // harnais fake

  // table arrière à droite
  ['AMM',.3399, 0, -.7084,   1341,1353,   0,0,0],    // connecteur fake
  ['CMM',.43, 0, -.8567,   1525,0,    0,0,0],    // connecteur fake
  ['CMM',.43, 0, -.8567,   1481,0,    0,0,0],    // connecteur fake
  ['EMM',.4958, 0, -.7012,   1373,1379,1385,1391,0],    // connecteur fake

  ['A3-33',.3637, .03, -.5579,     1249,1257,    1027,1035,0 ],     // harnais
  ['A3-22',.2783, -.3, -.6918,     1027,1035,    1249,1257,0],     // harnais en forme
  ['A3-15',.2953, -.015, -.6951,   961,0,      0,0,0 ],     // connecteur 
  ['A3-14',.2707, -.015, -.6891,   983,0,      0,0,0 ],     // connecteur

  ['A1-31',.3637, .03, -.5579,     385,393,    172,183,0 ],     // harnais
  ['A1-21',.3037, -.3, -.5924,     172,183,    385,393,0],     // harnais en forme
  ['A1-17',.2909, -.048, -.5921,   217,225,      0,0,0 ],     // connecteur

  ['A2-31',.3637, .031, -.5579,      763,771,779,    689,697],     // harnais
  ['A2-21',.4472, -.3, -.6456,       689,697,    763,771,779],     // harnais en forme
  ['A2-12.1',.3768, -.019, -.6372,   801,807,      0,0,0 ],     // connecteur
  ['A2-12',.3767, -.019, -.7182,     667,673,      0,0,0 ],     // connecteur
  ['A2-12.2',.5702, -.019, -.6403,   823,829,     0,0,0 ],     // connecteur

  ['A1-32',.3637, .031, -.5579,    325,333,341,    689,697],     // harnais
  ['A1-22',.5019, -.3, -.6091,     243,251,    325,333,341],     // harnais en forme 259
  ['A1-15',.4891, -.043, -.6186,   281,287,      0,0,0 ],     // connecteur
  ['A1-16',.5056, -.043, -.595,    303,309,      0,0,0 ]     // connecteur
];

//-----------------------------------------------------------------------------------------------------------------------
for (let s = 0; s < obj.length; s++) {
  var nom = obj[s][0];
  nom = nom.slice(0, 4);   
  if ((nom == 'A2-0') || (nom == 'A2-1') || (nom == 'A2-3')) {  Scenario_1_A2.push(obj[s][4])  };
  if ((nom == 'A3-0') || (nom == 'A3-1') || (nom == 'A3-3')) {  Scenario_2_A3.push(obj[s][4])  };
  if ((nom == 'A1-0') || (nom == 'A1-1') || (nom == 'A1-3')) {  Scenario_3_A1.push(obj[s][4])  };
};
const scenario = getScenario();
console.log("Scenario sélectionné :", scenario);
if (scenario == 1) { consigne = Scenario_1_A2};
if (scenario == 2) { consigne = Scenario_2_A3};
if (scenario == 3) { consigne = Scenario_3_A1};
console.log(Scenario_1_A2, Scenario_2_A3, Scenario_3_A1);

//-----------------------------------------------------------------------------------------------------------------------
function openPopup() { // Fonction pour ouvrir le popup
  var popup = document.getElementById("popup3");
  popup.style.display = "block";
}
function closePopup() {  // Fonction pour fermer le popup
  var popup = document.getElementById("popup3");
  popup.style.display = "none";
}
//-----------------------------------------------------------------------------------------------------------------------



// for (let i = 0; i < ObjetsScenario.length; i++) {
//   if (scenario == ObjetsScenario[i][0]) {
//     totalConsigne = consigne.push(ObjetsScenario[i][1]); 
//   };
// };
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

//-----------------------------------------------------------------------------------------------------------------------
const error = () => window.console.error("Sketchfab API error");
const success = (apiClient) => {
  api = apiClient;
  api.start(function () {
    api.addEventListener("viewerready", () => {
        api.getNodeMap(function(err, nodes) {
          if (!err) {window.console.log(nodes); }
        });
      //-----------------------------------------------------------------------------------------------------------------------
      // affiche les annotations sous forme de bulles semi transparentes
      for (let a = 0; a < Anot.length; a++) {
        api.createAnnotationFromWorldPosition(Anot[a][0], Anot[a][1], Anot[a][2], Anot[a][3], Anot[a][4]); // Version française
      };
      url = getNewPastilleURL('rgba(200,200,200,.2)', 'rgba(200,200,200,.4)', 'none', 'none', 0, 50, 512, 256); // Couleurs: intérieur, cercle, texte, texte
      api.setAnnotationsTexture(url, function () {});   

      //-----------------------------------------------------------------------------------------------------------------------
      // clic pour les déplacer les composants ou pour activer les boutons buzzer et solution
      api.addEventListener('click',function(info) { 
        window.console.log('clicked node', info.instanceID);
        // window.console.log(info);
        if (info.instanceID) {  // le clic se fait effectivement sur un objet 
          if (info.instanceID != 1647) { //clic d'autre chose que la scène  
            

            if (info.position3D[1] < 0 ) { // l'objet est sur la table (position Y < 0) alors retour à sa position initiale
              for (let i = 0; i < obj.length; i++) {
                var clic = info.instanceID;
                if ((clic == obj[i][4]) || (clic == obj[i][5]) || (clic == obj[i][6]) || (clic == obj[i][7]) || (clic == obj[i][8])) { // translate( instanceID, translateTo XYZ, options, [callback] )
                  api.translate(obj[i][4]-2, [obj[i][1], obj[i][2], obj[i][3]], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
                  tableAssy = tableAssy.filter((element) => element !== obj[i][4]);
                  window.console.log("objets sur la table :", tableAssy)
                  if ((i>-1) && (i<3)) {  lastBoitier[0] = 0 }; 
                  if ((i>2) && (i<6)) {  lastFaceAvant[0] = 0 }; 
                };
              };
            } else { // l'objet n'est pas sur la table
              for (let i = 0; i < obj.length; i++) {
                var clic = info.instanceID;
                if ((clic == obj[i][4]) || (clic == obj[i][5]) || (clic == obj[i][6]) || (clic == obj[i][7]) || (clic == obj[i][8])) {
                  api.translate(obj[i][4]-2, [0, 0, 0], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
                  // if ((clic == obj[i][4]) || (clic == obj[i][5])) {api.translate(obj[i][8]-2, [0, 0, 0], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});} //cache le harnais en forme
                  total = tableAssy.push(obj[i][4]);
                  
                  if ((i>-1) && (i<3)) { // c'est un boîtier
                    if (lastBoitier[0] != 0) {
                      api.translate(lastBoitier[3]-2, [lastBoitier[0], lastBoitier[1], lastBoitier[2]], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
                      tableAssy = tableAssy.filter((element) => element !== lastBoitier[3]);
                    };
                    for (let j = 0; j < 4; j++) { lastBoitier[j] = obj[i][j+1] }; 
                  };
                  if ((i>2) && (i<6)) { // c'est une face avant
                    if (lastFaceAvant[0] != 0) {
                      api.translate(lastFaceAvant[3]-2, [lastFaceAvant[0], lastFaceAvant[1], lastFaceAvant[2]], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
                      tableAssy = tableAssy.filter((element) => element !== lastFaceAvant[3]);
                    };
                    for (let j = 0; j < 4; j++) { lastFaceAvant[j] = obj[i][j+1] }; 
                  };
                  window.console.log("objets sur la table :", tableAssy);
                };
              };
              // api.setCameraLookAt([0, -1, .7], [0, -.2, .3], 4.3, function(err) {}); //setCameraLookAt( position, target, [duration], [callback] )
            };

          };
          
          //----------------------------------------------------------------------------------------------------------------------- 
          if (info.instanceID == 1633) { //clic sur le buzzer => vérification de la correspondance entre les objets sur table et la consigne
            // window.console.log("objets sur la table :", tableAssy)
            // window.console.log("consigne :", consigne)
            sontEgaux = consigne.length ===
             tableAssy.length && consigne.every((valeur, index) => valeur === tableAssy[index]);
            if (sontEgaux == true) {
              showBanner(true)
              resussite = 1;
              api.hide(1633-2); //cache le buzzer
            } else {showBanner(false)}
          }
          //----------------------------------------------------------------------------------------------------------------------- 
          if (info.instanceID == 1662) { //clic sur le bouton solution => affiche la solution en 3D sur la table 
            resussite = 1;
            api.hide(1633-2); //cache le buzzer
            //retourne les composants à leur place et vide le tableau "tableAssy"
            for (let i = 0; i < obj.length; i++) { 
              api.translate(obj[i][4]-2, [obj[i][1], obj[i][2], obj[i][3]], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
              tableAssy.splice(0, tableAssy.length);
            };
            // puis la recharge avec la selection du scenario
            if (scenario == 1) {
              for (let j = 0; j < Scenario_1_A2.length; j++) {
                for (let i = 0; i < obj.length; i++) {
                  if (obj[i][4] == Scenario_1_A2[j]) {
                    api.translate(obj[i][4]-2, [0, 0, 0], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {}); 
                    tableAssy.push(obj[i][4]);
                  };
                };
              };
            };
            if (scenario == 2) {
              for (let j = 0; j < Scenario_2_A3.length; j++) {
                for (let i = 0; i < obj.length; i++) {
                  if (obj[i][4] == Scenario_2_A3[j]) {
                    api.translate(obj[i][4]-2, [0, 0, 0], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {}); 
                    tableAssy.push(obj[i][4]);
                  };
                };
              };
            };
            if (scenario == 3) {
              for (let j = 0; j < Scenario_3_A1.length; j++) {
                for (let i = 0; i < obj.length; i++) {
                  if (obj[i][4] == Scenario_3_A1[j]) {
                    api.translate(obj[i][4]-2, [0, 0, 0], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {}); 
                    tableAssy.push(obj[i][4]);
                  };
                };
              };
            };

          }
        }
      }); 

      //-----------------------------------------------------------------------------------------------------------------------
      document.getElementById("solution").addEventListener("input", function(){ //au curseur, assemble au centre
        sliderSolution = document.getElementById("solution").value;
        //retourne les composants à leur place et vide le tableau "tableAssy"
        for (let i = 0; i < obj.length; i++) { 
          api.translate(obj[i][4]-2, [obj[i][1], obj[i][2], obj[i][3]], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {});
          tableAssy.splice(0, tableAssy.length);
        };
        // puis la recharge avec la selection du slider
        // if (scenario == 1) { consigne = Scenario_1_A2};
        // if (scenario == 2) { consigne = Scenario_2_A3};
        // if (scenario == 3) { consigne = Scenario_3_A1};
        if (sliderSolution == 1) {
          for (let j = 0; j < Scenario_1_A2.length; j++) {
            // window.console.log(Scenario_1_A2[j])
            for (let i = 0; i < obj.length; i++) {
              if (obj[i][4] == Scenario_1_A2[j]) {
                // window.console.log(Scenario_1_A2[j], obj[i][4])
                api.translate(obj[i][4]-2, [0, 0, 0], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {}); 
                tableAssy.push(obj[i][4]);
              };
            };
          };
        };
        if (sliderSolution == 2) {
          for (let j = 0; j < Scenario_2_A3.length; j++) {
            for (let i = 0; i < obj.length; i++) {
              if (obj[i][4] == Scenario_2_A3[j]) {
                api.translate(obj[i][4]-2, [0, 0, 0], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {}); 
                tableAssy.push(obj[i][4]);
              };
            };
          };
        };
        if (sliderSolution == 3) {
          for (let j = 0; j < Scenario_3_A1.length; j++) {
            for (let i = 0; i < obj.length; i++) {
              if (obj[i][4] == Scenario_3_A1[j]) {
                api.translate(obj[i][4]-2, [0, 0, 0], {duration: .2, easing: 'easeOutQuad'}, function(err, translateTo) {}); 
                tableAssy.push(obj[i][4]);
              };
            };
          };
        };


      });


    });
  });
};
