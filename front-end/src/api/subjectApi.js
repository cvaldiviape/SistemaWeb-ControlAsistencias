import instanceAxios from './baseApi';
import Constants from './../util/constants';

export const getSubjects = () => {
    return instanceAxios.get(`subject-all`);
}

export const getSubjectsOfTeacher = (teacher_id) => {
    return instanceAxios.get(`subject-of-teacher/${teacher_id}`);
}