/**
 * redirect to the upcoming reservations
 * @param {*} idZone 
 */
function reservationDetails(idZone){
    window.location.href = '/' + langUsed + '/bookings/'+idZone;
}

/**
 * redirect to the past reservations
 * @param {*} idZone 
 */
function reservationHistorical(idZone){
    window.location.href = '/' + langUsed + '/bookings/historique/' + idZone;
}