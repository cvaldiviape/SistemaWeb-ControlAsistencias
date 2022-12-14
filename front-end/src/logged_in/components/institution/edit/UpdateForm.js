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
import { getInstitutionById, updateInstitution } from '../../../../api/institutionApi';
import { getAddressRegions } from '../../../../api/addressRegionApi';
import { getDepartments } from '../../../../api/departmentApi';
import { getProvinces } from '../../../../api/provinceApi';
import { getDistricts } from '../../../../api/districtApi';

import { Formik } from 'formik';

const UpdateForm = () => {
    const history = useHistory();
    const params = useParams();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [institution, setInstitution] = useState(null);
    const [addressRegions, setAddressRegions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [showSelectDistrict, setShowSelectDistrict] = useState(false);

    useEffect(() => {
        getDataInstitution();
        getDataAddressRegions();
        getDataDepartments();
    }, []);

    const getDataInstitution = () => {
        let institution_id = params.id;
        getInstitutionById(institution_id).then((r) => { 
            if(r.data.data){
                const institution = r.data.data.institution;
                const department = r.data.data.department;
                const province = r.data.data.province;
                const district = r.data.data.district;
               
                const new_institution = {
                    id                  : institution_id,
                    code                : institution.code,
                    name                : institution.name,
                    description         : institution.description,
                    ubigeo_id           : institution.ubigeo_id,
                    address_region_id   : institution.direccion_regional_id,
                    phone               : institution.phone,
                    mobile              : institution.mobile,
                    information         : institution.information,
                    ugel                : institution.ugel,
                    department_id       : department.id,
                    province_id         : province.id,
                    district_id         : district.id,
                };

                setInstitution(new_institution);

                getProvinces(department.id).then((r) => {
                    setProvinces(r.data.data);
                }).catch((e) => {
                    console.log("Error del servidor, src/logged_in/components/institution/edit/UpdateForm.js, line 73");
                });

                getDistricts(province.id).then((r) => {
                    setDistricts(r.data.data);
                    setShowSelectDistrict(true);
                }).catch((e) => {
                    console.log("Error del servidor, src/logged_in/components/institution/edit/UpdateForm.js, line 79");
                });
            }
        }).catch((e) => {
            if(e.response){
                setMessage('Error de servidor, src/logged_in/components/institution/edit/UpdateForm.js, line 48');
                setOpen(true);
            } 
        });
    }

    const getDataAddressRegions = () => {
        getAddressRegions().then((r) => {
            setAddressRegions(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/institution/edit/UpdateForm.js, line 95");
        });
    }

    const getDataDepartments = () =>{
        getDepartments().then((r) => {
            setDepartments(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/institution/edit/UpdateForm.js, line 102");
        });
    }

    const getDataProvinces = (e) => {
        setProvinces([]);
        setDistricts([]);
        const department_id = e.target.value;

        getProvinces(department_id).then((r) => {
            setProvinces(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/institution/edit/UpdateForm.js, line 115");
        });
    };

    const getDataDistricts = (e) => {
        const province_id = e.target.value;

        getDistricts(province_id).then((r) => {
            setDistricts(r.data.data);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/institution/edit/UpdateForm.js, line 125");
        });
    };

    const submit = (values, {resetForm}) => {
        setLoading(true);
        values.code = values.code.toString();
        values.phone = values.phone.toString();
        values.mobile = values.mobile.toString();
        values.ubigeo_id = values.district_id;
        
        updateInstitution(values).then((r) => {
            if(r.data.success){
                setMessage('La actualizaci??n de la instituci??n fue exitosa.');
                setOpen(true);
                setLoading(false);
            }
        }).catch((e) => {
            if(e.response){
                if(e.response.data.code){
                    setMessage('Este c??digo ya se encuentra registrado, ingrese otro por favor.');
                    setOpen(true);
                    setLoading(false);
                }else if(e.response.data.phone){
                    setMessage('Este tel??fono ya se encuentra registrado, ingrese otro por favor.');
                    setOpen(true);
                    setLoading(false);
                }else if(e.response.data.mobile){
                    setMessage('Este celular ya se encuentra registrado, ingrese otro por favor.');
                    setOpen(true);
                    setLoading(false);
                }
            }else{
                console.log("Error del servidor, src/logged_in/components/institution/edit/UpdateForm.js, line 139");
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
        history.push('/dashboard/institution');
    }

    const validate = ({code, name, phone, mobile, description, information, ugel}) => {
        let errores = {};
        if(validationCode(code)){
            errores.code = validationCode(code);
        }
        if(validationName(name)){
            errores.name = validationName(name);
        }
        if(validationPhone(phone)){
            errores.phone = validationPhone(phone);
        }
        if(validationMobile(mobile)){
            errores.mobile = validationMobile(mobile);
        }
        if(validationDescription(description)){
            errores.description = validationDescription(description);
        }
        if(validationInformation(information)){
            errores.information = validationInformation(information);
        }
        if(validationUgel(ugel)){
            errores.ugel = validationUgel(ugel);
        }
        return errores;
    }

    const validationCode = (code) => {
        let mesage_error = null;
        if(!code){
            mesage_error = "Por favor ingresa un c??digo.";
        }else if(/^[\s]/.test(code)){
            mesage_error = "El c??digo no puede empezar con espacios..";
        }else if(/[\s]+$/.test(code)){
            mesage_error = "El c??digo no puede terminar con espacios.";
        }
    }

    const validationName = (name) => {
        let mesage_error = null;
        if(!name){
            mesage_error = "Por favor ingresa un nombre.";
        }else if(/^[\s]+[a-zA-Z??-??\s]+/.test(name)){
            mesage_error = "El nombre no puede empezar con espacios.";
        }else if(/[a-zA-Z??-??\s]+[\s]+$/.test(name)){
            mesage_error = "El nombre no puede terminar con espacios.";
        }else if(!/^[a-zA-Z??-??\s]{2,25}$/.test(name)){
            mesage_error = "El nombre solo puede contener letras y espacios.";
        }
        return mesage_error;
    }

    const validationPhone = (phone) => {
        let mesage_error = null;
        if(!phone){
            mesage_error = "Por favor ingresa un tel??fono.";
        }else if(!/^\d{7,9}$/.test(phone)){
            mesage_error = "El tel??fono debe contener entre 7 a 9 digitos.";
        }
        return mesage_error;
    }

    const validationMobile = (mobile) => {
        let mesage_error = null;
        if(!mobile){
            mesage_error = "Por favor ingresa un celular.";
        }else if(!/^\d{7,9}$/.test(mobile)){
            mesage_error = "El celular debe contener entre 7 a 9 digitos.";
        }
        return mesage_error;
    }

    const validationDescription = (description) => {
        let mesage_error = null;
        if(!description){
            mesage_error = "Por favor ingresa una descripci??n.";
        }else if(/^[\s]+[a-zA-Z??-??\s]+/.test(description)){
            mesage_error = "La descripci??n no puede empezar con espacios.";
        }else if(/[a-zA-Z??-??\s]+[\s]+$/.test(description)){
            mesage_error = "La descripci??n no puede terminar con espacios.";
        }else if(!/^[a-zA-Z??-??0-9\.\-\_\#\??\,\/\:\;\s]{2,60}$/.test(description)){
            mesage_error = "La descripci??n solo puede contener letras, n??meros, espacios, y los siguientes simbolos: # - _ : ; / ?? ";
        }
        return mesage_error;
    }

    const validationInformation = (information) => {
        let mesage_error = null;
        if(!information){
            mesage_error = "Por favor ingresa una informaci??n.";
        }else if(/^[\s]+[a-zA-Z??-??\s]+/.test(information)){
            mesage_error = "La informaci??n no puede empezar con espacios.";
        }else if(/[a-zA-Z??-??\s]+[\s]+$/.test(information)){
            mesage_error = "La informaci??n no puede terminar con espacios.";
        }else if(!/^[a-zA-Z??-??0-9\.\-\_\#\??\,\/\:\;\s]{2,600}$/.test(information)){
            mesage_error = "La informaci??n solo puede contener letras, n??meros, espacios, y los siguientes simbolos: # - _ : ; / ?? ";
        }
        return mesage_error;
    }

    const validationUgel = (ugel) => {
        let mesage_error = null;
        if(!ugel){
            mesage_error = "Por favor ingresa una ugel.";
        }else if(/^[\s]+[a-zA-Z??-??\s]+/.test(ugel)){
            mesage_error = "La ugel no puede empezar con espacios.";
        }else if(/[a-zA-Z??-??\s]+[\s]+$/.test(ugel)){
            mesage_error = "La ugel no puede terminar con espacios.";
        }else if(!/^[a-zA-Z??-??0-9\.\-\_\#\??\,\/\:\s]{2,50}$/.test(ugel)){
            mesage_error = "La ugel solo puede contener letras, n??meros, espacios, y los siguientes simbolos: # - _ : / ?? ";
        }
        return mesage_error;
    }

    return (
        <Container component="main">
            <CssBaseline />
            {
                institution 
                &&
                <Formik
                    initialValues={institution}
                    validate={validate}
                    onSubmit={submit}
                    enableReinitialize={true}
                >
                    {( {values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue, resetForm} ) => (
                        <form onSubmit={handleSubmit}>     
                            <Grid container spacing={2}>
                                
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="code"
                                        label="C??digo"
                                        name="code"
                                        autoComplete="code"
                                        value={values.code || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.code && errors.code)} 
                                        helperText={touched.code && errors.code} 
                                        type="text"
                                        onInput = {(e) =>{
                                            e.target.value = e.target.value.slice(0,10)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
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
                                        error={Boolean( touched.name && errors.name)} 
                                        helperText={touched.name && errors.name} 
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
                                        id="phone"
                                        label="Tel??fono"
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
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="mobile"
                                        label="Celular"
                                        name="mobile"
                                        autoComplete="mobile"
                                        value={values.mobile || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.mobile && errors.mobile)} 
                                        helperText={touched.mobile && errors.mobile} 
                                        type="number"
                                        onInput = {(e) =>{
                                            e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,9)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="description"
                                        label="Descripci??n"
                                        name="description"
                                        autoComplete="description"
                                        value={values.description || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.description && errors.description )} 
                                        helperText={touched.description && errors.description} 
                                        type="text"
                                        onInput = {(e) =>{
                                            e.target.value = e.target.value.slice(0,60)
                                        }} 
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="information"
                                        label="Informaci??n"
                                        name="information"
                                        autoComplete="information"
                                        value={values.information || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.information && errors.information )} 
                                        helperText={touched.information && errors.information} 
                                        type="text"
                                        multiline
                                        rows={6}
                                        onInput = {(e) =>{
                                            e.target.value = e.target.value.slice(0,600)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="ugel"
                                        label="Ugel"
                                        name="ugel"
                                        autoComplete="ugel"
                                        value={values.ugel || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={Boolean(touched.ugel && errors.ugel )} 
                                        helperText={touched.ugel && errors.ugel} 
                                        type="text"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_region">Regi??n</InputLabel>
                                        {
                                            (Array.isArray(addressRegions) && addressRegions.length > 0) 
                                            &&
                                            <Select
                                                required
                                                labelId="demo-simple-select-label_region"
                                                id="address_region_id"
                                                name="address_region_id"
                                                label="Regi??n"
                                                value={values.address_region_id || ''}
                                                onChange={handleChange}
                                            >
                                                {
                                                    addressRegions.map((row) => (
                                                        <MenuItem value={row.id} key={row.id}>{row.nombre}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                    </FormControl>
                                </Grid>
                               
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label_department">Departamento *</InputLabel>
                                        {
                                             (Array.isArray(departments) && departments.length > 0) 
                                             &&
                                             <Select
                                                required
                                                labelId="demo-simple-select-label_department"
                                                id="department_id"
                                                name="department_id"
                                                label="Departamento *"
                                                value={values.department_id || ''}
                                                onChange={(e) => {
                                                    handleChange(e); 
                                                    setFieldValue("province_id", "");
                                                    setFieldValue("district_id", "");
                                                    getDataProvinces(e);
                                                }}
                                            >
                                                {
                                                    departments.map((row) => (
                                                        <MenuItem value={row.id} key={row.id}>
                                                            {row.name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                        
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl required fullWidth>
                                        <InputLabel required id="demo-simple-select-label_province">Provincia</InputLabel>
                                        {
                                            (Array.isArray(provinces) && provinces.length > 0) 
                                            &&
                                            <Select
                                                required
                                                labelId="demo-simple-select-label_province"
                                                id="province_id"
                                                name="province_id"
                                                label="Provincia"
                                                value={values.province_id || ''}
                                                onChange={(e) => {
                                                    handleChange(e); 
                                                    setFieldValue("district_id", "");
                                                    getDataDistricts(e);
                                                }}
                                            >
                                                {
                                                    provinces.map((row) => (
                                                        <MenuItem value={row.id} key={row.id}>
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
                                        <InputLabel id="demo-simple-select-label_district">Distrito *</InputLabel>
                                        {
                                            (Array.isArray(districts) && showSelectDistrict) 
                                            &&
                                            <Select
                                                required
                                                labelId="demo-simple-select-label_district"
                                                id="district_id"
                                                name="district_id"
                                                label="Distrito *"
                                                value={values.district_id || ''}
                                                onChange={handleChange}
                                            >
                                                {
                                                    districts.map((row) => (
                                                        <MenuItem value={row.id} key={row.id}>
                                                            {row.name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        }
                                    </FormControl>
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