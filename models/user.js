const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,'username is required'],
            unique:true,
            trim: true,
            minlength: [3,'at least 3 characters']
        },
        email:{
            type:String,
            required:[true,'email must be required'],
            unique:true,
            lowercase:true,
            trim:true,
            match:[/^\S+@\S+\.\S+$/,'please provide a valid email']
        },
        password:{
            type:String,
            required:[true,'password is required'],
            minlength:[6,'at least three charactors'],

        }
    },{timestamps:true}
);

module.exports=mongoose.model('User',UserSchema);