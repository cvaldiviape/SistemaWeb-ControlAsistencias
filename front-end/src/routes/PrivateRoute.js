import { Route, Redirect, useLocation } from 'react-router-dom';
import { isAuth, getUserInfo } from '../api/userApi';

export default function PrivateRoute({ component: Component, ...rest }) {
    let isLogin = isAuth();
    return <Route {...rest}>{isLogin ? <Component /> : <Redirect to="/login" />}</Route>;
}
