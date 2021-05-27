const { response } = require('express');
var express = require('express');

var router = express.Router();
var productHelpers= require('../helpers/product-helpers')
/* GET home page. */
router.get('/', function (req, res, next) {

  productHelpers.productDisplay().then((products)=>{
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
    img.mv('./public/product-images/'+id+'.jpg')
      res.redirect('/admin/add-product');
   
  })
});

router.get('/delete/:id',(req,res)=>{
   let productId = req.params.id
   productHelpers.toDelete(productId).then((response)=>{
     res.redirect('/admin')
   })
});

router.get('/edit/:id',(req,res)=>{
  productHelpers.getoneProduct(req.params.id).then((product)=>{
    res.render('admin/edit-product',{product,admin : true})
  })
});

router.post('/edit/:id',(req,res)=>{
  productHelpers.editProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let img= req.files.Image
      console.log(true);
    img.mv('./public/product-images/'+req.params.id+'.jpg')
    }
    
  })
})

module.exports = router;
