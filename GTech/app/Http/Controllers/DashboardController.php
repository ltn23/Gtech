<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class DashboardController extends Controller
{
    public function getStats()
{
    return response()->json([
        'total_orders' => Order::count(),
        'monthly_revenue' => Order::whereMonth('created_at', now()->month)->sum('total_price'),
        'products_available' => Product::count(),
        'total_customers' => User::where('role', 'customer')->count(),
    ]);
}
}
