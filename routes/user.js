var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var accountHelpers = require('../helpers/account-helpers');
const { response } = require('express');

const checkLogin= (req,res,next)=>{
  if(req.session.loginStatus){
    next()
  }
  else{
    res.redirect('/login')
  }
}

/* GET users listing. */

router.get('/', function (req, res, next) {

  let user = req.session.user

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
  if(req.session.loginStatus){
    res.redirect('/')
  }
  else{
    let loginError = req.session.loginError
    res.render('user/login',{ loginError});
    req.session.loginError=false
    
  }

});


router.post('/login', (req, res) => {

  accountHelpers.ofLogin(req.body).then((response) => {
    if (response) {
      req.session.loginStatus= true
      req.session.user = response.user
      res.redirect('/')
    }
    else{
      req.session.loginStatus= false 
      req.session.loginError= "*Invalid Username or Password"
      res.redirect('/login')
    }
  })
});


router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
});



router.get('/cart/:id',checkLogin,(req,res)=>{
  let user = req.session.user
  accountHelpers.addtoCart(req.params.id,user._id).then((response)=>{
    res.redirect('/')
  })
})
 


module.exports = router;