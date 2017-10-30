//modal to open the confirmation reservation
function confirmReservation(arrayTimeDeparture){
    //Display Right date
    document.getElementById('dateDep').innerHTML = arrayTimeDeparture ;

    //open modal
    $('.modal').modal();
    $('#modal1').modal('open');
}