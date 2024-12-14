
require('dotenv').config();
const express = require('express');
const app = express();
require('express-ws')(app);
const mongoose = require('mongoose');
const cors = require('cors');
const { postRouter } = require('./routes/postRouter');
const { userRouter } = require('./routes/userRouter');
const { commentRouter } = require('./routes/commentRouter');
const { notisRouter } = require('./routes/notisRouter');

const url = process.env.DATABASE_URL;

mongoose.connect(url)
    .then(() => {
        console.log("database connected")
        app.listen(8000, () => {
            console.log('Yaycha api started at 8000')
        });
    })
    .catch((e) => console.log(e));

//middleware 
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

//routes
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);
app.use('/api',commentRouter);
app.use('/api/notis', notisRouter);