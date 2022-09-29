import { Route, Redirect } from 'react-router-dom';
import { isAuth, getUserInfo } from '../api/userApi';

export default function PublicRoute({ component: Component, ...rest }) {
    let isLogin = isAuth();
    return <Route {...rest}>{!isLogin ? <Component /> : <Redirect to="/dashboard" />}</Route>;
}
