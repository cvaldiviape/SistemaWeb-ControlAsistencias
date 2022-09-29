<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $table = 'subjects';
    protected $primaryKey = 'id';
    protected $fillable = ['code', 'name', 'active'];

    public function subject_assignment() // ok
    {
        return $this->hasMany('App\Models\Subject_assignment', 'subject_id');
    }
}
