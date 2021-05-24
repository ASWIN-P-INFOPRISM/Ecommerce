var express = require('express');

var router = express.Router();
var productHelpers= require('../helpers/product-helpers')
/* GET home page. */
router.get('/', function (req, res, next) {

  productHelpers.productDisplay().then((products)=>{
    console.log(products)
    res.render('admin/view-product', { title: 'E-Commerce', products, admin : true });
  });
  
  


});

router.get('/add-product',(req,res)=>{

  res.render('admin/add-product',{admin : true})
});

router.post('/add-product',(req,res)=>{
  console.log(req.body)
  productHelpers.productHelp(req.body,(id)=>{
    let img= req.files.Image
    img.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if (!err){   res.render('admin/add-product');}
      else {console.log(err);}
    })
   
  })
});

module.exports = router;
