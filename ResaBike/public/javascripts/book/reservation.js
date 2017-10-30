$(document).ready(function() {
    $('#submitt_confirm').click(function() {
        var stationFrom = document.getElementById("departureFrom").innerHTML ;
        var stationArrival = document.getElementById("arrivalTo").innerHTML ;
        var timeDep = document.getElementById("dateDep").innerHTML ;
        var nbBike = document.getElementById("nbBike").innerHTML ;
        var email = $('#email').val();
        //console.log(validateEmail(email));
        if(validateEmail(email)){
            reservation(stationFrom, stationArrival, timeDep, nbBike, $('#email').val());
            successFullReservation();
        }else{
            alert("WRONG EMAIL");
        }
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