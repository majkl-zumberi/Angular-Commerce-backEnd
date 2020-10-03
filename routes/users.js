const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const verifyToken = require('../guard/auth');
/* GET users listing. */
router.post("/signUp",function (req,res,next){
    var user= new User({
        email:req.body.email,
        username:req.body.username,
        password:User.hashPassword(req.body.password),
        creation_dt:Date.now()
    });
    let alreadyExist = User.findOne({email:req.body.email}).exec();
    alreadyExist.then(function (doc){
        if(doc){
            return res.status(401).json({message:"email già in uso"})
        } else{
            let promise = user.save();
            promise.then(function (doc){
                let token = jwt.sign({username:doc.username,email:doc.email,id:doc._id},'MAJKLzumberi-JWT-NodeJ-API-KEY',{expiresIn: '3h'});
                return res.status(200).json({token:token});
            });
        
            promise.catch(function (err){
                return res.status(501).json({message:'Error registering user: ',err});
            })
        }
    })
   
})
router.post("/signIn",function (req,res,next){
    let promise = User.findOne({email:req.body.email}).exec();
    promise.then(function (doc){
        if(doc){
            if(doc.isValid(req.body.password)){
                //generate token
                let token = jwt.sign({username:doc.username,email:doc.email,id:doc._id},'MAJKLzumberi-JWT-NodeJ-API-KEY',{expiresIn: '3h'});
                return res.status(200).json({token:token});
            } else{
                return res.status(501).json({message:'Credenziali invalide'});
            }
        }
        else{
            return res.status(501).json({message:"email non trovata"});
        }
    });
    promise.catch(function (err){
        return res.status(501).json({message:"server internal error occoured"})
    })
})
/*router.get("/username",verifyToken,function (req,res,next){
    return res.status(200).json(decodedToken.username);
})*/

router.patch("/:id",verifyToken,(req,res,next)=>{
    console.log('ID:', req.params.id);
    console.log("sei nella patch");
    console.log(req.body);
    let promise=User.updateOne({ _id:req.params.id },
        {
            lastName: req.body.userData.lastName,
            firstName: req.body.userData.firstName,
            phone: req.body.userData.phone,
            city: req.body.userData.city,
            cap: req.body.userData.cap,
            address: req.body.userData.address,
            houseNumber: req.body.userData.houseNumber,
            courier: req.body.userData.courier,
            cardNumber: req.body.userData.cardNumber,
            cardType: req.body.userData.cardType,
            paymentMethod: req.body.userData.paymentMethod,
            cvv: req.body.userData.cvv,
        }).exec();
    promise.then(doc=>{
        console.log(doc);
        if(doc){
            return res.status(200).json({doc});
        } else {
            return res.status(404).json({message:'id utente non trovata'});
        }
    }).catch(err=> {
        return res.status(501).json({message: err});
    });
});

router.get("/:id",verifyToken,(req,res,next)=>{
    console.log('ID:', req.params.id);
    let promise= User.findById(req.params.id).exec();
    promise.then(doc=>{
        if(doc){
            const {lastName,
                firstName,
                phone, city, cap, address, houseNumber, courier, cardNumber, cardType, paymentMethod, cvv}=doc;
            return res.status(200).json({lastName,
                firstName,
                phone,
                city,
                cap,
                address,
                houseNumber,
                courier,
                cardNumber,
                cardType,
                paymentMethod,
                cvv});
        } else {
            res.status(404).json("utente non trovato");
        }
    }).catch(err=>{
       res.status(501).json(err);
    });
});

module.exports = router;
