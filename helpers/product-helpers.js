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
        }
    }
