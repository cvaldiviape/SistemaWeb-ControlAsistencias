import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import InstitutionAll from './all/InstitutionAll';
import InstitutionCreate from './create/InstitutionCreate';
import InstitutionEdit from './edit/InstitutionEdit';

const InstitutionRouter = () => {

    const { url } = useRouteMatch();

    return (
        <div>
            <Route exact path={`${url}`} component={InstitutionAll}></Route>
            <Route exact path={`${url}/create`} component={InstitutionCreate}></Route>
            <Route exact path={`${url}/edit/:id`} component={InstitutionEdit}></Route>
        </div>
    )
}

export default InstitutionRouter;
