<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Ubigeo_peru_department extends Model
{
    protected $table = 'ubigeo_peru_departments';
    protected $primaryKey = 'id';
    protected $fillable = ['name'];
    
    public function Ubigeo_peru_district() // ok
    { 
        return $this->hasMany('App\Models\Ubigeo_peru_district', 'department_id');
    }

    public function Ubigeo_peru_province() // ok
    { 
        return $this->hasMany('App\Models\Ubigeo_peru_province', 'department_id');
    }
}
