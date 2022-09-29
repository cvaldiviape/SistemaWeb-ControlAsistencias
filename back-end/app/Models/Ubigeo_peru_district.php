<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Ubigeo_peru_district extends Model
{
    protected $table = 'ubigeo_peru_districts';
    protected $primaryKey = 'id';
    protected $fillable = ['name', 'province_id', 'department_id'];
    

    public function institution() // ok
    {
        return $this->hasMany('App\Models\Institution','ubigeo_id');
    }

    public function Ubigeo_peru_department() // ok
    { 
        return $this->belongsto('App\Models\Ubigeo_peru_department', 'department_id');
    }

    public function Ubigeo_peru_province() // ok
    { 
        return $this->belongsto('App\Models\Ubigeo_peru_province', 'province_id');
    }
}
