<?php

namespace App\Http\Middleware;

use Closure;


class CronMiddleware
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
        $key = $request->header('api-key');
        if (!$key) {
            return response()->json([
                'success' => false,
                'message' => 'api-key is not provided!'
            ], 400);
        } elseif ($key != env('API_KEY')) {
            return response()->json([
                'success' => false,
                'message' => 'api-key is WRONG!'
            ], 406);
        }

        return $next($request);
    }
}