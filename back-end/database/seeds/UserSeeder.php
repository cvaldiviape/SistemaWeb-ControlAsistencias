<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Admin
        User::create([
            'firt_name'      => 'Cristian',
            'last_name'  => 'Villegas',
            'email'     => 'cvillegas@ruwaytech.com',
            'dni'     => '46046448',
            'phone' => '963738532',
            'specialty' => '',
            'is_covid' => 1,
            'condition' => 'Nombrado',
            'password'  => Hash::make('12345'),
            'active'=>1
        ]);
    }
}
