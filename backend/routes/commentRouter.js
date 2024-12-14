const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');
const { auth, isOwner } = require('../middleware/auth')

// api
router.get('/posts/:post_id/comments', commentController.getComments);
router.post('/posts/:post_id/comments', auth, commentController.createComment);
router.delete('/posts/:post_id/comments/:comment_id', auth, isOwner("comment"), commentController.deleteComment);
router.patch('/posts/:post_id/comments/:comment_id', auth, isOwner("comment"), commentController.updateComment);
router.get('/posts/:post_id/comments/:comment_id', auth, commentController.getCommentToUpdate);

router.post('/posts/:post_id/comments/:comment_id/like', auth, commentController.createCommentLike);
router.delete('/posts/:post_id/comments/:comment_id/unlike', auth, commentController.deleteCommentLike);
router.get('/posts/:post_id/comments/:comment_id/likes', commentController.getCommentLike)

module.exports = { commentRouter: router}