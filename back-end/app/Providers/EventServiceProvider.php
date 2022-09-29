<?php

namespace App\Providers;

use Laravel\Lumen\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        # for customer register
        'App\Events\CustomerRegisterEvent' => [
            'App\Listeners\SendWelcomeMail',
        ],

        ### ORDER ###
        # checkout
        'App\Events\Order\CheckoutEvent' => [
            'App\Listeners\Order\SendInvoice',
        ],

    ];
}
