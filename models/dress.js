const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var dresslinksSchema = new Schema({
    link:{type:String,require:true}
});

const dressSchema = new Schema({
    name:{type:String,require:true},
    price:{type:Number,require:true},
    links:[dresslinksSchema],
    creation_dt:{type:Date,require:true}
});


module.exports = mongoose.model('Dress',dressSchema);
