import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import TeacherAssistanceAll from './all/TeacherAssistanceAll';

const TeacherAssistanceRouter = () => {
    const { url } = useRouteMatch();

    return (
        <div>
            <Route exact path={`${url}`} component={TeacherAssistanceAll}></Route>
        </div>
    )
}

export default TeacherAssistanceRouter;
