const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "CommentLike"
    }]
}, { timestamps: true});

const Comment = new mongoose.model("Comment", CommentSchema);

module.exports = Comment;
