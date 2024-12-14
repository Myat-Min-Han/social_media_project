import React from 'react';

import {
    Alert,
    Avatar, Box, Typography
} from '@mui/material';

import { pink } from '@mui/material/colors';;


import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import axios from '../config/axios';
import getToken from '../helpers/getToken';
import FollowButton from '../components/FollowButton';

type UserResponse = {
    _id: string,
    name: string,
    email: string,
    postIds: string[] | [],
    commentIds: string[] | [],
    postLikes: string[] | [],
    commentLikes: string[] | [],
    followers: string[] | [],
    following: string[] | [],
    notis: string[] | [],
    createdAt: string,
    updatedAt: string 
}


const fetchUser = async (url: string): Promise<UserResponse> => {
    const token = getToken();

    if(!token) {
        throw new Error("Token not found")
    };

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(response.status !== 200) {
            throw new Error("Cannot fetch user")
        }

        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Error fetching user data")
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
}

const Profile = (): React.JSX.Element => {
    const { id } = useParams();

    const { data, error, isLoading } = useSWR(`/users/${id}`, fetchUser);


    if(isLoading) {
        return <Typography>Loading...</Typography>
    }

    if(error) {
        return <Alert>Error: {error.message}</Alert>
    }

    return (
        <Box>
            <Box sx={{ bgcolor: 'banner', height: 150, borderRadius: 4}}/>
            <Box sx={{ 
                mb: 4,
                marginTop: '-60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1
            }}>

                <Avatar sx={{ width: 100, height: 100, bgcolor: pink[500]}} />

                <Box sx={{ textAlign: 'center'}}>
                    <Typography>{data?.name}</Typography>
                    <Typography sx={{ fontSize: '0.8em', color: 'text.fade'}}>{data?.email}</Typography>
                </Box>
                <FollowButton user={data!} />
            </Box>
            
        </Box>
    )
};

export default Profile;