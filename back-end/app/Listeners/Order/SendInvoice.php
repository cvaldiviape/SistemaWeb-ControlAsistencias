<?php

namespace App\Listeners\Order;

use App\Events\CustomerRegisterEvent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;
use App\Mail\Order\SendInvoice as Invoice;
use App\Events\Order\CheckoutEvent;

class SendInvoice
{
    public function handle(CheckoutEvent $event)
    {
        // Mail::to($event->order->customer()->first()->email)->send(new Invoice($event->order));
        Mail::to('aguzsupriyatna7@gmail.com')->send(new Invoice($event->order));
    }
}