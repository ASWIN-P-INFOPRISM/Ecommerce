var db = require('../config/connection')
var collection=require('../config/collection-names')


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
            
        }
    }
