<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimberLog;
use Illuminate\Http\Request;

class TimberController extends Controller
{
    /**
     * Calculate timber volume and (optionally) save to history.
     */
    public function calculate(Request $request)
    {
        $validated = $request->validate([
            'log_type' => 'required|string|in:cylinder,rectangular,custom',
            'diameter' => 'required_if:log_type,cylinder|numeric|nullable',
            'diameter_unit' => 'required_if:log_type,cylinder|string|nullable',
            'length' => 'required|numeric',
            'length_unit' => 'required|string',
            'calculation_method' => 'required|string|in:standard_cylinder,hoppus,custom',
            'species' => 'nullable|string',
            'save' => 'boolean',
        ]);

        // Convert everything to a common base (meters) before calculating
        $diameterM = $this->toMeters($validated['diameter'] ?? 0, $validated['diameter_unit'] ?? 'cm');
        $lengthM = $this->toMeters($validated['length'], $validated['length_unit']);

        $volumeCubicMeters = match ($validated['calculation_method']) {
            'standard_cylinder' => $this->standardCylinderVolume($diameterM, $lengthM),
            'hoppus' => $this->hoppusVolume($diameterM, $lengthM),
            default => $this->standardCylinderVolume($diameterM, $lengthM),
        };

        $volumeCubicFeet = $volumeCubicMeters * 35.3147;

        $result = [
            'volume_cubic_meters' => round($volumeCubicMeters, 4),
            'volume_cubic_feet' => round($volumeCubicFeet, 4),
        ];

        if ($request->boolean('save') && $request->user()) {
            $log = TimberLog::create([
                'user_id' => $request->user()->id,
                'log_type' => $validated['log_type'],
                'species' => $validated['species'] ?? null,
                'diameter' => $validated['diameter'] ?? null,
                'diameter_unit' => $validated['diameter_unit'] ?? null,
                'length' => $validated['length'],
                'length_unit' => $validated['length_unit'],
                'calculation_method' => $validated['calculation_method'],
                'volume_cubic_feet' => $result['volume_cubic_feet'],
                'volume_cubic_meters' => $result['volume_cubic_meters'],
            ]);
            $result['saved_log_id'] = $log->id;
        }

        return response()->json($result);
    }

    public function history(Request $request)
    {
        $logs = TimberLog::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(20);

        return response()->json($logs);
    }

    public function destroyHistoryItem(Request $request, TimberLog $timberLog)
    {
        abort_if($timberLog->user_id !== $request->user()->id, 403);
        $timberLog->delete();

        return response()->json(['message' => 'Deleted']);
    }

    /**
     * Standard cylinder formula: V = π * r^2 * length
     */
    private function standardCylinderVolume(float $diameterM, float $lengthM): float
    {
        $radius = $diameterM / 2;

        return pi() * ($radius ** 2) * $lengthM;
    }

    /**
     * Hoppus formula (traditional timber trade measure):
     * Hoppus volume (ft3) = ((Quarter Girth in inches)^2 * Length in feet) / 144
     * Quarter girth = circumference / 4. Here we approximate circumference from diameter.
     */
    private function hoppusVolume(float $diameterM, float $lengthM): float
    {
        $circumferenceInches = (pi() * $diameterM) * 39.3701;
        $quarterGirthInches = $circumferenceInches / 4;
        $lengthFeet = $lengthM * 3.28084;

        $hoppusCubicFeet = (($quarterGirthInches ** 2) * $lengthFeet) / 144;

        return $hoppusCubicFeet / 35.3147; // back to cubic meters for consistency
    }

    private function toMeters(float $value, string $unit): float
    {
        return match ($unit) {
            'mm', 'millimeter', 'millimeters' => $value / 1000,
            'cm', 'centimeter', 'centimeters' => $value / 100,
            'm', 'meter', 'meters' => $value,
            'in', 'inch', 'inches' => $value * 0.0254,
            'ft', 'feet' => $value * 0.3048,
            default => $value,
        };
    }
}
