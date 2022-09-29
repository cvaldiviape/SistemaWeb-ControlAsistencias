<?php

namespace App\Resources;

use Steevenz\Rajaongkir;
use League\Fractal;

class CourierResources
{
    public static function get($destination, $weight)
    {
        # create instance RajaOngkir
        $rajaOngkir = new Rajaongkir(env('RO_KEY'), env('RO_TYPE'));

        # get all courier data
        $jne = $rajaOngkir->getCost(['city' => env('WAREHOUSE_LOCATION')], ['city' => $destination], $weight, 'jne');
        $pos = $rajaOngkir->getCost(['city' => env('WAREHOUSE_LOCATION')], ['city' => $destination], $weight, 'pos');

        $couriers = [$jne, $pos];

        # create new array
        $services = [];
        foreach ($couriers as $courier) {
            if ($courier['code'] == 'jne') {
                $logo = url('images/couriers/jne.jpg');
            } elseif ($courier['code'] == 'pos') {
                $logo = url('images/couriers/pos.jpg');
            }

            foreach ($courier['costs'] as $cost) {
                $services[] = [
                    'company'       => $courier['name'],
                    'logo'          => $logo,
                    'service_name'  => strtoupper($courier['code']) . ' ' . $cost['service'],
                    'service_desc'  => $cost['description'],
                    'cost'          => $cost['cost'][0]['value'],    
                    'etd'           => $cost['cost'][0]['etd'],    
                ];
            }
        }

        # create collection
        $resource = new Fractal\Resource\Collection($services, function ($service) {
            return [
                'company'   => $service['company'],
                'logo'      => $service['logo'],
                'name'      => $service['service_name'],
                'desc'      => $service['service_desc'],
                'cost'      => $service['cost'],
                'etd'       => $service['etd'],
            ];
        });

        $fractal = new Fractal\Manager();
        return $fractal->createData($resource)->toArray();
    }

    # only one courier and one service courier
    public static function getShippingCost($destination, $weight)
    {
        $rajaOngkir = new Rajaongkir(env('RO_KEY'), env('RO_TYPE'));

        $courier = [];

        $jne = $rajaOngkir->getCost(['city' => env('WAREHOUSE_LOCATION')], ['city' => $destination], $weight, 'jne');
        foreach ($jne['costs'] as $cost) {
            if ($cost['service'] == 'REG' || $cost['service'] == 'CTCYES') {
                $courier['name'] = $jne['name'];
                $courier['service'] = $cost['service'];
                $courier['service_desc'] = $cost['description'];
                $courier['cost'] = $cost['cost'][0]['value'];
                $courier['etd'] = $cost['cost'][0]['etd'];
            }
        }
        
        return $courier;
    }
}