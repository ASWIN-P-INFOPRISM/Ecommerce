var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var accountHelpers = require('../helpers/account-helpers');
const { response } = require('express');
const { resolve, reject } = require('promise');

const checkLogin= (req,res,next)=>{
  if(req.session.loginStatus){
    next()
  }
  else{
    res.redirect('/login')
  }
}

/* GET users listing. */

router.get('/',async function (req, res, next) {

  let user = req.session.user
  let count = null
  if(user){
   count = await accountHelpers.getCartCount(user._id)
  }
  productHelpers.productDisplay().then((products) => {
    res.render('user/view-product', { title: 'E-Commerce', products,user,count });
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



router.get('/add-to-cart/:id',(req,res)=>{
  let user = req.session.user
  accountHelpers.addtoCart(req.params.id,user._id).then((response)=>{
    res.json({status : true})
  })
});

router.get('/cart',checkLogin,async(req,res)=>{
  let user = req.session.user
     let products = await accountHelpers.getCart(req.session.user._id)
     let total = await accountHelpers.placeOrder(req.session.user._id)
     res.render('user/cart',{products,user,total})
});

router.post('/change-quantity',(req,res)=>{
  accountHelpers.changeQuantity(req.body).then(async(response)=>{
    response.total = await accountHelpers.placeOrder(req.body.userId)
    res.json(response)
  })
});

router.post('/remove-product',(req,res)=>{
  accountHelpers.removeProduct(req.body).then((response)=>{
        res.json(response)
  })
});

router.get('/place-order',checkLogin,(req,res)=>{
  let user = req.session.user
  accountHelpers.placeOrder(user._id).then((total)=>{
    res.render('user/checkout',{user,total})
  })
 
})
 


module.exports = router;