//DELETE to delete a reservation
function deleteReservation(idBook){
    //AJAX DELETE
    $.ajax({
        url : '/bookings/'+idBook,
        type : 'DELETE',
        success : function(res){
            $('#bookingsDetails').load(' #bookingsDetails');
            Materialize.toast('The reservation has been canceled !', 4000);            
        }
    });
}

//PUT to modify a reservation
function confirmReservation(idBook){
    var book = {
        idBook: idBook
    };

    //AJAX PUT
    $.ajax({
        url : '/bookings',
        type : 'PUT',
        data: book,
        success : function(res){
            $('#bookingsDetails').load(' #bookingsDetails');   
            Materialize.toast('The reservation has been accepted !', 4000);
        }
    });
}