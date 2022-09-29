import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

SearchNotFoundDate.propTypes = {
    searchQuery: PropTypes.string
};

export default function SearchNotFoundDate({ searchQuery, searchFromDate, searchToDate, startSearch, ...other }) {
    return (
        <Paper {...other}>
            <Typography gutterBottom align="center" variant="subtitle1">
                No hay resultados
            </Typography>
            {
                startSearch
                &&
                <>
                {
                    searchQuery
                    ?
                    <Typography variant="body2" align="center">
                        No se encontraron resultados que coindican con &nbsp;
                        <strong>&quot;{searchQuery}&quot;</strong>.
                        <br />
                        En el rango fechas desde <strong>&quot;{searchFromDate}&quot;</strong> hasta <strong>&quot;{searchToDate}&quot;</strong>.
                    </Typography>
                    :
                    <Typography variant="body2" align="center">
                        No se encontraron resultados en el rango fechas desde <strong>&quot;{searchFromDate}&quot;</strong> hasta <strong>&quot;{searchToDate}&quot;</strong>.
                    </Typography>
                }
                </>
            }
            
        </Paper>
    );
}
