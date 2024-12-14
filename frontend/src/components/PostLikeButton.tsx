import {
    IconButton,
    ButtonGroup,
    Button
} from '@mui/material';

import {
    Favorite as LikedIcon,
    FavoriteBorder as LikeIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/ThemedApp';

import useSWRMutation from 'swr/mutation';
import React, { useState } from 'react';
import { postPostLike, deletePostLike } from "../libs/fetcher"
type itemLikesData = {
    _id: string,
    postId: string,
    userId: string,
    createdAt: string,
    updatedAt: string
}

type LikeButtonProps = {
    item: {
        _id: string,
        content: string,
        userId: {
            _id: string,
            name: string
        },
        commentIds: string[] | [],
        likes: itemLikesData[] | [],
        createdAt: string,
        updatedAt: string
    }
}

const PostLikeButton = ({item}: LikeButtonProps): React.JSX.Element => {
    const navigate = useNavigate();
    const {auth} = useApp();
    
    const [isLiked, setIsLiked ] = useState<boolean>((): boolean => {
        if(!auth) return false;
        if(!item.likes) return false;

        return item.likes.some(like => like.userId === auth._id);
    });

    const [likesCount, setLikesCount] = useState<number>(item.likes ? item.likes.length : 0);

    const { trigger: likePost} = useSWRMutation(
        `/posts/${item._id}/like`,
        postPostLike,
        {
            onSuccess: () => {
                setIsLiked(true);
                setLikesCount(prevCount => prevCount + 1);
            },
            onError: (error) => {
                console.error('Failed to like the post', error)
            }
        }
    );

    const { trigger: unlikePost} = useSWRMutation(
        `/posts/${item._id}/unlike`,
        deletePostLike,
            {
                onSuccess: () => {
                    
                    setIsLiked(false);
                    setLikesCount(prevCount => prevCount - 1);
                },
                onError: (error) => {
                    console.error('Failed to unlike the post', error);
                }
            }
    );

    return (
        <ButtonGroup>
            {
                isLiked ? (
                    <IconButton
                        size='small'
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            unlikePost();
                            e.stopPropagation();
                        }}
                    >
                        <LikedIcon 
                            color="error"
                            fontSize="small"
                        />
                    </IconButton>
                ) : (
                    <IconButton 
                        size='small'
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            likePost();
                            e.stopPropagation()
                        }}
                    >
                        <LikeIcon 
                            color="error"
                            fontSize='small'
                        />
                    </IconButton>
                )
            }
            <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    navigate(`${item._id}/likes`);
                    e.stopPropagation();
                }}
                sx={{
                    color: "text.fade"
                }}
                variant='text'
                size='small'
            >
                {likesCount}
            </Button>
        </ButtonGroup>
    )
};

export default PostLikeButton;