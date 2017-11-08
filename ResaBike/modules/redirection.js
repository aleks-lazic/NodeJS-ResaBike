
var redirectUser = function(user){
    //if user is null redirect to login
    if(user == null){
        console.log('je suis null');
        return '/login';
    } else {
        if(user.RoleId == 3){
            console.log('je suis sysadmin et jai access');
            return 'ok';
        } else {
            console.log('je suis kevin et je vais dans ma zone id');
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

exports.redirectOneZone = redirectOneZone;
exports.redirectAllZones = redirectAllZones;
exports.redirectUser = redirectUser;