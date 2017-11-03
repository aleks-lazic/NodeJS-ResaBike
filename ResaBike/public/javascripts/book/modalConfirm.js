//modal to open the confirmation reservation
function confirmReservation(arrayTimeDeparture, placesAvailable, trips){
    console.log(trips);
    //Display Right date
    document.getElementById('dateDep').innerHTML = arrayTimeDeparture ;
    document.getElementById('placesAvailable').value = placesAvailable;
    document.getElementById('trips').value = JSON.stringify(trips);
    //open modal
    $('.modal').modal();
    $('#modal1').modal('open');
}