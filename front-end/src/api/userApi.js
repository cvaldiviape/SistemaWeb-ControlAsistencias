import instanceAxios from './baseApi';
import Constants from './../util/constants';

export const login = (userDto) => {
    return instanceAxios.post('user-authentication', JSON.stringify(userDto));
};

export const isAuth = () => {
    return localStorage.getItem(Constants.userInfo) ? true : false;
};

export const searchUser = (userDto) => {
    return instanceAxios.get(`user-search?filter_value=${userDto}`);
};

export const getUsers = () => {
    return instanceAxios.get('user-all');
};

export const getUserById = (id) => {
    return instanceAxios.get(`user-edit/${id}`);
};

export const registerUser = (userDto) => {
    return instanceAxios.post(`user-register-account`, JSON.stringify(userDto)); 
}

export const updateUser = (userDto) => {
    return instanceAxios.put(`user-update`, JSON.stringify(userDto)); 
}

export const deleteUser = (id) => {
    return instanceAxios.delete(`user-delete/${id}`); 
}

export const getUserInfo = () => {
    return JSON.parse(localStorage.getItem(Constants.userInfo));
};


