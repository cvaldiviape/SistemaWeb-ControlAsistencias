<table>
    <thead>
        <tr>
            
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td colspan="15">"AÑO DE LA UNIVERSALIZACIÓN DE LA SALUD"</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td colspan="15">ANEXO N°3</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td colspan="15">FORMATO 1: REPORTE DE ASISTENCIAS DETALLADO</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        
        <tr>
            <td rowspan="4"></td>
            <td colspan="4">DRE</td>
            <td colspan="4">{{ mb_strtoupper($institution->department, 'UTF-8') }}</td>
            <td rowspan="4"></td>
            <td colspan="4">TURNO</td>
            <td colspan="16">MAÑANA</td>
            <td rowspan="4"></td>
        </tr>
        <tr>
            <td colspan="4">UGEL</td>
            <td colspan="4">{{ mb_strtoupper($institution->ugel, 'UTF-8') }}</td>
            <td colspan="4">LUGAR</td>
            <td colspan="16">{{ mb_strtoupper($institution->province, 'UTF-8') }}</td>
        </tr>
        <tr>
            <td colspan="4">NIVEL</td>
            <td colspan="4">SECUNDARIA</td>
            <td colspan="4">DISTRITO</td>
            <td colspan="16">{{ mb_strtoupper($institution->district, 'UTF-8') }}</td>
        </tr>
        <tr>
            <td colspan="4">INSTITUCIÓN EDUCATIVA</td>
            <td colspan="4">{{ mb_strtoupper($institution->name, 'UTF-8') }}</td>
            <td colspan="4">MES</td>
            <td colspan="16">{{ mb_strtoupper($name_month, 'UTF-8') }}</td>
        </tr>
        <tr color="red">
            <td rowspan="3">N°</td>
            <td rowspan="3">N° DNI</td>
            <td rowspan="3" colspan="4">APELLIDOS Y NOMBRES</td>
            <td rowspan="3">CARGO</td>
            <td rowspan="3">CONDICIÓN LABORAL</td>
            <td text-align=center color="#9c1111" colspan="{{ $count_days }}">DÍAS CALENDARIO</td>
            <td text-align="center" rowspan="3">TOTAL DÍAS LABORADOS</td>
        </tr>
        <tr>
            @foreach($alias_days_final as $day)
                <td>{{$day}}</td>
            @endforeach
        </tr>
        <tr>
            @foreach($days_date_final as $num_day)
                <td>{{$num_day}}</td>
            @endforeach
        </tr>
    </thead>
    <tbody>
        {{$i=1}}
        @foreach($report_assistances as $value) 
            <tr>
                <td>{{$i++}}</td>
                <td>{{$value->dni}}</td>
                <td colspan="4">{{$value->full_name}}</td>
                <td>{{$value->role}}</td>
                <td>{{$value->condition}}</td>
                @foreach($value->list_assistances as $assistance)
                    <td>{{$assistance}}</td>
                @endforeach
                <td>{{$value->total_assistances}}</td>
            </tr>
        @endforeach
    </tbody>
</table>

