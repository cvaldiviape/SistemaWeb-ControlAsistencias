<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\CartItem;

class CartItemTransformer extends TransformerAbstract
{
    public static function transform(CartItem $item)
    {
        return [
            'id'            => $item->id,
            'cart_id'       => $item->cart_id,
            'product_id'    => $item->product_id,
            'product_name'  => $item->product()->first()->name,
            'product_image' => $item->product()->first()->image,
            'size'          => $item->size,
            'price'         => $item->price,
        ];
    }
}