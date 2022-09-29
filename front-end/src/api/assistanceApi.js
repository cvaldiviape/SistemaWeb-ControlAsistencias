
import instanceAxios from './baseApi';

export const getAllAssistances = (institutionCode) => {
    return instanceAxios.get(`assistance-all?institution_code=${institutionCode}`);
}

export const searchAssistance = (filterValue, fromDate, toDate, institutionCode) => {
    return instanceAxios.get(`assistance-search?filter_value=${filterValue}&from_date=${fromDate}&to_date=${toDate}&institution_code=${institutionCode}`);
};

export const getAssistanceOfTeacher = (teacher_id, from_date, to_date) => {
    return instanceAxios.get(`assistance-of-teacher/${teacher_id}/${from_date}/${to_date}`);
};

export const getAssistanceById = (id) => {
    return instanceAxios.get(`assistance-edit/${id}`);
};

export const registerAssistance = (assistanceDto) => {
    return instanceAxios.post(`assistance-register`, JSON.stringify(assistanceDto)); 
}

export const updateAssistance = (assistanceDto) => {
    return instanceAxios.put(`assistance-update`, JSON.stringify(assistanceDto)); 
}

export const deleteAssistance = (id) => {
    return instanceAxios.delete(`assistance-delete/${id}`); 
}

export const getAssistanceOfTeacherReport = (date, institution_code) => {
    return instanceAxios.get(`assistance-report?date=${date}&institution_code=${institution_code}`, {
        responseType: 'blob',
      });
}