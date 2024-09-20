<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'auth'], function ($request) {
    Route::post('/login', [AuthController::class, 'login']);
});
// Route::post('/login', function (Request $request) {
//     return $request->user();
// })->middleware(['auth:sanctum']);
