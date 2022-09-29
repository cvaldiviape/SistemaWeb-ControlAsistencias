import { useRef, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { alpha } from '@material-ui/core/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@material-ui/core';
import MenuPopover from '../../../shared/MenuPopover';
import account from '../../../_mocks_/account';
import Constants from '../../../util/constants';
import { getUserInfo } from '../../../api/userApi';
import { useDispatch, useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const history = useHistory();
    const userInfo = getUserInfo();
    const { userAuth } = useSelector(state => state.user) 

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const logOut = () => {
        localStorage.removeItem(Constants.userInfo);
        history.push('/login');
    }

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={{
                    padding: 0,
                    width: 44,
                    height: 44,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
                        }
                    })
                }}
            >
                <Avatar src={account.photoURL} alt="photoURL" />
            </IconButton>

            <MenuPopover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                sx={{ width: 220 }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    {
                        userInfo
                        &&
                        <>
                            <Typography variant="subtitle1" noWrap>
                                {userInfo.user.firt_name + ' ' + userInfo.user.last_name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                {userInfo.user.email}
                            </Typography>
                        </>
                    }
                  
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ p: 2, pt: 1.5 }}>
                    <Button fullWidth color="inherit" variant="outlined" onClick={logOut}>
                        Cerrar Sesión
                    </Button>
                </Box>
            </MenuPopover>
        </>
    );
}
