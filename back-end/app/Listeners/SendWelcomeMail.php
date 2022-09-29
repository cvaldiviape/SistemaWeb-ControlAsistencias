<?php

namespace App\Listeners;

use App\Events\CustomerRegisterEvent;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;

class SendWelcomeMail
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  ExampleEvent  $event
     * @return void
     */
    public function handle(CustomerRegisterEvent $event)
    {
        try {
            Mail::to($event->customer->email)->send(new WelcomeMail($event->customer));
        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
