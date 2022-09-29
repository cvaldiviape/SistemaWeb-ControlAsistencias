<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Role_has_user extends Model
{
    // use HasFactory;
    protected $table = 'role_has_user';
    protected $primaryKey = 'id';
    protected $fillable = ['user_id', 'role_id'];


    public function user() // ok
    {
        return $this->belongsto('App\Models\User', 'user_id');
    }

    public function rol() // ok
    {
        return $this->belongsto('App\Models\Rol', 'role_id');
    }
}
