<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Review;
use App\Models\ShoppingCart;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gtech.com',
            'password' => Hash::make('123123'), // Mã hóa mật khẩu
            'role' => 'admin',
        ]);
        
        User::factory()->create([
            'name' => 'Regular Customer',
            'email' => 'customer@gtech.com',
            'password' => Hash::make('123123'), // Mã hóa mật khẩu
            'role' => 'customer',
        ]);

        // Tạo thêm 10 người dùng ngẫu nhiên khác
        User::factory(10)->create([
            'password' => Hash::make('123123'),
            'role' => 'customer',
        ]);

        $categories = [
            ['name' => 'Laptops', 'description' => 'Various models of laptops and ultrabooks.'],
            ['name' => 'Smartphones', 'description' => 'Latest smartphones from top brands.'],
            ['name' => 'Headphones', 'description' => 'Headphones and earphones, wired and wireless.'],
            ['name' => 'Smartwatches', 'description' => 'Smartwatches with latest health features.'],
            ['name' => 'Gaming Consoles', 'description' => 'Consoles and accessories for gaming.'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $products = [
            ['category_id' => Category::where('name', 'Laptops')->first()->id, 'name' => 'MacBook Pro 16"', 'price' => 2499.99, 'description' => 'Apple MacBook Pro with M1 chip.', 'stock_quantity' => 50, 'status' => 'available', 'image_url' => 'https://example.com/macbook.jpg'],
            ['category_id' => Category::where('name', 'Smartphones')->first()->id, 'name' => 'iPhone 14 Pro Max', 'price' => 1099.99, 'description' => 'Apple iPhone 14 with Pro Max features.', 'stock_quantity' => 100, 'status' => 'available', 'image_url' => 'https://example.com/iphone.jpg'],
            ['category_id' => Category::where('name', 'Headphones')->first()->id, 'name' => 'Sony WH-1000XM5', 'price' => 349.99, 'description' => 'Noise-cancelling wireless headphones.', 'stock_quantity' => 200, 'status' => 'available', 'image_url' => 'https://example.com/sony.jpg'],
            ['category_id' => Category::where('name', 'Smartwatches')->first()->id, 'name' => 'Apple Watch Series 8', 'price' => 499.99, 'description' => 'Latest Apple Watch with health monitoring.', 'stock_quantity' => 75, 'status' => 'available', 'image_url' => 'https://example.com/applewatch.jpg'],
            ['category_id' => Category::where('name', 'Gaming Consoles')->first()->id, 'name' => 'PlayStation 5', 'price' => 499.99, 'description' => 'Next-gen gaming console from Sony.', 'stock_quantity' => 25, 'status' => 'available', 'image_url' => 'https://example.com/ps5.jpg'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $orders = [
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'order_date' => now(), 'status' => 'pending', 'total_price' => 1599.98],
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'order_date' => now(), 'status' => 'completed', 'total_price' => 999.99],
        ];

        foreach ($orders as $order) {
            Order::create($order);
        }

        $orderItems = [
            ['order_id' => Order::first()->id, 'product_id' => Product::where('name', 'MacBook Pro 16"')->first()->id, 'quantity' => 1, 'price' => 2499.99],
            ['order_id' => Order::first()->id, 'product_id' => Product::where('name', 'iPhone 14 Pro Max')->first()->id, 'quantity' => 1, 'price' => 1099.99],
        ];

        foreach ($orderItems as $item) {
            OrderItem::create($item);
        }

        $payments = [
            ['order_id' => Order::first()->id, 'payment_status' => 'completed', 'total_amount' => 1599.98],
            ['order_id' => Order::skip(1)->first()->id, 'payment_status' => 'pending', 'total_amount' => 999.99],
        ];

        foreach ($payments as $payment) {
            Payment::create($payment);
        }

        $reviews = [
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'product_id' => Product::where('name', 'MacBook Pro 16"')->first()->id, 'rating' => 5, 'comment' => 'Amazing performance!'],
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'product_id' => Product::where('name', 'iPhone 14 Pro Max')->first()->id, 'rating' => 4, 'comment' => 'Great camera, but too expensive.'],
        ];

        foreach ($reviews as $review) {
            Review::create($review);
        }

        $cartItems = [
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Sony WH-1000XM5')->first()->id, 'quantity' => 2],
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'product_id' => Product::where('name', 'PlayStation 5')->first()->id, 'quantity' => 1],
        ];

        foreach ($cartItems as $item) {
            ShoppingCart::create($item);
        }
    
    }
}
