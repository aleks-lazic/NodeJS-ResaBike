var express = require('express');
var router = express.Router();


/* GET creation home page user. */
router.get('/create', function(req, res, next) { 
    res.render('createUser');
});

router.post('/create', (req, res, next) => {
    
})


module.exports = router;
