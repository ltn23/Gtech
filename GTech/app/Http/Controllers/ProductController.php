<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductSaveRequest;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class ProductController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Check if a category ID is provided
        if ($request->has('category')) {
            $query->where('category_id', $request->input('category'));
        }

        // Get the products based on the query
        $products = $query->get();

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function save(ProductSaveRequest $request)
    {
        // $requestData =  $request->validated();
        // $product = $requestData['id'] ? Product::find($requestData['id'])->first() : new Product();
        // $msg =  $requestData['id'] ? "Product updated successfully." : "Product created successfully.";
        // $product->fill($requestData);
        // $product->save();
        // return $this->sendSuccess($product,  $msg);

        // $requestData =  $request->validated();

        // // Kiểm tra nếu có 'id' trong request
        // $product = isset($requestData['id']) && $requestData['id'] ? Product::find($requestData['id'])->first() : new Product();


        // // Cập nhật hoặc tạo mới
        // $product->fill($requestData);
        // $product->save();

        // // Xác định thông điệp thành công dựa vào sự tồn tại của id
        // $msg = isset($requestData['id']) ? "Product updated successfully." : "Product created successfully.";

        // return $this->sendSuccess($product, $msg);



        $requestData = $request->validated();

        // Check if 'id' is present in request data to update existing product
        $product = isset($requestData['id']) ? Product::find($requestData['id']) : new Product();
    
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found.'], 404);
        }
    
        // Update or create the product with validated data
        $product->fill($requestData);
        $product->save();
    
        // Response message based on whether it was an update or create
        $msg = isset($requestData['id']) ? "Product updated successfully." : "Product created successfully.";
        return response()->json(['success' => true, 'message' => $msg, 'data' => $product]);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $product = Product::with('category')->find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
    //admin dashboard
    public function topProduct()
    {
        try {
            $topProducts = OrderItem::selectRaw('
                    product_id,
                    SUM(quantity) as units_sold,
                    SUM(price * quantity) as revenue
                ')
                ->groupBy('product_id')
                ->orderByDesc('units_sold')
                ->with('product:id,name') // Include product details
                ->take(10) // Limit to top 10 products
                ->get();

            $products = $topProducts->map(function ($item) {
                return [
                    'id' => $item->product_id,
                    'name' => $item->product->name,
                    'units_sold' => $item->units_sold,
                    'revenue' => $item->revenue,
                ];
            });

            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch top products'], 500);
        }
    }
}
