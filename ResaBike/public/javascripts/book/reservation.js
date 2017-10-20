$(document).ready(function() {
    $('#submitt_confirm').click(function() {
      reservation($('#departureFrom').val(),$('#arrivalTo').val(),$('#dateDep').val(),$('#nbBike').val(),$('#email').val());
    });
});


function reservation(stationFrom, stationArrival, timeDep, nbBike, email){

    
    //create the book object that will be used in the post
    var book = {
        from: stationFrom,
        arrival: stationArrival,
        timeDep: timeDep,
        nbBike: nbBike,
        email: email
    }

    //alert(idLine + " , " + timeDep + " , " + nbBike);

    $.ajax({
        type: 'POST',
        url: '/book/confirm',
        data: book,
        success: function(data){
            
        }
    });
}