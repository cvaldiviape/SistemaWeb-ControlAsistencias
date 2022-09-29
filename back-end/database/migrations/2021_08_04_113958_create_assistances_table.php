<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateAssistancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assistances', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('register_date', $precision = 0);
            $table->decimal('latitude', $precision = 15, $scale = 5)->default(0);
            $table->decimal('longitude', $precision = 15, $scale = 5)->default(0);
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('subject_assignment_id');
            $table->string('theme', 127);
            $table->string('comments', 127);
            $table->enum('status', ['Asistio','Tardanza', 'Falto'])->default('Asistio');;
            $table->boolean('active')->default(1);
            $table->timestamps();

            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('subject_assignment_id')->references('id')->on('subject_assignments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('assistances');
        Schema::enableForeignKeyConstraints();
    }
}
