import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Button } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function InstitutionMoreMenu(props) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const { id, nameInstitution, openDialogDelete } = props;

    const openConfirmDialog = () => { 
        openDialogDelete(id, nameInstitution);
        setIsOpen(false);
    }

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
                    to={`institution/edit/${id}`}
                    sx={{ color: 'text.secondary' }}
                >
                    <ListItemIcon>
                        <Icon icon={editFill} width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Editar" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
                <MenuItem 
                    component={Button}
                    onClick={openConfirmDialog}
                    sx={{ color: 'text.secondary' }}
                >
                    <ListItemIcon>
                        <Icon icon={trash2Outline} width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText primary="Eliminar" primaryTypographyProps={{ variant: 'body2' }} />
                </MenuItem>
            </Menu>
        </>
    );
}
