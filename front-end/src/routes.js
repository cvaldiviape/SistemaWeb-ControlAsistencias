import React from 'react';
import { Navigate, useRoutes, Outlet } from 'react-router-dom';
// layouts
import DashboardLayout from './logged_in/components/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './logged_out/components/login/Login';
import SignInSide from './logged_out/components/login/SignInSide';

import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './logged_in/components/user/all/UserAll';
import UserCreate from './logged_in/components/user/create/UserCreate';
import UserUpdate from './logged_in/components/user/edit/UserEdit';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router(props) {
    const { isLogin } = props;
    
    return useRoutes([
        {
            path: '/dashboard',
            element: isLogin ? <DashboardLayout /> : <Navigate to="/login" />,
            children: [
                { path: '/', element: <Navigate to="/dashboard/app" /* replace */ /> },
                { path: 'app', element: <DashboardApp /> },
                { path: 'user', element: <User /> }
                // { path: 'user/create', element: <UserCreate /> },
                // { path: 'user/update/:id', element: <UserUpdate /> },
                // { path: 'products', element: <Products /> },
                // { path: 'blog', element: <Blog /> }
            ]
        },
        {
            path: '/',
            element: !isLogin ? <SignInSide /> : <Navigate to="/dashboard/app" />,
            children: [
                { path: 'login', element: <SignInSide /> },
                { path: '/', element: <Navigate to="/login" /> }
                // { path: 'register', element: <Register /> },
                // { path: '404', element: <NotFound /> },
                // { path: '/', element: <Navigate to="/dashboard" /> },
                // { path: '*', element: <Navigate to="/404" /> }
            ]
        }

        // { path: '*', element: <Navigate to="/404" replace /> }
    ]);
}
