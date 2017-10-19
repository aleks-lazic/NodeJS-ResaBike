function reservation(stationFrom, stationArrival, timeDep, idLine, nbBike){
    $(document).ready(function() {
        $(function() {
                $.ajax({
                    type: 'POST',
                    url: "http://localhost:3000/book/reservation",
                    success: function(response) {
                        
                      }
                    });
                });
            });
        }