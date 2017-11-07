  /* Autocomplete pour les station, modifier les #id */
function autocomplete(inputId){
    $("#" + inputId).on("input",function(e){
        var input = document.getElementById(inputId).value;
        $.ajax({
            type: 'GET',
            url: "/fr/getAllStations",
            success: function(response) {
                var stationArray = response;
                var dataStation = {};
                for (var i = 0; i < stationArray.length; i++) {
                //console.log(stationArray[i].label);
                dataStation[stationArray[i].name] = null; //countryArray[i].flag or null
                }
                $('input.autocomplete').autocomplete({
                data: dataStation,
                limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
                onAutocomplete: function(val) {
                // Callback function when value is autcompleted.
                },
                minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
            });
            }
        });
    })
}

//autocompletion
$(function() {
    autocomplete('departureFrom');
    autocomplete('arrivalTo');
})