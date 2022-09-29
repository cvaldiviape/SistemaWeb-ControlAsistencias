import React from 'react';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Container, Typography } from '@material-ui/core';
// components
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

export default function InstitutionEdit() {

    return (
        <RootStyle title={config.title_page_admin}>
            <Container>
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Editar Institución
                    </Typography>
                </Box>
                <UpdateForm />
            </Container>
        </RootStyle>
    );
}
