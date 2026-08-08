const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asycHandler');


// making the register for new user

exports.register = asyncHandler(async (req,res)=>{
    const{username,email,password}=req.body;

    //validation
    if(!username||!email||!password){
        res.status(400);
        throw new Error('Please enter provide Username, Email and Password')

    }
    const userExits = await User.findOne({$or:[{email},{username}]});
    if (userExits){
        res.status(400);
        throw new Error('User with this email or username already exists');

    }
// the hash the password
    const saltRounds =10;
    const hashedPassword=await bcrypt.hash(password,saltRounds);
    const user = await User.create({
        username,email,password:hashedPassword // hashed password sav in the database

    });
    res.status(201).json({
        success:true,
        message:'User is register succefully',
        data:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    });

});

exports.login = asyncHandler(async ( req,res)=>{

    const {email,password}= req.body;
    if(!email|| !password){
        res.status(400);
        throw new Error('please provide email and password ')
    }

    const user = await User.findOne({email});
    if(!user){
        res.status(401);// unauthorized
        throw new Error('email not found or password is invalid')
    }

    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!password){
        res.status(401);
        throw new Error('Invalid Email or password')
    }
// jwt token
    const token = jwt.sign(
        {userId:user._id, email:user.email,username:user.username},//payload
        process.env.JWT_SECRET, // secret key
        {expiresIn:'7d'}  // token 7 days will expire
    );
    res.status(200).json({
        success:true,
        message:'Login successful!',
        token:token,
        data:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    });
})
