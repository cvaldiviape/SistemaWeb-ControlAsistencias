<?php
namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Support\Facades\DB;

class SubjectController extends Controller{

    public function index(){
       
        $subjects = Subject::all();

        return response()->json([
            'success' => true,
            'data' => $subjects,
        ], 200);
    }

    public function searchByTeacher($teacher_id){
       
        $subjects = DB::table('subjects AS su')->join('subject_assignments AS sa', 'sa.subject_id', '=', 'su.id')
                                               ->join('users AS us', 'us.id', '=', 'sa.teacher_id')
                                               ->where('us.id', '=', $teacher_id)
                                               ->select('su.id', 'su.name')
                                               ->distinct()
                                               ->orderBy('su.id', 'ASC')
                                               ->get();
        return response()->json([
            'success' => true,
            'data' => $subjects,
        ], 200);
    }
}