$(document).ready(function() {
    $('#submitt_confirm').click(function() {
        var stationFrom = document.getElementById("departureFrom").innerHTML ;
        var stationArrival = document.getElementById("arrivalTo").innerHTML ;
        var timeDep = document.getElementById("dateDep").innerHTML ;
        var nbBike = document.getElementById("nbBike").innerHTML ;
        var email = $('#email').val();
        var lines = document.getElementById('linee').value;
        var placesAvailable = document.getElementById('placesAvailable').value;
        var trips = document.getElementById('trips').value;

        if(validateEmail(email)){
            reservation(stationFrom, stationArrival, timeDep, nbBike, $('#email').val(), lines, placesAvailable, trips);
        }else{
            alert("WRONG EMAIL");
        }
    });
});


function reservation(stationFrom, stationArrival, timeDep, nbBike, email, lines, placesAvailable, trips){
    //create the book object that will be used in the post
    var book = {
        from: stationFrom,
        arrival: stationArrival,
        timeDep: timeDep,
        nbBike: nbBike,
        email: email,
        lines: lines,
        placesAvailable: placesAvailable,
        trips: trips
    };

    $.ajax({
        type: 'POST',
        url: '/book/confirm',
        data: book,
        success: function(data){
            if(data == 'success'){
                successfullReservation();
            } else if(data == 'needConfirmation'){
                reservationWillBeConfirmed();
            }
        }
    });
};

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
    return re.test(email);
};

//Closing modal and print a successfull message to the user
function successfullReservation(){
    $('.modal').modal();
    $('#modal1').modal('close');
    Materialize.toast('Reservation has been successfull', 4000, 'rounded')
    setTimeout(function(){
        window.location.href= "/";        
    }, 3000);
};

function reservationWillBeConfirmed(){
    $('.modal').modal();
    $('#modal1').modal('close');
    Materialize.toast('The reservation will be confirmed furthermore', 4000, 'rounded')
    setTimeout(function(){
        window.location.href= "/";        
    }, 3000);
}