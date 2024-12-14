import React from 'react';

import {
    IconButton,
    ButtonGroup,
    Button
} from '@mui/material';

import {
    ChatBubbleOutline as CommentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

type itemLikesData = {
    _id: string,
    postId: string,
    userId: string,
    createdAt: string,
    updatedAt: string
}

type PostCommentButtonProps = {
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

const PostCommentButton = ({item}: PostCommentButtonProps): React.JSX.Element => {

    const navigate = useNavigate();
    return (
        <ButtonGroup sx={{ml: 3}}>
            <IconButton size='small' 
            onClick={() => navigate(`${item._id}/comments`)}
            >
                <CommentIcon 
                    fontSize='small'
                    color='info'
                />
            </IconButton>
            <Button
                sx={{ color: 'text.fade'}}
                variant="text"
                size='small'
                onClick={() => navigate(`${item._id}/comments`)}
            >
                {item.commentIds.length}
            </Button>
        </ButtonGroup>
    )
};

export default PostCommentButton