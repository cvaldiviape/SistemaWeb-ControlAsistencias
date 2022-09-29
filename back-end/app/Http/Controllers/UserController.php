<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use App\Models\User;
use App\Models\Role_has_user;
use App\Models\Institution;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function __construct()
    {
        $this->middleware('jwt.admin', ['only' => ['profile']]);
    }

    protected function jwt($user)
    {
        $payload = [
            'level' => 'admin',
            'sub'   => $user->user_id,
            'iat'   => time(),
            'exp'   => time() + 60 * 60 * 24
        ];
        return JWT::encode($payload, env('JWT_SECRET'));
    }

    public function auth(Request $req)
    {
        $this->validate($req, [
            'email' => 'required',
            'password'  => 'required'
        ]);
        
        $user = User::where('email', $req->email)->first();
        if($user){
            $role_has_user = Role_has_user::where('user_id', $user->id)->first();
            $role = Rol::findOrFail($role_has_user->role_id);
            $institution = null;

            if($user->institution_id){
                $institution = Institution::findOrFail($user->institution_id);
            } 
            else {
                if($role->code=='002' || $role->code=='003')
                    return response()->json('Por favor contactar al director o administrador del sistema para activar su cuenta', 401);
            } 
            
            if(Hash::check($req->password, $user->password)) {
                $user["api_token"] = $this->jwt($user);
                $user["name"] = $user["firt_name"]." ".$user["last_name"];
                $user["password"] = "";
                return response()->json([
                    'success' => true,
                    'message' => 'Login Successfull',
                    'data' => [
                        'user' => $user,
                        'role' => $role,
                        'institution' => $institution,
                    ]
                ]);
            } else {
                return response()->json('La clave es incorrecto', 401);
            }   
        } else {
            return response()->json('El usuario no existe', 401);
        }
    }

    public function resetpassword(Request $req)
    {
        $this->validate($req, [
            'email' => 'required|email',
        ]);

        $user = User::where('email', $req->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User is not registered'
            ], 404);
        } else {
            return response()->json([
                'success' => true,
                'message' => 'Send link reset password!',
                'data'    => 'aqui colocar link de la pagina para resetear contraseña',
            ], 200);
        }
    }

    public function register(Request $req)
    { 
        $this->validate($req, [
            'firt_name'  => 'required',
            'last_name'  => 'required',
            'email' => 'required|email|max:191',
            'password' => 'required|min:8|max:191',
            'dni' => 'required|min:8|max:8',
            'phone' => 'required|min:6|max:15',
            'specialty' => 'required',
            'is_covid' => 'required',
            'address' =>  'required',
            'condition' => 'required',
            'role_code' => 'required',
        ]);

        $checkEmail = User::where('email', $req->email)->count();
        if ($checkEmail >= 1) {
            return response()->json([
                'success' => false,
                'email' => [
                    "The email has already registered!"
                ]
            ], 406);
        }
        $checkPhone = User::where('phone', $req->phone)->count();
        if ($checkPhone >= 1) {
            return response()->json([
                'success' => false,
                'phone' => [
                    "The phone has already registered!"
                ]
            ], 406);
        }
        $checkDni = User::where('dni', $req->dni)->count();
        if ($checkDni >= 1) {
            return response()->json([
                'success' => false,
                'dni' => [
                    "The DNI has already registered!"
                ]
            ], 406);
        } 
        else {
            $institution = Institution::where('code', $req->institution_code)->first();

            $institution_id = null;

            if($institution){
                $institution_id = $institution->id;
            }

            $role = Rol::where('code', $req->role_code)->first();

            $user = User::create([
                'firt_name'  => $req->firt_name,
                'last_name'  => $req->last_name,
                'email' => $req->email,
                'password' => Hash::make($req->password),
                'dni' => $req->dni,
                'phone' => $req->phone,
                'specialty' => $req->specialty,
                'is_covid' => $req->is_covid,
                'address' => $req->address,
                'condition' => $req->condition,
                'institution_id' => $institution_id
            ]);

            Role_has_user::create([
                'user_id' => $user->id,
                'role_id' => $role->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Account Created!',
                'data'    => [
                    'user' => $user,
                    'role' => $role,
                    'institution' => $institution,
                ],
            ], 200);
        }
    }

    public function search(Request $req)
    {
        $filter_value = $req->input('filter_value');
        
        $users = DB::table('users AS us')->join('role_has_user AS ru', 'ru.user_id', '=', 'us.id')
                                         ->join('roles AS ro', 'ro.id', '=', 'ru.role_id')
                                         ->Where(function($query) use ($filter_value){
                                            $query->orWhere('firt_name', 'LIKE', "%$filter_value%")
                                                  ->orWhere('last_name', 'LIKE', "%$filter_value%")
                                                  ->orWhere(DB::raw("CONCAT_WS(' ', firt_name, last_name)"), 'LIKE', "%$filter_value%")
                                                  ->orWhere(DB::raw("CONCAT_WS(' ', last_name, firt_name)"), 'LIKE', "%$filter_value%")
                                                  ->orWhere('dni', '=', "$filter_value");
                                         })
                                         ->select('us.id', DB::raw("CONCAT(us.firt_name, ' ', us.last_name) AS full_name"), 'us.email', 'us.dni', 'us.email', 'us.phone', 'ro.name AS role')
                                         ->orderBy('ro.name', 'ASC')
                                         ->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ], 200);
    }

    public function index()
    {
        $users = DB::table('users AS us')->join('role_has_user AS ru', 'ru.user_id', '=', 'us.id')
                                         ->join('roles AS ro', 'ro.id', '=', 'ru.role_id')
                                         ->select('us.id', DB::raw("CONCAT(us.firt_name, ' ', us.last_name) AS full_name"), 'us.email', 'us.dni', 'us.email', 'us.phone','ro.name AS role')
                                         ->orderBy('ro.name', 'ASC')
                                         ->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ], 200);
    }

    public function edit($id)
    {   
        $user = User::findOrFail($id);
    
        $role_has_user = Role_has_user::where('user_id', $user->id)->first();
        
        $role = Rol::findOrFail($role_has_user->role_id);

        $institution = null;
        if($user->institution_id){
            $institution = Institution::findOrFail($user->institution_id);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'role' => $role,
                'institution' => $institution,
            ]
        ], 200);  
    }

    public function update(Request $req)
    {    
        $this->validate($req, [
            'id' => 'required',
            'firt_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|max:191',
            'dni' => 'required|min:8|max:8',
            'phone' => 'required|min:6|max:15',
            'specialty' => 'required',
            'is_covid' => 'required',
            'address' =>  'required',
            'condition' => 'required',
            'role_code' => 'required',
        ]);

        $user = User::findOrFail($req->id);

        $checkEmail = User::where('email', $req->email)->count();
        if ($checkEmail >= 1 && $user->email != $req->email) { 
            return response()->json([
                'success' => false,
                'email' => [
                    "The email has already registered!"
                ]
            ], 406);
        }
        $checkPhone = User::where('phone', $req->phone)->count();
        if ($checkPhone >= 1 && $user->phone != $req->phone) {
            return response()->json([
                'success' => false,
                'phone' => [
                    "The phone has already registered!"
                ]
            ], 406);
        }
        $checkdni = User::where('dni', $req->dni)->count(); 
        if ($checkdni >= 1 && $user->dni != $req->dni) {
            return response()->json([
                'success' => false,
                'dni' => [
                    "The DNI has already registered!"
                ]
            ], 406);
        } 
        else {

            $role = Rol::where('code', $req->role_code)->first();

            $institution = null;
            $institution_id = null;
            
            if($req->institution_code){
                $institution = Institution::where('code', $req->institution_code)->first();
                $institution_id = $institution->id;
            }

            $user->update([
                'firt_name' => $req->firt_name,
                'last_name' => $req->last_name,
                'email' => $req->email,
                'dni' => $req->dni,
                'phone' => $req->phone,
                'specialty' => $req->specialty,
                'is_covid' => $req->is_covid,
                'address' => $req->address,
                'condition' => $req->condition,
                'institution_id' => $institution_id
            ]);

            $role_has_user = Role_has_user::findOrFail($user->id);

            $role_has_user->update([
                'role_id' => $role->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User Updated!',
                'data' => [
                    'user' => $user,
                    'role' => $role,
                    'institution' => $institution,
                ]
            ], 200);
        }
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User Deleted!',
            'data' => $user
        ], 200);
    }
}
