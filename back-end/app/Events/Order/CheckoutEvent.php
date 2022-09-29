<?php

namespace App\Events\Order;

use App\Events\Event;
use App\Models\Order;

class CheckoutEvent extends Event
{
    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }
}