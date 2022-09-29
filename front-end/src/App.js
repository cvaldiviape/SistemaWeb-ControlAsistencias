import React, { useState } from 'react';
import ThemeConfig from './theme';
// components
import ScrollToTop from './shared/ScrollToTop';
// Redux
import { Provider } from 'react-redux';
import store from './redux';
// Routes
import AppRouter from './routes/AppRouter';
// datetime
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateFnsUtils from "@date-io/date-fns";
import { es } from "date-fns/locale";

import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import * as locales from '@material-ui/core/locale';

export default function App() {
    const [locale, setLocale] = useState('esES');
   
    return (
        <Provider store={store}>
            <LocalizationProvider dateAdapter={AdapterDateFns} utils={DateFnsUtils} locale={es}>
                <ThemeConfig>
                    <ThemeProvider theme={(outerTheme) => createTheme(outerTheme, locales[locale])}>

                        <ScrollToTop />
                        <AppRouter/>

                    </ThemeProvider>
                </ThemeConfig>
            </LocalizationProvider>
        </Provider>
    );
}
