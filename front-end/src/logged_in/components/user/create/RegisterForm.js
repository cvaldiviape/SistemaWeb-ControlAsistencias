import React, { useState, useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useHistory } from 'react-router-dom';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import checkmarkSquare2Fill from '@iconify/icons-eva/checkmark-square-2-fill';
import backspaceFill from '@iconify/icons-eva/backspace-fill';
import closeSquareFilled from '@iconify/icons-ant-design/close-square-outlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { registerUser } from '../../../../api/userApi';
import { getRoles } from '../../../../api/roleApi';
import { getInstitutions } from '../../../../api/institutionApi';
import { Formik } from 'formik';
import { config } from '../../../../util/Config';

const RegisterForm = () => {
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        firt_name: '',
        last_name: '',
        email: '',
        password: '',
        repeat_password: '',
        dni: '',
        phone: '',
        specialty: '',
        is_covid: '',
        address: '',
        condition: '',
        role_code: '',
        institution_code: '',
    });
    const [roles, setRoles] = useState([]);
    const [institutions, setInstitutions] = useState([]);

    useEffect(() => {
        getDataRoles();
        getDataInstitutions();
    }, []);

    const getDataRoles = () => {
        getRoles().then((r) => {
            setRoles(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/user/create/RegisterForm.js, line 59");
        });
    }

    const getDataInstitutions = () =>{
        getInstitutions().then((r) => {
            setInstitutions(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/user/create/RegisterForm.js, line 66");
        });
    }

    const submit = (values, {resetForm}) => {
        setLoading(true);
        if(values.role_code==config.role_code_admin){
            values.institution_code = null;
        }
        values.dni = values.dni.toString();
        values.phone = values.phone.toString();
        if(values.password == values.repeat_password){
            registerUser(values).then((r) => {
                if(r.data.success){
                    resetForm();
                    setMessage('La creación del usuario fue exitosa.');
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
                    console.log("Error del servidor, src/logged_in/components/user/create/RegisterForm.js, line 82");
                    setLoading(false);
                }
            })
        }else{
            setMessage('Verificar contraseña.');
            setOpen(true);
            setLoading(false);
        }
    }

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleShowRepeatPassword = () => {
        setShowRepeatPassword((show) => !show);
    };

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

    const back = () => {
        history.push('/dashboard/user');
    }

    const validate = ({firt_name, last_name, dni, email, phone, specialty, address, password, repeat_password}) => {
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
        if(validationPassword(password)){
            errores.password = validationPassword(password);
        }
        if(validationRepeatPassword(repeat_password)){
            errores.repeat_password = validationRepeatPassword(repeat_password);
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

    const validationPassword = (password) => {
        let mesage_error = null;
        if(!password){
            mesage_error = "Por favor ingresa una contraseña.";
        }else if(/^[\s]+[a-zA-ZÀ-ÿ\s]+/.test(password)){
            mesage_error = "La contraseña no puede empezar con espacios.";
        }else if(/[a-zA-ZÀ-ÿ\s]+[\s]+$/.test(password)){
            mesage_error = "La contraseña no puede terminar con espacios.";
        }else if(!/^.{8,100}$/.test(password)){  
            mesage_error = "La contraseña debe contener un minimo de 8 caracteres.";
        }
        return mesage_error;
    }

    const validationRepeatPassword = (repeat_password) => {
        let mesage_error = null;
        if(!repeat_password){
            mesage_error = "Por favor confirmar contraseña.";
        }
        return mesage_error;
    }

    return (
        <Container component="main">
            <CssBaseline />

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
                                    required
                                    fullWidth
                                    id="firt_name"
                                    label="Nombre"
                                    name="firt_name"
                                    autoComplete="firt_name"
                                    value={values.firt_name || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(errors.firt_name && touched.firt_name)} 
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
                                    error={Boolean( touched.last_name && errors.last_name)} 
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
                                    type="text"
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

                            <Grid item xs={12} sm={6}>                                    
                                <TextField
                                    fullWidth
                                    autoComplete="current-password"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Contraseña"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onInput = {(e) =>{
                                        e.target.value = e.target.value.slice(0,50)
                                    }} 
                                    InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                        <IconButton onClick={handleShowPassword} edge="end">
                                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                                        </IconButton>
                                        </InputAdornment>
                                    )
                                    }}
                                    error={Boolean(touched.password && errors.password)}
                                    helperText={touched.password && errors.password}
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
                                    fullWidth
                                    type={showRepeatPassword ? 'text' : 'password'}
                                    label="Confirmar contraseña"
                                    name="repeat_password"
                                    value={values.repeat_password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onInput = {(e) =>{
                                        e.target.value = e.target.value.slice(0,50)
                                    }} 
                                    InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                        <IconButton onClick={handleShowRepeatPassword} edge="end">
                                            <Icon icon={showRepeatPassword ? eyeFill : eyeOffFill} />
                                        </IconButton>
                                        </InputAdornment>
                                    )
                                    }}
                                    error={Boolean(touched.repeat_password && errors.repeat_password)}
                                    helperText={touched.repeat_password && errors.repeat_password}
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
                                    error={Boolean(touched.address && errors.address )} 
                                    helperText={touched.address && errors.address} 
                                    type="text"
                                />
                            </Grid>
                            
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label_role">Rol</InputLabel>
                                    <Select
                                        required
                                        labelId="demo-simple-select-label_role"
                                        id="role_code"
                                        name="role_code"
                                        label="Rol"
                                        value={values.role_code || ''}
                                        onChange={handleChange}
                                    >
                                        {
                                            (Array.isArray(roles) && roles.length > 0) 
                                            &&
                                            roles.map((row) => (
                                                <MenuItem value={row.code} key={row.code}>{row.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label_covid">Covid</InputLabel>
                                    <Select
                                        required
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
                                        required
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
                                                (Array.isArray(institutions) && institutions.length > 0) 
                                                &&
                                                institutions.map((row) => (
                                                    <MenuItem value={row.code} key={row.code}>{row.name}</MenuItem>
                                                ))
                                            }
                                        </Select>
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
                                    Crear
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