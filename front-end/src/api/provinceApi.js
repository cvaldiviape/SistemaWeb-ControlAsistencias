import instanceAxios from './baseApi';
import Constants from './../util/constants';

export const getProvinces = (departmentId) => {
    return instanceAxios.get(`province-of-department/${departmentId}`);
}