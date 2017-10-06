var express = require('express');
var router = express.Router();
var request = require('request');

fetch("https://timetable.search.ch/api/route.en.json?from=sierre&to=zinal")
.then((res) =>{
    console.log("Résultat : \n" + res);
}).catch((err)=>{
    console.log("Error : " + err.message);
})

module.exports = router;