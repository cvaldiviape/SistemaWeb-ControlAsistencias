import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import ReportAll from './all/ReportAll';

const UserRouter = () => {
    const { url } = useRouteMatch();

    return (
        <div>
            <Route exact path={`${url}`} component={ReportAll}></Route>
        </div>
    )
}

export default UserRouter;
