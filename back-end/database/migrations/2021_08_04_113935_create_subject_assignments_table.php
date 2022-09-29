<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubjectAssignmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subject_assignments', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('subject_id');
            $table->unsignedInteger('degree_id');
            $table->unsignedInteger('section_id');
            $table->unsignedInteger('institution_id');
            $table->unsignedInteger('teacher_id');
            $table->unsignedInteger('year');
            $table->string('name', 127);
            $table->boolean('active')->default(1);
            $table->timestamps();


            $table->foreign('subject_id')->references('id')->on('subjects');
            $table->foreign('degree_id')->references('id')->on('degrees');
            $table->foreign('section_id')->references('id')->on('sections');
            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');;
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');;
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
        Schema::dropIfExists('subject_assignments');
        Schema::enableForeignKeyConstraints();
    }
}
