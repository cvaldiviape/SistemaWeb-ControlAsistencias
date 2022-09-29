import instanceAxios from './baseApi';
import Constants from './../util/constants';

export const getDegrees = () => {
    return instanceAxios.get(`degree-all`);
}

export const getDegreesOfTeacher = (teacher_id, subject_id) => {
    return instanceAxios.get(`degree-of-teacher-by-subject/${teacher_id}/${subject_id}`);
}