import React, { useState, useEffect } from 'react';

import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Alert
} from '@mui/material';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import axios from '../config/axios';
import { useNavigate, useParams } from 'react-router-dom';
import getToken from '../helpers/getToken';

type PostResponse = {
    id: string,
    content: string
};

const getPostToUpdate = async (url: string): Promise<PostResponse> => {
    try {
        const token = getToken();
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data
    } catch(e) {
        if(axios.isAxiosError(e)) {
            throw new Error(e.response?.data?.message || "Cannot fetch the post to update")
        };

        throw new Error("Unexpected error occured")
    }
};

const updatePost = async (url: string, { arg }: { arg: string}): Promise<any> => {
    try {
        const token = getToken();
        const response = await axios.patch(url, { content: arg }, {
            headers: {  
                Authorization: `Bearer ${token}`
            }
        });

        return response.data
    } catch(e) {
        if(axios.isAxiosError(e)) {
            throw new Error(e.response?.data?.message || "Cannot update the post")
        };

        throw new Error("Unexpected error occured")
    }
}

const EditPost = (): React.JSX.Element => {

    const { post_id } = useParams();
    const navigate = useNavigate();

    const [ open, setOpen ] = useState<boolean>(true);

    const [postContent, setPostContent] = useState<string>('');

    const { data: post, error: getPostToUpdateError } = useSWR(
        `/posts/${post_id}`,
        getPostToUpdate
    );

    const { trigger, error: updatePostError } = useSWRMutation(`/posts/${post_id}`, updatePost);

    useEffect(() => {
        if(post) setPostContent(post.content)
    }, [post]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostContent(e.target.value);
    }

    if(getPostToUpdateError) {
        return <Alert severity='error'>{getPostToUpdateError.message}</Alert>
    };

    if(updatePostError) {
        return <Alert severity='error'>{updatePostError.message}</Alert>
    };

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
                component: 'form',
                onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    try {
                        const result = await trigger(postContent);
                        console.log("Updated the post", result._id);
                        setOpen(false)
                        navigate('/')
                    } catch(err) {
                        console.log("Error in updating the post", (err as Error).message)
                    }
                }
            }}
        >
            <DialogTitle>Edit the post</DialogTitle>
            <DialogContent>
                <TextField 
                required
                multiline
                fullWidth
                variant='outlined'
                value={postContent}
                onChange={handleChange} 
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => navigate('/')}>Cancel</Button>
                <Button type="submit" variant='contained'>Save</Button>
            </DialogActions>
        </Dialog>
    )
};

export default EditPost;