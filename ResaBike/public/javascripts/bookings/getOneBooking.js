//document ready
$(document).ready(function() {
    $('#bookingsDetails').searchIt({
        useMaterializeCollapsible: true,
        headerIdentifier: '.collapsible-header',
        itemSelector : '.collapsible-header',
        searchTemplate:
        '<div class="row">'+ 
            '<div class="input-field col s6">' +
                '<input id="search" type="search" autocomplete="off" placeholder="Search">' +
                '<i class="material-icons close-search" data-target="search">close</i>'+
            '</div>'+
        '</div>'        
    }); 
});

//DELETE to delete a reservation
function deleteReservation(idBook){
    //AJAX DELETE
    $.ajax({
        url : '/fr/bookings/'+idBook,
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
        url : '/fr/bookings',
        type : 'PUT',
        data: book,
        success : function(res){
            $('#bookingsDetails').load(' #bookingsDetails');   
            Materialize.toast('The reservation has been accepted !', 4000);
        }
    });
}