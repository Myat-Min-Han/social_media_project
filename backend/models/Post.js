const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userId : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    commentIds: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'PostLike'
    }],
    notis: [{
        type: Schema.Types.ObjectId,
        ref: "Noti"
    }]
}, { timestamps: true});

const Post = new mongoose.model("Post", PostSchema);

module.exports = Post;