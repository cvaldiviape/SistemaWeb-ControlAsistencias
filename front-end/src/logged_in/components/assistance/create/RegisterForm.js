import React, { useState, useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useHistory } from 'react-router-dom';
import { Icon } from '@iconify/react';
import checkmarkSquare2Fill from '@iconify/icons-eva/checkmark-square-2-fill';
import backspaceFill from '@iconify/icons-eva/backspace-fill';
import closeSquareFilled from '@iconify/icons-ant-design/close-square-outlined';
import LoadingButton from '@mui/lab/LoadingButton';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { getUserInfo } from '../../../../api/userApi';
import { searchTeacher } from '../../../../api/teacherApi';
import { getSubjectsOfTeacher } from '../../../../api/subjectApi';
import { getDegreesOfTeacher } from '../../../../api/degreeApi';
import { getSectionsOfTeacher } from '../../../../api/sectionApi';
import { getSubjectAssignmentByIds } from '../../../../api/subjectAssignmentApi';
import { registerAssistance } from '../../../../api/assistanceApi';
import { Formik } from 'formik';

const RegisterForm = () => {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [assistance, setAssistance] = useState({
        teacher_id: '',
        subject_id: '',
        degree_id: '',
        section_id: '',
        theme: '',
        comments: '',
        register_date: (new Date()),
        latitude: 0,
        longitude: 0,
    });
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [sections, setSections] = useState([]);

    const [subjectAssignmentId, setSubjectAssignmentId] = useState(null);

    useEffect(() => {
        getDataTeachers();
    }, []);

    const getDataTeachers = () =>{
        const userInfo = getUserInfo();
        searchTeacher('', userInfo.institution.code).then((r) => {
            setTeachers(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/assistance/create/RegisterForm.js, line 58");
        });
    }

    const getDataSubjects = (e) => {
        let teacher_id = e.target.value;
        setSubjects([]);
        setDegrees([]);
        setSections([]);
        getSubjectsOfTeacher(teacher_id).then((r) => {
             setSubjects(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/assistance/create/RegisterForm.js, line 70");
        });
    }

    const getDataDegrees = (e, teacher_id) => {
        let subject_id = e.target.value;
        setDegrees([]);
        setSections([]);
        getDegreesOfTeacher(teacher_id, subject_id).then((r) => {
            setDegrees(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/assistance/create/RegisterForm.js, line 81");
        });
    }

    const getDataSections = (e, teacher_id, subject_id) => {
        let degree_id = e.target.value;
        setSections([]);
        getSectionsOfTeacher(teacher_id, subject_id, degree_id).then((r) => {
            setSections(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/assistance/create/RegisterForm.js, line 91");
        });
    }

    const getSubjectAssignmentId = (e, teacher_id, subject_id, degree_id) => {
        let section_id =  e.target.value;  
        let dataAuth = getUserInfo();
        let institution_id = dataAuth.institution.id;

        getSubjectAssignmentByIds(institution_id, teacher_id, subject_id, degree_id, section_id).then((r) => {
            setSubjectAssignmentId(r.data.data.id);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/assistance/create/RegisterForm.js, line 103");
        });
    }

    function convertFormatDateTime (dateTime){
        let hours = ((dateTime.getHours() < 10) ? "0" : "") + dateTime.getHours();
        let minutes = ((dateTime.getMinutes() < 10) ? "0" : "") + dateTime.getMinutes();
        let seconds = ((dateTime.getSeconds() < 10) ? "0" : "") + dateTime.getSeconds();
        let day = ((dateTime.getDate() < 10) ? "0" : "") + dateTime.getDate();
        let month = ((dateTime.getMonth() < 9) ? "0" : "") + (dateTime.getMonth()+1);
        let year = dateTime.getFullYear();

        let dateTimeCustom = year + "-" + month + "-" + day + ' ' + hours + ":" + minutes + ":" + seconds;
        return dateTimeCustom; 
    }

    const submit = (values, {resetForm}) => {

        let dateTime = convertFormatDateTime(values.register_date);

        let assistance = {
            register_date           : dateTime,
            user_id                 : values.teacher_id,
            subject_assignment_id   : subjectAssignmentId,
            theme                   : values.theme,
            comments                : values.comments,
            latitude                : 0,
            longitude               : 0,
        };
        
        setLoading(true);
        registerAssistance(assistance).then((r) => {
            if(r.data.success){
                resetForm();
                setMessage('Asistencia registrada exitosamente.');
                setOpen(true);
                setLoading(false);
            }
        }).catch((e) => {
            if(e.response.data.message){
                setMessage(e.response.data.message);
                setOpen(true);
                setLoading(false);
            }else{
                console.log('Error del servidor, src/logged_in/components/assistance/create/RegisterForm.js, line 137');
                setLoading(false);
            }
        })
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    const showMessage = (message) => (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={open}
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

    const back = () => {
        history.push('/dashboard/assistance');
    }

    const validate = ({theme, comments, register_date}) => {
        let errores = {};
        if(validationTheme(theme)){
            errores.theme = validationTheme(theme);
        }
        if(validationComments(comments)){
            errores.comments = validationComments(comments);
        }
        if(validationRegisterDate(register_date)){
            errores.register_date = validationRegisterDate(register_date);
        }
        return errores;
    }

    const validationTheme = (theme) => {
        let mesage_error = null;
        if(!theme){
            mesage_error = "Por favor ingresa un tema.";
        }else if(/^[\s]+[a-zA-ZÀ-ÿ\s]+/.test(theme)){
            mesage_error = "El tema no puede empezar con espacios.";
        }else if(/[a-zA-ZÀ-ÿ\s]+[\s]+$/.test(theme)){
            mesage_error = "El tema no puede terminar con espacios.";
        }else if(!/^[a-zA-ZÀ-ÿ0-9\.\-\_\#\°\,\/\:\;\s]{2,100}$/.test(theme)){
            mesage_error = "El tema solo puede contener letras, números, espacios, y los siguientes simbolos: # - _ : ; / ° ";
        }
        return mesage_error;
    }

    const validationComments = (comments) => {
        let mesage_error = null;
        if(!comments){
            mesage_error = "Por favor ingresa un comentario.";
        }else if(/^[\s]+[a-zA-ZÀ-ÿ\s]+/.test(comments)){
            mesage_error = "El comentario no puede empezar con espacios.";
        }else if(/[a-zA-ZÀ-ÿ\s]+[\s]+$/.test(comments)){
            mesage_error = "El comentario no puede terminar con espacios.";
        }else if(!/^[a-zA-ZÀ-ÿ0-9\.\-\_\#\°\,\/\:\;\s]{2,600}$/.test(comments)){
            mesage_error = "El comentario solo puede contener letras, números, espacios, y los siguientes simbolos: # - _ : ; / ° ";
        }
        return mesage_error;
    }

    const validationRegisterDate = (register_date) => {
        let mesage_error = null;

        if(register_date=='Invalid Date' || register_date==null){
            mesage_error = "Por favor ingresa un fecha y hora valida.";
        }
        return mesage_error;
    }
    
    return (
        <Container component="main">
            <CssBaseline />

            <Formik
                initialValues={assistance}
                validate={validate}
                onSubmit={submit}
            >
                {( {values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue} ) => (
                    <form onSubmit={handleSubmit}>     
                        <Grid container spacing={2}>
                           
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label_teacher">Docente *</InputLabel>
                                    <Select
                                        required
                                        labelId="demo-simple-select-label_teacher"
                                        id="teacher_id"
                                        name="teacher_id"
                                        label="Docente *"
                                        value={values.teacher_id || ''}
                                        onChange={(e) => {
                                            handleChange(e); 
                                            setFieldValue("subject_id", "");
                                            setFieldValue("degree_id", "");
                                            setFieldValue("section_id", "");
                                            getDataSubjects(e); 
                                        }}
                                    >
                                        {
                                            (Array.isArray(teachers) && teachers.length > 0) 
                                            &&
                                            teachers.map((row) => (
                                                <MenuItem value={row.id} key={row.id}>{`${row.full_name}`}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label_subject">Área *</InputLabel>
                                    <Select
                                        required
                                        labelId="demo-simple-select-label_subject"
                                        id="subject_id"
                                        name="subject_id"
                                        label="Área *"
                                        value={values.subject_id || ''}
                                        onChange={(e) => {
                                            handleChange(e); 
                                            setFieldValue("degree_id", "");
                                            setFieldValue("section_id", "");
                                            getDataDegrees(e, values.teacher_id);
                                        }}
                                    >
                                        {
                                            (Array.isArray(subjects) && subjects.length > 0) 
                                            &&
                                            subjects.map((row) => (
                                                <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label_degree">Grado *</InputLabel>
                                    <Select
                                        required
                                        labelId="demo-simple-select-label_degree"
                                        id="degree_id"
                                        name="degree_id"
                                        label="Grado *"
                                        value={values.degree_id || ''}
                                        onChange={(e) => {
                                            handleChange(e); 
                                            setFieldValue("section_id", "");
                                            getDataSections(e, values.teacher_id, values.subject_id);
                                        }}
                                    >
                                        {
                                            (Array.isArray(degrees) && degrees.length > 0) 
                                            &&
                                            degrees.map((row) => (
                                                <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={9}>
                                <TextField
                                    required
                                    fullWidth
                                    id="theme"
                                    label="Tema"
                                    name="theme"
                                    autoComplete="theme"
                                    value={values.theme || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(errors.theme && touched.theme)} 
                                    helperText={touched.theme && errors.theme} 
                                    type="text"    
                                    onInput = {(e) =>{
                                        e.target.value = e.target.value.slice(0,100)
                                    }}  
                                />  
                            </Grid>
                           
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label_section">Sección *</InputLabel>
                                    <Select
                                        required
                                        labelId="demo-simple-select-label_section"
                                        id="section_id"
                                        name="section_id"
                                        label="Sección *"
                                        value={values.section_id || ''}
                                        onChange={(e) => {
                                            handleChange(e); 
                                            getSubjectAssignmentId(e, values.teacher_id, values.subject_id, values.degree_id);
                                        }}
                                    >
                                        {
                                            (Array.isArray(sections) && sections.length > 0) 
                                            &&
                                            sections.map((row) => (
                                                <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={9}>
                                <TextField
                                    required
                                    fullWidth
                                    id="comments"
                                    label="Comentarios"
                                    name="comments"
                                    autoComplete="comments"
                                    value={values.comments || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(errors.comments && touched.comments)} 
                                    helperText={touched.comments && errors.comments} 
                                    type="text"    
                                    onInput = {(e) =>{
                                        e.target.value = e.target.value.slice(0,100)
                                    }}  
                                />  
                            </Grid>
                            
                            <Grid item xs={12} sm={3}>
                                <DateTimePicker
                                    ampm
                                    id="register_date"
                                    name="register_date"
                                    label="Fecha y hora"
                                    value={values.register_date}
                                    onChange={(e) => {
                                        setFieldValue("register_date", e);
                                    }}
                                    renderInput={(params, onChange) => 
                                        <TextField 
                                            required 
                                            fullWidth 
                                            id="datetime"
                                            name="datetime"
                                            
                                            value={values.register_date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={Boolean(errors.register_date && touched.register_date)} 
                                            helperText={touched.register_date && errors.register_date} 
                                            {...params} 
                                        />
                                    }
                                />
                            </Grid>
                           
                        </Grid>

                        <Grid container spacing={2} sx={{ mt: 3, mb: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<Icon icon={backspaceFill} />}
                                    onClick={back}
                                >
                                    Volver
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LoadingButton
                                    fullWidth
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                    loading={loading}
                                    loadingPosition="start"
                                    startIcon={<Icon icon={checkmarkSquare2Fill} />}
                                >
                                    Registrar
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>           
            { showMessage(message) }                         
        </Container>
    );
}

export default RegisterForm;