<?php

namespace App\Mail\Order;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Models\Order;
use App\Models\OrderDetail;

class SendInvoice extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $createdAt;
    public $dueDate;

    public function __construct(Order $order)
    {
        $this->order= $order;
    }

    public function build()
    {
        $this->createdAt = $this->dateTimeIndo($this->order->created_at);
        $this->dueDate = $this->dateTimeIndo($this->order->due_date);

        return $this->from('invoice@eCommerce.com', config('mail.from.name'))
                    ->view('mails.invoice')
                    ->subject('Pesanan Baru ' . $this->order->invoice);
    }

    private function dateTimeIndo($dateTime)
    {
        $time = strtotime($dateTime);

        $result = $this->hari(date('D', $time)).', '.
                  date('j', $time).' '.
                  $this->bulan(date('M', $time)).' '.
                  date('Y', $time).' '.
                  date('H:i', $time).' WIB';

        return $result;
    }

    private function hari($day)
    {
        $lists = [
            'Sun'   => 'Minggu',
            'Mon'   => 'Senin',
            'Tue'   => 'Selasa',
            'Wed'   => 'Rabu',
            'Thu'   => 'Kamis',
            'Fri'   => "Jum'at",
            'Sat'   => 'Sabtu'
        ];

        return $lists[$day];
    }

    private function bulan($month)
    {
        $lists = [
            'Jan' => 'Januari',
            'Feb' => 'Pebruari',
            'Mar' => 'Maret',
            'Apr' => 'April',
            'May' => 'Mei',
            'Jun' => 'Juni',
            'Jul' => 'Juli',
            'Aug' => 'Agustus',
            'Sep' => 'September',
            'Oct' => 'Oktober',
            'Nov' => 'Nopember',
            'Dec' => 'Desember'
        ];

        return $lists[$month];
    }
}