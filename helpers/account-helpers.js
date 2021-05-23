var db = require('../config/connection')
var collection=require('../config/collection-names')


module.exports={
    ofLogin : (details)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_DATA).insertOne(details)
        })
    }
}