<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Degree extends Model
{
    protected $table = 'degrees';
    protected $primaryKey = 'id';
    protected $fillable = ['code', 'name', 'active'];

    public function section() // ok
    {
        return $this->hasMany('App\Models\Section','section_id');
    } 

     public function subject_assignment() // ok
    {
        return $this->hasMany('App\Models\Subject_assignment','degree_id');
    } 
}
