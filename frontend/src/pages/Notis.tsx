import React from "react";

import {
    Box,
    Alert,
    Card,
    Avatar,
    Button,
    Typography,
    CardContent,
    CardActionArea
} from '@mui/material';

import {
    Comment as CommentIcon,
    Favorite as FavoriteIcon
} from '@mui/icons-material';

import { format } from 'date-fns';

import { useNavigate } from "react-router-dom";
import {
    fetchNotis,
    putAllNotisRead,
    putNotiRead
} from '../libs/fetcher';

import useSWR, { mutate} from "swr";
import useSWRMutation from "swr/mutation";

type NotiSchema = {
    _id: string,
    type: 'like' | 'comment'
    content: string,
    postId: string,
    userId: {
        _id: string,
        name: string,
        email: string
    }
    read: boolean,
    createdAt: string,
    updatedAt: string
}

const Notis = (): React.JSX.Element => {
    const navigate = useNavigate();

    const { data, error, isLoading } = useSWR<NotiSchema[]>('/notis',fetchNotis );

    const { trigger: readAllNotis } = useSWRMutation('/notis/read', putAllNotisRead, {
        onError: (error) => {
            console.warn(error.message)
        },
        onSuccess: () => {
            mutate('/notis')
        }
    });

    const { trigger: readNoti } = useSWRMutation('/notis/read', putNotiRead, {
        onError: (error) => {
            console.warn(error.message)
        },
    });

    if(error) {
        return (
            <Box>
                <Alert severity="warning">{error.message}</Alert>
            </Box>
        )
    };

    if(isLoading) {
        return <Box sx={{ textAlign: 'center'}}>Loading...</Box>
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', mb: 2}}>
                <Box sx={{ flex: 1}} />
                <Button 
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 5}}
                    onClick={async () => {
                        await readAllNotis()
                    }}
                >
                    Mark all as read
                </Button>
            </Box>

            {data?.map((noti: NotiSchema) => {
                return (
                    <Card
                        sx={{ mb: 2, opacity: noti.read ? 0.3 : 1}}
                        key={noti._id}
                    >
                        <CardActionArea
                        onClick={async () => {
                            await readNoti(noti._id);
                            navigate(`/${noti.postId}/comments`)
                        }}
                        >
                            <CardContent
                                sx={{display: 'flex', opacity: 1}}
                            >
                                {noti.type === "comment" ? (
                                    <CommentIcon color="success"/>
                                ) : (
                                    <FavoriteIcon color='error'/>
                                )}

                                <Box sx={{ ml: 3}}>
                                    <Avatar />

                                    <Box sx={{ mt: 1}}>
                                        <Typography>
                                            <b>{noti.userId.name}</b>
                                        </Typography>

                                        <Typography
                                            component="span"
                                            sx={{ mr: 1, color: 'text.secondary'}}
                                        >
                                            {noti.content}
                                        </Typography>

                                        <Typography
                                            component='span'
                                            color='primary'
                                        >
                                            <small>
                                                {format(
                                                    noti.createdAt,
                                                    "yyyy-MM-dd"
                                                )}
                                            </small>
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                )
            })}
        </Box>
    )
};

export default Notis;