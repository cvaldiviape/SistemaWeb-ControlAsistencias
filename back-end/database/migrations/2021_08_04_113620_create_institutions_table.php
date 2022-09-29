<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInstitutionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code', 20);
            $table->string('name', 127);
            $table->text('description');
            $table->string('ubigeo_id', 8);
            $table->unsignedInteger('direccion_regional_id');
            $table->string('phone', 50);
            $table->string('mobile', 50);
            $table->text('information');
            $table->string('ugel', 127);
            $table->boolean('active')->default(1);
            $table->timestamps();


            $table->foreign('ubigeo_id')->references('id')->on('ubigeo_peru_districts');
            $table->foreign('direccion_regional_id')->references('id')->on('direccion_regional');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('institutions');
    }
}
