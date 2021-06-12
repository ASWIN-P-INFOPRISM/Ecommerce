var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
var accountHelpers = require('../helpers/account-helpers');
const { response } = require('express');
const { resolve, reject } = require('promise');

const checkLogin= (req,res,next)=>{
  if(req.session.userloginStatus){
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
   productHelpers.productDisplay().then((products) => {
    res.render('user/view-product', { title: user.name, products,user,count });
  });
  }
  else{
    productHelpers.productDisplay().then((products) => {
      res.render('user/view-product', { title: 'E-Commerce', products});
    });
  }
  

});


router.get('/signup', (req, res) => {
  res.render('user/signup',{title: 'Sign Up'});
});


router.post('/signup', (req, res) => {

  accountHelpers.ofSignup(req.body).then((data) => {
    console.log(data)
    res.render('user/login')
  })

});


router.get('/login', (req, res) => {
  if(req.session.userloginStatus){
    res.redirect('/')
  }
  else{
    let loginError = req.session.userloginError
    res.render('user/login',{ loginError,title: 'Login'});
    req.session.userloginError=false
    
  }

});


router.post('/login', (req, res) => {

  accountHelpers.ofLogin(req.body).then((response) => {
    if (response) {
      req.session.userloginStatus= true
      req.session.user = response.user
      res.redirect('/')
    }
    else{
      req.session.userloginStatus= false 
      req.session.userloginError= "*Invalid Username or Password"
      res.redirect('/login')
    }
  })
});


router.get('/logout',(req,res)=>{
  req.session.userloginStatus=false
  req.session.user=null
  res.redirect('/') 
});



router.get('/add-to-cart/:id',(req,res)=>{
  let user = req.session.user
  accountHelpers.addtoCart(req.params.id,user._id).then((response)=>{
    console.log(response);
    res.json(response)
  })
});

router.get('/cart',checkLogin,async(req,res)=>{
  let user = req.session.user
     let products = await accountHelpers.getCart(req.session.user._id)
      let total = 0
     console.log(products);
     if(products.length>0){
      let total = await accountHelpers.placeOrder(req.session.user._id)
      res.render('user/cart',{products,user,total,title:"Your Cart"})
           
     }
     else{
      res.render('user/emptycart',{user,title:"Your Cart"})
     }
    
});

router.get('/view-product',checkLogin,(req,res)=>{
  res.redirect('/')
})

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
    res.render('user/checkout',{user,total,title : "Checkout"})
  })
 
});

router.post('/place-order',checkLogin,async(req,res)=>{
  let products = await accountHelpers.getCartProductList(req.body.userId)
  let total = await accountHelpers.placeOrder(req.body.userId)
  accountHelpers.orderPlaced(req.body,products,total).then((orderId)=>{
    if(req.body.paymentMethod === 'COD'){
      res.json({codsuccess : true})
    }
    else{
      accountHelpers.getRazorpay(orderId,total).then((order)=>{
        res.json(order);
      })
    }
   
})
});

router.post('/payment-success',(req,res)=>{
      accountHelpers.verifyPayment(req.body).then(()=>{
        console.log(req.body['order[receipt]']);
        accountHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
          res.json({status : true})
        })
      }).catch((err)=>{
        console.log(err);
        res.json({status : false})
      })
})

router.get('/order-success',checkLogin,async(req,res)=>{
  let order = await accountHelpers.yourOrders(req.session.user._id)
  res.render('user/orders',{user : req.session.user,order,title : "Your Orders"});
});

router.get('/view-your-products/:id',checkLogin,async(req,res)=>{
  let products = await accountHelpers.yourOrderProducts(req.params.id)
  res.render('user/yourProducts',{user : req.session.user,products,title : "Your Orders"})
});

router.get('/cancel/:id',checkLogin,(req,res)=>{
  productHelpers.cancelOrder(req.params.id).then(()=>{
      res.json({status : true})
  })
})
 


module.exports = router;