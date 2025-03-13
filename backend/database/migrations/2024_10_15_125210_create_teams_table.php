<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTeamsTable extends Migration
{
    public function up()
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('tag1', 511)->nullable();
            $table->string('tag2', 511)->nullable();
            $table->string('tag3', 511)->nullable();
            $table->string('tag4', 511)->nullable();
            $table->string('tag5', 511)->nullable();
            $table->string('tag6', 511)->nullable();
            $table->string('tag7', 511)->nullable();
            $table->string('tag8', 511)->nullable();
            $table->string('competencies')->nullable(); // Use json type for competencies
            $table->string('links')->nullable();
            $table->string('avatar')->nullable();
            $table->string('teamPic')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('teams');
    }
}
