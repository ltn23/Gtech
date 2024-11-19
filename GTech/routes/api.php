<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\ShoppingCartController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;



Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/profile', [UserController::class, 'show']);
    });

    Route::prefix('users')->group(function () {
        Route::get('', [UserController::class, 'index']);
        Route::post('', [UserController::class, 'store']);
        Route::put('{id}', [UserController::class, 'update']);
        Route::delete('{id}', [UserController::class, 'destroy']);
    });

    Route::prefix('products')->group(function () {
        Route::post('', [ProductController::class, 'save']);
        Route::delete('{id}', [ProductController::class, 'destroy']);
    });

    Route::prefix('orders')->group(function () {
        Route::put('{id}/status', [OrderController::class, 'updateStatus']);
        Route::get('/my-orders', [OrderController::class, 'getMyOrders']);
        Route::get('', [OrderController::class, 'index']);
        Route::post('', [OrderController::class, 'store']);
        Route::get('{id}', [OrderController::class, 'show']);
        Route::put('{id}', [OrderController::class, 'update']);
        Route::delete('{id}', [OrderController::class, 'destroy']);
    });

    Route::prefix('payments')->group(function () {
        Route::get('', [PaymentController::class, 'store']);
        Route::post('', [PaymentController::class, 'store']);
        Route::delete('{id}', [PaymentController::class, 'destroy']);
        Route::put('order/{orderId}', [PaymentController::class, 'updatePaymentStatus']);

    });
});



// Nhóm các route liên quan đến xác thực
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/google', [AuthController::class, 'redirectToGoogle'])->middleware('web');
    Route::get('/google/callback', [AuthController::class, 'handleGoogleCallback'])->middleware('web');

});

Route::prefix('products')->group(function () {
    Route::get('', [ProductController::class, 'index']);
    Route::get('{id}', [ProductController::class, 'show']);
});




Route::post('/images', [ImageController::class, 'store']);

// Nhóm các route quản lý danh mục
Route::apiResource('categories', CategoryController::class)->except(['show']);



// Nhóm các route quản lý mục trong đơn hàng
Route::apiResource('order-items', OrderItemController::class);

// Nhóm các route quản lý thanh toán
// Route::apiResource('payments', PaymentController::class);

// Nhóm các route liên quan đến giỏ hàng (yêu cầu xác thực)
Route::middleware('auth:sanctum')->prefix('cart')->group(function () {
    Route::get('', [ShoppingCartController::class, 'index']);
    Route::post('', [ShoppingCartController::class, 'store']);
    Route::put('{id}', [ShoppingCartController::class, 'update']);
    Route::delete('{id}', [ShoppingCartController::class, 'destroy']);
    // Route::delete('clear', [ShoppingCartController::class, 'clearCart']);
});

// Nhóm các route liên quan đến đánh giá (yêu cầu xác thực)
Route::middleware('auth:sanctum')->prefix('reviews')->group(function () {
    Route::get('product/{productId}', [ReviewController::class, 'index']);
    Route::post('', [ReviewController::class, 'store']);
    Route::put('{id}', [ReviewController::class, 'update']);
    Route::delete('{id}', [ReviewController::class, 'destroy']);
});

//chatbot 
Route::post('/chat', [ChatbotController::class, 'handleChat']);

//admin
Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
Route::middleware('auth:sanctum')->get('/sales', [SalesController::class, 'index']);
Route::middleware('auth:sanctum')->get('/product/top', [ProductController::class, 'topProduct']);

