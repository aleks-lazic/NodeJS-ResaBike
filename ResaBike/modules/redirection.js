/**
 * redirects a user if he's not allowd for the users page
 * @param {*} user 
 */
var redirectUser = function(user){
    //if user is null redirect to login
    if(user == null){
        return '/login';
    } else {
        if(user.RoleId == 3){
            return 'ok';
        } else {
            return '/zone/'+user.ZoneId;
        }
    }
}

/**
 * redirects a user if he has not access for the all zones page
 * @param {*} user 
 */
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

/**
 * redirect one user if he has not access to one zone details page
 * @param {*} user 
 * @param {*} zoneWanted 
 */
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

/**
 * redirects a user if he has not access for the bookings
 * @param {*} user 
 */
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

/**
 * redirects the user if he has access to one booking page
 * @param {*} user 
 * @param {*} zoneWanted 
 */
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