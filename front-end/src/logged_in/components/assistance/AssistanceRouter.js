import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import AssistanceAll from './all/AssistanceAll';
import AssistanceCreate from './create/AssistanceCreate';
import AssistanceEdit from './edit/AssistanceEdit';

const AssistanceRouter = () => {

    const { url } = useRouteMatch();

    return (
        <div>
            <Route exact path={`${url}`} component={AssistanceAll}></Route>
            <Route exact path={`${url}/create`} component={AssistanceCreate}></Route>
            <Route exact path={`${url}/edit/:id`} component={AssistanceEdit}></Route>
        </div>
    )
}

export default AssistanceRouter;