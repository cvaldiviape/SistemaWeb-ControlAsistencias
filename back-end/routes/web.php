<?php

$router->get('/', function () use ($router) {
    return view('welcome', ['version' => $router->app->version()]);
});

//----------------------------------------------------- My routes -----------------------------------------------------//

/**
 * User Route 
 */
$router->post('user-authentication', 'UserController@auth'); // OK
$router->post('user-reset-password', 'UserController@resetpassword'); // OK
$router->post('user-register-account', 'UserController@register'); // OK
$router->get('user-all', 'UserController@index'); // OK
$router->get('user-search', 'UserController@search'); // OK
$router->get('user-edit/{id}', 'UserController@edit'); // OK
$router->put('user-update', 'UserController@update'); // OK
$router->delete('user-delete/{id}', 'UserController@destroy'); // OK

/**
 * Teacher Route 
 */
$router->get('teacher-show-subject-assignments/{id}', 'TeacherController@show'); // OK
$router->get('teacher-profile/{id}', 'TeacherController@profile'); // OK
$router->get('teacher-of-institution/{institution_code}', 'TeacherController@teachersOfInstitution'); // OK
$router->get('teacher-search', 'TeacherController@search'); // OK

/**
 * Assistance Route 
 */
$router->post('assistance-register', 'AssistanceController@register'); // OK
$router->get('assistance-of-teacher/{teacher_id}/{from}/{to}', 'AssistanceController@assistancesOfTeacher'); // OK
$router->get('assistance-all', 'AssistanceController@index'); // OK
$router->get('assistance-search', 'AssistanceController@search'); // FAIL
$router->get('assistance-edit/{id}', 'AssistanceController@edit'); // OK
$router->put('assistance-update', 'AssistanceController@update'); // OK
$router->delete('assistance-delete/{id}', 'AssistanceController@destroy'); // OK
$router->get('assistance-report', 'AssistanceController@assistancesOfTeacherReport'); // OK

/**
 * SubjectAssignment Route 
 */
$router->post('subject-assignment-register', 'SubjectAssignmentController@register'); // OK
$router->get('subject-assignment-search-by-ids/{institution_id}/{teacher_id}/{subject_id}/{degree_id}/{section_id}', 'SubjectAssignmentController@searchByIds'); // OK
$router->get('subject-assignment-of-teacher/{teacher_id}', 'SubjectAssignmentController@subjectAssignmentOfTeacher'); // OK
$router->get('subject-assignment-edit/{id}', 'SubjectAssignmentController@edit'); // OK
$router->put('subject-assignment-update', 'SubjectAssignmentController@update'); // OK
$router->delete('subject-assignment-delete/{id}', 'SubjectAssignmentController@destroy'); // OK

/**
 * Role Route 
 */
$router->get('role-all', 'RolController@index'); // OK

/**
 * Subject Route 
 */
$router->get('subject-all', 'SubjectController@index'); // OK
$router->get('subject-of-teacher/{teacher_id}', 'SubjectController@searchByTeacher'); // OK

/**
 * Degree Route 
 */
$router->get('degree-all', 'DegreeController@index'); // OK
$router->get('degree-of-teacher-by-subject/{teacher_id}/{subject_id}', 'DegreeController@searchByTeacher'); // OK

/**
 * Section Route 
 */
$router->get('section-of-degree/{degree_code}', 'SectionController@search'); // OK
$router->get('section-of-teacher-by-degree/{teacher_id}/{subject_id}/{degree_id}', 'SectionController@searchByTeacher'); // OK

/**
 * Institution Route 
 */
$router->get('institution-all', 'InstitutionController@index'); // OK
$router->get('institution-search', 'InstitutionController@search'); // OK
$router->post('institution-register', 'InstitutionController@register'); // OK
$router->get('institution-edit/{id}', 'InstitutionController@edit'); // OK
$router->put('institution-update', 'InstitutionController@update'); // OK
$router->delete('institution-delete/{id}', 'InstitutionController@destroy'); // OK

/**
 * Direccion_regional Route 
 */
$router->get('address-region-all', 'DireccionRegionalController@index'); // OK

/**
 * UbigeoPeruDepartment Route 
 */
$router->get('department-all', 'UbigeoPeruDepartmentController@index'); // OK

/**
 * UbigeoPeruProvince Route 
 */
$router->get('province-of-department/{department_id}', 'UbigeoPeruProvinceController@search'); // OK

/**
 * UbigeoPeruDistrict Route 
 */
$router->get('district-of-province/{province_id}', 'UbigeoPeruDistrictController@search'); // OK

//-------------------------------------------------- END My routes ---------------------------------------------------//
