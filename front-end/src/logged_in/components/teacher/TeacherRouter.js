import React from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import TeacherAll from './all/TeacherAll';
import TeacherProfile from './profile/TeacherProfile';

const TeacherRouter = () => {
    const { url } = useRouteMatch();

    return (
        <div>
            <Route exact path={`${url}`} component={TeacherAll}></Route>
            <Route exact path={`${url}/profile/:id`} component={TeacherProfile}></Route>
        </div>
    )
}

export default TeacherRouter;
