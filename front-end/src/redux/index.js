import { configureStore } from '@reduxjs/toolkit';
import user from './slices/user';
import dashboard from './slices/dashboard';

export default configureStore({
    reducer: {
        user,
        dashboard,
    },
    //middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});