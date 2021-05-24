var db = require('../config/connection')
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
                console.log('LOGIN UNSUCCESSFULL' + user);
                resolve(response.loginStatus=false)
            }
        })

    }
}