const express = require('express');
const postController = require('../controller/postController');
const router = express.Router();
const { auth, isOwner } = require('../middleware/auth')

// api/posts

router.get('', postController.getPosts);
router.get("/following", auth, postController.followUserPosts)
router.get('/:post_id', postController.singlePost)
router.post('', auth, postController.createPost);
router.delete('/:post_id', auth, isOwner("post"), postController.deletePost);
router.get('/:post_id', auth, postController.getPostToUpdate)
router.patch('/:post_id', auth, isOwner("post"), postController.updatePost );

router.post('/:post_id/like', auth, postController.createPostLike);
router.delete('/:post_id/unlike', auth, postController.deletePostLike);
router.get('/:post_id/likes', postController.getPostLike);

module.exports = { postRouter: router}