import { styled } from '@material-ui/core/styles';
import { Box, Container, Typography } from '@material-ui/core';
import Page from '../../../../shared/Page';
import UpdateForm from './UpdateForm';
import { config } from '../../../../util/Config';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

// ----------------------------------------------------------------------

export default function AssistanceEdit() {
    return (
        <RootStyle title={config.title_page_director}>
            <Container>
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Editar Asistencia
                    </Typography>
                </Box>
                <UpdateForm />
            </Container>
        </RootStyle>
    );
}
