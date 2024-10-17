<?php

namespace App\Http\Controllers;

use App\Models\Shopping_cart;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;


class ShoppingCartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $userId = auth()->user()->id;
        $userId = $request->user()->id;
        $cart_Items = Shopping_Cart::with('product')->where('user_id', $userId)->get();
        return response()->json($cart_Items);
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
        // $userId = $request->user()->id;
        $userId = $request->user()->id;
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1); // Default to 1 if not provided

        // Check if the product already exists in the cart
        $cart_Item = Shopping_Cart::where('user_id', $userId)->where('product_id', $productId)->first();

        if ($cart_Item) {
            // Update quantity if it already exists
            $cart_Item->quantity += $quantity;
            $cart_Item->save();
        } else {
            // Add a new item to the cart
            $cart_Item = Shopping_Cart::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        return response()->json($cart_Item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Shopping_cart $shopping_cart)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Shopping_cart $shopping_cart)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cart_Item = Shopping_Cart::find($id);

        if (!$cart_Item) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cart_Item->update($request->all());

        return response()->json($cart_Item);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cart_Item = Shopping_Cart::find($id);

        if (!$cart_Item) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cart_Item->delete();
        return response()->json(['message' => 'Item removed from cart']);
    }

    // public function clearCart(Request $request)
    // {
    //     $userId = $request->user()->id;
    //     Shopping_Cart::where('user_id', $userId)->delete();

    //     return response()->json(['message' => 'Cart cleared']);
    // }
}
