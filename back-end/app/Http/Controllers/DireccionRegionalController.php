<?php
namespace App\Http\Controllers;

use App\Models\Direccion_regional;

class DireccionRegionalController extends Controller{

    public function index(){
       
        $address_regions = Direccion_regional::all();

        return response()->json([
            'success' => true,
            'data' => $address_regions,
        ], 200);
    }

}