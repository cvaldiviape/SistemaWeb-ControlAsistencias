<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Assistance extends Model
{
    protected $table = 'assistances';
    protected $primaryKey = 'id';
    protected $fillable = ['register_date', 'latitude', 'longitude', 'user_id', 'subject_assignment_id', 'theme', 'comments', 'active'];
    //protected $dates = ['register_date'];
    
    public function user() // ok
    { 
        return $this->belongsto('App\Models\User', 'user_id');
    }

    public function subject_assignment() // ok
    {
        return $this->belongsto('App\Models\Subject_assignment', 'subject_assignment_id');
    }
}
