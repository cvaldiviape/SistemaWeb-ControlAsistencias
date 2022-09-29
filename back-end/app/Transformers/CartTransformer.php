<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Cart;
use App\Resources\CartItemResource;

class CartTransformer extends TransformerAbstract
{
    public function transform(Cart $cart)
    {
        return [
            'customer_id'       => (int)$cart->customer_id,
            'customer_name'     => $cart->customer()->first()->name,
            'cart'              => [
                'cart_id'           => (int)$cart->cart_id,
                'qty'               => $cart->total_qty,
                'amount'            => $cart->total,
                'total_weight'      => $cart->total_weight,
                'shipping_cost'     => false,
                'total'             => false,
            ],
            'items'             => CartItemResource::getItems($cart->cart_id)
        ];
    }
}