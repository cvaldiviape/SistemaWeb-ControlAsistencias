<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Ubigeo_peru_province extends Model
{
    protected $table = 'ubigeo_peru_provinces';
    protected $primaryKey = 'id';
    protected $fillable = ['name', 'department_id'];
    
    public function Ubigeo_peru_department() // ok
    { 
        return $this->belongsto('App\Models\Ubigeo_peru_department', 'department_id');
    }

    public function Ubigeo_peru_district() // ok
    { 
        return $this->hasMany('App\Models\Ubigeo_peru_district', 'province_id');
    }
}
