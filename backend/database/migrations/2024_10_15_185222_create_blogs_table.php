<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('blog_type')->nullable();
            $table->string('startDate')->nullable();
            $table->string('endDate')->nullable();
            $table->string('guests')->nullable();
            $table->string('venue')->nullable();
            $table->string('video')->nullable();
            $table->string('images', 2048)->nullable();
            $table->string('tags')->nullable();
            $table->string('checkbox')->nullable();
            $table->string('equipment_type')->nullable();
            $table->string('site_type')->nullable();
            $table->json('cities')->nullable();
            $table->text('features')->nullable();
            $table->integer('queue')->default(0);
            $table->json('solution')->nullable();
            $table->string('title', 2048)->nullable();
            $table->string('description', 2048)->nullable();
            $table->string('keyword', 2048)->nullable();
            $table->foreignId('site_id')->nullable()->constrained('sites')->onDelete('set null');
            $table->foreignId('three_id')->nullable()->constrained('threes')->onDelete('set null');
            $table->boolean('checked')->default(false);
            $table->string('eventTitle')->default('Рассчитать такое же событие')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('blogs');
    }
};