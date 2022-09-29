import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import UserAll from './all/UserAll';
import UserCreate from './create/UserCreate';
import UserEdit from './edit/UserEdit';

const UserRouter = () => {
    const { url } = useRouteMatch();

    return (
        <div>
            <Route exact path={`${url}`} component={UserAll}></Route>
            <Route exact path={`${url}/create`} component={UserCreate}></Route>
            <Route exact path={`${url}/edit/:id`} component={UserEdit}></Route>
        </div>
    )
}

export default UserRouter;
