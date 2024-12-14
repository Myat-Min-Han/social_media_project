import {
    Box,
    Button,
    TextField,
    Typography,
    Alert
} from '@mui/material';

import { FormEvent, useRef } from 'react';

import axios from '../config/axios.ts';
import useSWRMutation from 'swr/mutation'

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/ThemedApp';

type UserData = {
    email: string,
    password: string
};

type UserResponse =  {
    user: {
        _id: string,
        name: string,
        email: string,
        postIds: string[] | [],
        commentIds: string[] | [],
        postLikes: string[] | [],
        commentLikes: string[] | [],
        followers: string[] | [],
        following: string[] | [],
        notis: string[] | [],
        createdAt: string,
        updatedAt: string,
    }
    token: string
}

const logInUser = async (url: string, {arg}: { arg: UserData}): Promise<UserResponse>=> {
    try {   
        const response = await axios.post<UserResponse>(url, arg);
        if(response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        };
        console.log(response.data)
        return response.data;
    } catch(error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to retrieve user');
        }
        throw new Error('An unexpected error occurred.');
    }
}

const Login = (): React.JSX.Element => {

    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const navigate = useNavigate();
    const { setAuth } = useApp();

    const { trigger, isMutating, data, error } = useSWRMutation(
        '/users/login',
        logInUser
    )

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(emailRef.current && passwordRef.current) {
            const user: UserData = {
                email: emailRef.current.value,
                password: passwordRef.current.value
            };

            try {
                const result = await trigger(user);
                setAuth(result.user);
                localStorage.setItem("token", result.token)
                console.log("User login with ID", result.user._id);
                navigate('/')
            } catch(e) {
                console.error('Error logging in:', e instanceof Error ? e.message : e);
            }
        }
    }

    return (
        <Box>
            <Typography variant='h3'>Login</Typography>

            <form onSubmit={handleSubmit}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mt: 2
                }}>
                    <TextField placeholder='Email' fullWidth required inputRef={emailRef}/>
                    <TextField placeholder='Password' type="password" fullWidth required
                    inputRef={passwordRef}/>
                    <Button type='submit' variant='contained' fullWidth>
                        {isMutating ? "Logging in..." : "Login"}
                    </Button>
                </Box>
            </form>
            {error && <Alert severity="warning">Error: {error.message}</Alert>}
            {data && <Alert severity='success'>User login successfully!</Alert>}
        </Box>
    )
};

export default Login;