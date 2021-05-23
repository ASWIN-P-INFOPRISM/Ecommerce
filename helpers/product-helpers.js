var db = require('../config/connection')

module.exports={
    productHelp : (product,callback)=>{
        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data)
            callback(data.ops[0]._id)
        })
    }
}