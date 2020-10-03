var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var schema = new Schema({
    email : { type:String, require:true},
    username: {type:String, require: false},
    password: {type:String,require:true},
    creation_dt:{type:Date,require:true},
    lastName:{type:String,require:false},
    firstName:{type:String,require:false},
    phone:{type:String,require:false},
    city:{type:String,require:false},
    cap:{type:String,require:false},
    address:{type:String,require:false},
    houseNumber:{type:String,require:false},
    courier:{type:String,require:false},
    cardNumber:{type:String,require:false},
    cardType:{type:String,require:false},
    paymentMethod:{type:String,require:false},
    cvv:{type:String,require:false}
});

schema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

schema.methods.isValid = function (hashedPassword){
    return bcrypt.compareSync(hashedPassword,this.password)
}

module.exports = mongoose.model('User',schema);
