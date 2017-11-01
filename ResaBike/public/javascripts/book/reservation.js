$(document).ready(function() {
    $('#submitt_confirm').click(function() {
        var stationFrom = document.getElementById("departureFrom").innerHTML ;
        var stationArrival = document.getElementById("arrivalTo").innerHTML ;
        var timeDep = document.getElementById("dateDep").innerHTML ;
        var nbBike = document.getElementById("nbBike").innerHTML ;
        var email = $('#email').val();
        var lines = document.getElementById('linee').value;
        if(validateEmail(email)){
            reservation(stationFrom, stationArrival, timeDep, nbBike, $('#email').val(), lines);
        }else{
            alert("WRONG EMAIL");
        }
    });
});


function reservation(stationFrom, stationArrival, timeDep, nbBike, email, lines){
    //create the book object that will be used in the post
    var booking = {
        from: stationFrom,
        arrival: stationArrival,
        timeDep: timeDep,
        nbBike: nbBike,
        email: email,
        lines: lines
    };

    $.ajax({
        type: 'POST',
        url: '/book/confirm',
        data: booking,
        success: function(data){
            
        }
    });
};

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
    return re.test(email);
};

//Closing modal and print a successfull message to the user
function successFullReservation(){
    $('.modal').modal();
    $('#modal1').modal('close');
    Materialize.toast('Reservation has been successfull', 4000, 'rounded')
};