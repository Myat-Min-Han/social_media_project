import React, {useRef} from "react";

import {
    Box,
    Button,
    TextField,
    Alert,
    CircularProgress
} from '@mui/material';

import Comment from "../components/Comment";

import axios from '../config/axios';
import useSWRMutation from "swr/mutation";
import { useParams } from "react-router-dom";
import getToken from "../helpers/getToken";
import useSWR from "swr";
import { useApp } from "../context/ThemedApp";

type commentLikesData = {
    _id: string,
    commentId: string,
    userId: string,
    createdAt: string,
    updatedAt: string
}

type CommentResponse = {
    _id: string,
    content: string,
    userId: {
        _id: string,
        name: string,
        email: string
    }
    postId: string,
    likes: commentLikesData[] | []
    createdAt: string,
    updatedAt: string
};

const createComment = async (url: string, { arg }: { arg: string}): Promise<CommentResponse> => {
    try {
        const token = getToken()
        const response = await axios.post(url, { content: arg }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return  response.data
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Cannot create the comment")
        };

        throw new Error("unexpected error occured")
    }
};

const getComments = async (url: string): Promise<CommentResponse[]> => {
    try {
        const response = await axios.get(url);
        if(response.status !== 200) throw new Error(`Unexpected status code ${response.status}`);

        return response.data;
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Cannot fetch the comments")
        };

        throw new Error('Unexpected error occured')
    }
};

const deleteComment = async (url: string, { arg }: { arg: string}): Promise<string> => {
    try {
        const token = getToken();
        await axios.delete(`${url}/${arg}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return "Comment deleted successfully"
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Error in deleting comment")
        };

        throw new Error('Unexpected error occured')
    }
};


const Comments = (): React.JSX.Element => {

    const { setGlobalMsg } = useApp()

    const { post_id } = useParams()
    const contentRef = useRef<HTMLInputElement | null>(null);

    const { data: comments, error, isLoading} = useSWR(
        `/posts/${post_id}/comments`,
        getComments
    )

    const { trigger, error: createCommentError, isMutating } = useSWRMutation(
        `/posts/${post_id}/comments`, 
        createComment
    );

    const { trigger: deleteFc , error: deleteCommentError } = useSWRMutation(
        `/posts/${post_id}/comments`,
        deleteComment
    );


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(contentRef.current) {
            const content: string = contentRef.current.value;

            try {
                const result = await trigger(content);
                console.log("Comment created successfully", result._id)
                setGlobalMsg("A comment created");
                contentRef.current.value = '';
            } catch(e) {
                console.log("Error in creating comment", (e as Error).message)
            }
            
        };
    };

    if(isLoading) {
        return <CircularProgress />
    };

    return (
        <Box>
            {createCommentError && <Alert severity="error">{createCommentError.message}</Alert>}

            {error && <Alert severity="error">{error.message}</Alert>}

            {deleteCommentError && <Alert severity="error">{deleteCommentError.message}</Alert>}

            {comments?.map(comment => {
                return <Comment 
                    key={comment._id}
                    item={comment}
                    remove={deleteFc}
                />
            })}

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: 'column', gap: 1, mt: 3}}>
                    <TextField multiline placeholder="Your Comment" inputRef={contentRef}/>
                    <Button type="submit" variant="contained" disabled={isMutating}>
                        {isMutating ? 'Creating' : "Reply"}
                    </Button>
                </Box>
            </form>
        </Box>
    )
};

export default Comments;