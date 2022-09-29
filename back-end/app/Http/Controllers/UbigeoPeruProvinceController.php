<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
class UbigeoPeruProvinceController extends Controller{

    public function search($department_id){
       
        $provinces = DB::table('ubigeo_peru_provinces')->where('department_id', '=', $department_id)
                                                       ->select('id', 'name')
                                                       ->orderBy('name', 'ASC')
                                                       ->get();

        return response()->json([
            'success' => true,
            'data' => $provinces,
        ], 200);
    }
}