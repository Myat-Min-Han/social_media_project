import React, { useState } from "react";

import { CircularProgress, Box, Button, Alert, Typography } from '@mui/material';

import Item from "../components/Item";
import Form from "../components/Form";

import { useApp } from "../context/ThemedApp";

import useSWR, {mutate} from "swr";
import axios from "../config/axios";
import getToken from "../helpers/getToken";
import { fetchFollowingPosts } from "../libs/fetcher";
import useSWRMutation from "swr/mutation";

type itemLikesData = {
    _id: string,
    postId: string,
    userId: string,
    createdAt: string,
    updatedAt: string
}

type Post = {
    _id: string,
    content: string,
    userId: {
        _id: string,
        name: string
    },
    commentIds: string[],
    likes: itemLikesData[] | [],
    createdAt: string,
    updatedAt: string
}

const fetchPosts = async (url: string): Promise<Post[]> => {
    try {
        const response = await axios.get(url);

        if(response.status !== 200) {
            throw new Error("Cannot fetch posts")
        };
        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Error fetching posts data")
        };

        throw new Error("Unexpected error occured")
    }
}   

const Home = (): React.JSX.Element => {

    const { showForm, setGlobalMsg, auth } = useApp();
    const [ showLatest, setShowLatest ] = useState(true)

    //fetch posts latest
    const { data: posts, error, isLoading } = useSWR(
        '/posts',
        fetchPosts
    );

    //fetch posts following
    const { trigger, data, error: fetchFollowingPostsError } = useSWRMutation(
        '/posts/following',
        fetchFollowingPosts
    )

    //remove function 
    const remove = async (post_id: string): Promise<void> => {
        try {
            const token = getToken();

            if(!token) {
                throw new Error("Token is missing");
            };

            const response = await axios.delete(`/posts/${post_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 200) {
                mutate('/posts', (posts || []).filter((post: Post) => post._id !== post_id), false);
            }
            
            setGlobalMsg("A post is deleted")
        } catch(error) {
            console.error("Error removing post:", (error as Error).message);
            setGlobalMsg("Failed to delete post")
        }
    }

    //add new post function 
    const add = async (content: string): Promise<void> => {
        try {
            const token = getToken();

            if(!token) {
                throw new Error("Token is missing");
            };

            const response = await axios.post('/posts', {content}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 201) {
                mutate('/posts', [response.data, ...(posts || [])], false);
            };

            setGlobalMsg("A post is added")
        } catch(error) {
            console.error("Error adding post:", (error as Error).message);
            setGlobalMsg("Failed to add post");
        }
    }

    return (
        <Box>
                {showForm && auth && <Form add={add}/>}

                {auth && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 1
                    }}>
                        <Button
                            disabled={showLatest}
                            onClick={() => setShowLatest(true)}
                        >
                            Latest
                        </Button>
                        <Typography sx={{ color: "terxt.fade", fontSize: 15}}> 
                            | 
                        </Typography>
                        <Button
                            disabled={!showLatest}
                            onClick={async () => {
                                setShowLatest(false)
                                await trigger()
                            }}
                        >
                            Following
                        </Button>
                    </Box>
                )}

                {showLatest ? posts?.map((post: Post) => (
                    <Item 
                    key={post._id}
                    item={post}
                    remove={remove}
                    />
                )): data?.map((item: Post) => (
                    <Item 
                    key={item._id}
                    item={item}
                    remove={remove}
                    />
                ))}

                {isLoading && <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>}

                {error && <Alert severity="error">{error.message}</Alert>}
                {fetchFollowingPostsError && <Alert severity="error">
                    {fetchFollowingPostsError.message}
                </Alert>}
        </Box>
    )
};

export default Home;
