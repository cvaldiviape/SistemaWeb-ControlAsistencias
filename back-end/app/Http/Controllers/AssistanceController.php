<?php
namespace App\Http\Controllers;

use App\Models\Assistance;
use Illuminate\Http\Request;
use App\Exports\AssistancesExport;
use App\Models\Subject_assignment;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

class AssistanceController extends Controller{

    const CODE_ROLE_ADMIN = '001';
    const CODE_ROLE_DIRECTOR = '002';
    const CODE_ROLE_TEACHER = '003';

    public function index(Request $req)
    {
        $institution_code = $req->input('institution_code');

        $assistances = DB::table('assistances AS a')->join('subject_assignments AS sa', 'sa.id',  '=', 'a.subject_assignment_id')
                                                    ->join('degrees AS de', 'de.id', '=', 'sa.degree_id')
                                                    ->join('sections AS se', 'se.id', '=', 'sa.section_id')
                                                    ->join('subjects AS su', 'su.id', '=', 'sa.subject_id')
                                                    ->join('users AS us', 'us.id', '=', 'a.user_id')
                                                    ->join('role_has_user AS ru', 'ru.user_id', '=', 'us.id')
                                                    ->join('roles AS ro', 'ro.id', '=', 'ru.role_id')
                                                    ->join('institutions AS ins', 'ins.id', '=', 'us.institution_id')
                                                    ->where('ro.code', '<>', self::CODE_ROLE_ADMIN)
                                                    ->where('ins.code', '=', $institution_code)
                                                    ->select('a.id', DB::raw("CONCAT(us.firt_name, ' ', us.last_name) AS full_name"), 'us.dni', 'su.name AS subject', 'de.name AS degree', 'se.name AS section', 'a.theme', 'a.register_date', 'a.latitude', 'a.longitude')
                                                    ->orderBy('a.register_date', 'DESC')
                                                    ->get();

        foreach ($assistances as $value){
            $value->hour = date('h:i a', strtotime($value->register_date));
            $value->date = date('d/m/Y', strtotime($value->register_date));
            $value->date_search = date('Y-m-d', strtotime($value->register_date));
        }
            
        return response()->json([
            'success' => true,
            'data' => $assistances,
        ], 200);        
    }

    public function assistancesOfTeacher ($teacher_id, $from, $to)
    {    
        $end_date= Carbon::createFromFormat('Y-m-d', $to)->endOfDay();

        $assistances = DB::table('assistances AS a')->join('subject_assignments AS sa', 'sa.id',  '=', 'a.subject_assignment_id')
                                                    ->join('degrees AS de', 'de.id', '=', 'sa.degree_id')
                                                    ->join('sections AS se', 'se.id', '=', 'sa.section_id')
                                                    ->join('subjects AS su', 'su.id', '=', 'sa.subject_id')
                                                    ->where('a.user_id', '=', $teacher_id)
                                                    ->whereBetween('a.register_date', [$from, $end_date])
                                                    ->select('a.id', 'su.name AS subject', 'de.name AS degree', 'se.name AS section', 'a.theme', 'a.register_date')
                                                    ->orderBy('a.register_date', 'DESC')
                                                    ->get();

        foreach ($assistances as $value){
            $value->hour = date('h:i a', strtotime($value->register_date));
            $value->date = date('d/m/Y', strtotime($value->register_date));
            $value->date_search = date('Y-m-d', strtotime($value->register_date));
        }
                                                       
        return response()->json([
            'success' => true,
            'data' => $assistances,
        ], 200);
    }

    public function search(Request $req)
    {
        $filter_value = $req->input('filter_value');
        $from_date = $req->input('from_date');
        $to_date = $req->input('to_date');
        $institution_code = $req->input('institution_code');

     
        $assistances = DB::table('assistances AS a')->join('subject_assignments AS sa', 'sa.id',  '=', 'a.subject_assignment_id')
                                                    ->join('degrees AS de', 'de.id', '=', 'sa.degree_id')
                                                    ->join('sections AS se', 'se.id', '=', 'sa.section_id')
                                                    ->join('subjects AS su', 'su.id', '=', 'sa.subject_id')
                                                    ->join('users AS us', 'us.id', '=', 'a.user_id')
                                                    ->join('role_has_user AS ru', 'ru.user_id', '=', 'us.id')
                                                    ->join('roles AS ro', 'ro.id', '=', 'ru.role_id')
                                                    ->join('institutions AS ins', 'ins.id', '=', 'us.institution_id')
                                                    ->whereBetween('a.register_date', [$from_date, $to_date])
                                                    ->where('ro.code', '=', self::CODE_ROLE_TEACHER)
                                                    ->where('ins.code', '=', $institution_code)
                                                    ->where(function($query) use ($filter_value){
                                                        $query->where('de.name', '=', "$filter_value")
                                                              ->orWhere('se.name', '=', "$filter_value")
                                                              ->orWhere('su.name', '=', "$filter_value")
                                                              ->orWhere('us.dni', '=', "$filter_value");
                                                    })
                                                    ->select(DB::raw("CONCAT(us.firt_name, ' ', us.last_name) AS full_name"), 'us.dni', 'su.name AS subject', 'de.name AS degree', 'se.name AS section', 'a.theme AS theme', 'a.register_date', 'a.latitude', 'a.longitude')
                                                    ->get();
        
        foreach ($assistances as $valor){
            $valor->register_date = date('d/m/Y', strtotime($valor->register_date));
        }
                                                    
        return response()->json([
            'success' => true,
            'data' => $assistances,
        ], 200);
    }

