<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSitesTable extends Migration
{
    public function up()
    {
        Schema::create('sites', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name')->nullable(); // Equivalent to String
            $table->text('site_type')->nullable();
            $table->string('capacity')->nullable();
            $table->string('address')->nullable();
            $table->string('link_page')->nullable();
            $table->string('video')->nullable();
            $table->integer('queue')->default(0); // Default value for queue
            $table->text('tags')->nullable(); // Store tags as a JSON array
            $table->text('equipment_type')->nullable();
            $table->text('blog_type')->nullable();
            $table->json('cities')->nullable();
            $table->text('title')->nullable();
            $table->text('description')->nullable();
            $table->text('keyword')->nullable();
            $table->timestamps(); // Created at and updated at
        });
    }

    public function down()
    {
        Schema::dropIfExists('sites');
    }
}
