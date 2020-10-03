const jwt = require('jsonwebtoken');
module.exports= function verifyToken(req,res,next){
    console.log(res.getHeader("Authorization"));
    let bearerToken = req.headers.authorization;
    let token=bearerToken==null? null:bearerToken.split("bearer ")[1];
    if(token == null) {
        console.log("il token è nullo");
        return res.status(501).json({message: "a valid token must be provided"});
    }else{
        console.log("non è nullo");
        jwt.verify(token,"MAJKLzumberi-JWT-NodeJ-API-KEY",function (err,tokenData){
            if(err){
                return res.status(501).json({message: "Unauthorized request"});
            }
            if(tokenData){
                next();
            }
        })
    }

}
