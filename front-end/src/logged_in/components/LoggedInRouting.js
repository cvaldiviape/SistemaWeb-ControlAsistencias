import { useState, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import { Redirect, Route } from 'react-router-dom';
import DashboardNavbar from './dashboard/DashboardNavbar';
import DashboardSidebar from './dashboard/DashboardSidebar';
import UserRouter from './user/UserRouter';
import AssistanceRouter from './assistance/AssistanceRouter';
import RoleRouter from './role/RoleRouter';
import TeacherRouter from './teacher/TeacherRouter';
import InstitutionRouter from './institution/InstitutionRouter';
import TeacherAssistanceRouter from './teacher_assistance/TeacherAssistanceRouter';
import TeacherSubjectRouter from './teacher_subject/TeacherSubjectRouter';
import ReportRouter from './report/ReportRouter';
import { getUserInfo } from '../../api/userApi';
import { config } from '../../util/Config';

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: APP_BAR_MOBILE + 24,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('lg')]: {
        paddingTop: APP_BAR_DESKTOP + 24,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    }
}));

const LoggedInRouting = () => {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState(false);

    useEffect(() => {
        const data = getUserInfo();
        setRole(data.role.code);
    }, []);

    return (
        <RootStyle>
            <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
            <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
            <MainStyle>
                {
                    role == config.role_code_admin
                    &&
                    <>
                        <Route exact path="/dashboard"><Redirect to="/dashboard/user" /></Route>
                        <Route path="/dashboard/user" component={UserRouter}></Route>
                        <Route path="/dashboard/institution" component={InstitutionRouter}></Route>
                        <Route path="/dashboard/role" component={RoleRouter}></Route>
                    </>
                }
                { 
                    role == config.role_code_director
                    &&
                    <>
                        <Route exact path="/dashboard"><Redirect to="/dashboard/teacher" /></Route>
                        <Route path="/dashboard/teacher" component={TeacherRouter}></Route>
                        <Route path="/dashboard/assistance" component={AssistanceRouter}></Route>
                        <Route path="/dashboard/report" component={ReportRouter}></Route>
                    </>

                }
                { 
                    role == config.role_code_teacher
                    &&
                    <>
                        <Route exact path="/dashboard"><Redirect to="/dashboard/teacher-assistance" /></Route>
                        <Route path="/dashboard/teacher-assistance" component={TeacherAssistanceRouter}></Route>
                        <Route path="/dashboard/teacher-subject" component={TeacherSubjectRouter}></Route>
                    </>

                }
            </MainStyle>
        </RootStyle>
    );
};

export default LoggedInRouting;
