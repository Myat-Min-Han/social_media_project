import React, { SetStateAction } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

import { useParams } from 'react-router-dom';
import { useApp } from '../context/ThemedApp'

type DeleteAlertType = {
    open: boolean,
    setOpen: React.Dispatch<SetStateAction<boolean>>,
    item: {
        _id: string;
        content: string;
        userId: {
            _id: string;
            name: string;
        };
        commentIds: string[] | [];
        likes: {
            _id: string,
            postId: string,
            userId: string,
            createdAt: string,
            updatedAt: string
        }[] | [],
        createdAt: string;
        updatedAt: string;
    } | {
        _id: string, 
        content: string,
        userId: {
            _id: string,
            name: string,
            email: string
        }
        postId: string,
        likes: {
            _id: string,
            commentId: string,
            userId: string,
            createdAt: string,
            updatedAt: string
        }[] | [],
        createdAt: string,
        updatedAt: string,
    }
    remove: (_id: string) => void
}

const DeleteAlert = ({open, setOpen, item, remove}: DeleteAlertType): React.JSX.Element => {
    const { comment_id } = useParams();

    const { setGlobalMsg } = useApp()
    return (
        <Dialog
            open={open}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
        >
            <DialogTitle>
                "Confirm Delete"
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {comment_id 
                        ? "Are you sure you want to delete this comment"
                        : "Are you sure you want to delete this post"
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} sx={{color: 'white'}}>Cancel</Button>
                <Button 
                    onClick={e => {
                        remove(item._id);
                        setGlobalMsg(comment_id ? "A comment is deleted" : "A post is deleted")
                        setOpen(false);
                        e.stopPropagation()
                    }}
                    color='error'
                    variant='contained'
                >Delete</Button>
            </DialogActions>
        </Dialog>
    )
};

export default DeleteAlert