<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    const CODE_ROLE_ADMIN = '001';
    const CODE_ROLE_DIRECTOR = '002';
    const CODE_ROLE_TEACHER = '003';
    
    public function show($id)
    {
        $user = User::findOrFail($id);

        $subjects = DB::table('subject_assignments AS sa')->join('subjects AS su', 'su.id', '=', 'sa.subject_id')
                                                            ->where('sa.teacher_id', '=', $id)
                                                            ->distinct()
                                                            ->select('su.id', 'su.name')
                                                            ->get();

        $sections = DB::table('subject_assignments AS sa')->join('sections AS se', 'se.id', '=', 'sa.section_id')
                                                            ->where('sa.teacher_id', '=', $id)
                                                            ->distinct()
                                                            ->select('se.id', 'se.name')
                                                            ->get();

        $degrees = DB::table('subject_assignments AS sa')->join('degrees AS de', 'de.id', '=', 'sa.degree_id')
                                                            ->where('sa.teacher_id', '=', $id)
                                                            ->distinct()
                                                            ->select('de.id', 'de.name')
                                                            ->get();
        
        return response()->json([
            'success' => true,
            'data'    => [
                'dni' => $user->dni,
                'subjects' => $subjects,
                'sections' => $sections,
                'degrees' => $degrees,
            ],
        ], 200);
    }

    public function profile($id)
    {
        $user = DB::table('users AS us')->join('role_has_user AS ru', 'ru.user_id', '=', 'us.id')
                                        ->join('roles AS ro', 'ro.id', '=', 'ru.role_id')
                                        ->where('ro.code', '<>', self::CODE_ROLE_ADMIN)
                                        ->where('us.id', '=', $id)
                                        ->select('us.*')
                                        ->first();

        $subject_assignments = DB::table('users AS us')->join('subject_assignments AS sa', 'sa.teacher_id',  '=', 'us.id')
                                                        ->join('degrees AS de', 'de.id', '=', 'sa.degree_id')
                                                        ->join('sections AS se', 'se.id', '=', 'sa.section_id')
                                                        ->join('subjects AS su', 'su.id', '=', 'sa.subject_id')
                                                        ->where('us.id', '=', $id)
                                                        ->select('sa.id', 'su.name AS subject', 'de.name AS degree', 'se.name AS section')
                                                        ->get();
        
        $institution = Institution::findOrFail($user->institution_id);
       
        if($user){
            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'subject_assignments' => $subject_assignments,
                    'institution' => $institution
                ],
            ], 200);
        }else{
            return response()->json([
                'teacher_error' => 'Teacher does not exist'
            ], 401);
        }
        
    }

    public function teachersOfInstitution($institution_code)
    {
        //Verificar no esta retornando bien los valores
        $institution = Institution::where('code', $institution_code)->first();

        $teachers = User::where('institution_id', $institution->id)->get();

        $teachers = DB::table('users AS us')->join('role_has_user AS ru', 'ru.user_id', '=', 'us.id')
                                            ->join('roles AS ro', 'ro.id', '=', 'ru.role_id')
                                            ->where('ro.code', '<>', self::CODE_ROLE_ADMIN)
                                            ->select('us.id', DB::raw("CONCAT(us.firt_name, ' ', us.last_name) AS full_name"), 'us.email', 'us.dni', 'us.email', 'us.phone','us.condition')
                                            ->orderBy('id')
                                            ->get();

        return response()->json([
            'success' => true,
            'data' => $teachers,
        ], 200);
    }

    public function search(Request $req)
    {
        $filter_value = $req->input('filter_value');
        $institution_code = $req->input('institution_code');
        
        $users = DB::table('users AS us')->join('role_has_user AS ru', 'ru.user_id', '=', 'us.id')
                                         ->join('roles AS ro', 'ro.id', '=', 'ru.role_id')
                                         ->join('institutions AS ins', 'ins.id', '=', 'us.institution_id')
                                         ->where('ro.code', '<>', self::CODE_ROLE_ADMIN)
                                         ->where('ins.code', '=', $institution_code)
                                         ->Where(function($query) use ($filter_value){
                                            $query->orWhere('firt_name', 'LIKE', "%$filter_value%")
                                                  ->orWhere('last_name', 'LIKE', "%$filter_value%")
                                                  ->orWhere(DB::raw("CONCAT_WS(' ', firt_name, last_name)"), 'LIKE', "%$filter_value%")
                                                  ->orWhere(DB::raw("CONCAT_WS(' ', last_name, firt_name)"), 'LIKE', "%$filter_value%")
                                                  ->orWhere('dni', '=', "$filter_value");
                                         })
                                         ->select('us.id', DB::raw("CONCAT(us.firt_name, ' ', us.last_name) AS full_name"), 'us.email', 'us.dni', 'us.email', 'us.phone', 'us.condition')
                                         ->orderBy('full_name', 'ASC')
                                         ->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ], 200);
    }
}
