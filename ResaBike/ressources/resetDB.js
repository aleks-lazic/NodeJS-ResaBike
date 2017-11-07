var models = require('../models');
var dbZone = require('../db/zone');
var dbRole = require('../db/role');
var dbUser = require('../db/user');

models.sequelize.sync({force:true}).then(function () {
    var promises = [];
    //rajouter tous les trucs
    promises.push(dbRole.createRole(1, 'chauffeur'));
    promises.push(dbRole.createRole(2, 'zoneadmin'));
    promises.push(dbRole.createRole(3, 'sysadmin'));
    
    Promise.all(promises).then(() => {
        dbUser.createUser('root', 'root', 'root@root.com', 'sysadmin');
    })

});