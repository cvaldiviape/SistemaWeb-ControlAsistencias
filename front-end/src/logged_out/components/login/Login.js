import { styled } from '@material-ui/core/styles';
import { Card, Stack, Container, Typography } from '@material-ui/core';
import Page from '../../../shared/Page';
import { MHidden } from '../../../shared/@material-extend';
import LoginForm from './LoginForm';
import { config } from '../../../util/Config'; 

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
    return (
        <RootStyle title={config.title_page_login}>
            <MHidden width="mdDown">
                <SectionStyle>
                    <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                        Hola, Bienvenido!!!
                    </Typography>
                    <img src="/static/illustrations/illustration_login.png" alt="login" />
                </SectionStyle>
            </MHidden>
            <Container maxWidth="sm">
                <ContentStyle>
                    <Stack sx={{ mb: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            Iniciar sesión
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                            Sistema de Control de Asistencias
                        </Typography>
                    </Stack>
                    <LoginForm />
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}
