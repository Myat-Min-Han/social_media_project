import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';

import {
    Alarm as TimeIcon,
    AccountCircle as UserIcon,
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';

import { green } from "@mui/material/colors";

import { useNavigate } from "react-router-dom";
import PostLikeButton from "./PostLikeButton";
import PostCommentButton from "./PostCommentButton";
import DeleteAlert from "./DeleteAlert";

type itemLikesData = {
    _id: string,
    postId: string,
    userId: string,
    createdAt: string,
    updatedAt: string
}

type ItemProps = {
    item: {
        _id: string,
        content: string,
        userId: {
            _id: string,
            name: string,
        },
        commentIds: string[] | [],
        likes: itemLikesData[] | [],
        createdAt: string,
        updatedAt: string
    },
    remove: (post_id: string) => void
}

const Item = ({item, remove}: ItemProps): React.JSX.Element => {
    const [open, setOpen ] = useState<boolean>(false)

    const navigate = useNavigate();

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

    return (
        <>
        <div ref={mainContentRef}>
        <Card sx={{ mb: 2}} ref={mainContentRef}>
            <CardContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alighItems: 'center',
                        gap:1
                    }}>
                        <TimeIcon fontSize="inherit" color="success" />
                        <Typography 
                            variant="caption"
                            sx={{ color: green[500]}}
                        >
                            A few seconds ago
                        </Typography>
                    </Box>
                    <Box>
                        <Tooltip title="Edit">
                            <IconButton
                                sx={{ mr: 1}}
                                size="small"
                                onClick={e => {
                                    navigate(`/${item._id}/edit`)
                                    e.stopPropagation()
                                }}  
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                            size="small"
                            onClick={e => {
                                setOpen(true)
                                e.stopPropagation()
                            }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box> 

                <Typography sx={{ my: 3}}>
                    {item.content}
                </Typography>
                
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                <Box
                    sx={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        alighItems: 'center',
                        gap: 1
                    }}
                >
                        <UserIcon 
                        fontSize="inherit"
                        color="info"
                        onClick={() => navigate(`/profile/${item.userId._id}`)}
                        />
                    <Typography variant="caption">{item.userId.name}</Typography>
                </Box>
                <Box>
                    <PostLikeButton item={item}/>
                    <PostCommentButton item={item}/>
                </Box>
                </Box>
            </CardContent>
        </Card>
        </div>
        <DeleteAlert open={open} setOpen={setOpen} item={item} remove={remove}/>
        </>
    )
};

export default Item
