<?php

namespace App\Resources;

use App\Models\Order;
use App\Transformers\OrderTransformer;
use League\Fractal;

class OrderResources
{
    # get by status and customer id
    public static function get($status = null, $customerID = null)
    {
        $fractal = new Fractal\Manager;

        if (is_null($customerID) && !is_null($status)) {
            $orders = Order::where('status', $status)->get();
        } else if (!is_null($customerID) && !is_null($status)) {
            $orders = Order::where('customer_id', $customerID)->where('status', $status)->get();
        } else {
            return false;
        }

        $resource = new Fractal\Resource\Collection($orders, new OrderTransformer);
        return $fractal->createData($resource)->toArray();
    }
}