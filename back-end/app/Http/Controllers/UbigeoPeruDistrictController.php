<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class UbigeoPeruDistrictController extends Controller{

    public function search($province_id){
       
        $districts = DB::table('ubigeo_peru_districts')->where('province_id', '=', $province_id)
                                                       ->select('id', 'name')
                                                       ->orderBy('name', 'ASC')
                                                       ->get();

        return response()->json([
            'success' => true,
            'data' => $districts,
        ], 200);
    }
    
}