import instanceAxios from './baseApi';
import Constants from './../util/constants';

export const getDistricts = (provinceId) => {
    return instanceAxios.get(`district-of-province/${provinceId}`);
}