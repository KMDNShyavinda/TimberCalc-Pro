<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConverterController;
use App\Http\Controllers\Api\TimberController;
use Illuminate\Support\Facades\Route;

// Public Auth routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Universal Unit Converter
Route::post('/convert', [ConverterController::class, 'convert']);
Route::get('/convert/categories', [ConverterController::class, 'categories']);

// Guest mode Timber calculation
Route::post('/timber/calculate-guest', [TimberController::class, 'calculate']);

// Protected routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    Route::post('/timber/calculate', [TimberController::class, 'calculate']);
    Route::get('/timber/history', [TimberController::class, 'history']);
    Route::delete('/timber/history/{timberLog}', [TimberController::class, 'destroyHistoryItem']);

    Route::get('/user', fn (\Illuminate\Http\Request $request) => $request->user());
});

