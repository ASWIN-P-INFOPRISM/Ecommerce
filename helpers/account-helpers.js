var db = require('../config/connection')
const objectId = require('mongodb').ObjectId
var collection=require('../config/collection-names')
const bcrypt = require('bcrypt')

module.exports={
    ofSignup : (details)=>{
        return new Promise(async(resolve,reject)=>{
            details.password = await bcrypt.hash(details.password,10)
            db.get().collection(collection.USER_DATA).insertOne(details).then((data)=>{
                
                resolve(data.ops[0])

            })
        })
    },
    ofLogin :(details)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {}
            let user= await db.get().collection(collection.USER_DATA).findOne({email : details.email})
            if(user){
                bcrypt.compare(details.password,user.password).then((status)=>{
                    if(status){
                        console.log('LOGINED ');
                        console.log( status);
                        response.user=user;
                        response.loginStatus=true
                        resolve(response)
                    }
                    else{
                        console.log('LOGIN UNSUCCESSFULL');
                        console.log( status);
                        resolve(response.loginStatus=false)
                    }
                })
            }
            else{
                console.log('LOGIN UNSUCCESSFULL');
                resolve(response.loginStatus=false)
            }
        })

    },

    addtoCart : (productId,userId)=>{
        let productObj = {
            item : objectId(productId),
            quantity : 1
        }
        return new Promise(async(resolve,reject)=>{

        let cart=await db.get().collection(collection.CART_USER).findOne({user : objectId(userId)})
            if (cart){
                let productExist = cart.products.findIndex(product => product.item==productId)
                console.log(productExist);
                if(productExist !=-1){
                db.get().collection(collection.CART_USER).updateOne({user : objectId(userId),'products.item' : objectId(productId)},{

                    $inc : {'products.$.quantity':1}

                }).then((response)=>{
                    resolve(response)
                })
            }
            else{
                db.get().collection(collection.CART_USER).updateOne({user : objectId(userId)},{

                    $push :{
                        products : productObj
                    } 

                }).then((response)=>{
                    resolve(response)
                })
            }
        }
         else{
               let userCart = {
                    user : objectId(userId),
                    products : [productObj]
                }
                db.get().collection(collection.CART_USER).insertOne(userCart).then((response)=>{
                    resolve(response)
                })
            }
            })
    },

    getCart : (userId)=>{
        return new Promise(async(resolve,reject)=>{

            let cartItems =await db.get().collection(collection.CART_USER).aggregate([
                {
                 $match : {user : objectId(userId)}
                },
                {
                    $unwind : '$products'
                    
                },
                {
                    $project : {
                        item : '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                   $lookup : {
                       from : collection.PRODUCT,
                       localField : 'item',
                       foreignField :'_id',
                       as : 'product'
                   }
                },
                // lookup returns as an array into 'product' and in the next $project we convert it into an object 
                // {
                //     $project : {
                // converting to object
                //         item : 1, quantity: 1, product :{$arrayElemAt:['$product',0]}
                //     }
                // }
             ]).toArray()
             resolve(cartItems)
        })
        
    },

    getCartCount : (userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count = 0
            let cart = await db.get().collection(collection.CART_USER).findOne({user : objectId(userId)})
            if(cart){
                count= cart.products.length
            }
            resolve(count)
        })
    },

    changeQuantity : (productDetails)=>{
        productDetails.quantity = parseInt(productDetails.quantity)
       productDetails.changeCount= parseInt(productDetails.changeCount)
        return new Promise((resolve,reject)=>{
            if(productDetails.changeCount==-1 && productDetails.quantity==1){

                db.get().collection(collection.CART_USER).updateOne({_id:objectId(productDetails.cartId)},{
                    $pull : {products : {item : objectId(productDetails.productId)}}
                }).then((response)=>{
                    resolve({removeProduct : true})
                })
            }
            else{
                db.get().collection(collection.CART_USER).updateOne({_id:objectId(productDetails.cartId),'products.item' : objectId(productDetails.productId)},{

                    $inc : {'products.$.quantity': productDetails.changeCount}
                }).then((response)=>{
                    resolve({status : true})
                })
            }
            
        })
        
    },

    removeProduct : (productDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_USER).updateOne({_id:objectId(productDetails.cartId)},{
                $pull : {products : {item : objectId(productDetails.productId)}}
            }).then((response)=>{
                resolve(response)
            })
        })
     
    },

    placeOrder : (userId)=>{
        return new Promise(async(resolve,reject)=>{
            let total =await db.get().collection(collection.CART_USER).aggregate([
                {
                 $match : {user : objectId(userId)}
                },
                {
                    $unwind : '$products'
                    
                },
                {
                    $project : {
                        item : '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                   $lookup : {
                       from : collection.PRODUCT,
                       localField : 'item',
                       foreignField :'_id',
                       as : 'product'
                   }
                },
               
                {
                    $project : {
                        item : 1, quantity: 1, product :{$arrayElemAt:['$product',0]}
                    }
                },
                {
                    
                    $group : {
                        _id : null,
                        total : {$sum : {$multiply:['$quantity','$product.price']}}
                    }
                }
             ]).toArray()
             resolve(total[0].total);

        })
    },

    getCartProductList : (userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cart = await db.get().collection(collection.CART_USER).findOne({user : objectId(userId)})
            resolve(cart.products)
        })
    },

    orderPlaced : (order,products,total)=>{
        return new Promise((resolve,reject)=>{
            let status = (order.paymentMethod==='COD')?'placed':'pending'
            let orderDetails = { 
                user : order.userId,
                deliveryDetails : {
                    address : order.address,
                    pincode : order.pincode,
                    mobile : order.mobile
                },
                paymentMethod : order.paymentMethod,
                status : status,
                products : products,
                totalAmount : total,
                date : new Date()
            }
            db.get().collection(collection.ORDER).insertOne(orderDetails).then(async(response)=>{
                await db.get().collection(collection.CART_USER).removeOne({user : objectId(order.userId)})
                resolve()
            })
        })
    },

    yourOrders : (userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER).find().toArray().then((response)=>{
                resolve(response)
            })
        })
       
    },

    yourOrderProducts : (orderId)=>{
        return new Promise(async(resolve,reject)=>{
            let products =await db.get().collection(collection.ORDER).aggregate([
                {
                 $match : {_id : objectId(orderId)}
                },
                {
                    $unwind : '$products'
                    
                },
                {
                    $project : {
                        item : '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                   $lookup : {
                       from : collection.PRODUCT,
                       localField : 'item',
                       foreignField :'_id',
                       as : 'product'
                   }
                },
               
                {
                    $project : {
                        item : 1, quantity: 1, product :{$arrayElemAt:['$product',0]}
                    }
                }
            ]).toArray()
            resolve(products)
    })
    }

}