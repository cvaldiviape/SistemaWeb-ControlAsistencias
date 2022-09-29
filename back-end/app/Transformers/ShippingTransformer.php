<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Shipping;

class ShippingTransformer extends TransformerAbstract
{
    public function transform(Shipping $shipping)
    {
        return [
            'shipping_id'   => $shipping->shipping_id,
            'customer_id'   => $shipping->customer_id,
            'received_name' => $shipping->received_name,
            'address'       => $shipping->address,
            'city_id'       => $shipping->city_id,
            'city'          => $shipping->city()->first()->city_name,
            'province_id'   => $shipping->province_id,
            'province'      => $shipping->province()->first()->province,
            'zip'           => $shipping->zip,
            'phone'         => $shipping->phone,
        ];
    }
}