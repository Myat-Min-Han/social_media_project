import { useApp } from '../context/ThemedApp';
import React from 'react';

import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge
} from '@mui/material';

import {
    Menu as MenuIcon,
    Add as AddIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Search as SearchIcon,
    NotificationAddRounded as NotiIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';


const Header = (): React.JSX.Element => {

    const { showForm, setShowForm, mode, setMode, setShowDrawer, auth, count} = useApp();

    const navigate = useNavigate();

    return (
        <AppBar position='static'>
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={() => setShowDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>

                <Typography sx={{ flexGrow: 1, ml: 2}}>Yaycha</Typography>

                <Box>
                    <IconButton 
                        color="inherit"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <AddIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/search')}
                    >
                        <SearchIcon />
                    </IconButton>
                    {auth && (
                        <IconButton
                            color="inherit"
                            onClick={() => navigate('/notis')}
                        >
                            <Badge
                                color='error'
                                badgeContent={count}
                            >
                                <NotiIcon />
                            </Badge>
                        </IconButton>
                    )}
                    { mode === "dark" ? (
                        <IconButton
                        color='inherit'
                        edge="end"
                        onClick={() => setMode("light")}
                    >
                        <LightModeIcon />
                    </IconButton>
                    ) : (
                        <IconButton
                        color='inherit'
                        edge="end"
                        onClick={() => setMode("dark")}
                    >
                        <DarkModeIcon />
                    </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
};

export default Header