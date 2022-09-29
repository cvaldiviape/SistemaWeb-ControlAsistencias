import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect, Fragment } from 'react';
import closeSquareFilled from '@iconify/icons-ant-design/close-square-outlined';
import searchIcon from '@iconify/icons-fa-solid/search';
import {
    Card,
    Table,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    TableContainer,
    TablePagination,
    Snackbar,
    IconButton,
    Grid,
    TextField,
} from '@material-ui/core';
import LoadingButton from '@mui/lab/LoadingButton';
import Page from '../../../../shared/Page';
import Scrollbar from '../../../../shared/Scrollbar';
import SearchNotFound from '../../../../shared/SearchNotFound';
import TeacherListHead from './TeacherListHead';
import TeacherListToolbar from './TeacherListToolbar';
import TeacherMoreMenu from './TeacherMoreMenu';
import { getUserInfo } from '../../../../api/userApi';
import { searchTeacher } from '../../../../api/teacherApi';
import { Formik } from 'formik';
import { config } from '../../../../util/Config';
import zoomReset from '@iconify/icons-bytesize/zoom-reset';
const TABLE_HEAD = [
    { id: 'full_name', label: 'Nombres y Apellidos', align: "center" },
    { id: 'dni', label: 'DNI', align: "center" },
    { id: 'email', label: 'Correo', align: "center" },
    { id: 'phone', label: 'Teléfono', align: "center" },
    { id: 'condition', label: 'Condición', align: "center" },
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
            (_teacher) => (
                (_teacher.full_name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
                ||
                (_teacher.dni.toLowerCase().indexOf(query.toLowerCase()) !== -1)
            )
        );
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function TeacherAll () {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('full_name');
    const [filterValue, setFilterValue] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [listTeachers, setListTeachers] = useState([]);
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [valuesSearch, setValuesSearch] = useState({
        filter_value: '',
    });
    const userInfo = getUserInfo();
    const [startSearch, setStartSearch] = useState(false);

    useEffect(() => {
        getDataTable();
    }, [])

    const getDataTable = () => {
        const userInfo = getUserInfo();
        searchTeacher('', userInfo.institution.code).then((r)=>{
            setListTeachers(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/teacher/all/TeacherAll.js, line 102");
        });
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenMessage(false);
    }

    const showMessage = (message) => (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={openMessage}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={
                    <Fragment>
                        <Button color="secondary" size="small" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <Icon icon={closeSquareFilled} />
                        </IconButton>
                    </Fragment>
                }
            />
        </div>
    )

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = listTeachers.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listTeachers.length) : 0;

    const filteredTeachers = applySortFilter(listTeachers, getComparator(order, orderBy), filterValue);

    const isUserNotFound = filteredTeachers.length === 0;


    const onSearch = (values) => {
        setLoading(true);
        setStartSearch(true);
        setFilterValue(values.filter_value);     
        setLoading(false);
    }   

    const onReset = () => {
        setFilterValue('');
        setStartSearch(false);
    }

    return (
        <Page title={config.title_page_director}>
            <Container>
                <Formik
                    initialValues={valuesSearch}
                    onSubmit={onSearch}
                >
                    {( {values, errors, touched, handleSubmit, handleChange, handleBlur} ) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2} mb={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="filter_value"
                                        label="Busqueda: 'nombre/apellido/DNI'"
                                        name="filter_value"
                                        autoComplete="filter_value"
                                        value={values.filter_value || ''}
                                        onChange={handleChange}
                                        type="text"    
                                        onInput = {(e) =>{
                                            e.target.value = e.target.value.slice(0,45)
                                        }}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} mt={1}>
                                    <LoadingButton
                                        fullWidth
                                        color="secondary"
                                        variant="contained"
                                        type="submit"
                                        loading={loading}
                                        loadingPosition="start"
                                        startIcon={<Icon icon={searchIcon} />}
                                    >
                                        Buscar
                                    </LoadingButton>
                                </Grid>
                                <Grid item xs={12} sm={3} mt={1}>
                                    <Button
                                        fullWidth
                                        color="secondary"
                                        variant="contained"
                                        type="button"
                                        onClick={onReset}
                                        startIcon={<Icon icon={zoomReset} />}
                                    >
                                        Reset
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
                   
                <Card>
                    <TeacherListToolbar
                        numSelected={selected.length}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TeacherListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={listTeachers.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {
                                        filteredTeachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { id, full_name, email, dni, phone, condition } = row;
                                            const isItemSelected = selected.indexOf(id) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell align="center">{full_name}</TableCell>
                                                    <TableCell align="center">{dni}</TableCell>
                                                    <TableCell align="center">{email}</TableCell>
                                                    <TableCell align="center">{phone}</TableCell>
                                                    <TableCell align="center">{condition}</TableCell>
                                                    <TableCell align="right">
                                                        <TeacherMoreMenu 
                                                            id={id}  
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    }
                                </TableBody>
                                {
                                    isUserNotFound 
                                    && 
                                    (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                    <SearchNotFound 
                                                        startSearch={startSearch} 
                                                        searchQuery={filterValue} 
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )
                                }
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={listTeachers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            { showMessage(message) }

        </Page>
    );
}

