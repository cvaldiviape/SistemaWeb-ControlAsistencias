<?php

namespace App\Resources;

use App\Models\CartItem;
use App\Transformers\CartItemTransformer;
use League\Fractal;

class CartItemResource
{
    public static function getItems($cartID)
    {
        $items = CartItem::where('cart_id', $cartID)->get();
        $resource = new Fractal\Resource\Collection($items, new CartItemTransformer);

        $fractal = new Fractal\Manager;
        $fractal->setSerializer(new Fractal\Serializer\ArraySerializer);

        return $fractal->createData($resource)->toArray();
    }

}