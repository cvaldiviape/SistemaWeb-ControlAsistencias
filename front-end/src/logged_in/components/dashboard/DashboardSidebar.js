import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@material-ui/core';
import Logo from '../../../shared/Logo';
import Scrollbar from '../../../shared/Scrollbar';
import NavSection from '../../../shared/NavSection';
import { MHidden } from '../../../shared/@material-extend';
import account from '../../../_mocks_/account';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import chalkboardTeacher from '@iconify/icons-fa-solid/chalkboard-teacher';
import schoolSolid from '@iconify/icons-teenyicons/school-solid';
import closedBook from '@iconify/icons-emojione-monotone/closed-book';
import bxsReport from '@iconify/icons-bx/bxs-report';
import { getUserInfo } from '../../../api/userApi';
import { useSelector } from 'react-redux';

import { getIcon } from '../../../shared/myshared/functions';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 230;

const RootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('lg')]: {
        flexShrink: 0,
        width: DRAWER_WIDTH
    }
}));

const AccountStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 2.5),
    borderRadius: theme.shape.borderRadiusSm,
    backgroundColor: theme.palette.grey[200]
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
    isOpenSidebar: PropTypes.bool,
    onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
    const { pathname } = useLocation();
    const sidebarAdmin = [
        {
            title: 'Usuarios',
            path: '/dashboard/user',
            icon: getIcon(peopleFill)
        },
        {
            title: 'Instituciones',
            path: '/dashboard/institution',
            icon: getIcon(schoolSolid)
        },
        {
            title: 'Roles',
            path: '/dashboard/role',
            icon: getIcon(fileTextFill)
        }
    ];
    const sidebarDirector = [
        {
            title: 'Docentes',
            path: '/dashboard/teacher',
            icon: getIcon(chalkboardTeacher)
        },
        {
            title: 'Asistencias',
            path: '/dashboard/assistance',
            icon: getIcon(shoppingBagFill)
        },
        {
            title: 'Reportes',
            path: '/dashboard/report',
            icon: getIcon(bxsReport)
        }
    ];
    const sidebarTeacher = [
        {
            title: 'Mis Asistencias',
            path: '/dashboard/teacher-assistance',
            icon: getIcon(shoppingBagFill)
        },
        {
            title: 'Mis Areas',
            path: '/dashboard/teacher-subject',
            icon: getIcon(closedBook)
        }  
    ];
    const [sidebarConfig, setSidebarConfig] = useState([]);
    const userInfo = getUserInfo();
    const { userAuth } = useSelector(state => state.user) 

    useEffect(() => {
        if (isOpenSidebar) {
            onCloseSidebar();
        }
        setConfig();
    }, [pathname]);

    const setConfig = () => {
        const data = getUserInfo();
        if(data.role.code=="001"){
            setSidebarConfig(sidebarAdmin);
        }else if(data.role.code=="002"){
            setSidebarConfig(sidebarDirector);
        }else if(data.role.code=="003"){
            setSidebarConfig(sidebarTeacher);
        }
    }    

    const renderContent = (
        <Scrollbar
            sx={{
                height: '100%',
                '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
            }}
        >
           

            <Box sx={{ mb: 5, mx: 2.5, mt: 3 }}>
                <Link underline="none" component={RouterLink} to="#">
                    <AccountStyle>
                        <Avatar src={account.photoURL} alt="photoURL" />
                        <Box sx={{ ml: 2 }}>
                            {
                                userInfo
                                &&
                                <>
                                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                                        {userInfo.user.firt_name + ' ' + userInfo.user.last_name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {userInfo.role.name}
                                    </Typography>
                                </>

                            }
                           
                        </Box>
                    </AccountStyle>
                </Link>
            </Box>

            <NavSection navConfig={sidebarConfig} />

            <Box sx={{ flexGrow: 1 }} />
        </Scrollbar>
    );

    return (
        <RootStyle>
            <MHidden width="lgUp">
                <Drawer
                    open={isOpenSidebar}
                    onClose={onCloseSidebar}
                    PaperProps={{
                        sx: { width: DRAWER_WIDTH }
                    }}
                >
                    {renderContent}
                </Drawer>
            </MHidden>

            <MHidden width="lgDown">
                <Drawer
                    open
                    variant="persistent"
                    PaperProps={{
                        sx: {
                            width: DRAWER_WIDTH,
                            bgcolor: 'background.default'
                        }
                    }}
                >
                    {renderContent}
                </Drawer>
            </MHidden>
        </RootStyle>
    );
}
