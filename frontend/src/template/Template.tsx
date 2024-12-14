import React from "react";

import {
    Box,
    Container,
    Snackbar
} from '@mui/material';

import { Outlet } from "react-router-dom";

import Header from '../components/Header';
import AppDrawer from "../components/AppDrawer";

import { useApp } from "../context/ThemedApp";

const Template = (): React.JSX.Element => {

    const { globalMsg, setGlobalMsg } = useApp();

    return (
        <Box>
            <Header />
            <AppDrawer />

            <Container maxWidth="sm" sx={{ mt: 4}}>
                <Outlet />
            </Container>

            <Snackbar 
                    anchorOrigin={{
                        horizontal: 'center',
                        vertical: 'bottom'
                    }}
                    open={Boolean(globalMsg)}
                    autoHideDuration={2000}
                    onClose={() => setGlobalMsg(null)}
                    message={globalMsg}
            />
        </Box>
    )
};

export default Template;