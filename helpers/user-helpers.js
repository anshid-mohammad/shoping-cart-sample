const collection = require('../config/collection')
var db=require('../config/connection')
const bcrypt=require('bcrypt')





module.exports = {
    dosignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            // or evide call back functionum kodukam hash functionil alengil asing await kodka 
            // aa password matoru key leek akunnnath vare w8 akan vendi ane eth use akunnath
            try {
                // Hash the password
                userData.password = await bcrypt.hash(userData.password, 10);

                // Insert user data into the collection
             db.get().collection(collection.USER_COLLECTION).insertOne(userData)
                    .then((result) => {
                        resolve(result.insertedId); // Use insertedId instead of ops[0]
                    })
                    .catch((err) => {
                        reject(err); // Reject the promise on error
                    });
            } catch (error) {
                reject(error); // Handle any errors from bcrypt
            }
        });
    },
    // logon cheyyunna full methods pass email correct ano nokunnath
    dologin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let responce={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("login success");
                        responce.user=user
                        responce.status=true
                        resolve(responce)

                    }else{
                        console.log('login failed');
                        resolve({status:false})
                    }
                })
            }else{
               resolve({status:false}) 
            }

        })

    }


};

   
