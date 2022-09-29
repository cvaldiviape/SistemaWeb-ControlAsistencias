import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
    searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', startSearch, ...other }) {
    return (
        <Paper {...other}>
            <Typography gutterBottom align="center" variant="subtitle1">
                No hay resultados
            </Typography>
            {
                startSearch
                &&
                <Typography variant="body2" align="center">
                    No se encontraron resultados que coindican con &nbsp;
                    <strong>&quot;{searchQuery}&quot;</strong>.
                </Typography>
            }

        </Paper>
    );
}
