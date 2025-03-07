<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        ini_set('upload_max_filesize', env('UPLOAD_MAX_FILESIZE', '2048M'));
        ini_set('post_max_size', env('POST_MAX_SIZE', '2048M'));
    }
}
