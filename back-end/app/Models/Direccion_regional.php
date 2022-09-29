<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Direccion_regional extends Model
{
    protected $table = 'direccion_regional';
    protected $primaryKey = 'id';
    protected $fillable = ['nombre', 'responsable_id', 'active'];

     public function direccion_regional() // ok
    {
        return $this->hasMany('App\Models\Direccion_regional','direccion_regional_id');
    }
}
