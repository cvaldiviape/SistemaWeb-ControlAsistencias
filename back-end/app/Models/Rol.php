<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = 'roles';
    protected $primaryKey = 'id';
    protected $fillable = ['name', 'code', 'guard_name', 'default'];


    public function role_has_user() // ok
    {
        return $this->hasMany('App\Models\Role_has_user', 'role_id');
    }
}
