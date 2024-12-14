const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentLikeSchema = new Schema({
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true});

const CommentLike = new mongoose.model("CommentLike", CommentLikeSchema);

module.exports = CommentLike;