<?php

use Illuminate\Database\Seeder;
use App\Models\Rol;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Rol::create([
            'name'     => 'Administrador',
            'code'=> '001',
            'guard_name'  => 'web',
            'default'   => 0
        ]);

        Rol::create([
            'name'     => 'Director',
            'code'=> '002',
            'guard_name'  => 'web',
            'default'   => 0
        ]);

        Rol::create([
            'name'     => 'Docente',
            'code'=> '003',
            'guard_name'  => 'web',
            'default'   => 1
        ]);
    }
}
