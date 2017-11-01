//modal to open the confirmation reservation
function confirmReservation(arrayTimeDeparture, placesAvailable){
    //Display Right date
    document.getElementById('dateDep').innerHTML = arrayTimeDeparture ;
    document.getElementById('placesAvailable').value = placesAvailable;
    //open modal
    $('.modal').modal();
    $('#modal1').modal('open');
}