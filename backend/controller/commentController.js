const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');
const CommentLike = require('../models/CommentLike');
const notisController = require('../controller/notisController')

const commentController = {
    getComments: async (req, res) => {
        try {
            const { post_id } = req.params;

            const comments = await Comment
                .find({ postId: post_id})
                .sort({ createdAt: -1})
                .populate('likes')
                .populate({
                    path: 'userId',
                    select: 'name email'
                })
            res.status(200).json(comments)
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    createComment: async (req, res) => {
        try {
            const { content } = req.body;
            const { post_id } = req.params;
            const { user } = res.locals;

            const newComment = await Comment.create({
                content,
                userId: user.id,
                postId: post_id
            });

            await User.findByIdAndUpdate(
                user.id,
                {$push: {commentIds: newComment._id}}
            );

            await Post.findByIdAndUpdate(
                post_id,
                {$push: {commentIds: newComment._id}}
            );

            await notisController.addNoti({
                type: 'comment',
                content: 'reply your post',
                postId: post_id,
                userId: user.id
            })

            res.status(201).json(newComment)

        } catch(e) {
            res.status(500).json({error: e.message });
        }
    },

    deleteComment: async (req, res) => {
        try {
            const { comment_id, post_id} = req.params;

            const deletedComment = await Comment.findByIdAndDelete(comment_id);

            if(!deletedComment) {
                return res.status(404).json({ error: "Comment not found"})
            };

            await User.findByIdAndUpdate(
                deletedComment.userId,
                { $pull: { commentIds: comment_id}}
            );

            await Post.findByIdAndUpdate(
                deletedComment.postId,
                {$pull: { commentIds: comment_id}}
            )

            await CommentLike.deleteMany({commentId: comment_id});

            await notisController.deleteNoti(post_id)

            res.status(200).json({msg: "Comment deleted successfully"})
        } catch(e) {
            res.status(500).json({error: e.message});
        }
    },

    updateComment: async (req, res) => {
        try {
            const { content } = req.body;
            const { comment_id } = req.params;

            const updatedComment = await Comment.findByIdAndUpdate(comment_id, { content }, { new: true});

            if(!updatedComment) {
                return res.status(404).json({error: "Comment not found"});
            };

            res.status(200).json(updatedComment)
        } catch(e) {
            res.status(500).json({ error: e.message})
        }
    },

    getCommentToUpdate: async (req, res) => {
        try {
            const { comment_id } = req.params;

            const comment = await Comment.findOne({_id: comment_id}).select('content');

            if(!comment) {
                return res.status(404).json({error: "Comment not found"})
            };

            res.status(200).json(comment)
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    createCommentLike: async (req, res) => {
        try {
            const { comment_id, post_id } = req.params;
            const { user } = res.locals;

            const like = await CommentLike.create({
                commentId: comment_id,
                userId: user.id
            });

            await User.findByIdAndUpdate(
                user.id,
                {$push: {commentLikes: comment_id}}
            );

            await Comment.findByIdAndUpdate(
                comment_id,
                {$push: {likes: like._id}}
            )

            await notisController.addNoti({
                type: "like",
                content: 'likes your comment',
                postId: post_id,
                userId: user.id
            });
            
            res.status(201).json(like)
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    deleteCommentLike: async (req, res) => {
        try {
            const { comment_id } = req.params;
            const { user } = res.locals;

            const deletedLike = await CommentLike.findOneAndDelete({
                commentId: comment_id,
                userId: user.id
            });

            if(!deletedLike) {
                return res.status(404).json({error: "Comment not found"})
            };

            await User.findByIdAndUpdate(
                user.id,
                {$pull: {commentLikes: comment_id}}
            );

            await Comment.findByIdAndUpdate(
                comment_id,
                {$pull: { likes: deletedLike._id}}
            )

            res.status(200).json({msg: "unlike the comment"})
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },
    
    getCommentLike: async (req ,res) => {
        try {
            const { comment_id } = req.params;

            const data = await CommentLike
            .find({commentId: comment_id})
            .populate({
                path: "userId",
                select: '-password'
            });

            res.status(200).json(data)
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    }
};

module.exports = commentController