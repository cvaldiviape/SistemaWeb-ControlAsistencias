import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Icon } from '@iconify/react';
import baselineNotListedLocation from '@iconify/icons-ic/baseline-not-listed-location';


const useStyles = makeStyles(theme => ({
    dialog: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    },
    dialogTitle: {
        textAlign: 'center'
    },
    dialogContent: {
        textAlign: 'center'
    },
    dialogAction: {
        justifyContent: 'center'
    },
    titleIcon: {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: theme.palette.secondary.light,
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '8rem',
        }
    }
}))

export default function ConfirmDialogDelete(props) {

    const { title, subTitle, open, setOpen, id, onDelete } = props;
    const classes = useStyles();

    const notDelete = () => {
        setOpen(false);
    }

    const yesDelete = () => {
        onDelete(id);
        setOpen(false);
    }

    return (
        <Dialog open={open} classes={{ paper: classes.dialog }}>
            <DialogTitle className={classes.dialogTitle}>
                <IconButton disableRipple className={classes.titleIcon}>
                    <Icon icon={baselineNotListedLocation} />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {title}
                </Typography>
                <Typography variant="subtitle2">
                    {subTitle}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={notDelete} 
                >
                    No
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={yesDelete} 
                >
                    Si
                </Button>
            </DialogActions>
        </Dialog>
    )
}
