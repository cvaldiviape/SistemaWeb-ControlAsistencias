import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        listUsers: [],
        userAuth: null,
    },
    reducers: {
        setListUsersReducer: (state, action) => { 
            state.listUsers = action.payload;
        },
        loginReducer: (state, action) => {
            state.userAuth = action.payload;
        }
    }
});

export const { setListUsersReducer, loginReducer } = userSlice.actions; 

export default userSlice.reducer;
