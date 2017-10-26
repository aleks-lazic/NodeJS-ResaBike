//modal to open the confirmation reservation
function confirmReservation(arrayTimeDeparture){
    //Display Right date
    document.getElementById('dateDep').innerHTML = arrayTimeDeparture ;

    //open modal
    $('.modal').modal();
    $('#modal1').modal('open');
}

//Closing modal and print a successfull message to the user
function successFullReservation(){
    $('.modal').modal();
    $('#modal1').modal('close');
    Materialize.toast('Reservation has been successfull', 3000, 'rounded')
}