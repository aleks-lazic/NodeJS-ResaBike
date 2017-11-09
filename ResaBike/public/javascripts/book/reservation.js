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
        var firstname = document.getElementById('firstname').value;
        var lastname = document.getElementById('lastname').value;


        if(validateEmail(email)){
            reservation(stationFrom, stationArrival, timeDep, nbBike, $('#email').val(), lines, placesAvailable, trips, firstname, lastname);
        }else{
            $("#email").attr("class","validate invalid");
        }
    });
});

/**
 * will post the values form to add it into the db
 * @param {*} stationFrom 
 * @param {*} stationArrival 
 * @param {*} timeDep 
 * @param {*} nbBike 
 * @param {*} email 
 * @param {*} lines 
 * @param {*} placesAvailable 
 * @param {*} trips 
 * @param {*} firstname 
 * @param {*} lastname 
 */
function reservation(stationFrom, stationArrival, timeDep, nbBike, email, lines, placesAvailable, trips, firstname, lastname){
    
    //create the book object that will be used in the post
    var books = {
        from: stationFrom,
        arrival: stationArrival,
        timeDep: timeDep,
        nbBike: nbBike,
        email: email,
        lines: lines,
        placesAvailable: placesAvailable,
        trips: trips,
        firstname: firstname,
        lastname: lastname
    };

    $.ajax({
        type: 'POST',
        url: '/' + langUsed + '/book/confirm',
        data: books,
        success: function(data){
            if(data == 'success'){
                successfullReservation();
            } else if(data == 'needConfirmation'){
                reservationWillBeConfirmed();
            }
        }
    });
};

/**
 * validates the email with regex
 * @param {*} email 
 */
function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
    return re.test(email);
};

/**
 * shows toast if the reservation is successfull
 */
function successfullReservation(){
    $('.modal').modal();
    $('#modal1').modal('close');
    Materialize.toast(`${lang.resSuccessfull}`, 4000, 'rounded')
    setTimeout(function(){
        window.location.href= "/";        
    }, 3000);
};

/**
 * show toast if the reservation needs to be confirmed
 */
function reservationWillBeConfirmed(){
    $('.modal').modal();
    $('#modal1').modal('close');
    Materialize.toast(`${lang.resConfirmed}`, 4000, 'rounded')
    setTimeout(function(){
        window.location.href= "/";        
    }, 3000);
}