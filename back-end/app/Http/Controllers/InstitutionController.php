<?php
namespace App\Http\Controllers;

use App\Models\Institution;
use Illuminate\Http\Request;
use App\Models\Direccion_regional;
use Illuminate\Support\Facades\DB;
class InstitutionController extends Controller{

    public function index()
    {
        $institutions = DB::table('institutions AS in')->join('direccion_regional AS dire', 'dire.id', '=', 'in.direccion_regional_id')
                                                       ->join('ubigeo_peru_districts AS updi', 'updi.id', '=', 'in.ubigeo_id')
                                                       ->join('ubigeo_peru_provinces AS upp', 'upp.id', '=', 'updi.province_id')
                                                       ->join('ubigeo_peru_departments AS upde', 'upde.id', '=', 'updi.department_id')
                                                       ->select('in.*', 'dire.nombre AS region', 'upde.name AS department')
                                                       ->orderBy('in.id', 'ASC')
                                                       ->get();
       
        return response()->json([
            'success' => true,
            'data' => $institutions,
        ], 200);

    }

    public function search(Request $req)
    {
        $filter_value = $req->input('filter_value');

        $institutions = DB::table('institutions AS in')->join('direccion_regional AS dire', 'dire.id', '=', 'in.direccion_regional_id')
                                                       ->join('ubigeo_peru_districts AS updi', 'updi.id', '=', 'in.ubigeo_id')
                                                       ->join('ubigeo_peru_provinces AS upp', 'upp.id', '=', 'updi.province_id')
                                                       ->join('ubigeo_peru_departments AS upde', 'upde.id', '=', 'updi.department_id')
                                                       ->Where(function($query) use ($filter_value){
                                                            $query->orWhere('code', '=', "$filter_value")
                                                                  ->orWhere('in.name', 'like', "%$filter_value%")
                                                                  ->orWhere('in.ugel', 'like', "%$filter_value%")
                                                                  ->orWhere('upde.name', 'like', "%$filter_value%")
                                                                  ->orWhere('dire.nombre', 'like', "%$filter_value%");
                                                        })
                                                       ->select('in.*', 'dire.nombre AS region', 'upde.name AS department')
                                                       ->orderBy('in.id', 'ASC')
                                                       ->get();
       
        return response()->json([
            'success' => true,
            'data' => $institutions,
        ], 200);

    }

    public function register(Request $req)
    { 
        $this->validate($req, [
            'code' => 'required',
            'name' => 'required',
            'description' => 'required',
            'ubigeo_id' => 'required',
            'address_region_id' => 'required',
            'phone' => 'required',
            'mobile' => 'required',
            'information' => 'required',
            'ugel' => 'required',
        ]);

        $checkCode = Institution::where('code', $req->code)->count();
        if ($checkCode >= 1) {
            return response()->json([
                'success' => false,
                'code' => [
                    "The code has already registered!"
                ]
            ], 406);
        }
        $checkPhone = Institution::where('phone', $req->phone)->count();
        if ($checkPhone >= 1) {
            return response()->json([
                'success' => false,
                'phone' => [
                    "The phone has already registered!"
                ]
            ], 406);
        }
        $checkMobile = Institution::where('mobile', $req->mobile)->count();
        if ($checkMobile >= 1) {
            return response()->json([
                'success' => false,
                'mobile' => [
                    "The mobile has already registered!"
                ]
            ], 406);
        } else {
            $institution = Institution::create([
                'code' => $req->code,
                'name' => $req->name,
                'description' => $req->description,
                'ubigeo_id' => $req->ubigeo_id,
                'direccion_regional_id' => $req->address_region_id,
                'phone' => $req->phone,
                'mobile' => $req->mobile,
                'information' => $req->information,
                'ugel' => $req->ugel,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Intitution Created!',
                'data' => $institution,
            ], 200);
        }
    }

    public function edit($id)
    {
        $institution = Institution::findOrFail($id);
        $direccion_regional = Direccion_regional::findOrFail($institution->direccion_regional_id);

        $district = DB::table('ubigeo_peru_districts')->where('id', '=', $institution->ubigeo_id)
                                                      ->select('id', 'name', 'department_id', 'province_id')
                                                      ->first();

        $department = DB::table('ubigeo_peru_departments')->where('id', '=', $district->department_id)
                                                          ->select('id', 'name')
                                                          ->first();

        $province = DB::table('ubigeo_peru_provinces')->where('id', '=', $district->province_id)
                                                      ->select('id', 'name')
                                                      ->first();
      
        return response()->json([
            'success' => true,
            'data' => [
                'institution' => $institution,
                'address_region' => $direccion_regional,
                'district' => $district,
                'department' => $department,
                'province' => $province
            ],
        ], 200);
    }

    public function update(Request $req)
    {
        $this->validate($req, [
            'id' => 'required',
            'code' => 'required',
            'name' => 'required',
            'description' => 'required',
            'ubigeo_id' => 'required',
            'address_region_id' => 'required',
            'phone' => 'required',
            'mobile' => 'required',
            'information' => 'required',
            'ugel' => 'required',
        ]);

        $institution = Institution::findOrFail($req->id);

        $checkCode = Institution::where('code', $req->code)->count();
        if ($checkCode >= 1 && $institution->code != $req->code) {
            return response()->json([
                'success' => false,
                'code' => [
                    "The code has already registered!"
                ]
            ], 406);
        }

        $checkPhone = Institution::where('phone', $req->phone)->count();
        if ($checkPhone >= 1 && $institution->phone != $req->phone) {
            return response()->json([
                'success' => false,
                'phone' => [
                    "The phone has already registered!"
                ]
            ], 406);
        }

        $checkMobile = Institution::where('mobile', $req->mobile)->count();
        if ($checkMobile >= 1 && $institution->mobile != $req->mobile) {
            return response()->json([
                'success' => false,
                'mobile' => [
                    "The mobile has already registered!"
                ]
            ], 406);
        }
        else{
            $institution->update([
                'code' => $req->code,
                'name' => $req->name,
                'description' => $req->description,
                'ubigeo_id' => $req->ubigeo_id,
                'direccion_regional_id' => $req->address_region_id,
                'phone' => $req->phone,
                'mobile' => $req->mobile,
                'information' => $req->information,
                'ugel' => $req->ugel
            ]);
    
            return response()->json([
                'success' => true,
                'message' => 'Institution Updated!',
                'data' => $institution
            ], 200);
        }   
    }

    public function destroy($id)
    {
        $institution = Institution::findOrFail($id);

        $institution->delete();

        return response()->json([
            'success' => true,
            'message' => 'Institution Deleted!',
            'data' => $institution
        ], 200);
    }

}