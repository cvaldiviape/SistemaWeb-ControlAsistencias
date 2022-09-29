<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class UbigeoPeruDepartmentController extends Controller{

    public function index(){
       
        $departments = DB::table('ubigeo_peru_departments')->select('id', 'name')
                                                           ->orderBy('name', 'ASC')
                                                           ->get();

        return response()->json([
            'success' => true,
            'data' => $departments,
        ], 200);
    }
}