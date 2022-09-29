import { useState, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import closeSquareFilled from '@iconify/icons-ant-design/close-square-outlined';
import checkmarkSquare2Fill from '@iconify/icons-eva/checkmark-square-2-fill';
// material
import {
    Stack,
    TextField,
    IconButton,
    Button,
    Snackbar,
    InputAdornment
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { login } from '../../../api/userApi';
import Constants from './../../../util/constants';
import { Formik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch } from 'react-redux';
import { loginReducer } from '../../../redux/slices/user';
// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh'
    },
    image: {
        backgroundImage: "url('../assets/logo.png')",
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontSize: '35px',
        fontWeight: 'bold',
        paddingTop: '40px',
        paddingLeft: '40px'
    },
    paper: {
        margin: theme.spacing(4, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    buttonLink: {
        textDecoration: 'none',
        color: theme.palette.common.greenColor,
        fontWeight: 'bold',
        cursor: 'pointer'
    }
}));

const LoginForm = () => {
    const history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const dispatchRedux = useDispatch();

    const submit = (values) => {
        setLoading(true);
        dispatchRedux(authentication(values));
    };

    const authentication = (valuesForm) => (dispatch) => {
        login(valuesForm).then((r) => {
            if (r.data.success) {
                let { user, role, institution } = r.data.data;
                let user_auth = null;
                
                if(institution){
                    user_auth = {
                        full_name: user.name,
                        email: user.email,
                        role: role.name,
                        institution_code: institution.code,
                    } 
                }else{
                    user_auth = {
                        full_name: user.name,
                        email: user.email,
                        role: role.name,
                    } 
                } 
                dispatch(loginReducer(user_auth));

                localStorage.setItem(Constants.userInfo, JSON.stringify(r.data.data));
                history.push('/dashboard');
                setLoading(false);
            } 
        })
        .catch((e) => {
            if(e.response){   
                setMessage(e.response.data);
                setOpen(true);
            }else{
                console.log("Error del servidor, src/logged_out/components/user/login/LoginForm.js, line 85");
            }
            setLoading(false);
        });
    }

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

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
                            className={classes.close}
                            onClick={handleClose}
                        >
                            <Icon icon={closeSquareFilled} />
                        </IconButton>
                    </Fragment>
                }
            />
        </div>
    );

    const validate = ({ email, password }) => {
        let errores = {};
        if (validationEmail(email)) {
            errores.email = validationEmail(email);
        }
        return errores;
    };

    const validationEmail = (email) => {
        let mesage_error = null;
        if (!email) {
            mesage_error = 'Por favor ingresa un correo.';
        } else if (/^\s+[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/.test(email)) {
            mesage_error = 'El correo no puede empezar con espacios.';
        } else if (/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\s+$/.test(email)) {
            mesage_error = 'El correo no puede terminar con espacios.';
        } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
            mesage_error =
                'El correo solo puede contener letras, numeros, puntos, guiones, guion bajo y @.';
        }
        return mesage_error;
    };

    return (
        <Fragment>
            <Formik 
                initialValues={user} 
                validate={validate} 
                onSubmit={submit}
            >
                {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Stack spacing={3}>
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
                                onInput={(e) => {
                                    e.target.value = e.target.value.slice(0, 50);
                                }}
                            />
                            <TextField
                                fullWidth
                                autoComplete="current-password"
                                type={showPassword ? 'text' : 'password'}
                                label="Contraseña"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onInput={(e) => {
                                    e.target.value = e.target.value.slice(0, 50);
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
                        </Stack>
                        <br />
                        <LoadingButton
                            fullWidth
                            color="primary"
                            variant="contained"
                            type="submit"
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<Icon icon={checkmarkSquare2Fill} />}
                        >
                            Iniciar sesión
                        </LoadingButton>
                    </form>
                )}
            </Formik>
            {showMessage(message)}
        </Fragment>
    );
}

export default LoginForm;