const express = require('express');
const router = express.Router();
const verifyToken = require('../guard/auth');
const Dress= require('../models/dress');
const mongoose = require("mongoose");

router.post("/add",verifyToken,(req,res,next)=>{
 

    const newDress=new Dress({
        name:req.body.name,
        price:req.body.price,
        links:req.body.links
    })
    let alreadyExist = Dress.findOne({name:req.body.name}).exec();
    alreadyExist.then(function (doc){
        if(doc){
            return res.status(401).json({message:"nome vestito già in uso"})
        } else{
            let promise = newDress.save();
            promise.then(function (doc){
               return res.status(201).json(doc);
            });
        
            promise.catch(function (err){
                return res.status(501).json({message:'Error registering dress: ',err});
            })
        }
    })
    
});

router.get("/all",verifyToken,(req,res,next)=>{

    const allDressesPromise = Dress.find({}).exec();
    allDressesPromise.then(doc=>{
        if(doc){
            return res.status(200).json(doc);
        }
    }).catch(function (err){
        return res.status(501).json({message:'Error getting dresses: ',err});
    })

});

router.get("/:id",verifyToken,(req, res, next) => {
    console.log('ID:', req.params.id);
    const dressById = Dress.findById(req.params.id).exec();
    dressById.then(doc => {
        if(doc){
            return res.status(200).json(doc);
        } else{
            return res.status(404).json({message:"prodotto non trovato"});
        }
    }).catch(function (err){
        return res.status(501).json({message:'Errore durante il recupero del prodotto',err});
    })
});

module.exports = router;
