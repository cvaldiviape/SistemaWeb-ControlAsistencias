import instanceAxios from './baseApi';
import Constants from './../util/constants';

export const registerSubjectAssignment = (SubjectAssignmentDto) => {
    return instanceAxios.post(`subject-assignment-register`, JSON.stringify(SubjectAssignmentDto));
}

export const getSubjectAssignmentByIds = (institutionId, teacherId, subjectId, degreeId, sectionId) => {
    return instanceAxios.get(`subject-assignment-search-by-ids/${institutionId}/${teacherId}/${subjectId}/${degreeId}/${sectionId}`);
}

export const getSubjectAssignmentById = (id) => {
    return instanceAxios.get(`subject-assignment-edit/${id}`);
}

export const getSubjectAssignmentOfTeacher = (teacher_id) => {
    return instanceAxios.get(`subject-assignment-of-teacher/${teacher_id}`);
}

export const updateSubjectAssignment = (SubjectAssignmentDto) => {
    return instanceAxios.put(`subject-assignment-update`, JSON.stringify(SubjectAssignmentDto));
}

export const deleteSubjectAssignment = (id) => {
    return instanceAxios.delete(`subject-assignment-delete/${id}`); 
}