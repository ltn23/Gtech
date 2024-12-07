<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $orders = Order::with('user', 'orderItems.product', 'payment')->get();
        return response()->json($orders);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::all();
        return view('orders.create', compact('products'));
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     $order = Order::create([
    //         'user_id' => $request->user()->id,
    //         'status' => $request->status ?? 'pending',
    //         'total_price' => $request->total_price,
    //     ]);

    //     foreach ($request->products as $product) {
    //         OrderItem::create([
    //             'order_id' => $order->id,
    //             'product_id' => $product['id'],
    //             'quantity' => $product['quantity'],
    //             'price' => $product['price'],
    //         ]);
    //     }

    //     // Change 'order_Items' to 'orderItems'
    //     return response()->json($order->load('orderItems.product'), 201);
    // }

    public function store(Request $request)
{
    // Bắt đầu giao dịch
    DB::beginTransaction();
    try {
        // Tạo đơn hàng
        $order = Order::create([
            'user_id' => $request->user()->id,
            'status' => $request->status ?? 'pending',
            'total_price' => $request->total_price,
        ]);

        // Lặp qua các sản phẩm trong đơn hàng
        foreach ($request->products as $product) {
            // Kiểm tra nếu số lượng trong kho đủ
            $productRecord = Product::find($product['id']);
            if ($productRecord->stock_quantity < $product['quantity']) {
                // Rollback giao dịch nếu số lượng không đủ
                DB::rollBack();
                return response()->json(['message' => 'Không đủ số lượng sản phẩm trong kho'], 400);
            }

            // Tạo OrderItem
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product['id'],
                'quantity' => $product['quantity'],
                'price' => $product['price'],
            ]);

            // Giảm số lượng sản phẩm trong kho
            $productRecord->stock_quantity -= $product['quantity'];
            $productRecord->save();
        }

        // Commit giao dịch sau khi hoàn tất
        DB::commit();

        return response()->json($order->load('orderItems.product'), 201);

    } catch (\Exception $e) {
        // Rollback nếu có lỗi
        DB::rollBack();
        return response()->json(['message' => 'Đã xảy ra lỗi khi tạo đơn hàng'], 500);
    }
}

    /**
     * Display the specified resource.
     */
    public function show($id)
    {

        $order = Order::with('user', 'orderItems.product', 'payment')->find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        return response()->json($order);
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $order = Order::findOrFail($id);
        $products = Product::all();
        return view('orders.edit', compact('order', 'products'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->update($request->all());

        return response()->json($order->load('orderItems.product'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->delete();
        return response()->json(['message' => 'Order deleted']);
    }

    public function getMyOrders(Request $request)
    {
        $user = $request->user();

        $orders = Order::with('orderItems.product', 'payment')
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function updateStatus(Request $request, $id)
{
    $order = Order::find($id);

    if (!$order) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    $validatedData = $request->validate([
        'status' => 'required|in:pending,shipping,completed,cancelled',
    ]);

    $order->status = $validatedData['status'];
    $order->save();

    return response()->json(['message' => 'Order status updated successfully', 'order' => $order]);
}

}
