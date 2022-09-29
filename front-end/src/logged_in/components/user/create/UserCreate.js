import { styled } from '@material-ui/core/styles';
import { Box, Container, Typography } from '@material-ui/core';
import Page from '../../../../shared/Page';
import RegisterForm from './RegisterForm';
import { config } from '../../../../util/Config';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

// ----------------------------------------------------------------------

export default function UserCreate() {
    return (
        <RootStyle title={config.title_page_admin}>
            <Container>
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Nuevo Usuario
                    </Typography>
                </Box>
                <RegisterForm />
            </Container>
        </RootStyle>
    );
}