    public function register(Request $req)
    {
        $this->validate($req, [
            'user_id' => 'required',
            'subject_assignment_id' => 'required',
            'theme' => 'required',
            'comments' => 'required',
        ]);

        $register_date = $req->register_date; 
        if($register_date==null){
            $register_date = date("Y-m-d H:i:s");
        }else{
            $register_date = Carbon::createFromFormat('Y-m-d H:i:s',  $register_date);
        }

        $start_date = Carbon::createFromFormat('Y-m-d H:i:s',  $register_date)->startOfDay();
        $end_date= Carbon::createFromFormat('Y-m-d H:i:s',  $register_date)->endOfDay();
        
        $exists = DB::table('assistances')->where('subject_assignment_id', $req->subject_assignment_id)
                                          ->whereBetween('register_date', [$start_date, $end_date])
                                          ->first();

        if($exists){
            return response()->json([
                'success' => false,
                'message' => 'Para el dia actual ya se encuentra registrado la asistencia para esta área.',
            ], 406);
        }
        
        $day_off = new Carbon($register_date);

        if($day_off->dayOfWeekIso == 6 || $day_off->dayOfWeekIso == 7){
            return response()->json([
                'success' => false,
                'message' => 'Sabado y Domingo son dias no laborables.',
            ], 406);
        }

        $assistance = Assistance::create([
            'register_date' => $register_date,
            'user_id' => $req->user_id,
            'subject_assignment_id' => $req->subject_assignment_id,
            'theme' => $req->theme,
            'comments' => $req->comments,
            'latitude' => $req->latitude,
            'longitude' => $req->longitude
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Assistance registered!',
            'data' => $assistance,
        ], 200);
        
    
    }

    public function edit($id)
    {   
        $assistance = Assistance::findOrFail($id);
        $subject_assignment = Subject_assignment::findOrFail($assistance->subject_assignment_id);
    
        return response()->json([
            'success' => true,
            'data' => [
                'assistance' => $assistance,
                'subject_assignment' => $subject_assignment,
            ]
        ], 200);  
    }

    public function update(Request $req)
    {
        $this->validate($req, [
            'id' => 'required',
            'register_date' => 'required',
            'user_id' => 'required',
            'subject_assignment_id' => 'required',
            'theme' => 'required',
            'comments' => 'required',
        ]);
        
        $assistance = Assistance::findOrFail($req->id);

        $register_date = date("Y-m-d", strtotime($req->register_date));
      
        $exists = DB::table('assistances')->where('subject_assignment_id', $req->subject_assignment_id)
                                          ->whereDate('register_date', $register_date)
                                          ->first();

        if($exists && $exists->id!=$req->id){
            return response()->json('Para el dia actual ya se encuentra registrado la asistencia para esta área.', 402);
        }

        $day_off = new Carbon($req->register_date);

        if($day_off->dayOfWeekIso == 6 || $day_off->dayOfWeekIso == 7){
            return response()->json([
                'success' => false,
                'message' => 'Sabado y Domingo son dias no laborables.',
            ], 406);
        }

        $assistance->update([
            'register_date' => $req->register_date,
            'user_id' => $req->user_id,
            'subject_assignment_id' => $req->subject_assignment_id,
            'theme' => $req->theme,
            'comments' => $req->comments,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Assistance updated!',
            'data' => $assistance,
        ], 200);
        
    }

