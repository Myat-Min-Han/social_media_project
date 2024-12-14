const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const auth = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];
    if(!token) {
        return res.status(400).json({msg: "token required"})
    };

    const user = jwt.decode(token, process.env.JWT_SECRET);//{id:..., email:...}
    if(!user) {
        return res.status(401).json({ msg: "incorrect token"})
    };

    res.locals.user = user;

    next()
};

const isOwner = (type) => {
    return async (req, res, next) => {
        const { post_id, comment_id } = req.params;
        const  { user } = res.locals;

        if(type === "post") {
            const post = await Post.findOne({_id: post_id});
            if(post.userId.toString() === user.id) return next();
        };

        if(type === "comment") {
            const comment = await Comment.findOne({_id: comment_id});
            if(comment.userId.toString() === user.id || comment.postId.userId.toString() === user.id) {
                return next();
            } 
        };

        res.status(403).json({ msg: "Unauthorized to delete"})
    };
}

module.exports = { auth, isOwner }