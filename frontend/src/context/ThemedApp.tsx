import React, { 
    createContext, 
    Dispatch, 
    SetStateAction, 
    useContext, 
    useState, 
    useMemo,
    useEffect
} from "react";

import {
    CssBaseline,
    ThemeProvider,
    createTheme,
    PaletteMode,
} from '@mui/material';

import { deepPurple, grey } from "@mui/material/colors";

import { RouterProvider } from "react-router-dom";
import router from "../routes/routes";
import getToken from "../helpers/getToken";
import axios from "../config/axios";
import useSWR from "swr";
import { fetchNotis } from "../libs/fetcher";

type AuthData = {
    _id: string,
    name: string,
    email: string,
    postIds: string[] | [],
    commentIds: string[] | [],
    postLikes: string[] | [],
    commentLikes: string[] | [],
    followers: string[] | [],
    following: string[] | [],
    notis: string[] | []
    createdAt: string,
    updatedAt: string,
}

type AppContextType = {
    showForm: boolean,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    mode: 'light' | 'dark',
    setMode: Dispatch<SetStateAction<PaletteMode>>,
    showDrawer: boolean,
    setShowDrawer: Dispatch<SetStateAction<boolean>>,
    auth: AuthData | null,
    setAuth: Dispatch<SetStateAction<AuthData | null>>,
    globalMsg: string | null,
    setGlobalMsg: Dispatch<SetStateAction<string | null>>
    count: number | undefined,
    setCount: Dispatch<SetStateAction<number | undefined>>,
};

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

declare module '@mui/material/styles' {
    interface Palette {
        banner: string;
    }

    interface PaletteOptions {
        banner?: string;
    }

    interface TypeText {
        fade: string
    }
}

const AppContext = createContext<AppContextType | null>(null);

const useApp = () => {
    const context = useContext(AppContext);
    
    if(!context) {
        throw new Error("useApp must be used within an AppContextProvider");
    };

    return context
};

const fetchVerify = async (): Promise<boolean | any> => {
    const token = getToken();
    try {
        const response = await axios.get('/users/verify', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) return response.data;
        return false;
    } catch (error) {
        console.error("Verification failed:", error);
        return false;
    }
};

const ThemedApp = (): React.JSX.Element => {
    const [ showForm, setShowForm ] = useState<boolean>( false);
    const [ mode, setMode ] = useState<PaletteMode>("dark");
    const [ showDrawer, setShowDrawer ] = useState<boolean>(false);
    const [ globalMsg, setGlobalMsg ] = useState<string | null>(null);
    const [ auth, setAuth ] = useState<AuthData | null>(null);
    const [ count, setCount ] = useState<number | undefined>(0);


    const { isLoading, error, data } = useSWR<NotiSchema[]>('/notis', fetchNotis)

    useEffect(() => {
        fetchVerify().then(user => {
            if(user) setAuth(user)
        })
    }, []);

    useEffect(() => {
        const notiCount = async (): Promise<void> => {
            if(!auth) return 
            if(isLoading || error ) return;

            let isMatching = data?.some(noti => noti.userId._id === auth?._id);
            const unreadNotis = data?.filter(notis => !notis.read).length;

            isMatching ? setCount(0) : setCount(unreadNotis)
        };
        notiCount();
    }, [auth, data, error, isLoading])

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode,
                primary: deepPurple,
                banner: mode === 'dark' ? grey[500] : grey[200],
                text: {
                    fade: grey[500]
                }
            }
        })
    }, [mode]);


    return (
        <ThemeProvider theme={theme}>
            <AppContext.Provider value={{ 
                showForm, setShowForm,
                mode, setMode,
                auth, setAuth,
                globalMsg, setGlobalMsg,
                showDrawer, setShowDrawer,
                count, setCount,
                }}>
                    <RouterProvider router={router}/>
                <CssBaseline />
            </AppContext.Provider>
        </ThemeProvider>
    )
};

export {useApp, ThemedApp}