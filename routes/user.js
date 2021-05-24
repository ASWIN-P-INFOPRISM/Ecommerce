var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var accountHelpers = require('../helpers/account-helpers');
const { response } = require('express');
/* GET users listing. */
router.get('/', function (req, res, next) {

  let user = req.session.user
  console.log(user);

  productHelpers.productDisplay().then((products) => {
    res.render('user/view-product', { title: 'E-Commerce', products,user });
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

});


router.get('/login', (req, res) => {
  res.render('user/login');
});


router.post('/login', (req, res) => {

  accountHelpers.ofLogin(req.body).then((response) => {
    if (response) {
      req.session.user = response.user
      res.redirect('/')
    }
    else{
      res.redirect('/login')
    }
  })
});


router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
});



module.exports = router;
