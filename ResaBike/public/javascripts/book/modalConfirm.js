/**
 * confirm a reservation with the date places available and the trips
 * @param {*} dateTime 
 * @param {*} placesAvailable 
 * @param {*} trips 
 */
function confirmReservation(dateTime, placesAvailable, trips){
    //Display Right date
    document.getElementById('dateDep').innerHTML = dateTime ;
    document.getElementById('placesAvailable').value = placesAvailable;
    document.getElementById('trips').value = JSON.stringify(trips);
    //open modal
    $('.modal').modal();
    $('#modal1').modal('open');
}