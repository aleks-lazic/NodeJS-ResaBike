var requestApi = require('./requestDataApi');
var dbBook = require('../db/book');

// getAllConnections('Sierre', 'Zinal', '2017/11/10', 1).then((connections) => {
//     console.log(connections);
// })

function getAllConnections(stationDeparture, arrivalTo, dateTravel, nbBike){
    return new Promise((resolve, reject) => {
        //url request the api
        var test = new Date(dateTravel);
        var today = new Date();
        day = today.getDate();
        month = today.getMonth() +1;
        year = today.getFullYear();
        var currentDate = new Date(year + '/' + month + '/' + day);
        
        var url = "";
        if(currentDate.getTime() == test.getTime()){
            url = "https://timetable.search.ch/api/route.en.json?from=" + stationDeparture + "&to=" + arrivalTo + "&date=" + dateTravel;
        } else {
            url = "https://timetable.search.ch/api/route.en.json?from=" + stationDeparture + "&to=" + arrivalTo + "&date=" + dateTravel + "&time=06:00";
        }
        //request the api
        requestApi.getDataFromAPI(url).then((object) => {
            //get the connections
            let connections = object.connections;
            var connectionsArray = [];

            //get through all connections
            for(let i = 0 ; i<connections.length ; i++){
                //if the date is not the same continue to the next connection
                if(connections[i].departure.split(' ')[0] != dateTravel){
                    continue;
                }
                var connection = {};
                let lines = [];
                let trips = [];           
                for(let j = 0 ; j<connections[i].legs.length ; j++){
                    let currentLeg = connections[i].legs[j];
                    if(currentLeg.type == 'post' || currentLeg.type == 'bus'){
                        //get the line number
                        lines.push(currentLeg.line);

                        //get the date for the departure
                        if(connection.date == null){
                            connection.date = currentLeg.departure;                            
                        }

                        //get the trip
                        var trip = {
                            departureId: currentLeg.stopid,
                            departureStation: currentLeg.name,
                            exitId: currentLeg.exit.stopid,
                            exitStation: currentLeg.exit.name
                        };

                        //insert the trip into the trips array
                        trips.push(trip);
                    }
                }
                connection.trips = trips;
                connection.lines = lines;
                connection.nbBike = nbBike;
                connectionsArray.push(connection);
            }

            //get the number of places available
            const MAX_PLACES = 6;
            let promisesPlaces = [];
            for(let k = 0 ; k<connectionsArray.length ; k++){
                promisesPlaces.push(dbBook.getSumWithMultipleLines(connectionsArray[k].date, connectionsArray[k].lines).then((max) => {
                    connectionsArray[k].placesAvailable = MAX_PLACES - max;
                    if(connectionsArray[k].placesAvailable < 0){
                        connectionsArray[k].placesAvailable = 0;
                    }
                }));
            }

            //once all promises are done we can resolve the connections
            Promise.all(promisesPlaces).then(() => {
                resolve(connectionsArray);
            })
        })
    })
}

exports.getAllConnections = getAllConnections;