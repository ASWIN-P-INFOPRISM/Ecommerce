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


router.get('/signup',(req,res)=>{
  res.render('user/signup');
});

router.post('/signup',(req,res)=>{

  
  
})





router.get('/login',(req,res)=>{
  res.render('user/login');
});

router.post('/login',(req,res)=>{
  
})

module.exports = router;
