<?php

use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\AuthController;
    use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\OrderController;
    use App\Http\Controllers\OrderItemController;
    use App\Http\Controllers\PaymentController;
    use App\Http\Controllers\ProductController;
    use App\Http\Controllers\ReviewController;
    use App\Http\Controllers\ShoppingCartController;
    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\UserController;

    // Nhóm các route liên quan đến xác thực
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        Route::get('/google', [AuthController::class, 'redirectToGoogle'])->middleware('web');
        Route::get('/google/callback', [AuthController::class, 'handleGoogleCallback'])->middleware('web');
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/profile', [UserController::class, 'show']);
        });
    });

    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    Route::post('/images', [ImageController::class, 'store']);

    // Nhóm các route quản lý danh mục
    Route::apiResource('categories', CategoryController::class)->except(['show']);

    // Nhóm các route quản lý sản phẩm
    Route::apiResource('products', ProductController::class);

    // Nhóm các route quản lý đơn hàng
    Route::apiResource('orders', OrderController::class);

    // Nhóm các route quản lý mục trong đơn hàng
    Route::apiResource('order-items', OrderItemController::class);

    // Nhóm các route quản lý thanh toán
    Route::apiResource('payments', PaymentController::class);

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