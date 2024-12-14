const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotiSchema = new Schema({
    type: {
        type: String, //like or comment noti
        required: true
    },
    content: String,
    userId: { // who like or comment
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    postId: {  //which post or which comment--> if comment, postId will be saved 
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    read: { 
        type: Boolean,
        default: false
    }
}, { timestamps: true});

const Noti = new mongoose.model("Noti", NotiSchema);

module.exports = Noti;