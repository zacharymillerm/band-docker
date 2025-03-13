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
            $table->text('tag1')->nullable();
            $table->text('tag2')->nullable();
            $table->text('tag3')->nullable();
            $table->text('tag4')->nullable();
            $table->text('tag5')->nullable();
            $table->text('tag6')->nullable();
            $table->text('tag7')->nullable();
            $table->text('tag8')->nullable();
            $table->text('competencies')->nullable(); // Use json type for competencies
            $table->string('links')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('teams');
    }
}
