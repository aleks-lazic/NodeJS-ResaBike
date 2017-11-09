
var redirectUser = function(user){
    //if user is null redirect to login
    if(user == null){
        console.log('je suis null');
        return '/login';
    } else {
        if(user.RoleId == 3){
            return 'ok';
        } else {
            return '/zone/'+user.ZoneId;
        }
    }
}

var redirectAllZones = function(user){
    //if user is null redirect to login
    if(user == null){
        return '/login';
    } else {
        console.log(user.RoleId);
        if(user.RoleId == 3){
            return 'ok';
        } else {
            return '/zone/'+user.ZoneId;
        }
    }
}

var redirectOneZone = function(user, zoneWanted){
    //if user is null redirect to login
    if(user == null){
        return '/login';
    } else {
        if(user.RoleId == 3){
            return 'ok';
        } else if(user.ZoneId == zoneWanted){
            return 'ok';
        } else {
            return '/zone/'+user.ZoneId;            
        }
    }
}

var redirectAllBookings = function(user){
    //if user is null redirect to login
    if(user == null){
        return '/login';
    } else {
        if(user.RoleId != 1){
            return 'ok';
        } else {
            return '/bookings/'+user.ZoneId;
        }
    }
}

var redirectOneBooking = function(user, zoneWanted){
    //if user is null redirect to login
    if(user == null){
        return '/login';
    } else {
        if(user.RoleId == 3){
            return 'ok';
        } else if(user.ZoneId == zoneWanted){
            return 'ok';
        } else {
            return '/zone/'+user.ZoneId;            
        }
    }
}

exports.redirectOneBooking = redirectOneBooking;
exports.redirectAllBookings = redirectAllBookings;
exports.redirectOneZone = redirectOneZone;
exports.redirectAllZones = redirectAllZones;
exports.redirectUser = redirectUser;