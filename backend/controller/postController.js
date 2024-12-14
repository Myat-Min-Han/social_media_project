const Post = require('../models/Post');
const User = require('../models/User');
const PostLike = require('../models/PostLike');
const Comment = require('../models/Comment');
const CommentLike = require('../models/CommentLike');
const notisController = require('../controller/notisController')

const postController = {
    getPosts: async (req, res) => {
        try {
            const posts = await Post
            .find()
            .sort({createdAt: -1})
            .populate({
                path: 'userId',
                select: '_id name'
            })
            .populate('likes')

            res.status(200).json(posts)
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    singlePost: async (req, res) => {
        try {   
            const { post_id } = req.params;

        const post = await Post
                    .findById(post_id)
                    .populate({
                        path: 'userId',
                        select: '_id name'
                    })
                    .populate('likes');

            res.status(200).json(post)
        } catch(e) {
            res.status(500).json({error: e.message})
        }   
    },

    createPost: async (req, res) => {
        try {
            const { content } = req.body;
            let { user } = res.locals;
            const isUserExists = await User.findOne({_id: user.id});

            if (!isUserExists) {
                return res.status(404).json({ error: "User not found" });
            };

            const newPost = await Post.create({
                content,
                userId: isUserExists._id
            })

            const populatedPost = await newPost.populate('userId', "name _id")

            isUserExists.postIds.push(newPost._id);
            await isUserExists.save();

            res.status(201).json(populatedPost)
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    },

    deletePost: async (req, res) => {
        try {
            const { post_id } = req.params;

            const deletedPost = await Post.findByIdAndDelete(post_id);

            if (!deletedPost) {
                return res.status(404).json({ msg: "Post not found" });
            };

            const comments = await Comment.find({ postId: post_id});
            const commentIds = comments.map(comment => comment._id)

            await User.updateOne(
                { _id: deletedPost.userId },
                { $pull: { 
                    postIds: post_id, 
                    postLikes: post_id,
                    commentIds: {$in: commentIds},
                    commentLikes: {$in: commentIds}
                }}
            );

            await PostLike.deleteMany({postId: post_id});
            await Comment.deleteMany({postId: post_id});
            await CommentLike.deleteMany({commentId: {$in: commentIds}});

            await notisController.deleteNoti(post_id);
            
            res.status(200).json({ msg: "Post and related data successfully deleted" })
        } catch(e) {
            res.status(500).json({ msg: "An error occured while deleting the post"})
        }
    },

    updatePost: async (req, res) => {
        try {
            const { post_id } = req.params;
            const { content } = req.body;

            const updatedPost = await Post.findByIdAndUpdate(post_id, { content }, { new: true});

            if(!updatedPost) {
                return res.status(404).json({error: "Post not found"})
            };
            
            res.status(200).json(updatedPost)
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    getPostToUpdate: async (req ,res) => {
        try {
            const { post_id } = req.params;

            const post = await Post.findOne({_id: post_id}).select("content");

            if(!post) {
                return res.status(404).json({ message: 'Post not found' });
            };

            res.status(200).json(post);
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    createPostLike: async (req, res) => {
        try {
            const { post_id } = req.params;
            const { user } = res.locals;

            const like = await PostLike.create({
                postId: post_id,
                userId: user.id
            });

            await Post.findByIdAndUpdate(
                post_id,
                {$push: {likes: like._id}}
            )

            await User.findByIdAndUpdate(
                user.id,
                {$push: {postLikes: post_id}}
            );

            await notisController.addNoti({
                type: 'like',
                content: "likes your post",
                postId: post_id,
                userId: user.id
            })

            res.status(201).json(like)
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    deletePostLike: async (req, res) => {
        try {
            const { post_id } = req.params;
            const { user } = res.locals;

            const deletedLike = await PostLike.findOneAndDelete({
                postId: post_id,
                userId: user.id
            });

            if (!deletedLike) {
                return res.status(404).json({ msg: "Like not found" });
            }

            await Post.findByIdAndUpdate(
                post_id,
                {$pull: {likes: deletedLike._id}}
            )

            await User.findByIdAndUpdate(
                user.id,
                {$pull: { postLikes: post_id}}
            );

            res.status(200).json({msg: "unlike the post"})
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    getPostLike: async (req ,res) => {
        try {
            const { post_id } = req.params;

            const data = await PostLike
                .find({postId: post_id})
                .populate({
                    path: "userId",
                    select: '-password'
                });
            res.status(200).json(data)
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    },

    followUserPosts: async (req, res) => {
        try {
            const { user } = res.locals;
            
            const followUsers = await User.find({followers: {$in: [user.id]}});

            const users = followUsers.map(item => item._id);

            const data = await Post
                .find({ userId: { $in: users}})
                .populate({
                    path: 'userId',
                    select: 'name'
                })

            res.status(200).json(data);
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    }
};

module.exports = postController;
