import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Button,
    TextField,
    InputLabel,
    Grid,
    MenuItem,
    FormControl,
    Select, Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Icon } from '@iconify/react';
import checkmarkSquare2Fill from '@iconify/icons-eva/checkmark-square-2-fill';
import backspaceFill from '@iconify/icons-eva/backspace-fill';
import LoadingButton from '@mui/lab/LoadingButton';
import { Formik } from 'formik';
import { getSubjects } from '../../../../../../api/subjectApi';
import { getDegrees } from '../../../../../../api/degreeApi';
import { getSections } from '../../../../../../api/sectionApi';
import { registerSubjectAssignment } from '../../../../../../api/subjectAssignmentApi';

const useStyles = makeStyles((theme) => ({
    dialog: {
        position: 'absolute',
        width: 'fit-content'
    },
    dialogTitle: {
        textAlign: 'center'
    },
    dialogContent: {
        //textAlign: 'center'
    },
    dialogAction: {
        justifyContent: 'center'
    },
    titleIcon: {
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: theme.palette.secondary.light,
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '8rem'
        }
    }
}));

export default function SubjectAssignmentsCreate(props) {
    const { open, setOpen, userId, institutionCode, getDataTeacher, setMessage, setOpenMessage } = props;
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [subjectAssignment, setSubjectAssignment] = useState({
        user_id: userId,
        subject_code: '',
        degree_code: '',
        section_code: '',
        institution_code: institutionCode,
        year: '',
        name: ''
    });
    const [subjects, setSubjects] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [sections, setSections] = useState([]);
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('xl');

    useEffect(() => {
        getDataSubjects();
        getDataDegrees(); 
    }, []);

    const getDataSubjects = () => {
        getSubjects().then((r) => {
            setSubjects(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/teacher/profile/subjects_assignments/create/SubjectAssignmentsCreate.js, line 78"); 
        });
    };

    const getDataDegrees = () => {
        getDegrees().then((r) => {
            setDegrees(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/teacher/profile/subjects_assignments/create/SubjectAssignmentsCreate.js, line 86");
        });
    };

    const getDataSections = (e) => {
        const degree_code = e.target.value;
        getSections(degree_code).then((r) => {
            setSections(r.data.data);
        }).catch((e) => {
            setMessage("Error del servidor, src/logged_in/components/teacher/profile/subjects_assignments/create/SubjectAssignmentsCreate.js, line 95");
            setOpenMessage(true);
        });
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const submit = (values, { resetForm }) => {
        setLoading(true);
        registerSubjectAssignment(values).then((r) =>{
            if (r.data.success) {
                resetForm();
                setMessage('La asignación del Área fue exitosa.');
                setOpenMessage(true);
                setLoading(false);
                getDataTeacher();
                setOpen(false);
            }
        }).catch((e)=> {
            if(e.response){
                setMessage(e.response.data.message);
                setOpenMessage(true);
                setLoading(false);
            }else{
                console.log('Error del servidor, src/logged_in/components/teacher/profile/subjects_assignments/create/SubjectAssignmentsCreate.js, line 109');
            }
            setLoading(false);
        })
    };

    const back = () => {
        setOpen(false);
    };

    const validate = ({name, year}) => {
        let errores = {};
        if (validationName(name)) {
            errores.name = validationName(name);
        }
        if (validationYear(year)) {
            errores.year = validationYear(year);
        }
        return errores;
    };

    const validationName = (name) => {
        let mesage_error = null;
        if (!name) {
            mesage_error = 'Por favor ingresa un nombre.';
        } else if (/^[\s]+[a-zA-ZÀ-ÿ\s]+/.test(name)) {
            mesage_error = 'El nombre no puede empezar con espacios.';
        } else if (/[a-zA-ZÀ-ÿ\s]+[\s]+$/.test(name)) {
            mesage_error = 'El nombre no puede terminar con espacios.';
        } else if (!/^[a-zA-ZÀ-ÿ\s]{2,25}$/.test(name)) {
            mesage_error = 'El nombre solo puede contener letras y espacios.';
        }
        return mesage_error;
    };

    const validationYear = (year) => {
        let mesage_error = null;
        if (!year) {
            mesage_error = 'Por favor ingresa el Año.';
        } else if (!/^\d{4}$/.test(year)) {
            mesage_error = 'El Año debe contener 4 digitos.';
        }
        return mesage_error;
    };

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            classes={{ paper: classes.dialog }}
        >
            <DialogTitle className={classes.dialogTitle}>
                <Box sx={{ mb: 0 }}>
                        <Typography variant="h4" gutterBottom>
                            Asignación de Área
                        </Typography>
                    </Box>
            </DialogTitle>

            <DialogContent className={classes.dialogContent}>
                <br/>
                <Formik 
                    initialValues={subjectAssignment} 
                    validate={validate} 
                    onSubmit={submit}
                    enableReinitialize={true}
                >
                    {({ values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_role">Área *</InputLabel>
                                        <Select
                                            required
                                            labelId="demo-simple-select-label_role"
                                            id="subject_code"
                                            name="subject_code"
                                            label="Área *"
                                            value={values.subject_code || ''}
                                            onChange={handleChange}
                                        >
                                            {
                                                (Array.isArray(subjects) && subjects.length > 0) 
                                                &&
                                                subjects.map((row) => (
                                                    <MenuItem value={row.code} key={row.code}>
                                                        {row.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_degree">Grado *</InputLabel>
                                        {
                                            <Select
                                                required
                                                labelId="demo-simple-select-label_degree"
                                                id="degree_code"
                                                name="degree_code"
                                                label="Grado *"
                                                value={values.degree_code || ''}
                                                onChange={(e) => {
                                                    handleChange(e); 
                                                    setFieldValue("section_code", "");
                                                    getDataSections(e);
                                                }}
                                            >
                                                {   
                                                    (Array.isArray(degrees) && degrees.length > 0) 
                                                    &&
                                                    degrees.map((row) => (
                                                        <MenuItem value={row.code} key={row.code}>
                                                            {row.name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                        
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_role">Sección *</InputLabel>
                                        {
                                            (Array.isArray(sections)) 
                                            &&
                                            <Select
                                                required
                                                labelId="demo-simple-select-label_role"
                                                id="section_code"
                                                name="section_code"
                                                label="Sección *"
                                                value={values.section_code || ''}
                                                onChange={handleChange}
                                            >
                                                {   
                                                    sections.map((row) => (
                                                        <MenuItem value={row.code} key={row.code}>
                                                            {row.name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                    </FormControl>
                                </Grid>                            
                               
                                <Grid item xs={12} sm={10}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="name"
                                        label="Nombre"
                                        name="name"
                                        autoComplete="name"
                                        value={values.name || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                        type="text"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.slice(0, 30);
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="year"
                                        label="Año"
                                        name="year"
                                        autoComplete="year"
                                        value={values.year || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.year && errors.year)}
                                        helperText={touched.year && errors.year}
                                        type="number"
                                        onInput={(e) => {
                                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4);
                                        }}
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
                                        Asignar
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                            
                        </form>
                    )}
                </Formik>
            </DialogContent>

        </Dialog>
    );
}
