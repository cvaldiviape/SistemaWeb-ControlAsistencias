
import instanceAxios from './baseApi';
import Constants from './../util/constants';

export const searchInstitution = (filterValue) => {
    return instanceAxios.get(`institution-search?filter_value=${filterValue}`);
};

export const getInstitutions = () => {
    return instanceAxios.get(`institution-all`);
}

export const getInstitutionById = (id) => {
    return instanceAxios.get(`institution-edit/${id}`);
};

export const registerInstitution = (institutionDto) => {
    return instanceAxios.post(`institution-register`, JSON.stringify(institutionDto)); 
}

export const updateInstitution = (institutionDto) => {
    return instanceAxios.put(`institution-update`, JSON.stringify(institutionDto)); 
}

export const deleteInstitution = (id) => {
    return instanceAxios.delete(`institution-delete/${id}`); 
}