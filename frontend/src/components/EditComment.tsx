import React, { useState, useEffect } from "react";

import {
    TextField,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Alert,
    Button
} from '@mui/material';

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import axios from '../config/axios';
import getToken from "../helpers/getToken";

type CommentResponse = {
    _id: string,
    content: string
}

const getCommentToUpdate = async (url: string): Promise<CommentResponse> => {
    try {
        const token = getToken();
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Cannot fetch the comment")
        };

        throw new Error("Unexpected error occured")
    }
};

const updateComment = async (url: string, { arg }: { arg: string}): Promise<any> => {
    try {
        const token = getToken();
        const response = await axios.patch(url, { content: arg}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data
    } catch(error) {
        if(axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Cannot update the comment")
        };

        throw new Error("Unexpected error occured")
    }
}

const EditComment = (): React.JSX.Element => {
    const { comment_id, post_id} = useParams();
    const navigate = useNavigate();
    const [ open, setOpen ] = useState<boolean>(true);
    const [ comment, setComment ] = useState<string>('');

    const { data, error } = useSWR(
        `/posts/${post_id}/comments/${comment_id}`,
        getCommentToUpdate
    );

    const { trigger, error: updateCommentError } = useSWRMutation(
        `/posts/${post_id}/comments/${comment_id}`,
        updateComment
    )

    useEffect(() => {
        if(data) setComment(data.content)
    }, [data])

    if(error) {
        return <Alert severity="error">{error.message}</Alert>
    };

    if(updateCommentError) {
        return <Alert severity="error">{updateCommentError.message}</Alert>
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
                        const result = await trigger(comment);
                        console.log("Updated the comment", result._id);
                        setOpen(false);
                        navigate(-1);
                    } catch(e) {
                        console.log("Error in updating the comment", (e as Error).message)
                    }
                }
            }}
        >
            <DialogTitle>Edit the comment</DialogTitle>
            <DialogContent>
                <TextField
                fullWidth
                required
                multiline
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
                value={comment}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setOpen(false);
                    navigate(-1)
                }}>Cancel</Button>
                <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    )
};

export default EditComment