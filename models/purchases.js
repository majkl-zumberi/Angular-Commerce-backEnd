const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Dress= require('../models/dress');
const User= require('../models/user');

var dresslinksSchema = new Schema({
    link:{type:String,require:true}
});

const dressSchema = new Schema({
    name:{type:String,require:true},
    price:{type:Number,require:true},
    links:[dresslinksSchema],
    creation_dt:{type:Date,require:true}
});

/*const purchaseSchema = new Schema({
    dressType:{type:String,require:true},
    currentImage:{type:String,require:true},
    customText:{type:String,require:false},
    productColor:{type:String,require:false},
    prodotto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dress'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});*/
const purchaseSchema = new Schema({
    dressType:{type:String,require:true},
    currentImage:{type:String,require:true},
    customText:{type:String,require:false},
    productColor:{type:String,require:false},
    prodotto:[dressSchema]
});
const purchasesSchema = new Schema({
    cart:[purchaseSchema],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

})
module.exports = mongoose.model('Purchase',purchasesSchema);
