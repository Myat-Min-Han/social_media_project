require('dotenv').config()
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const  { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    postIds: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
        }],
    commentIds: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    postLikes: [{
        type: Schema.Types.ObjectId,
        ref: "PostLike"
    }],
    commentLikes: [{
        type: Schema.Types.ObjectId,
        ref: "CommentLike"
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    notis: [{
        type: Schema.Types.ObjectId,
        ref: "Noti"
    }]
}, {timestamps: true});

UserSchema.statics.register = async function(name, email, password) {
    let isEmailExists = await this.findOne({email});
    if(isEmailExists) {
        throw new Error("Email has already existed")
    };

    const hashPassword = await bcrypt.hash(password, 10);
    let newUser = await this.create({
        name,
        email,
        password: hashPassword
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
};

UserSchema.statics.login = async function(email, password) {
    const isUserExists = await this.findOne({email});
    if(!isUserExists) {
        throw new Error("User's email does not exist")
    };

    const isPasswordTrue = await bcrypt.compare(password, isUserExists.password);

    if(!isPasswordTrue) {
        throw new Error("Password is not valid")
    } 
    const token = jwt.sign(
        {id: isUserExists._id, email: isUserExists.email}, 
        process.env.JWT_SECRET
    );

    const { password: _, ...userWithoutPassword } = isUserExists.toObject();
    return {user: userWithoutPassword, token};
};

const User = mongoose.model('User', UserSchema);

module.exports = User;