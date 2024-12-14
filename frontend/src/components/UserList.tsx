import React from 'react';

import {
    Box,
    Typography,
    List,
    ListItem,
    Avatar,
   ListItemText,
   ListItemAvatar,
   ListItemButton,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';

type postLikesItem = {
    _id: string,
    postId: string,
    userId: {
        _id: string,
        name: string,
        email: string,
        postIds: string[] | [],
        commentIds:  string[] | [],
        postLikes:  string[] | [],
        commentLikes:  string[] | [],
        followers: string[] | [],
        following: string[] | [],
        notis: string[] | [],
        createdAt: string,
        updatedAt: string
    },
    createdAt: string,
    updatedAt: string
};

type commentLikesItem = {
    _id: string,
    commentId: string,
    userId: {
        _id: string,
        name: string,
        email: string,
        postIds: string[] | [],
        commentIds:  string[] | [],
        postLikes:  string[] | [],
        commentLikes:  string[] | [],
        followers: string[] | [],
        following: string[] | [],
        notis: string[] | [],
        createdAt: string,
        updatedAt: string
    },
    createdAt: string,
    updatedAt: string
}

type UserListProps = {
    title: string,
    data: postLikesItem[] | commentLikesItem[]
}

const UserList = ({ title, data }: UserListProps ): React.JSX.Element => {
    const navigate = useNavigate();
    return (
        <Box>
            <Typography variant='h4' sx={{ mb: 3}}>
                {title}
            </Typography>
            <List>
                {data?.map((item: postLikesItem | commentLikesItem) => {
                    return (
                        <ListItem key={item._id}
                            secondaryAction={
                                <FollowButton user={item.userId}/>
                            }
                        >
                            <ListItemButton
                                onClick={() => {
                                    navigate(`/profile/${item.userId._id}`)
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={item.userId.name}
                                    secondary={item.userId.email}
                                />
                            </ListItemButton>
                            
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )
};

export default UserList;