const jwt= require('jsonwebtoken');
const config= require('config');

module.exports= function(req,res,next){
    const token= req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied, no token provided');

    try{
        const decoded= jwt.verify(token, config.get('private_key'));
        req.user= decoded;
        next();
    }
    catch{
        return res.status(401).send('Access denied, invalid token');
    }
}
