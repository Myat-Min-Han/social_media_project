import {
    createBrowserRouter,
} from 'react-router-dom';

import Template from '../template/Template';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Comments from '../pages/Comments';
import Likes from '../pages/Likes';
import EditPost from '../components/EditPost';
import EditComment from '../components/EditComment';
import ErrorPage from '../ErrorPage';
import Search from '../pages/Search';
import Notis from '../pages/Notis'

const auth = ():boolean => {
    const token = localStorage.getItem('token');
    return token ? true : false;
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <Template />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: auth() ? <Home /> : <Login />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/profile/:id',
                element: auth() ? <Profile /> : <Login />
            },
            {
                path: '/:post_id/comments',
                element: auth() ? <Comments /> : <Login />
            },
            {
                path: '/:post_id/likes',
                element: auth() ? <Likes /> : <Login />
            },
            {
                path: '/:post_id/comments/:comment_id/likes',
                element: auth() ? <Likes /> : <Login />
            },
            {
                path: '/:post_id/edit',
                element: auth() ? <EditPost /> : <Login />
            },
            {
                path: '/:post_id/comments/:comment_id/edit',
                element: auth() ? <EditComment /> : <Login />
            },
            {
                path: '/search',
                element: auth() ? <Search /> : <Login />
            },
            {
                path: '/notis',
                element: auth() ? <Notis /> : <Login />
            }
        ]
    }
]);

export default router
