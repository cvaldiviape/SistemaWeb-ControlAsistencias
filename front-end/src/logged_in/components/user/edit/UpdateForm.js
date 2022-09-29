import React, { useState, useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useHistory, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import checkmarkSquare2Fill from '@iconify/icons-eva/checkmark-square-2-fill';
import backspaceFill from '@iconify/icons-eva/backspace-fill';
import closeSquareFilled from '@iconify/icons-ant-design/close-square-outlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { getUserById, updateUser } from '../../../../api/userApi';
import { getRoles } from '../../../../api/roleApi';
import { getInstitutions } from '../../../../api/institutionApi';
import { Formik } from 'formik';
import { config } from '../../../../util/Config';

const UpdateForm = () => {
    const history = useHistory();
    const params = useParams();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [institutions, setInstitutions] = useState([]);

    useEffect(() => {
        getDataUser();
        getDataRoles();
        getDataInstitutions();
    }, []);

    const getDataUser = () => {
        let user_id = params.id;
        getUserById(user_id).then((r) => {
            if(r.data.data){
                const user = r.data.data.user;
                const role = r.data.data.role;

                let institution_code = '';
                if(r.data.data.institution){
                    institution_code = r.data.data.institution.code;
                }

                user.is_covid = user.is_covid.toString();

                const new_user = {
                    id              : user_id,
                    firt_name       : user.firt_name,
                    last_name       : user.last_name,
                    email           : user.email,
                    dni             : user.dni,
                    phone           : user.phone,
                    specialty       : user.specialty,
                    is_covid        : user.is_covid,
                    address         : user.address,
                    condition       : user.condition,
                    role_code       : role.code,
                    institution_code: institution_code
                };
                setUser(new_user);
            }
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/user/edit/UpdateForm.js, line 43");
        });
    }

    const getDataRoles = () =>{
        getRoles().then((r) => {
            setRoles(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/user/edit/UpdateForm.js, line 77");
        });
    }

    const getDataInstitutions = () =>{
        getInstitutions().then((r) => {
            setInstitutions(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/user/edit/UpdateForm.js, line 85");
        });
    }

    const submit = (values) => {
        setLoading(true);
        if(values.role_code==config.role_code_admin){
            values.institution_code = null;
        }
        values.id = parseInt(values.id);
        updateUser(values).then((r) => {
            if(r.data.success){
                setMessage('Usuario actualizado exitosamente.');
                setOpen(true);
                setLoading(false);
            }
        }).catch((e) => {
            if(e.response){
                if(e.response.data.dni){
                    setMessage('Este DNI ya se encuentra registrado, ingrese otro por favor.');
                    setOpen(true);
                    setLoading(false);
                }else if(e.response.data.phone){
                    setMessage('Este teléfono ya se encuentra registrado, ingrese otro por favor.');
                    setOpen(true);
                    setLoading(false);
                }else if(e.response.data.email){
                    setMessage('Este correo ya se encuentra registrado, ingrese otro por favor.');
                    setOpen(true);
                    setLoading(false);
                }
            }else{
                console.log("Error del servidor, src/logged_in/components/user/edit/UpdateForm.js, line 98");
                setLoading(false);
            }
        });
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
        history.push('/dashboard/user');
    }

    const validate = ({firt_name, last_name, dni, email, phone, specialty, address}) => {
        let errores = {};
        if(validationFirtName(firt_name)){
            errores.firt_name = validationFirtName(firt_name);
        }
        if(validationLastName(last_name)){
            errores.last_name = validationLastName(last_name);
        }
        if(validationDni(dni)){
            errores.dni = validationDni(dni);
        }
        if(validationEmail(email)){
            errores.email = validationEmail(email);
        }
        if(validationPhone(phone)){
            errores.phone = validationPhone(phone);
        }
        if(validationSpecialty(specialty)){
            errores.specialty = validationSpecialty(specialty);
        }
        if(validationAddress(address)){
            errores.address = validationAddress(address);
        }
    
        return errores;
    }

    const validationFirtName = (firt_name) => {
        let mesage_error = null;
        if(!firt_name){
            mesage_error = "Por favor ingresa un nombre.";
        }else if(/^[\s]+[a-zA-ZÀ-ÿ\s]+/.test(firt_name)){
            mesage_error = "El nombre no puede empezar con espacios.";
        }else if(/[a-zA-ZÀ-ÿ\s]+[\s]+$/.test(firt_name)){
            mesage_error = "El nombre no puede terminar con espacios.";
        }else if(!/^[a-zA-ZÀ-ÿ\s]{2,25}$/.test(firt_name)){
            mesage_error = "El nombre solo puede contener letras y espacios.";
        }
        return mesage_error;
    }

    const validationLastName = (last_name) => {
        let mesage_error = null;
        if(!last_name){
            mesage_error = "Por favor ingresa un apellido.";
        }else if(/^[\s]+[a-zA-ZÀ-ÿ\s]+/.test(last_name)){
            mesage_error = "El apellido no puede empezar con espacios.";
        }else if(/[a-zA-ZÀ-ÿ\s]+[\s]+$/.test(last_name)){
            mesage_error = "El apellido no puede terminar con espacios.";
        }else if(!/^[a-zA-ZÀ-ÿ\s]{2,25}$/.test(last_name)){
            mesage_error = "El apellido solo puede contener letras y espacios.";
        }
        return mesage_error;
    }

    const validationDni = (dni) => {
        let mesage_error = null;
        if(!dni){
            mesage_error = "Por favor ingresa un DNI.";
        }else if(/^[\s]/.test(dni)){
            mesage_error = "El DNI no puede empezar con espacios..";
        }else if(/[\s]+$/.test(dni)){
            mesage_error = "El DNI no puede terminar con espacios.";
        }else if (!/\d{8}$/.test(dni)) {
            mesage_error = "El DNI debe contener 8 digitos.";
        }
        return mesage_error;
    }

    const validationEmail = (email) => {
        let mesage_error = null;
        if(!email){
            mesage_error = "Por favor ingresa un correo.";
        }else if(/^\s+[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/.test(email)){
            mesage_error = "El correo no puede empezar con espacios.";
        }else if(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\s+$/.test(email)){
            mesage_error = "El correo no puede terminar con espacios.";
        }else if(!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)){ 
            mesage_error = "El correo solo puede contener letras, numeros, puntos, guiones, guion bajo y @."
        }
        return mesage_error;
    }

    const validationPhone = (phone) => {
        let mesage_error = null;
        if(!phone){
            mesage_error = "Por favor ingresa un teléfono.";
        }else if(!/^\d{7,9}$/.test(phone)){
            mesage_error = "El teléfono debe contener entre 7 a 9 digitos.";
        }
        return mesage_error;
    }

    const validationSpecialty = (specialty) => {
        let mesage_error = null;
        if(!specialty){
            mesage_error = "Por favor ingresa una especialidad.";
        }else if(/^[\s]+[a-zA-ZÀ-ÿ\s]+/.test(specialty)){
            mesage_error = "La especialidad no puede empezar con espacios.";
        }else if(/[a-zA-ZÀ-ÿ\s]+[\s]+$/.test(specialty)){
            mesage_error = "La especialidad no puede terminar con espacios.";
        }else if(!/^[a-zA-ZÀ-ÿ\s]{2,30}$/.test(specialty)){
            mesage_error = "La especialidad solo puede contener letras y espacios.";
        }
        return mesage_error;
    }

    const validationAddress = (address) => {
        let mesage_error = null;
        if(!address){
            mesage_error = "Por favor ingresa una dirección.";
        }else if(/^[\s]+[a-zA-ZÀ-ÿ\s]+/.test(address)){
            mesage_error = "La dirección no puede empezar con espacios.";
        }else if(/[a-zA-ZÀ-ÿ\s]+[\s]+$/.test(address)){
            mesage_error = "La dirección no puede terminar con espacios.";
        }else if(!/^[a-zA-ZÀ-ÿ0-9\.\-\#\°\,\/\:\s]{2,50}$/.test(address)){
            mesage_error = "La dirección solo puede contener letras, números, espacios, y los siguientes simbolos: # - : / ° ";
        }
        return mesage_error;
    }

    return (
        <Container component="main">
            <CssBaseline />
            { 
                user &&  
                <Formik
                    initialValues={user}
                    validate={validate}
                    onSubmit={submit}
                >
                    {( {values, errors, touched, handleSubmit, handleChange, handleBlur} ) => (
                        <form onSubmit={handleSubmit}>     
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        autoFocus
                                        required
                                        fullWidth
                                        id="firt_name"
                                        label="Nombre"
                                        name="firt_name"
                                        autoComplete="firt_name"
                                        value={values.firt_name || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.firt_name && errors.firt_name)} 
                                        helperText={touched.firt_name && errors.firt_name} 
                                        type="text"    
                                        onInput = {(e) =>{
                                            e.target.value = e.target.value.slice(0,25)
                                        }}  
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="last_name"
                                        label="Apellidos"
                                        name="last_name"
                                        autoComplete="last_name"
                                        value={values.last_name || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.last_name && errors.last_name)} 
                                        helperText={touched.last_name && errors.last_name} 
                                        type="text"
                                        onInput = {(e) =>{
                                            e.target.value = e.target.value.slice(0,25)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="dni"
                                        label="DNI"
                                        name="dni"
                                        autoComplete="dni"
                                        value={values.dni || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.dni && errors.dni)} 
                                        helperText={touched.dni && errors.dni} 
                                        onInput = {(e) =>{
                                            e.target.value = e.target.value.slice(0,8)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Correo electronico"
                                        name="email"
                                        autoComplete="email"
                                        value={values.email || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.email && errors.email)} 
                                        helperText={touched.email && errors.email} 
                                        type="text"
                                        onInput = {(e) =>{
                                            e.target.value = e.target.value.slice(0,50)
                                        }} 
                                    />
                                </Grid>
        
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="phone"
                                        label="Teléfono"
                                        name="phone"
                                        autoComplete="phone"
                                        value={values.phone || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.phone && errors.phone)} 
                                        helperText={touched.phone && errors.phone} 
                                        type="number"
                                        onInput = {(e) =>{
                                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,9)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="specialty"
                                        label="Especialidad"
                                        name="specialty"
                                        autoComplete="specialty"
                                        value={values.specialty || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.specialty && errors.specialty)} 
                                        helperText={touched.specialty && errors.specialty} 
                                        type="text"
                                        onInput = {(e) =>{
                                            e.target.value = e.target.value.slice(0,30)
                                        }} 
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="address"
                                        label="Dirección"
                                        name="address"
                                        autoComplete="address"
                                        value={values.address || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.address && errors.address)} 
                                        helperText={touched.address && errors.address} 
                                        type="text"
                                    />
                                </Grid>
                               
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_role">Rol</InputLabel>
                                        {
                                            (Array.isArray(roles) && roles.length > 0) 
                                            &&
                                            <Select
                                                labelId="demo-simple-select-label_role"
                                                id="role_code"
                                                name="role_code"
                                                label="Rol"
                                                value={values.role_code || ''}
                                                onChange={handleChange}
                                            >
                                                {
                                                    roles.map((row) => (
                                                        <MenuItem value={row.code} key={row.code}>{row.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_covid">Covid</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label_covid"
                                            id="is_covid"
                                            name="is_covid"
                                            label="Covid"
                                            value={values.is_covid || ''}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="0">No</MenuItem>
                                            <MenuItem value="1">Si</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_condition">
                                            Condición
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label_condition"
                                            id="condition"
                                            name="condition"
                                            label="Condición"
                                            value={values.condition || ''}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Contratado">Contratado</MenuItem>
                                            <MenuItem value="Nombrado">Nombrado</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                               
                                {
                                    (values.role_code==config.role_code_director || values.role_code==config.role_code_teacher) 
                                    &&
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label_role">Institución</InputLabel>
                                            {
                                                (Array.isArray(institutions) && institutions.length > 0) 
                                                &&
                                                <Select
                                                required
                                                labelId="demo-simple-select-label_role"
                                                id="institution_code"
                                                name="institution_code"
                                                label="Institución"
                                                value={values.institution_code || ''}
                                                onChange={handleChange}
                                            >
                                                {
                                                    institutions.map((row) => (
                                                        <MenuItem value={row.code} key={row.code}>{row.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                            }
                                        </FormControl>
                                    </Grid>
                                }

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
                                        Actualizar
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