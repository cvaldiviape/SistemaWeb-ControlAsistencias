import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect, Fragment } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeSquareFilled from '@iconify/icons-ant-design/close-square-outlined';
import searchIcon from '@iconify/icons-fa-solid/search';
import zoomReset from '@iconify/icons-bytesize/zoom-reset';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Page from '../../../../shared/Page';
import Scrollbar from '../../../../shared/Scrollbar';
import SearchNotFoundDate from '../../../../shared/SearchNotFoundDate';
import AssistanceListHead from './AssistanceListHead';
import AssistanceListToolbar from './AssistanceListToolbar';
import AssistanceMoreMenu from './AssistanceMoreMenu';
import GoogleMap from './GoogleMap';
import { getUserInfo } from '../../../../api/userApi';
import { getAllAssistances, deleteAssistance } from '../../../../api/assistanceApi';
import ConfirmDialogDelete from './ConfirmDialogDelete';
import ConfirmDialogDeleteMultiple from './ConfirmDialogDeleteMultiple';
import { Formik } from 'formik';
import moment from 'moment';
import { config } from '../../../../util/Config';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'date', label: 'Fecha',  align: 'center' },
    { id: 'hour', label: 'Hora',  align: 'center' },
    { id: 'full_name', label: 'Nombres y Apellidos',  align: 'center' },
    { id: 'dni', label: 'DNI',  align: 'center' },
    { id: 'subject', label: 'Área',  align: 'center' },
    { id: 'degree', label: 'Grado',  align: 'center' },
    { id: 'section', label: 'Sección',  align: 'center' },
    { id: 'location', label: 'Ubicación',  align: 'center' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (moment(new Date(b[orderBy])) < moment(new Date(a[orderBy]))) {
        return -1;
    }
    if (moment(new Date(b[orderBy])) > moment(new Date(a[orderBy]))) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'asc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, queryFilterValue, queryFromDate, queryToDate, startSearch) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
       
        return a[1] - b[1];
    });
   
    if(startSearch){
        if (queryFilterValue) {
            let listFilter = filter(array, (_assistance) => (
                (
                    (_assistance.section.toLowerCase() == queryFilterValue.toLowerCase())
                    ||
                    (_assistance.degree.toLowerCase() == queryFilterValue.toLowerCase())
                    ||
                    (_assistance.subject.toLowerCase() == queryFilterValue.toLowerCase())
                    ||
                    (_assistance.dni == queryFilterValue)
                )
                &&
                (
                    (moment(queryFromDate) <= moment(_assistance.date_search) && moment(_assistance.date_search) <= moment(queryToDate))
                )
            ));
            return listFilter;
        } else {
            let listFilter = filter(array, (_assistance) => (
                (moment(queryFromDate) <= moment(_assistance.date_search) && moment(_assistance.date_search) <= moment(queryToDate))
            ));
            return listFilter;
        }
    }
   
    return stabilizedThis.map((el) => el[0]);
}

