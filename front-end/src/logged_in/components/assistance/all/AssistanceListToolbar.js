import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import { styled } from '@material-ui/core/styles';
import {
    Box,
    Toolbar,
    Tooltip,
    IconButton,
    Typography,
    OutlinedInput,
    InputAdornment
} from '@material-ui/core';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
}));

// ----------------------------------------------------------------------

AssistanceListToolbar.propTypes = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func
};

export default function AssistanceListToolbar({ numSelected, openDialogDeleteMultiple }) {

    const openConfirmDialog = () => { 
        openDialogDeleteMultiple(numSelected);
    }
    
    return (
        <RootStyle
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter'
                })
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    Registros seleccionados: {numSelected} 
                </Typography>
            ) : (
                <Typography variant="h4" gutterBottom>
                    Asistencias
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton
                        onClick={openConfirmDialog}
                    >
                        <Icon icon={trash2Fill} />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <Icon icon={roundFilterList} />
                    </IconButton>
                </Tooltip>
            )}
        </RootStyle>
    );
}
