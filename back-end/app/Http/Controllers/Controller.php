<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Response;

class Controller extends BaseController
{
    //

    public function sendError($message, $code = 402)
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], $code);
    }

}
