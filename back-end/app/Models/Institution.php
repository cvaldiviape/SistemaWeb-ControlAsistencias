<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Institution extends Model
{
    protected $table = 'institutions';
    protected $primaryKey = 'id';
    protected $fillable = ['code', 'name', 'description', 'ubigeo_id', 'direccion_regional_id', 'phone', 'mobile', 'information', 'active', 'ugel'];

    public function direccion_regional() // ok
    {
        return $this->belongsto('App\Models\Direccion_regional', 'direccion_regional_id');
    }

    public function ubigeo_peru_district() // ok
    { 
        return $this->belongsto('App\Models\Ubigeo_peru_district', 'ubigeo_id');
    }

    public function subject_assignment() // ok
    {
        return $this->hasMany('App\Models\Subject_assignment','institution_id');
    }

    public function user() // ok
    {
        //return $this->hasOne('App\Models\User','user_id');
        return $this->hasMany('App\Models\User','institution_id');
    }
}
