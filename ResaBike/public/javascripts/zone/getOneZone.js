
/**
 * Delete a line using an ajax request
 * @param {*} idZone 
 * @param {*} idLine 
 */
function deleteLine(idZone, idLine) {
    //create object to pass through body
    var object = {
        idZone: idZone,
        idLine: idLine
    };
    
    // AJAX DELETE to delete a line
    $.ajax({
        url: '/fr/zone/delete/line/'+idLine,
        type: 'DELETE',
        data: object,
        success: function(res){
            $('#linesTable').load(' #linesTable');
        }
    });
}

/**
 * Autocomplete function retrieving API stations
 * @param {*} inputId 
 */
function autocomplete(inputId){
    $('#'+inputId).on("input", (e) => {
        var input = document.getElementById(inputId).value;
        $.ajax({
            type: 'GET',
            url: "https://timetable.search.ch/api/completion.json?term="+input,
            success: function(response) {
                var stations = response;
                var dataStation = {};
                stations.forEach(function(s) {
                   dataStation[s.label] = null;
                }, this);
                $('input.autocomplete').autocomplete({
                    data: dataStation,
                    limit: 10,
                    onAutocomplete: function(val){

                    },
                    minLength: 1
                });
            }
        })
    })
}

/**
 * Use of autocomplete for departure fields and arrival fields
 */
$(function() {
    autocomplete('departure');
    autocomplete('arrival');
})


/**
 * Open the modal for creating the line
 * @param {*} idZone 
 */
function modalCreateLine(idZone){
    document.getElementById('id').value = idZone;

    //open modal
    $('.modal').modal();
    $('#modalCreateLine').modal('open');
}

/**
 * Creation of lines using an ajax request
 */
function createLines(){
    //get the values from form
    var departure = document.getElementById('departure').value;
    var arrival = document.getElementById('arrival').value;
    var idZone = document.getElementById('id').value;

    //create object to pass through the body
    var line = {
        departure: departure,
        arrival: arrival,
        idZone: idZone
    };

    //AJAX POST to create the line
    $.ajax({
        url: '/fr/zone/create/line',
        type: 'POST',
        data: line,
        success: function(result){
            $('.modal').modal();                
            $('#modalCreateLine').modal('close');
            $('#formCreateLine')[0].reset();                                                                    
            $('#linesTable').load(' #linesTable');
        }
    });
}