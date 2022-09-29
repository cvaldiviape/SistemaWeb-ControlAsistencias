
import { Icon } from '@iconify/react';
import { useState } from 'react';
import arrowDownload16Filled from '@iconify/icons-fluent/arrow-download-16-filled';
import zoomReset from '@iconify/icons-bytesize/zoom-reset';
import fileDownload from 'js-file-download';
import {
    Stack,
    Button,
    Container,
    Typography,
    Grid,
    TextField,
} from '@material-ui/core';
import LoadingButton from '@mui/lab/LoadingButton';
import DatePicker from '@mui/lab/DatePicker';
import Page from '../../../../shared/Page';
import { getUserInfo } from '../../../../api/userApi';
import { getAssistanceOfTeacherReport } from '../../../../api/assistanceApi';
import { Formik } from 'formik';
import { config } from '../../../../util/Config';

const ReportAll = () => {
    const userInfo = getUserInfo();
    const [loading, setLoading] = useState(false);
    const [valuesSearch, setValuesSearch] = useState({
        date: (new Date()),
    });

    function convertFormatDate(date) {
        let day = ((date.getDate() < 10) ? "0" : "") + date.getDate();
        let month = ((date.getMonth() < 9) ? "0" : "") + (date.getMonth() + 1);
        let year = date.getFullYear();

        let dateCustom = year + "-" + month + "-" + day;
        return dateCustom;
    }

    const onDownloadReport = (values) => {
        setLoading(true);
        let institution_code = userInfo.institution.code;
        let date = convertFormatDate(values.date);

        getAssistanceOfTeacherReport(date, institution_code).then((res)=>{
            fileDownload(res.data, 'report.xlsx');
            setLoading(false);
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/report/all/ReportAll.js, line: 44");
            setLoading(false);
        });
    }

    return (
        <Page title={config.title_page_director}>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Reportes
                    </Typography>
                </Stack>
                <Formik
                    initialValues={valuesSearch}
                    onSubmit={onDownloadReport}
                >
                    {({ values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2} mb={2}>
                                <Grid item xs={12} sm={3}>
                                    <DatePicker
                                        id="date"
                                        name="date"
                                        views={['year', 'month']}
                                        label="Mes y Año"
                                        minDate={new Date('2021-01-02')}
                                        maxDate={new Date('2033-01-01')}
                                        value={values.date}
                                        onChange={(e) => {
                                            setFieldValue("date", e);
                                        }}
                                        renderInput={(params) => 
                                            <TextField 
                                                required 
                                                fullWidth 
                                                {...params} 
                                            />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} mt={1}>
                                    <LoadingButton
                                        fullWidth
                                        color="secondary"
                                        variant="contained"
                                        type="submit"
                                        loading={loading}
                                        loadingPosition="start"
                                        startIcon={<Icon icon={arrowDownload16Filled} />}
                                    >
                                        Descargar
                                    </LoadingButton>
                                </Grid>
                                <Grid item xs={12} sm={3} mt={1}>
                                    <Button
                                        fullWidth
                                        color="secondary"
                                        variant="contained"
                                        onClick={() => {
                                            setFieldValue(new Date());
                                        }}
                                        startIcon={<Icon icon={zoomReset} />}
                                    >
                                        Reset
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Container>
        </Page>
    )
};

export default ReportAll;
