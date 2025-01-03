<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
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
        $cartItems = ShoppingCart::with('product')->where('user_id', $userId)->get();
        return response()->json($cartItems);
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
        $userId = $request->user()->id;
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);


        $cartItem = ShoppingCart::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {

            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {

            $cartItem = ShoppingCart::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }


        return response()->json($cartItem, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(ShoppingCart $shoppingCart)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ShoppingCart $shoppingCart)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cartItem = ShoppingCart::find($id);

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cartItem->update($request->all());

        return response()->json($cartItem);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cartItem = ShoppingCart::find($id);

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cartItem->delete();
        return response()->json(['message' => 'Item removed from cart']);
    }
}
