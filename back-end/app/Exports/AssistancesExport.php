<?php

namespace App\Exports;

use App\Models\Assistance;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class AssistancesExport implements FromView, ShouldAutoSize, WithDrawings
{
    /**
    * @return \Illuminate\Support\Collection
    */

    public $report_assistances;
    public $alias_days_final;
    public $count_days;
    public $days_date_final;
    public $name_month;
    public $institution;

    public function __construct($report_assistances, $alias_days_final, $count_days, $days_date_final, $name_month, $institution){
        $this->report_assistances = $report_assistances;
        $this->alias_days_final = $alias_days_final;
        $this->count_days = $count_days;
        $this->days_date_final = $days_date_final;
        $this->name_month = $name_month;
        $this->institution = $institution;
    }

    public function view() : View
    {     
        return view('exports.reports_assistances', [
            'report_assistances' => $this->report_assistances,
            'alias_days_final' => $this->alias_days_final,
            'count_days' => $this->count_days,
            'days_date_final' => $this->days_date_final,
            'name_month' => $this->name_month,
            'institution' => $this->institution,
        ]);
    }

    public function drawings()
    {
        $img_1 = new Drawing();
        $img_1->setName('Logo');
        $img_1->setDescription('This is my logo');
        $img_1->setPath(public_path('/images/logo1.png'));
        $img_1->setHeight(90);
        $img_1->setCoordinates('C2');

        $img_2 = new Drawing();
        $img_2->setName('Logo');
        $img_2->setDescription('This is my logo');
        $img_2->setPath(public_path('/images/logo2.png'));
        $img_2->setHeight(70);
        $img_2->setCoordinates('W3');

        $img_3 = new Drawing();
        $img_3->setName('Logo');
        $img_3->setDescription('This is my logo');
        $img_3->setPath(public_path('/images/logo3.png'));
        $img_3->setHeight(90);
        $img_3->setCoordinates('AC2');

        return [$img_1, $img_2, $img_3];
    }
}
