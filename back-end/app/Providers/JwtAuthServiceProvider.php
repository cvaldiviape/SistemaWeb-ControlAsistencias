<?php

namespace App\Providers;

use App\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;

class AuthServiceProvider extends ServiceProvider
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
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        $this->app['auth']->viaRequest('api', function ($request) {
            if ($request->bearerToken()) {
                // return User::where('api_token', $request->input('api_token'))->first();
                try {
                    $credentials = JWT::decode($request->bearerToken(), env('JWT_SECRET'), ['HS256']);
                    return $credentials;
                } catch(ExpiredException $e) {
                    return "Token Expired!";
                } catch(\Exception $e) {
                    return "Error when decoding token!";
                }
            }
        });

        
    }
}
