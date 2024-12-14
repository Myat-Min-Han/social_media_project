import React, { useEffect } from "react";

import {
    Alert,
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    TextField
} from '@mui/material';

import { useState } from "react";
import useSWRMutation from "swr/mutation";

import { fetchSearch } from "../libs/fetcher";
import FollowButton from "../components/FollowButton";

import { useDebounce } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

type searchUserSchema = {
    _id: string,
    name: string,
    email: string,
    postIds: string[] | [],
    commentIds: string[] | [],
    postLikes: string[] | [],
    commentLikes: string[] | [],
    followers: string[] | [],
    following: string[]| [],
    notis: string[] | [],
    createdAt: string,
    updatedAt: string
}

const Search = (): React.JSX.Element => {
    const [ userName, setUserName] = useState<string>('');


    const debounceSearchItem = useDebounce(userName, 500);

    const navigate = useNavigate();

    const { trigger, isMutating, error, data } = useSWRMutation(
        `/users/search`,
        fetchSearch
    );

    useEffect(() => {
        const performSearch = async () => {
            try {
                await trigger(debounceSearchItem)
            } catch(err: any) {
                console.log(err.message || "An error occured during search")
            }
        };
        performSearch();
    }, [debounceSearchItem]);


    return (
        <Box>
            <TextField 
                fullWidth
                variant="outlined"
                value={userName}
                label="Search Users"
                onChange={e => setUserName(e.target.value)}
                placeholder="Type a username"
            />
            {isMutating && <Alert severity="info">Searching...</Alert>}
            {error && <Alert severity="error">{error.message}</Alert>}

            <List>
                {data?.map((user: searchUserSchema) => {
                    return (
                        <ListItem key={user._id}
                            secondaryAction={
                                <FollowButton user={user}/>
                            }
                        >
                            <ListItemButton onClick={() => navigate(`/profile/${user._id}`)}>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={user.name}
                                    secondary={user.email}
                                />
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </Box>
    )
};

export default Search;