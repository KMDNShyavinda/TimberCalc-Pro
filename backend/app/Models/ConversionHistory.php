<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConversionHistory extends Model
{
    use HasFactory;

    protected $table = 'conversion_history';

    protected $fillable = [
        'user_id',
        'type',
        'input_value',
        'from_unit',
        'to_unit',
        'result',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
