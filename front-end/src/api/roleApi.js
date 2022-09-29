import instanceAxios from './baseApi';
import Constants from './../util/constants';

export const getRoles = () => {
    return instanceAxios.get('role-all');
};
