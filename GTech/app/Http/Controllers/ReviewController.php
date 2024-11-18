<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;


class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($productId)
    {
        $reviews = Review::with('user')->where('product_id', $productId)->get();
        return response()->json($reviews);
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
        try {
            $userId = $request->user()->id;
            $productId = $request->input('product_id');
            $rating = $request->input('rating');
            $comment = $request->input('comment');

            // Validate the request data
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string',
            ]);

            // Create a new review
            $review = Review::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'rating' => $rating,
                'comment' => $comment,
            ]);

            // Load user data to include it in the response
            $review->load('user');

            return response()->json($review, 201);
        } catch (\Exception $e) {
            Log::error("Review store error: " . $e->getMessage());
            return response()->json(['message' => 'Server error'], 500);
        }
    }




    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        $review->update($request->all());
        return response()->json($review);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        $review->delete();
        return response()->json(['message' => 'Review deleted']);
    }
}
