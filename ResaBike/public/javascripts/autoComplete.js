
(function() {

  $(document).ready(function(){
    //get all stations with ajax
    $.ajax({
      url: 'http://localhost:3000/getAllStations',
      success: function(data){
        stations = data;
      }
    })
  });
  
var searchElement = document.getElementById('departureFrom'),
    results = document.getElementById('results'),
    selectedResult = -1, // Permet de savoir quel résultat est sélectionné : -1 signifie "aucune sélection"
    previousRequest, // On stocke notre précédente requête dans cette variable
    previousValue = searchElement.value; // On fait de même avec la précédente valeur
    var stations;



function displayResults(response) { // Affiche les résultats d'une requête

    if(searchElement.value == ""){
      results.style.display = 'none';
      return;
    }
    //trier l'array a à z
    response.sort();

    //get only the values needed
    var array = [];
    for(let k = 0 ; k<response.length ; k++){
        if(response[k].name.toLowerCase().startsWith(searchElement.value.toLowerCase())){
          array.push(response[k].name)
        }
    }
    console.log("Array length : " + array.length);
    results.style.display = array.length ? 'block' : 'none'; // On cache le conteneur si on n'a pas de résultats

    if (array.length) { // On ne modifie les résultats que si on en a obtenu

        results.innerHTML = ''; // On vide les résultats

        for (var i = 0, div ; i < array.length ; i++) {

            div = results.appendChild(document.createElement('div'));
            div.innerHTML = array[i];

            div.addEventListener('click', function(e) {
                chooseResult(e.target);
            });

        }

    }

}

function chooseResult(result) { // Choisi un des résultats d'une requête et gère tout ce qui y est attaché

    searchElement.value = previousValue = result.innerHTML; // On change le contenu du champ de recherche et on enregistre en tant que précédente valeur
    results.style.display = 'none'; // On cache les résultats
    result.className = ''; // On supprime l'effet de focus
    selectedResult = -1; // On remet la sélection à "zéro"
    searchElement.focus(); // Si le résultat a été choisi par le biais d'un clique alors le focus est perdu, donc on le réattribue

}

searchElement.addEventListener('keyup', function(e) {

    var divs = results.getElementsByTagName('div');

    if (e.keyCode == 38 && selectedResult > -1) { // Si la touche pressée est la flèche "haut"

        divs[selectedResult--].className = '';

        if (selectedResult > -1) { // Cette condition évite une modification de childNodes[-1], qui n'existe pas, bien entendu
            divs[selectedResult].className = 'result_focus';
        }

    }

    else if (e.keyCode == 40 && selectedResult < divs.length - 1) { // Si la touche pressée est la flèche "bas"

        results.style.display = 'block'; // On affiche les résultats

        if (selectedResult > -1) { // Cette condition évite une modification de childNodes[-1], qui n'existe pas, bien entendu
            divs[selectedResult].className = '';
        }

        divs[++selectedResult].className = 'result_focus';

    }

    else if (e.keyCode == 13 && selectedResult > -1) { // Si la touche pressée est "Entrée"

        chooseResult(divs[selectedResult]);

    }

    else if (searchElement.value != previousValue) { // Si le contenu du champ de recherche a changé

        previousValue = searchElement.value;
        displayResults(stations);
        selectedResult = -1; // On remet la sélection à "zéro" à chaque caractère écrit

    }

});

})();

// })
// // $(function() {
    
// //       var stationAvailable = [
// //           "ActionScript",
// //           "AppleScript",
// //           "Asp",
// //           "BASIC",
// //           "C",
// //           "C++",
// //           "Clojure",
// //           "COBOL",
// //           "ColdFusion",
// //           "Erlang",
// //           "Fortran",
// //           "Groovy",
// //           "Haskell",
// //           "Java",
// //           "JavaScript",
// //           "Lisp",
// //           "Perl",
// //           "PHP",
// //           "Python",
// //           "Ruby",
// //           "Scala",
// //           "Scheme"
// //         ];
// //         $( "#tags" ).autocomplete({
// //           source: stationAvailable
// //         });
// //         // alert("YOLO");
// // });