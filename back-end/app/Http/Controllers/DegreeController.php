<?php
namespace App\Http\Controllers;

use App\Models\Degree;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class DegreeController extends Controller{

    public function index(){
       
        $degrees = Degree::all();

        return response()->json([
            'success' => true,
            'data' => $degrees,
        ], 200);
    }

    public function searchByTeacher($teacher_id, $subject_id){
       
        $degrees = DB::table('degrees AS de')->join('subject_assignments AS sa', 'sa.degree_id', '=', 'de.id')
                                             ->join('subjects AS su', 'su.id', '=', 'sa.subject_id')
                                             ->join('users AS us', 'us.id', '=', 'sa.teacher_id')
                                             ->where('us.id', '=', $teacher_id)
                                             ->where('su.id', '=', $subject_id)
                                             ->select('de.id', 'de.name')
                                             ->distinct()
                                             ->orderBy('de.id', 'ASC')
                                             ->get();
        return response()->json([
            'success' => true,
            'data' => $degrees,
        ], 200);
    }
}