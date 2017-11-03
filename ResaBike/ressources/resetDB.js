var models = require('../models');
var dbZone = require('../db/zone');

models.sequelize.sync({force:true}).then(function () {
    //rajouter tous les trucs
    dbZone.createZone('Anniviers');

});