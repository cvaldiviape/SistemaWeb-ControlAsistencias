<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use App\Models\Customer;

class CustomerAuthJwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token is not provided!'], 401);
        }

        try {
            # decoded token
            $credentials = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        } catch (ExpiredException $e) {
            # if token is expired
            return response()->json(['error' => 'Token is expired!'], 400);
        } catch (\Exception $e) {
            # if error when decoding
            return response()->json(['error' => 'Error when decoding token!'], 400);
        }

        # if is not customer
        if ($credentials->level != 'customer') {
            return response()->json(['error' => 'Unauthorized!'], 401);
        }

        # extract data
        $customer = Customer::find($credentials->sub);
        if (!$customer) {
            return response()->json(['error' => 'User not found!'], 400);
        }
        
        # FIXME: cari cara lain
        $request->user = $customer;

        return $next($request);
    }
}
