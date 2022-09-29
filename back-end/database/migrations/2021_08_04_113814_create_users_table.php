<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('firt_name', 191);
            $table->string('last_name', 191);
            $table->string('email', 191);
            $table->string('password', 191);
            $table->string('dni', 8);
            $table->char('api_token', 60)->nullable();
            $table->string('device_token', 191)->nullable();
            $table->string('phone', 9);
            $table->string('specialty', 191);
            $table->string('verified', 100)->nullable();
            $table->boolean('is_covid');
            $table->string('address', 191);
            $table->enum('condition', ['Contratado','Nombrado']);
            $table->boolean('active')->default(1);
            $table->unsignedInteger('institution_id')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('institution_id')->references('id')->on('institutions');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
