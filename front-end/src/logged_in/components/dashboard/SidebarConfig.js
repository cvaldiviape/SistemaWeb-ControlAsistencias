import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import chalkboardTeacher from '@iconify/icons-fa-solid/chalkboard-teacher';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const [sidebarConfig, setSidebarConfig] = useState([
    {
        title: 'Usuarios',
        path: '/dashboard/user',
        icon: getIcon(peopleFill)
    },
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
        title: 'Roles',
        path: '/dashboard/role',
        icon: getIcon(fileTextFill)
    }
]);


export default sidebarConfig;
