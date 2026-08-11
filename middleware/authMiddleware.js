const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');

// this function verify the token and user add the data in the req .user
exports.portect = asyncHandler (async(req,res,next)=>{
    let token;
    // token is authorize token available in the header or not
    if (
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.spilts(' ')[1];
        //bearer means <token> sparated out from token
        if(!token){
            res.status(401);
            throw new Error('Not authorized, no token provided');

        }
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user= decoded;
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token invalid or expired');
        }
    }
});