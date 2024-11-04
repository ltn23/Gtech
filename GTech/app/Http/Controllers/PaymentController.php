<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with('order')->get();
        return response()->json($payments);
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
//     public function store(Request $request)
// {
//     // Validate the request
//     $request->validate([
//         'order_id' => 'required|exists:orders,id', 
//         'payment_method' => 'required|in:paypal,cash',
//         'total_amount' => 'required|numeric',
//     ]);

//     // Tạo payment
//     try {
//         $payment = Payment::create($request->all());
//         return response()->json($payment, 201);
//     } catch (\Exception $e) {
//         // Log error và trả về phản hồi lỗi
//         Log::error('Payment creation failed:', ['error' => $e->getMessage()]);
//         return response()->json(['message' => 'Failed to create payment'], 500);
//     }
// }

public function store(Request $request)
{
    // Validate the request
    $request->validate([
        'order_id' => 'required|exists:orders,id',
        'payment_method' => 'required|in:paypal,cash',
        'total_amount' => 'required|numeric',
    ]);

    // Set payment status based on payment method
    $paymentStatus = $request->payment_method === 'paypal' ? 'completed' : 'pending';

    // Create payment with conditional status
    try {
        $payment = Payment::create([
            'order_id' => $request->order_id,
            'payment_method' => $request->payment_method,
            'total_amount' => $request->total_amount,
            'payment_status' => $paymentStatus,
        ]);

        return response()->json($payment, 201);
    } catch (\Exception $e) {
        // Log error and return failure response
        Log::error('Payment creation failed:', ['error' => $e->getMessage()]);
        return response()->json(['message' => 'Failed to create payment'], 500);
    }
}



    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $payment = Payment::with('order')->find($id);
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }
        return response()->json($payment);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $payment->update($request->all());
        return response()->json($payment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $payment->delete();
        return response()->json(['message' => 'Payment deleted']);
    }
}
