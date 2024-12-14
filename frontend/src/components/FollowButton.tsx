import React, {useState} from 'react';

import {
    Button
} from '@mui/material';

import useSWRMutation from 'swr/mutation';

import { useApp } from '../context/ThemedApp';
import { postFollow, deleteFollow } from '../libs/fetcher';

type userData = {
    user: {
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
    } 
};

const FollowButton = ({ user }: userData): React.JSX.Element => {
    const { auth } = useApp();

    const [isFollowingState, setIsFollowingState] = useState<boolean>(
        user.followers.some((id: string) => id === auth?._id)
    )
    

    const { trigger: followUser } = useSWRMutation(
        `users/${user._id}/follow`,
        postFollow,
        {    
            onError: (error) => {
                console.log(error.message)
            },
            
        }
    );

    const { trigger: unfollowUser } = useSWRMutation(
        `users/${user._id}/unfollow`,
        deleteFollow,
        {
            onError: (error) => {
                console.log(error.message)
            },
        }
    );

    if(!auth) return <></>;

    return auth._id === user._id ? (
        <></>
    ) : (
        <Button
            size='small'
            variant={isFollowingState ? "outlined" : "contained"}
            onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                if (isFollowingState) {
                    await unfollowUser();
                    setIsFollowingState(false)
                } else {
                    await followUser();
                    setIsFollowingState(true)
                }
                e.stopPropagation();
            }} 
        >
            {isFollowingState ? "Following" : "Follow"}
        </Button>
    )
};

export default  FollowButton;
