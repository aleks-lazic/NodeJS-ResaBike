$(document).ready(function() {

    //autocomplete part
    /* Autocomplete pour les Zones, modifier les #id */

    $(function() {
        $("#autocomplete-input").on("input",function(e){
            var input = $(this).val();
            $.ajax({
                type: 'GET',
                url: "https://timetable.search.ch/api/completion.json?term="+input,
                success: function(response) {
                  var stationArray = response;
                  var dataStation = {};
                  for (var i = 0; i < stationArray.length; i++) {
                    //console.log(stationArray[i].label);
                    dataStation[stationArray[i].label] = null; //countryArray[i].flag or null
                  }
                  $('input.autocomplete').autocomplete({
                    data: dataStation,
                    limit: 10, // The max amount of results that can be shown at once. Default: Infinity.
                                onAutocomplete: function(val) {
                    // Callback function when value is autcompleted.
                    },
                    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
                });
                }
              });
        })
    });
});

function modalCreateZone(){
    //get all zone admins
    $.ajax({
        url : '/user/getAllZoneAdmin',
        type : 'GET',
        success : function(data){
            data = JSON.parse(data);
            var select = document.getElementById('selectUser');
            data.forEach(function(element) {
                console.log(element);                
                var opt = document.createElement("option");
                opt.value = element.id;
                opt.textContent = element.username;
                select.appendChild(opt);
            }, this);
        }
    });

    //open modal
    $('.modal').modal();
    $('#modalCreateZone').modal('open');
}

function createZone(){

    //get all values from form
    var name = document.getElementById('name').value;
    var userIndex = document.getElementById('selectUser');
    var userId = userIndex.options[userIndex.selectedIndex].value; 
    
    //create the object to create the zone
    var zone = {
        name: name,
        userId: userId
    };

    // POST ajax to create the zone
    $.ajax({
        url : '/zone/create',
        type : 'POST',
        data: zone,
        success : function(res){
          
        }
    });
}