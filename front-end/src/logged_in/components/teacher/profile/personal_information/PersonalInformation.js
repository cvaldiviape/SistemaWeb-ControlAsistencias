import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useHistory } from 'react-router-dom';
import { Icon } from '@iconify/react';
import backspaceFill from '@iconify/icons-eva/backspace-fill';
import { Formik } from 'formik';


const PersonalInformation = (props) => {
    const { user } = props;
    const history = useHistory();
    
    const back = () => {
        history.push('/dashboard/teacher');
    }

    return (
        <Container component="main">
            <CssBaseline />
            <Typography variant="h4" gutterBottom sx={{ mb: 5, mt: -3 }}>
                Datos personales:
            </Typography>
            { 
                user &&  
                <Formik
                    initialValues={user}
                >
                    {( {values, errors, touched, handleSubmit, handleChange, handleBlur} ) => (
                        <form onSubmit={handleSubmit}>     
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        autoFocus
                                        disabled
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
                                        disabled
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
                                        disabled
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
                                        type="number"
                                        onInput = {(e) =>{
                                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0,8)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        disabled
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
                                        disabled
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
                                        disabled
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
                                        disabled
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
                               
                                <Grid item xs={12} sm={2}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_covid">Covid</InputLabel>
                                        <Select
                                            disabled
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
                                            disabled
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
                                <Grid item xs={12} sm={6} sx={{ mt: 1, mb: 0 }}>
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
                            </Grid>
                        </form>
                    )}
                </Formik>           
            }
        </Container>
    );
}

export default PersonalInformation;