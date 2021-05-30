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
                db.get().collection(collection.CART_USER).updateOne({'products.item' : objectId(productId)},{

                    $inc : {'products.$.quantity': 1}

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
                }
             ]).toArray()
             console.log(cartItems[0].product);
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
    }
}