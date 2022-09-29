import PropTypes from 'prop-types';
import { visuallyHidden } from '@material-ui/utils';
import { Box, TableRow, TableCell, TableHead, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@mui/styles';
import palette from '../../../../theme/palette';

// ----------------------------------------------------------------------

const useStyles = makeStyles({
    tableHead: {
        backgroundColor: palette.secondary.main,
        color: palette.common.white
    }
});

TeacherListHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']),
    orderBy: PropTypes.string,
    rowCount: PropTypes.number,
    headLabel: PropTypes.array,
    numSelected: PropTypes.number,
    onRequestSort: PropTypes.func,
    onSelectAllClick: PropTypes.func
};

export default function TeacherListHead({
    order,
    orderBy,
    headLabel,
    onRequestSort,
}) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const classes = useStyles();

    return (
        <TableHead>
            <TableRow>
                {headLabel.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            // onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
