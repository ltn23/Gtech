<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order; // Assuming sales data is derived from orders
use Illuminate\Routing\Controller;

class SalesController extends Controller

{
    public function index()
    {
        try {
            // Group sales data by month and calculate total sales
            $sales = Order::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(total_price) as total_sales')
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->get();

            $labels = $sales->pluck('month');
            $data = $sales->pluck('total_sales');

            return response()->json([
                'labels' => $labels,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch sales data'], 500);
        }
    }
}
