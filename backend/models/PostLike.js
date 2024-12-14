const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostLikeSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true});

const PostLike = new mongoose.model("PostLike", PostLikeSchema);

module.exports = PostLike;