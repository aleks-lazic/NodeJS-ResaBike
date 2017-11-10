var models = require('../models');
var dbZone = require('../db/zone');
var dbRole = require('../db/role');
var dbUser = require('../db/user');
var crypto = require('crypto');

models.sequelize.sync({force:true}).then(function () {
    var promises = [];
    //rajouter tous les trucs
    promises.push(dbRole.createRole(1, 'chauffeur'));
    promises.push(dbRole.createRole(2, 'zoneadmin'));
    promises.push(dbRole.createRole(3, 'sysadmin'));
    
    Promise.all(promises).then(() => {
        var secret = "You'll never find the key";
        var hash = crypto.createHmac('sha256', secret)
                        .update('root')
                        .digest('hex');
        dbUser.createUser('root', hash, 'root@root.com', 'sysadmin');
    })

});