    public function destroy($id)
    {
        $assistance = Assistance::findOrFail($id);

        $assistance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Assistance Deleted!',
            'data' => $assistance
        ], 200);
    }

    public function assistancesOfTeacherReport (Request $req)
    {
        $institution_code = $req->input('institution_code');
        $date = $req->input('date');

        $report_assistances =  DB::table('users AS us')->join('role_has_user AS ru', 'ru.user_id',  '=', 'us.id')
                                                       ->join('roles AS ro', 'ro.id',  '=', 'ru.role_id')
                                                       ->join('institutions AS ins', 'ins.id', '=', 'us.institution_id')
                                                       ->where('ro.code', '<>', self::CODE_ROLE_ADMIN)
                                                       ->where('ins.code', '=', $institution_code)
                                                       ->select(DB::raw("CONCAT(us.last_name, ', ', us.firt_name) AS full_name"), 'us.dni', 'us.condition', 'ro.name AS role')
                                                       ->orderBy('full_name', 'ASC')
                                                       ->get();

        $institution = DB::table('institutions AS ins')->join('ubigeo_peru_districts AS updi', 'updi.id', '=', 'ins.ubigeo_id')
                                                       ->join('ubigeo_peru_departments AS upde', 'upde.id', '=', 'updi.department_id') 
                                                       ->join('ubigeo_peru_provinces AS upp', 'upp.id', '=', 'updi.province_id') 
                                                       ->where('ins.code', '=', $institution_code)
                                                       ->select('ins.ugel', 'ins.name', 'updi.name AS district', 'upde.name AS department', 'upp.name AS province')
                                                       ->first();

        $total_days = date('t', strtotime($date));
        $month = date('m', strtotime($date));
        $year = date('Y', strtotime($date));

        $name_month = '';
        $months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

        for($i=0; $i<12; $i++)
        {
            if(intval($month)==($i+1))
            {
                $name_month = $months[$i];
            }
        }

        $alias_days_final = [];
        $days_date_final = [];
    
        foreach ($report_assistances as $user)
        {
            $total_assistances = 0; 
            $list_assistances = []; // seteando lista de asistencias de cada empleado, pero representado en ['A', 'T', 'F']
            $alias_days = [];       // [L,M,M,J,V,...]
            $days_date = [];        // [01,02,....., 29,30,31]

            for($i=1; $i<=$total_days; $i++){
                // domingo '0', lunes '1', martes '2', miercoles '3', jueves '4', viernes '5', sabado '6'
                $number_day = date('w', strtotime($year . '-'. $month . '-' . $i)); // '2021-11-01'
                $only_day_date = date('d', strtotime($year . '-'. $month . '-' . $i)); // '2021-11-01'
    
                if($number_day == '1' || $number_day == '2' || $number_day == '3'|| $number_day == '4' || $number_day == '5'){
                    //verificando si el usuario asistio tal dia del mes
                    $user_assistance = DB::table('users AS us')->join('assistances AS a', 'a.user_id', '=', 'us.id')
                                                               ->where('dni', $user->dni)
                                                               ->whereDate('a.register_date', $year . '-'. $month . '-' . $i)
                                                               ->select('a.register_date', 'a.status')
                                                               ->first();
                    $value = 'F';

                    if($user_assistance){
                        if($user_assistance->status=='Asistio'){
                            $value='A';
                        }else{
                            $value='T';
                        }
                        $total_assistances++;
                    }
                    array_push($list_assistances, $value);
                }  

                if($number_day == '1'){
                    array_push($alias_days, 'L');
                    array_push($days_date, $only_day_date);
                }
                else if($number_day == '2'){
                    array_push($alias_days, 'M');
                    array_push($days_date, $only_day_date);
                }
                else if($number_day == '3'){
                    array_push($alias_days, 'M');
                    array_push($days_date, $only_day_date);
                }
                else if($number_day == '4'){
                    array_push($alias_days, 'J');
                    array_push($days_date, $only_day_date);
                }
                else if($number_day == '5'){
                    array_push($alias_days, 'V');
                    array_push($days_date, $only_day_date);
                }
                
            }
            $user->total_assistances = $total_assistances;
            $user->list_assistances = $list_assistances;
            $alias_days_final = $alias_days;
            $days_date_final = $days_date;
        }

        $count_days = count($alias_days_final);
                    
        return Excel::download(new AssistancesExport(
            $report_assistances,
            $alias_days_final, 
            $count_days, 
            $days_date_final,
            $name_month,
            $institution,
        ), 'assistances.xlsx');
        
    }
    
    public function test ($date_current, $lista_facturas)
    {
        // sumandole 1 dia a la fecha de hoy
        $date_tomorrow = date("Y-m-d",strtotime($date_current ."+ 1 days"));  

        // domingo '0', sabado '6' - obteniendo el "numero de dia", es decir, "0 (para domingo) hasta 6 (para sábado)".
        $number_day = date('w', strtotime($date_tomorrow)); 

        foreach($lista_facturas as $item){
            // 0 (para domingo) hasta 6 (para sábado)
            if($number_day != '0' || $number_day != '6'){ // si el "dia_mañana" es diferente de "sabado" y "domingo", asignar "fecha_mañana"
                $item->fechaip = $date_tomorrow;
            }else{ // sino, asignar "fecha_hoy"
                $item->fechaip = $date_current;
            }
        }

        return $lista_facturas;
    }
}