<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUbigeoPeruProvincesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ubigeo_peru_provinces', function (Blueprint $table) {
            $table->string('id', 4)->unique();
            $table->string('name', 45);
            $table->string('department_id', 2);
            $table->timestamps();

            
            $table->foreign('department_id')->references('id')->on('ubigeo_peru_departments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ubigeo_peru_provinces');
    }
}
