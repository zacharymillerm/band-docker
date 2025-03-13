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
            $table->string('tag1', 2048)->nullable();
            $table->string('tag2', 2048)->nullable();
            $table->string('tag3', 2048)->nullable();
            $table->string('tag4', 2048)->nullable();
            $table->string('tag5', 2048)->nullable();
            $table->string('tag6', 2048)->nullable();
            $table->string('tag7', 2048)->nullable();
            $table->string('tag8', 2048)->nullable();
            $table->string('competencies', 2048)->nullable(); // Use json type for competencies
            $table->string('links', 2048)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('teams');
    }
}
