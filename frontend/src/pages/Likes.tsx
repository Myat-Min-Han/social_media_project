import React from "react";

import UserList from "../components/UserList";

import { Box, Alert } from "@mui/material";

import { useParams } from "react-router-dom";

import useSWR from "swr";

import { fetchPostLikes, fetchCommentLikes } from "../libs/fetcher";

const Likes = (): React.JSX.Element => {

    const { post_id, comment_id } = useParams();

    const { data: postLikes, isLoading, error } = useSWR(
        `/posts/${post_id}/likes`,
        fetchPostLikes
    );

    const { data: commentLikes } = useSWR(
        `/posts/${post_id}/comments/${comment_id}/likes`,
        fetchCommentLikes
    );
    
    if(error) {
        return (
            <Box>
                <Alert severity="warning">{error.message}</Alert>
            </Box>
        )
    };

    if(isLoading) {
        return (
            <Box sx={{textAlign: 'center'}}>
                Loading...
            </Box>
        )
    };

    return (
        <Box>
            <UserList title="Likes" data={comment_id ? commentLikes : postLikes }/>
        </Box>
    )
};

export default Likes;