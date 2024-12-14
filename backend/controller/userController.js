const User = require('../models/User');

const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            let newUser = await User.register(name, email, password);
            res.status(201).json(newUser)
        } catch(e) {
            res.status(400).json({ error: e.message})
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const { user, token} = await User.login(email, password);
            res.status(200).send({ user, token})
        } catch(e) {
            res.status(401).json({ error: e.message})
        }
    },

    getUsers: async (req, res) => {
        try {
            const data = await User
                .find()
                .select("-password");
                const totalUsers = await User.countDocuments();
            res.status(200).json({
                users: data,
                total: totalUsers
            })
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    },

    singleUser: async (req, res) => {
        try {
            const { user_id } = req.params;
            const user = await User.findOne({_id: user_id})
                .select("-password")
                .populate({
                    path: 'followers',
                    select: "name email"
                })
                .populate({
                    path: 'following',
                    select: "name email"
                })

            if(!user) {
                return res.status(404).json({ error: "User not found"})
            };

            // const { password, ...userWithoutPassword } = user.toObject();

            res.status(200).json(user)
        } catch(e) {
            res.status(400).json({ error: e.message})
        }
    },

    verify: async (req ,res) => {
        try {
            const { user } = res.locals;

            const isUser = await User.findById(user.id).select('-password')
            if(!isUser) {
                return res.status(404).json({error: "User not found"})
            };
        
            res.status(200).json(isUser)
        } catch(e) {
            res.status(500).json({ error: e.message})
        }
    },
    
    followUser: async (req, res) => {
        try {
            const { user_id } = req.params;
            const { user } = res.locals;

            await User.findByIdAndUpdate(
                user.id,
                {$push: { following: user_id}}
            );

            await User.findByIdAndUpdate(
                user_id,
                {$push: { followers: user.id}}
            )

            res.status(201).json(`follow the ${user_id}`)
        } catch(e) {
            res.status(400).json({error: e.message})
        }
    },

    unfollowUser: async (req, res) => {
        try {
            const { user } = res.locals;
            const { user_id }= req.params;

            await User.findByIdAndUpdate(
                user.id,
                {$pull: {following: user_id}}
            );

            await User.findByIdAndUpdate(
                user_id,
                {$pull: {followers: user.id}}
            )

            res.status(200).json({msg: `Unfollow the ${user_id}`})
        } catch(e) {
            res.status(400).json({error: e.message})
        }
    },

    searchUser: async (req, res) => {
        try {
            const { q } = req.query;

            const user = await User.find({name: q}).select("-password")

            res.status(200).json(user)
        } catch(e) {
            res.status(500).json({error: e.message})
        }
    }
};  

module.exports = userController;