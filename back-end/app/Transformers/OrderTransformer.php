<?php

namespace App\Transformers;

use App\Models\Order;
use League\Fractal\TransformerAbstract;

class OrderTransformer extends TransformerAbstract
{
    public function transform(Order $order)
    {
        return [
            'order_id'      => $order->order_id,
            'invoice'       => $order->invoice,
            'customer_id'   => $order->customer_id,
            'amount'        => $order->amount,
            'shipping_cost' => $order->shipping_cost,
            'total_payment' => $order->total_payment,
            'order_detail'  => $order->details()->get(),
            'shipping_info' => [
                'received_name' => $order->received_name,
                'address'       => $order->address,
                'province_id'   => $order->province_id,
                'province_name' => $order->province()->first()->province,
                'city_id'       => $order->city_id,
                'city_name'     => $order->city()->first()->city_name,
                'zip'           => $order->zip,
                'phone'         => $order->phone,
            ], 
            'due_date'      => $order->due_date,
            'awb'           => $order->awb,
            'status'        => $order->status,
        ];
    }
}