<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use PHPUnit\Framework\Constraint\Exception;
use App\Models\User;

class UserAuthJwtMiddleware
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

        // if token not exists
        if (!$token) {
            return response()->json(['error' => 'Token is Not Provided'], 401);
        }

        try {
            # decode token
            $credentials = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        } catch(ExpiredException $e) {
            # if token expired
            return response()->json(['error' => 'Token is expired!'], 401);
        } catch(Exception $e) {
            # if error when decoding
            return response()->json(['error' => 'An error when decoding token!'], 400);
        }

        # if credentials level is not admin
        if ($credentials->level != 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
            exit();
        }

        $user = User::find($credentials->sub);

        # FIXME: cari alternativ lain
        $request->user = $user;

        return $next($request);
    }
}
