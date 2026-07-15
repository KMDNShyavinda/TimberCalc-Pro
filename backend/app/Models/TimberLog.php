<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimberLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'log_type',
        'species',
        'diameter',
        'diameter_unit',
        'length',
        'length_unit',
        'calculation_method',
        'volume_cubic_feet',
        'volume_cubic_meters',
        'estimated_value',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
