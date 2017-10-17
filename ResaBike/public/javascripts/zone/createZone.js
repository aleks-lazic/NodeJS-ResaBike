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