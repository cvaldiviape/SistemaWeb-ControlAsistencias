import instanceAxios from './baseApi';
import Constants from './../util/constants';

export const getDepartments = () => {
    return instanceAxios.get(`department-all`);
}