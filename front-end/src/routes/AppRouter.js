import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
// pages
import Login from '../logged_out/components/login/Login';
import NotFound from '../pages/Page404';
// router
import DashboardLayout from '../logged_in/components/dashboard';
import LoggedInRouting from '../logged_in/components/LoggedInRouting';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRouter = () => (
    <div>
        <Router>
            <Switch>
                <Route exact path="/"><Redirect to="/login" /></Route> 
                <PublicRoute exact path="/login" component={Login} />
                <PrivateRoute path="/dashboard" component={LoggedInRouting}></PrivateRoute>
                <Route path="/404" component={NotFound} />
                <Route path="*"><Redirect to="/404" /></Route>
            </Switch>
        </Router>
    </div>
);

export default AppRouter;
