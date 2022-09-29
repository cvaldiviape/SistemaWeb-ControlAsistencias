import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect, Fragment } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeSquareFilled from '@iconify/icons-ant-design/close-square-outlined';
import searchIcon from '@iconify/icons-fa-solid/search';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
    Card,
    Table,
    Button,
    Checkbox,
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
// components
import Page from '../../../../shared/Page';
import Scrollbar from '../../../../shared/Scrollbar';
import SearchNotFound from '../../../../shared/SearchNotFound';
import UserListHead from './UserListHead';
import UserListToolbar from './UserListToolbar';
import UserMoreMenu from './UserMoreMenu';
import { getUsers, deleteUser } from '../../../../api/userApi';
import ConfirmDialogDelete from './ConfirmDialogDelete';
import ConfirmDialogDeleteMultiple from './ConfirmDialogDeleteMultiple';
import { Formik } from 'formik';
import { config } from '../../../../util/Config';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'full_name', label: 'Nombres y Apellidos', align: 'center' },
    { id: 'dni', label: 'DNI', align: 'center' },
    { id: 'email', label: 'Correo', align: 'center' },
    { id: 'phone', label: 'Teléfono', align: 'center' },
    { id: 'role', label: 'Rol', align: 'center' },
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
    return order === 'desc'
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
            (_user) =>  (
                (_user.full_name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
                ||
                (_user.dni.toLowerCase().indexOf(query.toLowerCase()) !== -1)
            )
        );
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function UserAll() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('role');
    const [filterValue, setFilterValue] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [listUsers, setListUsers] = useState([]);
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [titleDialog, setTitleDialog] = useState('');
    const [subTitleDialog, setSubTitleDialog] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [idUserDelete, setIdUserDelete] = useState(null);
    const [openDialogMultiple, setOpenDialogMultiple] = useState(false);
    const [loading, setLoading] = useState(false);
    const [valuesSearch, setValuesSearch] = useState({
        filter_value: '',
    });
    const [startSearch, setStartSearch] = useState(false);

    useEffect(() => {
        getDataTable();
    }, [])

    const getDataTable = () => {
        getUsers().then((r)=>{
            setListUsers(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/user/all/UserAll.js, line 113");
        });
    }

    const openDialogDelete = (id, fullName) => {
        setTitleDialog(`Estás seguro que quieres eliminar al usuario "${fullName}"`);
        setSubTitleDialog('Una vez que se elimine, no se podrá recuperar.');
        setOpenDialog(true);
        setIdUserDelete(id);     
    }

    const onDelete= (id) => {
        deleteUser(id).then((r) => {
            if(r.data.success){
                setMessage("Usuario eliminado.");
                setOpenMessage(true);
                getDataTable();
            }
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/user/all/UserAll.js, line 128");
            getDataTable();
        });
    }

    const openDialogDeleteMultiple = (numSelected) => {
        if(numSelected==1){
            setTitleDialog(`¿Estas seguro que quieres eliminar el registro seleccionado?`);
        }else{
            setTitleDialog(`¿Estas seguro que quieres eliminar los ${numSelected} registros seleccionados?`);
        }
        setSubTitleDialog(`Una vez se eliminen, no podran ser recuperados.`);
        setOpenDialogMultiple(true);
    }

    const onDeleteMultiple = (IDs)=> {
        IDs.map(id => {
            deleteUser(id).then((r) => {
                getDataTable();
            }).catch((e) => {
                console.log("Error del servidor, src/logged_in/components/user/all/UserAll.js, line 152");
                getDataTable();
            });
        });

        if(IDs.length > 1){
            setMessage(`${IDs.length} registros han sido eliminados.`);
            setOpenMessage(true);
        }else{
            setMessage(`1 registro ha sido eliminado.`);
            setOpenMessage(true);
        }
     
        setSelected([]);
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
                            // className={classes.close}
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
            const newSelecteds = listUsers.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listUsers.length) : 0;

    const filteredUsers = applySortFilter(listUsers, getComparator(order, orderBy), filterValue);

    const isUserNotFound = filteredUsers.length === 0;
   
    const onSearch = (values) => {
        setLoading(true);
        setStartSearch(true);
        setFilterValue(values.filter_value);
        setLoading(false);       
    }   

    return (
        <Page title={config.title_page_admin}>
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
                                        color="primary"
                                        variant="contained"
                                        component={RouterLink}
                                        to="/dashboard/user/create"
                                        startIcon={<Icon icon={plusFill} />}
                                    >
                                        Crear
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
                   
                <Card>
                    <UserListToolbar
                        numSelected={selected.length}
                        openDialogDeleteMultiple={openDialogDeleteMultiple}
                    />
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={listUsers.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {
                                        filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { id, full_name, email, dni, phone, role } = row;
                                            const isItemSelected = selected.indexOf(id) !== -1;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    //role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) =>
                                                                handleClick(event, id)
                                                            }
                                                        />
                                                    </TableCell>
                                                    
                                                    <TableCell align="center">{full_name}</TableCell>
                                                    <TableCell align="center">{dni}</TableCell>
                                                    <TableCell align="center">{email}</TableCell>
                                                    <TableCell align="center">{phone}</TableCell>
                                                    <TableCell align="center">{role}</TableCell>

                                                    <TableCell align="right">
                                                        <UserMoreMenu 
                                                            id={id} 
                                                            fullName={full_name}
                                                            openDialogDelete={openDialogDelete} 
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
                        count={listUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            { showMessage(message) }

            <ConfirmDialogDelete
                title={titleDialog}
                subTitle={subTitleDialog}
                open={openDialog}
                setOpen={setOpenDialog}
                id={idUserDelete}
                onDelete={onDelete}
            />

            <ConfirmDialogDeleteMultiple
                title={titleDialog}
                subTitle={subTitleDialog}
                open={openDialogMultiple}
                setOpen={setOpenDialogMultiple}
                IDs={selected}
                onDeleteMultiple={onDeleteMultiple}
            />
        </Page>
    );
}
