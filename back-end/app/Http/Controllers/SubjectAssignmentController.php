<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Degree;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Institution;
use Illuminate\Http\Request;
use App\Models\Subject_assignment;
use Illuminate\Support\Facades\DB;

class SubjectAssignmentController extends Controller{

    public function register(Request $req)
    { 
        $this->validate($req, [
            'user_id' => 'required',
            'subject_code'  => 'required',
            'degree_code'  => 'required',
            'section_code'  => 'required',
            'institution_code'  => 'required',
            'year' => 'required',
            'name' => 'required'
        ]);

        $subject = Subject::where('code', $req->subject_code)->first();
        $degree = Degree::where('code', $req->degree_code)->first();
        $section = Section::where('code', $req->section_code)->first();
        $institution = Institution::where('code', $req->institution_code)->first();

        $exists = Subject_assignment::where('institution_id', $institution->id)
                                    ->where('subject_id', $subject->id)
                                    ->where('degree_id', $degree->id)
                                    ->where('section_id', $section->id)
                                    ->first();

        if ($exists){
            if($exists->teacher_id==$req->user_id){
                $message = "Esta Área ya se encuentra asignada a este docente.";
            }else{
                $teacher = User::findOrFail($exists->teacher_id);
                $full_name = "$teacher->firt_name $teacher->last_name";
                $message =  "Esta Área ya se encuentra asignada al docente '$full_name'.";
            }
            return response()->json([
                'success' => false,
                'message' => $message,
            ], 406);
        } 

        $subject_assignment = Subject_assignment::create([
            'subject_id' => $subject->id,
            'degree_id' => $degree->id,
            'section_id' => $section->id,
            'institution_id' => $institution->id,
            'teacher_id' => $req->user_id,
            'year' => $req->year,
            'name' => $req->name
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subject Assignment Created!',
            'data' => [
                'subject_assignment' => $subject_assignment,
                'subject' => $subject,
                'degree' => $degree,
                'section' => $section,
                'institution' => $institution,
            ],
        ], 200);
    }

    public function subjectAssignmentOfTeacher($teacher_id)
    {
        $subject_assignment = DB::table('subject_assignments AS sa')->join('degrees AS de', 'de.id', '=', 'sa.degree_id')
                                                                    ->join('sections AS se', 'se.id', '=', 'sa.section_id')
                                                                    ->join('subjects AS su', 'su.id', '=', 'sa.subject_id')
                                                                    ->where('sa.teacher_id', '=', $teacher_id)
                                                                    ->select('sa.id',  'su.name AS subject', 'de.name AS degree', 'se.name AS section')
                                                                    ->orderBy('subject', 'ASC')
                                                                    ->get();

        return response()->json([
            'success' => true,
            'data' => $subject_assignment,
        ], 200);
    }

    public function searchByIds ($institution_id, $teacher_id, $subject_id, $degree_id, $section_id)
    {
        $subject_assignment = Subject_assignment::where('institution_id', '=', $institution_id)
                                                ->where('teacher_id', '=', $teacher_id)
                                                ->where('subject_id', '=', $subject_id)
                                                ->where('degree_id', '=', $degree_id)
                                                ->where('section_id', '=', $section_id)
                                                ->first();

        return response()->json([
            'success' => true,
            'data' => $subject_assignment,
        ], 200);
    }

    public function edit($id)
    {   
        $subject_assignment = Subject_assignment::findOrFail($id);

        $subject = Subject::findOrFail($subject_assignment->subject_id);
        $degree = Degree::findOrFail($subject_assignment->degree_id);
        $section = Section::findOrFail($subject_assignment->section_id);
        $institution = Institution::findOrFail($subject_assignment->institution_id);
        
        return response()->json([
            'success' => true,
            'data' => [
                'subject_assignment' => $subject_assignment,
                'subject' => $subject,
                'degree' => $degree,
                'section' => $section,
                'institution' => $institution,
            ]
        ], 200);  
    }

    public function update(Request $req)
    { 
        $this->validate($req, [
            'id' => 'required',
            'subject_code'  => 'required',
            'degree_code'  => 'required',
            'section_code'  => 'required',
            'institution_code' => 'required',
            'year' => 'required',
            'name' => 'required',
            'user_id' => 'required'
        ]);

        $subject_assignment = Subject_assignment::findOrFail($req->id);

        $subject = Subject::where('code', $req->subject_code)->first();
        $degree = Degree::where('code', $req->degree_code)->first();
        $section = Section::where('code', $req->section_code)->first();
        $institution = Institution::where('code', $req->institution_code)->first();

        $exists = Subject_assignment::where('institution_id', $institution->id)
                                    ->where('subject_id', $subject->id)
                                    ->where('degree_id', $degree->id)
                                    ->where('section_id', $section->id)
                                    ->first();

        if ($exists && $exists->id!= $req->id){
            if($exists->teacher_id==$req->user_id){
                $message = "Esta Área ya se encuentra asignada a este docente.";
            }else{
                $teacher = User::findOrFail($exists->teacher_id);
                $full_name = "$teacher->firt_name $teacher->last_name";
                $message =  "Esta Área ya se encuentra asignada al docente '$full_name'.";
            }
            return response()->json([
                'success' => false,
                'message' => $message,
            ], 406);

        } 

        $subject_assignment->update([
            'subject_id' => $subject->id,
            'degree_id' => $degree->id,
            'section_id' => $section->id,
            'year' => $req->year,
            'name' => $req->name
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subject Assignment Updated!',
            'data' => [
                'subject_assignment' => $subject_assignment,
                'subject' => $subject,
                'degree' => $degree,
                'section' => $section,
            ],
        ], 200);
    }

    public function destroy($id)
    {
        $subject_assignment = Subject_assignment::findOrFail($id);

        $subject_assignment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subject Assignment Deleted!',
            'data' => $subject_assignment
        ], 200);
    }

    
}