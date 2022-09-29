<?php
namespace App\Http\Controllers;

use App\Models\Degree;
use App\Models\Section;
use Illuminate\Support\Facades\DB;

class SectionController extends Controller{

    public function search($degree_code){
       
        $degree = Degree::where("code", $degree_code)->first();
        $sections = Section::where("degree_id", $degree->id)->get();

        return response()->json([
            'success' => true,
            'data' => $sections,
        ], 200);
    }

    public function searchByTeacher($teacher_id, $subject_id, $degree_id){
       
        $sections = DB::table('sections AS se')->join('subject_assignments AS sa', 'sa.section_id', '=', 'se.id')
                                               ->join('users AS us', 'us.id', '=', 'sa.teacher_id')
                                               ->join('subjects AS su', 'su.id', '=', 'sa.subject_id')
                                               ->join('degrees AS de', 'de.id', '=', 'se.degree_id')
                                               ->where('us.id', '=', $teacher_id)
                                               ->where('su.id', '=', $subject_id)
                                               ->where('de.id', '=', $degree_id)
                                               ->select('se.id', 'se.name')
                                               ->distinct()
                                               ->orderBy('se.id', 'ASC')
                                               ->get();

        return response()->json([
            'success' => true,
            'data' => $sections,
        ], 200);
    }
}