<?php

namespace App\Resources;

use App\Models\Payment;
use App\Transformers\PaymentTransformer;
use League\Fractal;

class PaymentResource
{
    # show payment info
    public static function show($id)
    {
        $fractal = new Fractal\Manager;
        $payment = Payment::find($id);
        if (!$payment) {
            return false;
        }

        $resource= new Fractal\Resource\Item($payment, new PaymentTransformer);

        $fractal->parseIncludes('order_info')->setSerializer(new Fractal\Serializer\ArraySerializer);

        return $fractal->createData($resource)->toArray();
    }

    # get unconfirmed payments
    public static function unconfirmed()
    {
        $fractal    = new Fractal\Manager; # create fractal manager instance
        $payments   = Payment::where('status', 'unconfirmed')->get(); # get unconfirmed payment
        $resource   = new Fractal\Resource\Collection($payments, new PaymentTransformer); # create resource collection

        if (isset($_GET['include'])) {
            $fractal->parseIncludes($_GET['include']);
        }

        return $fractal->createData($resource)->toArray();
    }
}