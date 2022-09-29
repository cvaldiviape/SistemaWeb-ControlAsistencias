import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import RoleAll from './all/RoleAll';

const TeacherRouter = () => {
    const { url } = useRouteMatch();

    return (
        <div>
            <Route exact path={`${url}`} component={RoleAll}></Route>
        </div>
    )
}

export default TeacherRouter;
