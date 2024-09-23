// eth product or user information data base ik varan vendi
//oru product object varum oru call back object varum enn ethil


const db = require('../config/connection')
const collection = require('../config/collection')
const { Collection } = require('mongoose');
const { response } = require('express');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    addProduct: (product, callback) => {
        // console.log(product);
        // Insert the product into the 'product' collection
        db.get().collection('product').insertOne(product)
        .then((data) => {
            callback(null, data);  // Pass the result to the callback on success
        })
        .catch((err) => {
            console.error("Error inserting product:", err);
            callback(err);  // Pass the error to the callback on failure
        });
       
    },
    // getAllProducts: async () => {
    //     try {
    //         const products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
    //         return products;
    //     } catch (error) {
    //         throw new Error("Failed to retrieve products: " + error.message);
    //     }
    // }
    
    //  data base le data edukan 
     getAllproducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
     }

};
