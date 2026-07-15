<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConversionHistory;
use Illuminate\Http\Request;

class ConverterController extends Controller
{
    // Conversion factors to a base unit per category
    private array $factors = [
        'length' => [
            'base' => 'meter',
            'units' => [
                'millimeter' => 0.001,
                'centimeter' => 0.01,
                'meter' => 1,
                'kilometer' => 1000,
                'inch' => 0.0254,
                'feet' => 0.3048,
                'yard' => 0.9144,
                'mile' => 1609.344,
            ],
        ],
        'weight' => [
            'base' => 'kilogram',
            'units' => [
                'kilogram' => 1,
                'gram' => 0.001,
                'pound' => 0.453592,
                'ton' => 1000,
            ],
        ],
        'volume' => [
            'base' => 'liter',
            'units' => [
                'cubic_meter' => 1000,
                'cubic_feet' => 28.3168,
                'liter' => 1,
                'gallon' => 3.78541,
                'milliliter' => 0.001,
            ],
        ],
        'area' => [
            'base' => 'square_meter',
            'units' => [
                'square_meter' => 1,
                'square_feet' => 0.092903,
                'square_inch' => 0.00064516,
                'acre' => 4046.86,
                'hectare' => 10000,
            ],
        ],
    ];

    public function categories()
    {
        return response()->json(array_map(fn ($c) => array_keys($c['units']), $this->factors));
    }

    public function convert(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'value' => 'required|numeric',
            'from_unit' => 'required|string',
            'to_unit' => 'required|string',
            'save' => 'boolean',
        ]);

        if ($validated['category'] === 'temperature') {
            $result = $this->convertTemperature(
                $validated['value'],
                $validated['from_unit'],
                $validated['to_unit']
            );
        } else {
            abort_if(! isset($this->factors[$validated['category']]), 422, 'Unknown category');
            $units = $this->factors[$validated['category']]['units'];
            abort_if(! isset($units[$validated['from_unit']], $units[$validated['to_unit']]), 422, 'Unknown unit');

            $baseValue = $validated['value'] * $units[$validated['from_unit']];
            $result = $baseValue / $units[$validated['to_unit']];
        }

        $result = round($result, 6);

        if ($request->boolean('save') && $request->user()) {
            ConversionHistory::create([
                'user_id' => $request->user()->id,
                'type' => $validated['category'],
                'input_value' => $validated['value'],
                'from_unit' => $validated['from_unit'],
                'to_unit' => $validated['to_unit'],
                'result' => $result,
            ]);
        }

        return response()->json(['result' => $result]);
    }

    private function convertTemperature(float $value, string $from, string $to): float
    {
        // Normalize to Celsius first
        $celsius = match ($from) {
            'celsius' => $value,
            'fahrenheit' => ($value - 32) * 5 / 9,
            'kelvin' => $value - 273.15,
            default => $value,
        };

        return match ($to) {
            'celsius' => $celsius,
            'fahrenheit' => ($celsius * 9 / 5) + 32,
            'kelvin' => $celsius + 273.15,
            default => $celsius,
        };
    }
}
