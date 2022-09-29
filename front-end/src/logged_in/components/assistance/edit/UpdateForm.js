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
import { useHistory, useParams } from 'react-router-dom';
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
import { updateAssistance, getAssistanceById } from '../../../../api/assistanceApi';
import { Formik } from 'formik';

const UpdateForm = () => {
    const history = useHistory();
    const params = useParams();
    const userInfo = getUserInfo();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [assistance, setAssistance] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjectAssignmentId, setSubjectAssignmentId] = useState(null);
    const [showSelectDegree, setShowSelectDegree] = useState(false);
    const [showSelectSection, setShowSelectSection] = useState(false);

    useEffect(() => {
        getDataTeachers();
        getDataAssistance();
    }, []);

    const getDataAssistance = () => {
        let assistance_id = params.id;
        getAssistanceById(assistance_id).then((r) => {
            if(r.data.data){
                const assistance = r.data.data.assistance;
                const subject_assignment = r.data.data.subject_assignment;

                const new_assistance = {
                    id              : assistance.id,
                    teacher_id      : assistance.user_id,
                    subject_id      : subject_assignment.subject_id,
                    degree_id       : subject_assignment.degree_id,
                    section_id      : subject_assignment.section_id,
                    theme           : assistance.theme,
                    comments        : assistance.comments,
                    register_date   : new Date(assistance.register_date)
                };
                setAssistance(new_assistance)
            
                let teacher_id = assistance.user_id;
                let subject_id = subject_assignment.subject_id;
                let degree_id = subject_assignment.degree_id;
                let section_id = subject_assignment.section_id;

                getDataSubjects({target: {value: teacher_id}});
                getDataDegrees({target: {value: subject_id}}, teacher_id);
                getDataSections({target: {value: degree_id}}, teacher_id, subject_id);
                getSubjectAssignmentId({target: {value: section_id}}, teacher_id, subject_id, degree_id);
            }
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/assistance/edit/UpdateForm.js, line 52");
        });
    }

    const getDataTeachers = () =>{
        searchTeacher('', userInfo.institution.code).then((r) => {
            setTeachers(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/assistance/edit/UpdateForm.js, line 85");
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
            setMessage("Error del servidor, src/logged_in/components/assistance/edit/UpdateForm.js, line 98");
            setOpen(true);
        });
    }

    const getDataDegrees = (e, teacher_id) => {
        let subject_id = e.target.value;
        setDegrees([]);
        setSections([]);

        getDegreesOfTeacher(teacher_id, subject_id).then((r) => {
            setDegrees(r.data.data);
            setShowSelectDegree(true);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/assistance/edit/UpdateForm.js, line 111");
        });
    }

    const getDataSections = (e, teacher_id, subject_id) => {
        let degree_id = e.target.value;
        setSections([]);
        getSectionsOfTeacher(teacher_id, subject_id, degree_id).then((r) => {
            setSections(r.data.data);
            setShowSelectSection(true);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/assistance/edit/UpdateForm.js, line 122");
        });
    }

    const getSubjectAssignmentId = (e, teacher_id, subject_id, degree_id) => {
        let section_id =  e.target.value;  
        let institution_id = userInfo.institution.id;

        getSubjectAssignmentByIds(institution_id, teacher_id, subject_id, degree_id, section_id).then((r) => {
            setSubjectAssignmentId(r.data.data.id);
        }).catch((e) => {
            setMessage("Error del servidor, src/logged_in/components/assistance/edit/UpdateForm.js, line 134");
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
            id: values.id,
            register_date: dateTime,
            user_id: values.teacher_id,
            subject_assignment_id: subjectAssignmentId,
            theme: values.theme,
            comments: values.comments,
        };
        setLoading(true);

        updateAssistance(assistance).then((r) => {
            if(r.data.success){
                setMessage('Asistencia modificada exitosamente.');
                setOpen(true);
                setLoading(false);
            }
        }).catch((e) => {
            if(e.response.data.message){
                setMessage(e.response.data.message);
                setOpen(true);
                setLoading(false);
            }else{
                console.log("Error del servidor, src/logged_in/components/assistance/edit/UpdateForm.js, line 165");
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

    const validate = ({theme, comments}) => {
        let errores = {};
        if(validationTheme(theme)){
            errores.theme = validationTheme(theme);
        }
        if(validationComments(comments)){
            errores.comments = validationComments(comments);
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
        }else if(!/^[a-zA-ZÀ-ÿ0-9\.\-\_\#\°\,\/\:\;\s]{2,600}$/.test(theme)){
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

    return (
        <Container component="main">
            <CssBaseline />
            {
                assistance
                &&
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
                                        {
                                            (Array.isArray(teachers) && teachers.length > 0) 
                                            &&
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
                                                    teachers.map((row) => (
                                                        <MenuItem value={row.id} key={row.id}>
                                                            {row.full_name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                        
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_subject">Área *</InputLabel>
                                        {
                                            (Array.isArray(subjects) && subjects.length > 0) 
                                            &&
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
                                                    subjects.map((row) => (
                                                        <MenuItem value={row.id} key={row.id}>
                                                            {row.name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_degree">Grado *</InputLabel>
                                        {
                                            (Array.isArray(degrees) && showSelectDegree) 
                                            &&
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
                                                    degrees.map((row) => (
                                                        <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
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
                                            e.target.value = e.target.value.slice(0,70)
                                        }}  
                                    />  
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_section">Sección *</InputLabel>
                                        {
                                            (Array.isArray(sections) && showSelectSection) 
                                            &&
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
                                                    sections.map((row) => (
                                                        <MenuItem value={row.id} key={row.id}>{row.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
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
                                        required
                                        fullWidth
                                        id="register_date"
                                        name="register_date"
                                        label="Fecha y hora"
                                        value={values.register_date}
                                        onChange={(e) => {
                                            setFieldValue("register_date", e);
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
                            </Grid>

                            <Grid container spacing={2} sx={{ mt: 3, mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        //   component={RouterLink}
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
                                        Modificar
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>           
            }
            { showMessage(message) }                         
        </Container>
    );
}

export default UpdateForm;