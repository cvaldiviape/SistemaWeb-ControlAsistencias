<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Subject_assignment extends Model
{
    protected $table = 'subject_assignments';
    protected $primaryKey = 'id';
    protected $fillable = ['subject_id', 'degree_id', 'section_id', 'institution_id', 'teacher_id', 'year', 'name', 'active'];

    public function subject() // ok
    {
        return $this->belongsto('App\Models\Subject', 'subject_id');
    }

    public function degree() // ok
    {
        return $this->belongsto('App\Models\Degree', 'degree_id');
    }

    public function section() // ok
    {
        return $this->belongsto('App\Models\Section', 'section_id');
    }

    public function user() // ok
    {
        return $this->belongsto('App\Models\User', 'teacher_id');
    }

    public function assistance() // ok
    {
        return $this->hasMany('App\Models\Assistance', 'subject_assignment_id');
    }

    public function institution() // ok
    {
        return $this->belongsto('App\Models\Institution', 'institution_id');
    }
}
