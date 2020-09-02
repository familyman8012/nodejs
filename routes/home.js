var express = require('express');
var router = express.Router();
router.get('/', function(req,res){
    res.redirect('/contacts')
})

module.exports = router;