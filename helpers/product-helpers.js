var db = require('../config/connection')
const objectId = require('mongodb').ObjectId
var collection=require('../config/collection-names')
const { response } = require('express')

module.exports={
    productHelp : (product,callback)=>{
        db.get().collection(collection.PRODUCT).insertOne(product).then((data)=>{
            console.log(data)
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
        }
    }
