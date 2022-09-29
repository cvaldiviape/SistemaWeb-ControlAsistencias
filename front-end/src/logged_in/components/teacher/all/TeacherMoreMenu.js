import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import contactCard16Filled from '@iconify/icons-fluent/contact-card-16-filled';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function TeacherMoreMenu(props) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const { id } = props;

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Icon icon={moreVerticalFill} width={20} height={20} />
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 200, maxWidth: '100%' }
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    component={RouterLink}
                    to={`teacher/profile/${id}`}
                    sx={{ color: 'text.secondary' }}
                >
                    <ListItemIcon>
                        <Icon icon={contactCard16Filled} width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Ver perfil" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            </Menu>
        </>
    );
}
