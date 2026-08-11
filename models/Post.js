// this is the Post code reference to User  this is the post
//model for title, content and the auther

const  mongoose  = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required: [true,'Post title is required'],
            trim:true,
            minlength:[3,'title must be 3 characters long']
        },
        content:{
            type:String,
            required:[true,'Content is required'],
            minlength:[10,'content must be at least 10 charaters long']
        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    },{
        timestamp:true
    }
)
;

module.exports =mongoose.model('Post',PostSchema);