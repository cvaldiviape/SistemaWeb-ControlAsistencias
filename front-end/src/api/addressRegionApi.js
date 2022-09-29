import instanceAxios from './baseApi';

export const getAddressRegions = () => {
    return instanceAxios.get(`address-region-all`);
}