export default function AssistanceAll() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('date');
    const [filterValue, setFilterValue] = useState('');
    const [filterFromDate, setFilterFronDate] = useState('');
    const [filterToDate, setFilterToDate] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [listAssistances, setListAssistances] = useState([]);
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [titleDialog, setTitleDialog] = useState('');
    const [subTitleDialog, setSubTitleDialog] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [idAssistanceDelete, setIdAssistanceDelete] = useState(null);
    const [openDialogMultiple, setOpenDialogMultiple] = useState(false);
    const [loading, setLoading] = useState(false);
    const [valuesSearch, setValuesSearch] = useState({
        filter_value: '',
        from_date: (new Date()),
        to_date: (new Date()),
    });
    const [startSearch, setStartSearch] = useState(false);
    const [searchFromDate, setSearchFromDate] = useState('');
    const [searchToDate, setSearchToDate] = useState('');
    const [location, setLocation] = useState(null);
    const userInfo = getUserInfo();
    
    useEffect(() => {
        getDataTable();
    }, [])

    const getDataTable = () => {
        let institution_code = userInfo.institution.code;
        getAllAssistances(institution_code).then((r)=>{
            setListAssistances(r.data.data);
        }).catch((e) => {
            console.log('Error de servidor, src/logged_in/components/assistance/all/AssistanceAll.js, line 148');
        });
    }

    const openDialogDelete = (id, fullName, registerDate) => {
        setTitleDialog(`¿Estas seguro que quieres eliminar la asistencia de "${fullName}"?`);
        setSubTitleDialog('Una vez que se elimine, no se podrá recuperar.');
        setOpenDialog(true);
        setIdAssistanceDelete(id);     
    }

    const onDelete= (id) => {
        deleteAssistance(id).then((r) => {
            if(r.data.success){
                setMessage("Asistencia eliminada.");
                setOpenMessage(true);
                getDataTable();
            }
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/assistance/all/AssistanceAll.js, line 163");
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
            deleteAssistance(id).then((r) => {
                getDataTable();
            }).catch((e) => {
                getDataTable();
                console("Error del servidor, src/logged_in/components/assistance/all/AssistanceAll.js, line 187");
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
            const newSelecteds = listAssistances.map((n) => n.id);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listAssistances.length) : 0;

    const filteredAssistances = applySortFilter(listAssistances, getComparator(order, orderBy), filterValue, filterFromDate, filterToDate, startSearch);

    const isUserNotFound = filteredAssistances.length === 0;

    function convertFormatDate (date){
        let day = ((date.getDate() < 10) ? "0" : "") + date.getDate();
        let month = ((date.getMonth() < 9) ? "0" : "") + (date.getMonth()+1);
        let year = date.getFullYear();

        let dateCustom = year + "-" + month + "-" + day;
        return dateCustom; 
    }

    function convertFormatDateForSearch (date){
        let day = ((date.getDate() < 10) ? "0" : "") + date.getDate();
        let month = ((date.getMonth() < 9) ? "0" : "") + (date.getMonth()+1);
        let year = date.getFullYear();

        let dateCustom = day + "/" + month + "/" + year;
        return dateCustom; 
    }

    const onSearch = (values) => {
        setLoading(true);
        setStartSearch(true);

        let valueFilter = values.filter_value;
        let fromDate = convertFormatDate(values.from_date);
        let toDate = convertFormatDate(values.to_date);
        
        setFilterValue(valueFilter);
        setFilterFronDate(fromDate);
        setFilterToDate(toDate);

        let sFromDate = convertFormatDateForSearch(values.from_date);
        let sToDate = convertFormatDateForSearch(values.to_date);

        setSearchFromDate(sFromDate);
        setSearchToDate(sToDate);

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
                    {( {values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue} ) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2} mb={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="filter_value"
                                        label="Busqueda: 'DNI/curso/grado/sección'"
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
                                <Grid item xs={12} sm={3}>
                                    <DesktopDatePicker
                                        id="from_date"
                                        name="from_date"
                                        label="Desde"
                                        value={values.from_date}
                                        onChange={(e) => {
                                            setFieldValue("from_date", e);
                                        }}
                                        renderInput={(params) => 
                                            <TextField 
                                                required 
                                                fullWidth 
                                                {...params} 
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <DesktopDatePicker
                                        id="to_date"
                                        name="to_date"
                                        label="Hasta"
                                        value={values.to_date}
                                        onChange={(e) => {
                                            setFieldValue("to_date", e);
                                        }}
                                        renderInput={(params) => 
                                            <TextField 
                                                required 
                                                fullWidth 
                                                {...params} 
                                            />
                                        }
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
                                        onClick={onReset}
                                        startIcon={<Icon icon={zoomReset} />}
                                    >
                                        Reset
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={3} mt={1}>
                                    <Button
                                        fullWidth
                                        color="primary"
                                        variant="contained"
                                        component={RouterLink}
                                        to="/dashboard/assistance/create"
                                        startIcon={<Icon icon={plusFill} />}
                                    >
                                        Nuevo
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
                   
                <Card>
                    <AssistanceListToolbar
                        numSelected={selected.length}
                        openDialogDeleteMultiple={openDialogDeleteMultiple}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <AssistanceListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={listAssistances.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {
                                        filteredAssistances.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { id, full_name, dni, subject, degree, section, hour, date, latitude, longitude} = row;
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
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) =>
                                                                handleClick(event, id)
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">{date}</TableCell>
                                                    <TableCell align="center">{hour}</TableCell>
                                                    <TableCell align="center">{full_name}</TableCell>
                                                    <TableCell align="center">{dni}</TableCell>
                                                    <TableCell align="center">{subject}</TableCell>
                                                    <TableCell align="center">{degree}</TableCell>
                                                    <TableCell align="center">{section}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton 
                                                            style={{color: "red"}} 
                                                            aria-label="location"
                                                            onClick={(event) => {
                                                                if(latitude == 0.00000 && longitude==0.00000 ){
                                                                    setMessage('Esta asistencia ha sido regularizada por el director.');
                                                                    setOpenMessage(true);
                                                                    setLocation(null);
                                                                }else{
                                                                    let new_location = {
                                                                            lat: latitude,
                                                                            lng: longitude
                                                                    }
                                                                    setLocation(new_location);
                                                                }
                                                            }}
                                                        >
                                                            <LocationOnIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                    
                                                    <TableCell align="right">
                                                        <AssistanceMoreMenu 
                                                            id={id} 
                                                            fullName={`${full_name}`}
                                                            registerDate={date}
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
                                                <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
                                                    <SearchNotFoundDate 
                                                        startSearch={startSearch} 
                                                        searchQuery={filterValue} 
                                                        searchFromDate={searchFromDate} 
                                                        searchToDate={searchToDate} 
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
                        count={listAssistances.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
                {
                    location
                    &&
                    <GoogleMap
                        location={location}
                    />
                }            
            </Container>

            { showMessage(message) }

            <ConfirmDialogDelete
                title={titleDialog}
                subTitle={subTitleDialog}
                open={openDialog}
                setOpen={setOpenDialog}
                id={idAssistanceDelete}
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
