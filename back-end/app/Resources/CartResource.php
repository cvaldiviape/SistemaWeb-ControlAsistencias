<?php

namespace App\Resources;

use App\Models\Cart;
use App\Transformers\CartTransformer;
use League\Fractal;

class CartResource
{
    public static function get($customerID)
    {
        $cart = Cart::where('customer_id', $customerID)->first();
        if (!$cart) {
            $cart = Cart::create([
                'customer_id' => $customerID,
            ]);
        }

        $fractal = new Fractal\Manager;
        $fractal->setSerializer(new Fractal\Serializer\ArraySerializer);

        $resource = new Fractal\Resource\Item($cart, new CartTransformer);
        return $fractal->createData($resource)->toArray();
    }
}