var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var accountHelpers = require('../helpers/account-helpers')
/* GET users listing. */
router.get('/', function (req, res, next) {

  productHelpers.productDisplay().then((products) => {
    console.log(products)
    res.render('user/view-product', { title: 'E-Commerce', products });
  });

});


router.get('/signup', (req, res) => {
  res.render('user/signup');
});

router.post('/signup', (req, res) => {

  accountHelpers.ofSignup(req.body).then((data) => {
    console.log(data)
    res.render('user/login')
  })

})





router.get('/login', (req, res) => {
  res.render('user/login');
});

router.post('/login', (req, res) => {

  accountHelpers.ofLogin(req.body);

});

module.exports = router;
