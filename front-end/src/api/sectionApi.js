import instanceAxios from './baseApi';
import Constants from './../util/constants';

export const getSections = (degree_code) => {
    return instanceAxios.get(`section-of-degree/${degree_code}`);
}

export const getSectionsOfTeacher = (teacher_id, subject_id, degree_id) => {
    return instanceAxios.get(`section-of-teacher-by-degree/${teacher_id}/${subject_id}/${degree_id}`);
}