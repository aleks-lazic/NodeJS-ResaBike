function reservation(stationFrom, stationArrival, timeDep, idLine, nbBike){
    // alert(stationFrom);
    // return;

    //create the book object that will be used in the post
    var book = {
        from: stationFrom,
        arrival: stationArrival,
        timeDep: timeDep,
        idLine: idLine,
        nbBike: nbBike
    }

    //alert(idLine + " , " + timeDep + " , " + nbBike);

    $.ajax({
        type: 'POST',
        url: '/book/reservation',
        data: book,
        success: function(data){
            
        }
    });
}