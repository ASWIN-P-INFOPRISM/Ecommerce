var db = require('../config/connection')
const objectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')
var collection=require('../config/collection-names')
const { response } = require('express')

module.exports={

    ofLogin : (details)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {}
            let admin= await db.get().collection(collection.ADMIN_DATA).findOne({email : details.email})
            if(admin){
                bcrypt.compare(details.password,admin.password).then((status)=>{
                    if(status){
                        console.log('LOGINED ');
                        console.log( status);
                        response.admin=admin;
                        response.adminloginStatus=true
                        resolve(response)
                    }
                    else{
                        console.log('LOGIN UNSUCCESSFULL');
                        console.log( status);
                        resolve(response.adminloginStatus=false)
                    }
                })
            }
            else{
                console.log('LOGIN UNSUCCESSFULL');
                resolve(response.adminloginStatus=false)
            }
        })

    },

    ofSignup :(details)=>{
        return new Promise(async(resolve,reject)=>{
            details.password = await bcrypt.hash(details.password,10)
            db.get().collection(collection.ADMIN_DATA).insertOne(details).then((data)=>{
                
                resolve(data.ops[0])

            })
        })
    },

    productHelp : (product,callback)=>{
        product.price=parseInt(product.price)
        db.get().collection(collection.PRODUCT).insertOne(product).then((data)=>{

            callback(data.ops[0]._id)
        })
    },
    
    productDisplay : ()=>{
        return new Promise(async(resolve,reject)=>{

           let products = await db.get().collection(collection.PRODUCT).find().toArray()
           resolve(products)
 
        })
            
        },

        toDelete : (productId)=>{
            return new Promise((resolve,reject)=>{
                let Id = objectId(productId)
                db.get().collection(collection.PRODUCT).removeOne({_id:Id}).then((response)=>{
                    console.log(response);
                    resolve(response)
                })
            })
        },

        getoneProduct : (id)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.PRODUCT).findOne({_id : objectId(id)}).then((product)=>{
                    resolve(product)
            })
            
            })
        },

        editProduct : (id,content)=>{
                return new Promise((resolve,reject)=>{
                    content.price=parseInt(content.price)
                 db.get().collection(collection.PRODUCT).updateOne({_id : objectId(id)},{
                    $set : {
                        category : content.category,
                        name : content.name,
                        price : content.price,
                        description : content.description
                    }
                }).then((response)=>{
                    resolve()
                })

            })
        },

        allUserOrders : (userId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.ORDER).find({user : userId}).toArray().then((orders)=>{
                    resolve(orders)
                })
            })
        },

        shipping : (orderId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.ORDER).updateOne({_id : objectId(orderId)},
                {
                    $set : {
                        status : 'Shipped',
                        shippment : true
                    }
                }).then(()=>{
                    db.get().collection(collection.ORDER).findOne({_id : objectId(orderId)}).then((response)=>{
                        resolve(response.status)
                    })
                })
            })
        },

        cancelOrder : (orderId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.ORDER).updateOne({_id : objectId(orderId)},
                {
                    $set : {
                        status : 'Cancelled',
                        shippment : true,
                        cancelled : true
                    }
                }).then(()=>{
                    resolve()
                })
            })
        }
    }
