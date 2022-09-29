<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $table = 'sections';
    protected $primaryKey = 'id';
    protected $fillable = ['degree_id', 'code', 'name', 'active'];

    public function subject_assignment() // ok
    {
        return $this->hasMany('App\Models\Subject_assignment', 'section_id');
    }

    public function degree() // ok
    {
        return $this->belongsto('App\Models\Degree', 'degree_id');
    }
}
