<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = "users";
    protected $primaryKey = 'id';
    protected $fillable = ['firt_name', 'last_name', 'email', 'password', 'dni', 'api_token', 'device_token', 'phone', 'specialty','verified', 'is_covid', 'address', 'condition', 'active', 'institution_id'];

    public function assistance() // ok
    { 
        return $this->hasMany('App\Models\Assistance', 'user_id');
    }

    public function role_has_user() // ok
    { 
        return $this->hasMany('App\Models\Role_has_user', 'user_id');
    }

    public function institution() // ok
    {
        return $this->belongsto('App\Models\Institution', 'institution_id');
        //return $this->belongsTo('App\Models\Institution', 'user_id');
    }
    
}
