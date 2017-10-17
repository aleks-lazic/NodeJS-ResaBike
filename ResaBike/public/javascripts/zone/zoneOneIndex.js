function deleteLineOfZone(idLine, idZone) {
    $.ajax({
        url: '/zone/delete/line/'+idLine,
        type: 'DELETE',
        success: function(res){
            window.location.href = "/zone/get/"+idZone;
        }
    });
}
