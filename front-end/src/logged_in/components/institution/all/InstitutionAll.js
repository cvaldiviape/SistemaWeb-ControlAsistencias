import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect, Fragment } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeSquareFilled from '@iconify/icons-ant-design/close-square-outlined';
import searchIcon from '@iconify/icons-fa-solid/search';
import { Link as RouterLink } from 'react-router-dom';
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
import Page from '../../../../shared/Page';
import Scrollbar from '../../../../shared/Scrollbar';
import SearchNotFound from '../../../../shared/SearchNotFound';
import InstitutionListHead from './InstitutionListHead';
import InstitutionListToolbar from './InstitutionListToolbar';
import InstitutionMoreMenu from './InstitutionMoreMenu';
import { getInstitutions, deleteInstitution } from '../../../../api/institutionApi';
import ConfirmDialogDelete from './ConfirmDialogDelete';
import ConfirmDialogDeleteMultiple from './ConfirmDialogDeleteMultiple.js';
import { Formik } from 'formik';
import { config } from '../../../../util/Config';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'code', label: 'Código', align: 'center'},
    { id: 'name', label: 'Nombre', align: 'center' },
    { id: 'phone', label: 'Teléfono', align: 'center' },
    { id: 'ugel', label: 'Ugel', align: 'center' },
    { id: 'region', label: 'Región', align: 'center' },
    { id: 'department', label: 'Departamento', align: 'center' }
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
            (_institution) =>  (
                (_institution.code.toLowerCase().indexOf(query.toLowerCase()) !== -1)
                ||
                (_institution.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
                ||
                (_institution.ugel.toLowerCase().indexOf(query.toLowerCase()) !== -1)
                ||
                (_institution.region.toLowerCase().indexOf(query.toLowerCase()) !== -1)
                ||
                (_institution.department.toLowerCase().indexOf(query.toLowerCase()) !== -1)
            )
            
        );
    }
    
    return stabilizedThis.map((el) => el[0]);
}

export default function InstitutionAll() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('code');
    const [filterValue, setFilterValue] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [listInstitutions, setListInstiturions] = useState([]);
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [titleDialog, setTitleDialog] = useState('');
    const [subTitleDialog, setSubTitleDialog] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [idInstitutionDelete, setIdInstitutionDelete] = useState(null);
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
        getInstitutions().then((r)=>{
            setListInstiturions(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/institution/all/InstitutionAll.js, line 122");
        });
    }

    const openDialogDelete = (id, nameInstitution) => {
        setTitleDialog(`Estás seguro que quieres eliminar la institución "${nameInstitution}"`);
        setSubTitleDialog('Una vez que se elimine, no se podrá recuperar.');
        setOpenDialog(true);
        setIdInstitutionDelete(id);     
    }

    const onDelete= (id) => {
        deleteInstitution(id).then((r) => {
            if(r.data.success){
                setMessage("Institución eliminada.");
                setOpenMessage(true);
                getDataTable();
            }
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/institution/all/InstitutionAll.js, line 137");
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
            deleteInstitution(id).then((r) => {
                getDataTable();
            }).catch((e) => {
                console.log("Error del servidor, src/logged_in/components/institution/all/InstitutionAll.js, line 161");
                getDataTable();
            });
        });

        if(IDs.length > 1){
            setMessage(`${IDs.length} registros han sido eliminados.`);
            setOpenMessage(true);
        }else if(IDs.length == 1){
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
            const newSelecteds = listInstitutions.map((n) => n.id);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listInstitutions.length) : 0;

    const filteredInstitutions = applySortFilter(listInstitutions, getComparator(order, orderBy), filterValue);
  
    const isInsitutionNotFound = filteredInstitutions.length === 0;

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
                                        label="Busqueda: 'codigo/nombre/ugel/region/departamento'"
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
                                        to="/dashboard/institution/create"
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
                    <InstitutionListToolbar
                        numSelected={selected.length}
                        openDialogDeleteMultiple={openDialogDeleteMultiple}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <InstitutionListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={listInstitutions.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {
                                        filteredInstitutions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { id, code, name, phone, ugel, region, department } = row;
                                            const isItemSelected = selected.indexOf(id) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
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

                                                    <TableCell align="center">{code}</TableCell>
                                                    <TableCell align="center">{name}</TableCell>
                                                    <TableCell align="center">{phone}</TableCell>
                                                    <TableCell align="center">{ugel}</TableCell>
                                                    <TableCell align="center">{region}</TableCell>
                                                    <TableCell align="center">{department}</TableCell>

                                                    <TableCell align="right">
                                                        <InstitutionMoreMenu 
                                                            id={id} 
                                                            nameInstitution={`${name}`}
                                                            openDialogDelete={openDialogDelete} 
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={8} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                {isInsitutionNotFound && (
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
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={listInstitutions.length}
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
                id={idInstitutionDelete}
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
