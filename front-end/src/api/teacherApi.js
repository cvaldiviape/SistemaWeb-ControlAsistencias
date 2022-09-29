import instanceAxios from './baseApi';


export const getProfileTeacher = (id) => {
    return instanceAxios.get(`teacher-profile/${id}`);
};

export const searchTeacher = (filterValue, institutionCode) => {
    return instanceAxios.get(`teacher-search?filter_value=${filterValue}&institution_code=${institutionCode}`);
};

