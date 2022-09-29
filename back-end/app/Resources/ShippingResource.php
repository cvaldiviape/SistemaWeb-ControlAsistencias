<?php

namespace App\Resources;

use App\Models\Shipping;
use App\Transformers\ShippingTransformer;
use League\Fractal;

class ShippingResource
{
    public static function get($customerID)
    {
        $shipping = Shipping::where('customer_id', $customerID)->first();
        if (!$shipping) {
            return false;
        }

        $fractal = new Fractal\Manager;
        $fractal->setSerializer(new Fractal\Serializer\ArraySerializer);

        $resource = new Fractal\Resource\Item($shipping, new ShippingTransformer);
        return $fractal->createData($resource)->toArray();
    }
}