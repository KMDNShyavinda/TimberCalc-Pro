<?php

use App\Http\Controllers\Api\ConverterController;
use App\Http\Controllers\Api\TimberController;
use Illuminate\Support\Facades\Route;

// Universal Unit Converter
Route::post('/convert', [ConverterController::class, 'convert']);
Route::get('/convert/categories', [ConverterController::class, 'categories']);

// Timber Volume Calculator (auth required to save history)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/timber/calculate', [TimberController::class, 'calculate']);
    Route::get('/timber/history', [TimberController::class, 'history']);
    Route::delete('/timber/history/{timberLog}', [TimberController::class, 'destroyHistoryItem']);

    Route::get('/user', fn (\Illuminate\Http\Request $request) => $request->user());
});

// Allow calculating without login too (guest mode), just without saving
Route::post('/timber/calculate-guest', [TimberController::class, 'calculate']);
