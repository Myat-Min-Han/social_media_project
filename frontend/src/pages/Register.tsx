import React, { FormEvent, useRef} from 'react';
import axios from '../config/axios.ts';
import useSWRMutation from 'swr/mutation'

import { 
    Box,
    Button,
    TextField,
    Typography,
    Alert
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

type UserData = {
    name: string,
    email: string,
    password: string
};

type UserResponse = {
    _id: string,
    name: string,
    email: string,
    postIds: string[] | [],
    postLikes: string[] | [],
    commentIds: string[] | [],
    commentLikes: string[] | [],
    notis: string[] | [],
    createdAt: string,
    updatedAt: string
};

const createUser = async (url: string, { arg }: { arg: UserData}): Promise<UserResponse> => {
    try {
        const response = await axios.post<UserResponse>(url, arg);
        if(response.status !== 201) {
            throw new Error(`Unexpected response status: ${response.status}`);
        };
        return response.data
    } catch(error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to create user');
        }
        throw new Error('An unexpected error occurred.');
    }
}

const Register = (): React.JSX.Element => {

    const navigate = useNavigate();

    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const { trigger, isMutating, data, error } = useSWRMutation(
        '/users/register',
        createUser
    )

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        //the data to sent in the post request
        if(nameRef.current && emailRef.current && passwordRef.current) {
            const newUser: UserData = {
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
            }

            //trigger the mutation 
            try {
                const result = await trigger(newUser);
                console.log('User created', result);
                navigate('/login')
            } catch(e) {
                console.error('Error creating user:', e instanceof Error ? e.message : e);
            }
        }
    }
    
    return (
        <Box>
            <Typography variant='h3'>Register</Typography>

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2}}>
                    <TextField placeholder='Name' fullWidth required inputRef={nameRef}/>
                    <TextField placeholder='Email' fullWidth required inputRef={emailRef}/>
                    <TextField placeholder='Password' type="password" fullWidth required inputRef={passwordRef}/>
                    <Button type='submit' variant='contained' fullWidth>
                        {isMutating ? "Posting" : "Post"}
                    </Button>
                </Box>
            </form>
            {error && <Alert severity="warning">Error: {error.message}</Alert>}
            {data && <Alert severity='success'>Post created successfully!</Alert>}
        </Box>
    )
};

export default Register;