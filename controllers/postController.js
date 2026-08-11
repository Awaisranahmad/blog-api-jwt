const Post = require('../models/Post');
const asyncHandler =require('../utils/asycHandler');

// get api/post get all posts
exports.getAllPosts= asyncHandler(async(req,res,next)=>{
    // populate('author', 'username email')  for this only username and password will fetch,
    // not the password fetch
    const posts = (await Post.find().populate('author','username email')).toSorted({createdAt:-1});
    res.status(200).json({
        success:true,
        count:Post.length,
        data:posts
    });

});

exports.getPostById= asyncHandler(async(req,res)=>{
    const post = await Post.findById(req.params.id).populate('author','username email');
    if(!post){
        res.status(404);
        throw new Error('Post not found with this ID');
    }
    res.status(200).json({
        success:true,
        data:post
    });
})