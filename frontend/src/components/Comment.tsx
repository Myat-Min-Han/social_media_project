import React, { useState, useRef, useEffect} from "react";

import {
    Card,
    CardContent,
    Avatar,
    CardHeader,
    CardActions,
    Typography,
    IconButton,
    Button,
    Tooltip
} from '@mui/material';

import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Favorite as LikedIcon,
    FavoriteBorder as LikeIcon
} from '@mui/icons-material'

import { green, grey } from "@mui/material/colors";
import { useApp } from "../context/ThemedApp";
import useSWRMutation from "swr/mutation";

type commentLikesData = {
    _id: string,
    commentId: string,
    userId: string,
    createdAt: string,
    updatedAt: string
}

type CommentProps = {
    item: {
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
        updatedAt: string,
    },
    remove: (id: string) => void 
};

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { deleteCommentLike, postCommentLike } from "../libs/fetcher";
import DeleteAlert from "./DeleteAlert";


const Comment = ({item, remove}: CommentProps) : React.JSX.Element => {

    const [ open, setOpen ] = useState<boolean>(false);

    const { auth } = useApp();
    const navigate = useNavigate();
    const { post_id } = useParams();

    const [isLiked, setIsLiked ] = useState<boolean>(() => {
        if(!auth) return false;
        if(!item.likes) return false;

        return item.likes.some(like => like.userId === auth._id)
    });

    const mainContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
            if (mainContentRef.current) {
                if (open) {
                    mainContentRef.current.setAttribute('inert', 'true');
                } else {
                    mainContentRef.current.removeAttribute('inert');
                }
            }
    }, [open]);

    const [likesCount, setLikesCount] = useState<number>(item.likes ? item.likes.length : 0);

    const { trigger: likeComment } = useSWRMutation(
        `/posts/${post_id}/comments/${item._id}/like`,
        postCommentLike,
        {
            onSuccess: () => {
                setIsLiked(true);
                setLikesCount(prevCount => prevCount + 1);
            },
            onError: (error) => {
                console.log("failed to like the comment", error)
            }
        }
    );

    const { trigger: unLikeComment } = useSWRMutation(
        `/posts/${post_id}/comments/${item._id}/unlike`,
        deleteCommentLike,
        {
            onSuccess: () => {
                setIsLiked(false);
                setLikesCount(previous => previous - 1)
            },
            onError: () => {
                console.log("failed to unlike the post")
            }
        }
    )
    return ( 
        <>
            <div ref={mainContentRef}>
            <Card sx={{ mb: 4}}>
            <CardHeader 
                avatar={
                    <Avatar 
                        sx={{ bgcolor: grey[200]}}
                    >
                        {item.userId.name[0]}
                    </Avatar>
                }

                action={
                    <>
                    <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => {
                        navigate(`/${post_id}/comments/${item._id}/edit`)
                    }}>
                        <EditIcon />
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => {
                        setOpen(true)
                    }}>
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                    </Tooltip>
                    </>
                }
                title={item.userId.name}
                subheader={
                    <Typography variant="caption"  sx={{ color: green[200]}}>Date</Typography>
                }

            />
            <CardContent>
                <Typography variant="body1">
                    {item.content}
                </Typography>
            </CardContent>
            <CardActions disableSpacing sx={{ 
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                {
                    isLiked ? (
                        <IconButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            unLikeComment();
                            e.stopPropagation()
                        }}>
                            <LikedIcon 
                                color="error"
                                fontSize="small"
                            />
                        </IconButton>
                    ) : (
                        <IconButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            likeComment();
                            e.stopPropagation()
                        }}>
                            <LikeIcon 
                                color="error"
                                fontSize="small"
                            />
                        </IconButton>
                    )
                }
                <Button sx={{
                    color: "text.fade"
                }} size="small" variant="text"
                onClick={() => navigate(`/${post_id}/comments/${item._id}/likes`)}
                >{likesCount}</Button>
            </CardActions>
        </Card>
        </div>
        <DeleteAlert open={open} setOpen={setOpen} item={item} remove={remove}/>
    </>
    )
};

export default Comment