const express  = require('express');
const router = express.Router();
const {protect}= require('../middleware/authMiddleware')

const {getAllPosts,getPostById
    , createdPost,updatePost,deletePost 
}=require('../controllers/postController');

//public routes not require any auth for that posts

router.get('/',getAllPosts);
router.get('/:id',getPostById);

//portected routes
router.post('/',protect,createdPost);
router.put('/:id',protect,updatePost);
router.delete('/:id',protect,deletePost);



module.exports= router;