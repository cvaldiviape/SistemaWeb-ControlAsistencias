<?php

namespace App\Transformers;

use League\Fractal\TransformerAbstract;
use App\Models\Payment;
use App\Models\Order;
use App\Transformers\OrderTransformer;

class PaymentTransformer extends TransformerAbstract
{
    protected $availableIncludes = ['order_info'];

    public function transform(Payment $payment)
    {
        return [
            'payment_id'    => $payment->payment_id,
            'customer_id'   => $payment->customer_id,
            'order_id'      => $payment->order_id,
            'invoice'       => $payment->invoice,
            'to_bank'       => $payment->to_bank,
            'bank_name'     => $payment->bank_name,
            'account_number'=> $payment->account_number,
            'account_name'  => $payment->account_name,
            'amount'        => $payment->amount,
            'date'          => $payment->date,
            'status'        => $payment->status,
        ];
    }

    public function includeOrderInfo(Payment $payment)
    {
        $order = Order::find($payment->order_id);
        return $this->item($order, new OrderTransformer);
    }
}