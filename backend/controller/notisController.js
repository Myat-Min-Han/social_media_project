const Noti = require('../models/Noti');
const Post = require('../models/Post');

const notisController = {
    getNotis: async (req, res) => {
        try {
            const { user } = res.locals;

            const usersPosts = await Post.find({userId: user.id}).select('_id');
            const usersPostsId = usersPosts.map(post => post._id);

            const notis = await Noti
                .find({
                    postId: {$in: usersPostsId},
                    read: false
                
                })
                .populate({
                    path: 'userId',
                    select: 'name email'
                })
                .sort({createdAt: -1})

            res.status(200).json(notis)
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    readNotis: async (req, res) => {
        try {
            const { user } = res.locals;

            const usersPosts = await Post.find({userId: user.id}).select('_id');
            const usersPostsId = usersPosts.map(post => post._id);

            const result = await Noti.updateMany(
                { postId: { $in: usersPostsId }}, 
                { $set: { read: true }}
            );

            res.status(200).json({
                message: "MArked all notis read",
                modifiedCount: result.modifiedCount
            })
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    readNotiWithId: async (req, res) => {
        try {
            const { id } = req.params;
            const notis = await Noti.updateOne(
                {_id: id},
                {$set: {read: true}}
            );

            res.status(200).json(notis)
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    addNoti: async ({ type, content, postId, userId }) => {
        const post = await Post.findById(postId);

        if(post.userId === userId) return false;

        return await Noti.create({
            type,
            content,
            postId,
            userId
        })
    },

    deleteNoti: async (postId) => {
        await Noti.deleteMany({postId});
        return 
    }
}; 

module.exports = notisController;