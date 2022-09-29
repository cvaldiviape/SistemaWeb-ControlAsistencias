import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import {
    Card,
    Table,
    TableRow,
    TableBody,
    TableCell,
    Container,
    TableContainer,
    Grid
} from '@material-ui/core';
import Page from '../../../../shared/Page';
import Scrollbar from '../../../../shared/Scrollbar';
import SearchNotFound from '../../../../shared/SearchNotFound';
import RoleListHead from './RoleListHead';
import RoleListToolbar from './RoleListToolbar';
import { getRoles } from '../../../../api/roleApi';
import { config } from '../../../../util/Config';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    // TODO: nombre de columnas
    { id: 'code', label: 'Código', alignRight: false },
    { id: 'firtName', label: 'Nombre', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'asc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(
            array,
            (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function UserAll() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('code');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [listRoles, setListRoles] = useState([]);

    useEffect(() => {
        getDataTable();
    }, [])

    const getDataTable = () => {
        getRoles().then((r)=>{
            setListRoles(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/role/all/RoleAll.js, line 77");
        });
    }
   
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = listRoles.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listRoles.length) : 0;

    const filteredRoles = applySortFilter(listRoles, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredRoles.length === 0;

    return (
        <Page title={config.title_page_admin}>
            <Container>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <RoleListToolbar
                            numSelected={selected.length}
                            filterName={filterName}
                            onFilterName={handleFilterByName}
                        />
                        
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 300 }}>
                                <Table>
                                    <RoleListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={listRoles.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleRequestSort}
                                        onSelectAllClick={handleSelectAllClick}
                                    />
                                    <TableBody>
                                        {
                                            filteredRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                const {id, name, code } = row;
                                                const isItemSelected = selected.indexOf(id) !== -1;

                                                return (
                                                    <TableRow
                                                        hover
                                                        key={id}
                                                        tabIndex={-1}
                                                        selected={isItemSelected}
                                                        aria-checked={isItemSelected}
                                                    >
                                                        <TableCell align="center">{code}</TableCell>
                                                        <TableCell align="center">{name}</TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        }
                                    </TableBody>
                                    {isUserNotFound && (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="center" colSpan={2} sx={{ py: 3 }}>
                                                    <SearchNotFound searchQuery={filterName} />
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )}
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </Card>
                </Grid>
            </Container>
        </Page>
    );
}
