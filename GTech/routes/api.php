<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShoppingCartController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::group(['prefix' => 'auth'], function ($request) {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});



Route::group(['middleware' => ['web']], function () {
    Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
});


Route::group(['prefix' => 'categories'], function () {
    Route::get('', [CategoryController::class, 'index']);
    Route::post('', [CategoryController::class, 'store']);
    Route::put('{id}', [CategoryController::class, 'update']);
    Route::delete('{id}', [CategoryController::class, 'destroy']);
});

Route::group(['prefix' => 'products'], function () {
    Route::get('', [ProductController::class, 'index']);
    Route::post('', [ProductController::class, 'store']);
    Route::get('{id}', [ProductController::class, 'show']);
    Route::put('{id}', [ProductController::class, 'update']);
    Route::delete('{id}', [ProductController::class, 'destroy']);
});

Route::group(['prefix' => 'orders'], function () {
    Route::get('', [OrderController::class, 'index']);
    Route::post('', [OrderController::class, 'store']);
    Route::get('{id}', [OrderController::class, 'show']);
    Route::put('{id}', [OrderController::class, 'update']);
    Route::delete('{id}', [OrderController::class, 'destroy']);
});

Route::group(['prefix' => 'order-items'], function () {
    Route::get('', [OrderItemController::class, 'index']);
    Route::post('', [OrderItemController::class, 'store']);
    Route::get('{id}', [OrderItemController::class, 'show']);
    Route::put('{id}', [OrderItemController::class, 'update']);
    Route::delete('{id}', [OrderItemController::class, 'destroy']);
});

Route::group(['prefix' => 'payments'], function () {
    Route::get('', [PaymentController::class, 'index']);
    Route::post('', [PaymentController::class, 'store']);
    Route::get('{id}', [PaymentController::class, 'show']);
    Route::put('{id}', [PaymentController::class, 'update']);
    Route::delete('{id}', [PaymentController::class, 'destroy']);
});


Route::group(['middleware' => 'auth:sanctum', 'prefix' => 'cart'], function () {
    Route::get('', [ShoppingCartController::class, 'index']);  
    Route::post('', [ShoppingCartController::class, 'store']); 
    Route::put('{id}', [ShoppingCartController::class, 'update']); 
    Route::delete('{id}', [ShoppingCartController::class, 'destroy']); 
    // Route::delete('clear', [ShoppingCartController::class, 'clearCart']); 
});

Route::group(['middleware' => 'auth:sanctum', 'prefix' => 'reviews'], function () {
    Route::get('product/{productId}', [ReviewController::class, 'index']); 
    Route::post('', [ReviewController::class, 'store']); 
    Route::put('{id}', [ReviewController::class, 'update']); 
    Route::delete('{id}', [ReviewController::class, 'destroy']); 
});
