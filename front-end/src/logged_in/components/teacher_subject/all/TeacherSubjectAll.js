import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect, Fragment } from 'react';
import closeSquareFilled from '@iconify/icons-ant-design/close-square-outlined';
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
} from '@material-ui/core';
import Page from '../../../../shared/Page';
import Scrollbar from '../../../../shared/Scrollbar';
import SearchNotFound from '../../../../shared/SearchNotFound';
import TeacherSubjectListHead from './TeacherSubjectListHead';
import TeacherSubjectListToolbar from './TeacherSubjectListToolbar';
import { getUserInfo } from '../../../../api/userApi';
import { getSubjectAssignmentOfTeacher } from '../../../../api/subjectAssignmentApi';
import { config } from '../../../../util/Config';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'subject', label: 'Área', alignRight: false },
    { id: 'degree', label: 'Grado', alignRight: false },
    { id: 'section', label: 'Sección', alignRight: false },
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
            (_user) => _user.id.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function TeacherSubjectAll() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('subject');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [listSubjects, setListSubjects] = useState([]);
    const userInfo = getUserInfo();
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        getDataTable();
    }, [])

    const getDataTable = () => {
        let teacher_id = userInfo.user.id;
        getSubjectAssignmentOfTeacher(teacher_id).then((r)=>{
            setListSubjects(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/teacher_subject/all/TeacherSubjectAll.js, line 87");
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
            const newSelecteds = listSubjects.map((n) => n.name);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listSubjects.length) : 0;

    const filteredUsers = applySortFilter(listSubjects, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Page title={config.title_page_teacher}>
            <Container>
              
                <Card>
                    <TeacherSubjectListToolbar
                        numSelected={selected.length}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TeacherSubjectListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={listSubjects.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            const {
                                                id,
                                                subject,
                                                degree,
                                                section,
                                            } = row;
                                            const isItemSelected =
                                                selected.indexOf(id) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >    
                                                    <TableCell align="center">{subject}</TableCell>
                                                    <TableCell align="center">{degree}</TableCell>
                                                    <TableCell align="center">{section}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    }
                                </TableBody>
                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={3} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={filterName} />
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
                        count={listSubjects.length}
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
