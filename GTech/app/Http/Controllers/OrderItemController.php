<?php

namespace App\Http\Controllers;

use App\Models\Order_item;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class OrderItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $order_Items = Order_Item::with('product', 'order')->get();
        return response()->json($order_Items);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $order_Item = Order_Item::create($request->all());
        return response()->json($order_Item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order_Item = Order_Item::with('product', 'order')->find($id);
        if (!$order_Item) {
            return response()->json(['message' => 'OrderItem not found'], 404);
        }
        return response()->json($order_Item);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order_item $order_item)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $order_Item = Order_Item::find($id);
        if (!$order_Item) {
            return response()->json(['message' => 'OrderItem not found'], 404);
        }

        $order_Item->update($request->all());
        return response()->json($order_Item);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $order_Item = Order_Item::find($id);
        if (!$order_Item) {
            return response()->json(['message' => 'OrderItem not found'], 404);
        }

        $order_Item->delete();
        return response()->json(['message' => 'OrderItem deleted']);
    }
}
