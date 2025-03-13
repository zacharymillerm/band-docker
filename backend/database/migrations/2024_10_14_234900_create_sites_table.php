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
            $table->string('equipment_type')->nullable();
            $table->string('blog_type')->nullable();
            $table->json('cities')->nullable();
            $table->string('title', 512)->nullable();
            $table->string('description', 512)->nullable();
            $table->string('keyword', 512)->nullable();
            $table->json('siteTags')->nullable(); // Add siteTags column as JSON
            $table->timestamps(); // Created at and updated at
        });
    }

    public function down()
    {
        Schema::dropIfExists('sites');
    }
}
