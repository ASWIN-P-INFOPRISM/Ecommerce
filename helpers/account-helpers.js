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
        return new Promise(async(resolve,reject)=>{

        let cart=await db.get().collection(collection.CART_USER).findOne({user : objectId(userId)})
            if (cart){
                db.get().collection(collection.CART_USER).updateOne({user : objectId(userId)},{
                    $push : {
                        products : objectId(productId)
                    } 
                }).then((response)=>{
                    resolve(response)
                })
            }
            else{
               let userCart = {
                    user : objectId(userId),
                    products : [objectId(productId)]
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
                    $lookup : {
                        from : collection.PRODUCT,
                        let : {productList : '$products'},
                        pipeline : [
                            {
                                $match : {
                                    $expr : {
                                        $in : ['$_id','$$productList']
                                    }
                                }
                            }
                        ],
                        as : 'cartItems'
                    }
                }
             ]).toArray()
             resolve(cartItems[0].cartItems)
        })
        
    }
}