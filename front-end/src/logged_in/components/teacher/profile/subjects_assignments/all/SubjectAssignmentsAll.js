import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, Fragment } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeSquareFilled from '@iconify/icons-ant-design/close-square-outlined';
import {
    Card,
    Table,
    Stack,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    Snackbar,
    IconButton,
} from '@material-ui/core';
import Page from '../../../../../../shared/Page';
import Scrollbar from '../../../../../../shared/Scrollbar';
import SearchNotFound from '../../../../../../shared/SearchNotFound';
import SubjectListHead from './SubjectListHead';
import SubjectMoreMenu from './SubjectMoreMenu';
import { deleteSubjectAssignment, getSubjectAssignmentById } from '../../../../../../api/subjectAssignmentApi';
import ConfirmDialog from './ConfirmDialog';
import SubjectAssignmentsCreate from '../create/SubjectAssignmentsCreate';
import SubjectAssignmentsEdit from '../edit/SubjectAssignmentsEdit';
import { config } from '../../../../../../util/Config';

const TABLE_HEAD = [
    { id: 'subject', label: 'Área', align: "center" },
    { id: 'degree', label: 'Grado', align: "center" },
    { id: 'section', label: 'Sección', align: "center" },
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
            (_user) => _user.subject.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function SubjectAssignmentsAll (props) { 
    const { listSubjects, userId, institutionCode, getDataTeacher } = props;
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('subject');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [message, setMessage] = useState('');
    const [openMessage, setOpenMessage] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');
    const [subTitleDialog, setSubTitleDialog] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [idSubjectAssignmentDelete, setIdSubjectAssignmentDelete] = useState(null);
    const [openDialogFormCreate, setOpenDialogFormCreate] = useState(false);
    const [openDialogFormEdit, setOpenDialogFormEdit] = useState(false);
    const [subjectAssignment, setSubjectAssignment] = useState(null);

    const openDialogDelete = (id, subject, degree, section) => {
        setTitleDialog(`Estas seguro que quieres eliminar el Área de "${subject}" que esta asignado a "${degree}" de la sección "${section}"?`);
        setSubTitleDialog('Una vez que se elimine, no se podrá recuperar.');
        setOpenDialog(true);
        setIdSubjectAssignmentDelete(id);     
    }

    const openFormCreate = () => {
        setOpenDialogFormCreate(true);   
    }

    const openFormEdit = (id) => {
        getSubjectAssignmentById(id).then((r) => {
            let subjectAssigment = {
                id              : r.data.data.subject_assignment.id,
                subject_code    : r.data.data.subject.code,
                degree_code     : r.data.data.degree.code,
                section_code    : r.data.data.section.code,
                institution_code: r.data.data.institution.code,
                name            : r.data.data.subject_assignment.name,
                year            : r.data.data.subject_assignment.year
            };
            setSubjectAssignment(subjectAssigment);
            setOpenDialogFormEdit(true); 
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/teacher/profile/subjects_assignments/all/SubjectAssignmentsAll.js, line 102");
        });
    }

    const onDelete= (id) => {
        deleteSubjectAssignment(id).then((r) => {
            if(r.data.success){
                setMessage("Área eliminada.");
                setOpenMessage(true);
                getDataTeacher();
            }
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/teacher/profile/subjects_assignments/all/SubjectAssignmentsAll.js, line 120");
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
        <Page title={config.title_page_director}>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h4" gutterBottom>
                    Áreas Asignadas:
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={openFormCreate}
                        startIcon={<Icon icon={plusFill} />}
                    >
                        Asignar Área
                    </Button>
                </Stack>

                <Card>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <SubjectListHead
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
                                        .map((row, index) => {
                                            const {
                                                id,
                                                subject,
                                                degree,
                                                section
                                            } = row;
                                            const isItemSelected =
                                                selected.indexOf(subject) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={index}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell align="center">{subject}</TableCell>
                                                    <TableCell align="center">{degree}</TableCell>
                                                    <TableCell align="center">{section}</TableCell>

                                                    <TableCell align="right">
                                                        <SubjectMoreMenu 
                                                            id={id} 
                                                            subject={subject}
                                                            degree={degree}
                                                            section={section}
                                                            openDialogDelete={openDialogDelete} 
                                                            openFormEdit={openFormEdit}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    }
                                </TableBody>
                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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

            <ConfirmDialog
                title={titleDialog}
                subTitle={subTitleDialog}
                open={openDialog}
                setOpen={setOpenDialog}
                id={idSubjectAssignmentDelete}
                onDelete={onDelete}
            />

            <SubjectAssignmentsCreate
                open={openDialogFormCreate}
                setOpen={setOpenDialogFormCreate}
                userId={userId}
                institutionCode={institutionCode}
                getDataTeacher={getDataTeacher}
                setMessage={setMessage}
                setOpenMessage={setOpenMessage}
            />

            {
                openDialogFormEdit
                &&
                 <SubjectAssignmentsEdit
                    open={openDialogFormEdit}
                    setOpen={setOpenDialogFormEdit}
                    subjectAssignment={subjectAssignment}
                    getDataTeacher={getDataTeacher}
                    setMessage={setMessage}
                    setOpenMessage={setOpenMessage}
                />
            }       

            { showMessage(message) }

        </Page>
    );
}

