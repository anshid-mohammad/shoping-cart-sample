const db = require('../config/connection')
const collection = require('../config/collection')
const { Collection } = require('mongoose');
const { response } = require('express');
const { resource } = require('../app');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
// module.exports = {
//     doAdminSignin,  // Make sure this function is exported
//     // other functions
//   };


module.exports = {


    doAdminSignin:(adminData)=>{
        return new Promise(async (resolve, reject) => {
            adminData.password = await bcrypt.hash(adminData.password, 10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
                resolve(data.insertId)
                console.log("ftht")
            })
        })
    },
    // doAdminSignin: (adminData) => {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             console.log('err')
    //             adminData.password = await bcrypt.hash(adminData.password, 10);
    //             const result = await db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData);
    //             return result.insertedId;  // updated to use insertedId
    //         } catch (err) {
    //             throw err;  // this will reject the promise if an error occurs
    //         }
    //     })
    // },






            doAdminLogin: (adminData) => {
                return new Promise(async (resolve, reject) => {
                    let loginStatus = true
                    let response = {}
                    let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })
                    if (admin) {
                        bcrypt.compare(adminData.password, admin.password).then((status) => {
                            if (status) {
                                console.log('Login successful')
                                response.admin = admin
                                response.status = true
                                resolve(response)
                            } else {
                                console.log('Login faild')
                                resolve({ status: false })
                            }
                        });
                    } else {
                        console.log('login failed')
                        resolve({ status: false })
                    }
                })
            },
            getAllUsers: () => {
                return new Promise(async (resolve, reject) => {
                    let userData = await db.get().collection(collection.USER_COLLECTION).find().toArray()
                    resolve(userData)
                })
            },
            addUser:(userData)=>{
                return new Promise(async(resolve,reject)=>{
                    userData.password=await bcrypt.hash(userData.password,10)
                    db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                        resolve(data.insertId)
                    })
                })
               },
               
    deleteUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            // string il kedakkunna data ne object id lek matanam 
            await db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: new ObjectId(userId) });
            resolve()
        })

},
getUserDetails: (userId) => {
    return new Promise(async (resolve, reject) => {
        let userData = await db.get().collection(collection.USER_COLLECTION).find({ _id: new ObjectId(userId) }).toArray()
        resolve(userData)
    })
},

updateUser: (userId, userData) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.USER_COLLECTION)
            .updateOne({ _id: new ObjectId(userId) }, {
                $set: {
                    name: userData.name,
                    email: userData.email,
                }
            }).then((response) => {
                resolve()
            })
    })
},
getUsersByName: (searchName) => {
    return new Promise(async (resolve, reject) => {
        let usersData = await db.get().collection(collection.USER_COLLECTION)
            .find({ name: searchName })
            .toArray();
        resolve(usersData);
    })
},
}
