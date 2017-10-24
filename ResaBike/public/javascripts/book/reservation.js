$(document).ready(function() {
    $('#submitt_confirm').click(function() {
        var stationFrom = document.getElementById("departureFrom").innerHTML ;
        var stationArrival = document.getElementById("arrivalTo").innerHTML ;
        var timeDep = document.getElementById("dateDep").innerHTML ;
        var nbBike = document.getElementById("nbBike").innerHTML ;
      reservation(stationFrom, stationArrival, timeDep, nbBike, $('#email').val());
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