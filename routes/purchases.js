const express = require('express');
const router = express.Router();
const verifyToken = require('../guard/auth');
const Dress= require('../models/dress');
const User = require('../models/user');
const Purchase= require('../models/purchases');
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
router.post("/add/:id",verifyToken,(req,res,next)=>{
   console.log(req.body.cart);
   /*let purchases=[];
   req.body.cart.forEach(purchase=>{
       purchases.push({...purchase,prodotto:purchase.prodotto._id})
       const purchaseToSave= new Purchase({...purchase,prodotto:purchase.prodotto._id, userId:req.params.id});
       let promise=purchaseToSave.save();
       promise.then(doc=>{
           if(!doc){
               res.status(500).json("errore durante l'inserimento dell\' acquisto");
           }
       }).catch(err=>{
           res.status(501).json(err);
       })
   });
   res.status(200).json({message: "aggiunto con successo"});*/
    const purchase= new Purchase({
        cart:req.body.cart,
        userId:req.params.id
    });
    let promise=purchase.save();
    promise.then(doc=>{
        if(!doc){
            res.status(500).json("errore durante l'inserimento dell\' acquisto");
        } else{
            res.status(200).json(doc);
            const user = User.findById(doc.userId).exec();
            user.then(Userdoc => {
                if(Userdoc){
                    main(Userdoc.email, doc);
                } else{
                    console.log('utente non trovato');
                }
            }).catch(function (err){
                console.log(err);
            })

        }
    }).catch(err=>{
        res.status(501).json(err);
    })

});

module.exports = router;
 function main(email, content) {
    let transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: 'mailtrapUserHere',
            pass: 'mailtrapPassHere'
        }
    });
    let custom='';
    content.cart.forEach(product=>{
        custom+=`<h1>${product.prodotto[0].name}</h1> <br>
                 <p>prezzo : ${product.prodotto[0].price}</p> <br>
                 <p>tipo: ${product.dressType}</p> <br>
                 <p>colore: ${product.productColor}</p> <br>
                 <p>testo personalizzato: ${product.customText}</p> <br><br>`;
    });
    const message = {
        from: 'payments@lillo.it', // Sender address
        to: email,         // List of recipients
        subject: 'Il tuo ordine sta per Arrivare!', // Subject line
        html: custom // Plain text body
    };
    transport.sendMail(message, function(err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}
