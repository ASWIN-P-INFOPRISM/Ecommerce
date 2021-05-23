var express = require('express');
var router = express.Router();
var productHelpers= require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  productHelpers.productDisplay().then((products)=>{
    console.log(products)
    res.render('user/view-product', { title: 'E-Commerce', products});
  });

});

module.exports = router;
