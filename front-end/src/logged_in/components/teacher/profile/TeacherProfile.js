import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import { Box, Container, Typography } from '@material-ui/core';
import Page from '../../../../shared/Page';
import PersonalInformation from './personal_information/PersonalInformation';
import SubjectAssignmentsAll from './subjects_assignments/all/SubjectAssignmentsAll';
import { getProfileTeacher } from '../../../../api/teacherApi';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

// ----------------------------------------------------------------------

export default function TeacherProfile() {
    const [user, setUser] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const params = useParams();
    const [userId, setUserId] = useState(null);
    const [institutionCode, setInstitutionCode] = useState(null)

    useEffect(() => {
        getDataTeacher();
    }, []);

    const getDataTeacher = () => {
        let teacher_id = params.id;
        getProfileTeacher(teacher_id).then((r) => {
            if(r.data.data){
                const teacher = r.data.data.user;
                teacher.is_covid = teacher.is_covid.toString();
                const institution = r.data.data.institution;

                const new_teacher = {
                    id          : teacher_id,
                    firt_name   : teacher.firt_name,
                    last_name   : teacher.last_name,
                    email       : teacher.email,
                    dni         : teacher.dni,
                    phone       : teacher.phone,
                    specialty   : teacher.specialty,
                    is_covid    : teacher.is_covid,
                    address     : teacher.address,
                    condition   : teacher.condition,
                };
                setUser(new_teacher);
                setUserId(teacher.id);
                setInstitutionCode(institution.code);

                const subjects = r.data.data.subject_assignments;
                setSubjects(subjects);
            }
        }).catch((e) => {
            console.log("Error del servidor, src/logged_in/components/teacher/profile/all/TeacherProfile.js, line 33");
        });
    }

    return (
        <div>
            <RootStyle>
                <Container>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            Perfil del Docente
                        </Typography>
                    </Box>
                    <PersonalInformation user={user} />
                    <br/>
                    {
                        (subjects && userId && institutionCode)
                        &&
                        <SubjectAssignmentsAll listSubjects={subjects} userId={userId} institutionCode={institutionCode} getDataTeacher={getDataTeacher}/>
                    }
                </Container>
            </RootStyle>
        </div>
    );
}
