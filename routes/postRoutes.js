const express  = require('express');
const router = express.Router();

const {getAllPosts,getPostById}=require('../controllers/postController');

//public routes not require any auth for that posts

router.get('/',getAllPosts);
router.get('/:id',getPostById);
module.exports= router;