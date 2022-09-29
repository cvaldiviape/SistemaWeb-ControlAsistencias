import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import TeacherSubjectAll from './all/TeacherSubjectAll';

const TeacherSubjectRouter = () => {
    const { url } = useRouteMatch();

    return (
        <div>
            <Route exact path={`${url}`} component={TeacherSubjectAll}></Route>
        </div>
    )
}

export default TeacherSubjectRouter;
