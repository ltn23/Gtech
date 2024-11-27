<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Image;
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

        // // Tạo thêm 10 người dùng ngẫu nhiên khác
        // User::factory(10)->create([
        //     'password' => Hash::make('123123'),
        //     'role' => 'customer',
        // ]);

        User::factory()->createMany([
            ['name' => 'John Doe', 'email' => 'john.doe@gtech.com', 'password' => Hash::make('123123'), 'role' => 'customer'],
            ['name' => 'Jane Smith', 'email' => 'jane.smith@gtech.com', 'password' => Hash::make('123123'), 'role' => 'customer'],
            ['name' => 'Alice Brown', 'email' => 'alice.brown@gtech.com', 'password' => Hash::make('123123'), 'role' => 'customer'],
            ['name' => 'Bob White', 'email' => 'bob.white@gtech.com', 'password' => Hash::make('123123'), 'role' => 'customer'],
            ['name' => 'Tom Green', 'email' => 'tom.green@gtech.com', 'password' => Hash::make('123123'), 'role' => 'customer'],
            ['name' => 'Sarah Blue', 'email' => 'sarah.blue@gtech.com', 'password' => Hash::make('123123'), 'role' => 'customer'],
            ['name' => 'Michael Red', 'email' => 'michael.red@gtech.com', 'password' => Hash::make('123123'), 'role' => 'customer'],
            ['name' => 'Emily Yellow', 'email' => 'emily.yellow@gtech.com', 'password' => Hash::make('123123'), 'role' => 'customer'],
            ['name' => 'Chris Orange', 'email' => 'chris.orange@gtech.com', 'password' => Hash::make('123123'), 'role' => 'customer'],
            ['name' => 'Paul Purple', 'email' => 'paul.purple@gtech.com', 'password' => Hash::make('123123'), 'role' => 'customer'],
        ]);
        

        $categories = [
            ['name' => 'Laptops', 'description' => 'Various models of laptops and ultrabooks.'],
            ['name' => 'Smartphones', 'description' => 'Latest smartphones from top brands.'],
            ['name' => 'Headphones', 'description' => 'Headphones and earphones, wired and wireless.'],
            ['name' => 'Smartwatches', 'description' => 'Smartwatches with latest health features.'],
            ['name' => 'Gaming Consoles', 'description' => 'Consoles and accessories for gaming.'],
            ['name' => 'Monitors', 'description' => 'High-resolution monitors for professional and gaming use.'],
            ['name' => 'Keyboards', 'description' => 'Mechanical and membrane keyboards.'],
            ['name' => 'Mice', 'description' => 'Wireless and gaming mice.'],
            ['name' => 'Printers', 'description' => 'All-in-one and inkjet printers.'],
            ['name' => 'Networking Equipment', 'description' => 'Routers, modems, and extenders.'],
            ['name' => 'Speakers', 'description' => 'Bluetooth and wired speakers.'],
            ['name' => 'Power Banks', 'description' => 'Portable charging devices.'],
            ['name' => 'External Storage', 'description' => 'HDDs, SSDs, and flash drives.'],
            ['name' => 'Graphics Cards', 'description' => 'High-performance GPUs for gaming and workstations.'],
            ['name' => 'Software', 'description' => 'Licensed operating systems and applications.'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $products = [
            ['category_id' => Category::where('name', 'Laptops')->first()->id, 'name' => 'MacBook Pro 16"', 'price' => 12, 'description' => 'Apple MacBook Pro with M1 chip.', 'stock_quantity' => 50, 'status' => 'available', 'image_url' => 'https://res.cloudinary.com/dsh0cqmhc/image/upload/v1730218120/abduxru09ctukytscrb3.jpg'],
            ['category_id' => Category::where('name', 'Smartphones')->first()->id, 'name' => 'iPhone 14 Pro Max', 'price' => 20, 'description' => 'Apple iPhone 14 with Pro Max features.', 'stock_quantity' => 100, 'status' => 'available', 'image_url' => 'https://res.cloudinary.com/dsh0cqmhc/image/upload/v1730218131/nsfywi1k06jo3ijyfjri.jpg'],
            ['category_id' => Category::where('name', 'Headphones')->first()->id, 'name' => 'Sony WH-1000XM5', 'price' => 50, 'description' => 'Noise-cancelling wireless headphones.', 'stock_quantity' => 200, 'status' => 'available', 'image_url' => 'https://res.cloudinary.com/dsh0cqmhc/image/upload/v1730218145/qlrkf6tr9hs4xwat8swm.jpg'],
            ['category_id' => Category::where('name', 'Smartwatches')->first()->id, 'name' => 'Apple Watch Series 8', 'price' => 49, 'description' => 'Latest Apple Watch with health monitoring.', 'stock_quantity' => 75, 'status' => 'available', 'image_url' => 'https://res.cloudinary.com/dsh0cqmhc/image/upload/v1730218154/m0o2j8e2xzbrq9op5n6y.png'],
            ['category_id' => Category::where('name', 'Gaming Consoles')->first()->id, 'name' => 'PlayStation 5', 'price' => 60, 'description' => 'Next-gen gaming console from Sony.', 'stock_quantity' => 25, 'status' => 'available', 'image_url' => 'https://res.cloudinary.com/dsh0cqmhc/image/upload/v1730218162/k2hsazqcvi21vhcirvxd.png'],
            ['category_id' => Category::where('name', 'Monitors')->first()->id, 'name' => 'Dell UltraSharp 27"', 'price' => 45, 'description' => '27-inch 4K UHD monitor.', 'stock_quantity' => 40, 'status' => 'available', 'image_url' => 'https://example.com/image1.jpg'],
    ['category_id' => Category::where('name', 'Keyboards')->first()->id, 'name' => 'Logitech MX Keys', 'price' => 25, 'description' => 'Wireless keyboard for professionals.', 'stock_quantity' => 100, 'status' => 'available', 'image_url' => 'https://example.com/image2.jpg'],
    ['category_id' => Category::where('name', 'Mice')->first()->id, 'name' => 'Razer DeathAdder', 'price' => 20, 'description' => 'Ergonomic gaming mouse.', 'stock_quantity' => 80, 'status' => 'available', 'image_url' => 'https://example.com/image3.jpg'],
    ['category_id' => Category::where('name', 'Printers')->first()->id, 'name' => 'HP LaserJet Pro', 'price' => 150, 'description' => 'All-in-one laser printer.', 'stock_quantity' => 20, 'status' => 'available', 'image_url' => 'https://example.com/image4.jpg'],
    ['category_id' => Category::where('name', 'Networking Equipment')->first()->id, 'name' => 'Netgear Nighthawk', 'price' => 35, 'description' => 'High-speed router.', 'stock_quantity' => 50, 'status' => 'available', 'image_url' => 'https://example.com/image5.jpg'],
    ['category_id' => Category::where('name', 'Speakers')->first()->id, 'name' => 'JBL Flip 5', 'price' => 10, 'description' => 'Portable Bluetooth speaker.', 'stock_quantity' => 70, 'status' => 'available', 'image_url' => 'https://example.com/image6.jpg'],
    ['category_id' => Category::where('name', 'Power Banks')->first()->id, 'name' => 'Anker PowerCore 10000', 'price' => 15, 'description' => 'Compact portable charger.', 'stock_quantity' => 200, 'status' => 'available', 'image_url' => 'https://example.com/image7.jpg'],
    ['category_id' => Category::where('name', 'External Storage')->first()->id, 'name' => 'Samsung T7 Portable SSD', 'price' => 50, 'description' => 'Fast external storage.', 'stock_quantity' => 30, 'status' => 'available', 'image_url' => 'https://example.com/image8.jpg'],
    ['category_id' => Category::where('name', 'Graphics Cards')->first()->id, 'name' => 'NVIDIA RTX 3080', 'price' => 300, 'description' => 'High-performance gaming GPU.', 'stock_quantity' => 15, 'status' => 'available', 'image_url' => 'https://example.com/image9.jpg'],
    ['category_id' => Category::where('name', 'Software')->first()->id, 'name' => 'Microsoft Office 365', 'price' => 100, 'description' => 'Productivity software suite.', 'stock_quantity' => 150, 'status' => 'available', 'image_url' => 'https://example.com/image10.jpg'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $orders = [
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'order_date' => now(), 'status' => 'pending', 'total_price' => 32],
            ['user_id' => User::where('email', 'john.doe@gtech.com')->first()->id, 'order_date' => now()->subDays(10), 'status' => 'completed', 'total_price' => 500],
    ['user_id' => User::where('email', 'jane.smith@gtech.com')->first()->id, 'order_date' => now()->subDays(8), 'status' => 'pending', 'total_price' => 150],
    ['user_id' => User::where('email', 'alice.brown@gtech.com')->first()->id, 'order_date' => now()->subDays(5), 'status' => 'completed', 'total_price' => 300],
    ['user_id' => User::where('email', 'bob.white@gtech.com')->first()->id, 'order_date' => now()->subDays(3), 'status' => 'shipping', 'total_price' => 450],
    ['user_id' => User::where('email', 'tom.green@gtech.com')->first()->id, 'order_date' => now()->subDays(1), 'status' => 'cancelled', 'total_price' => 100],
    ['user_id' => User::where('email', 'sarah.blue@gtech.com')->first()->id, 'order_date' => now()->subDays(15), 'status' => 'completed', 'total_price' => 600],
    ['user_id' => User::where('email', 'michael.red@gtech.com')->first()->id, 'order_date' => now()->subDays(20), 'status' => 'pending', 'total_price' => 200],
    ['user_id' => User::where('email', 'emily.yellow@gtech.com')->first()->id, 'order_date' => now()->subDays(12), 'status' => 'completed', 'total_price' => 250],
    ['user_id' => User::where('email', 'chris.orange@gtech.com')->first()->id, 'order_date' => now()->subDays(18), 'status' => 'completed', 'total_price' => 700],
    ['user_id' => User::where('email', 'paul.purple@gtech.com')->first()->id, 'order_date' => now()->subDays(9), 'status' => 'shipping', 'total_price' => 350],

            
        ];

        foreach ($orders as $order) {
            Order::create($order);
        }

        $orderItems = [
            ['order_id' => Order::first()->id, 'product_id' => Product::where('name', 'MacBook Pro 16"')->first()->id, 'quantity' => 1, 'price' => 12],
            ['order_id' => Order::first()->id, 'product_id' => Product::where('name', 'iPhone 14 Pro Max')->first()->id, 'quantity' => 1, 'price' => 20],
            ['order_id' => Order::first()->id, 'product_id' => Product::where('name', 'Dell UltraSharp 27"')->first()->id, 'quantity' => 1, 'price' => 45],
    ['order_id' => Order::first()->id, 'product_id' => Product::where('name', 'Logitech MX Keys')->first()->id, 'quantity' => 2, 'price' => 25],
    ['order_id' => Order::find(2)->id, 'product_id' => Product::where('name', 'Samsung T7 Portable SSD')->first()->id, 'quantity' => 1, 'price' => 50],
    ['order_id' => Order::find(2)->id, 'product_id' => Product::where('name', 'JBL Flip 5')->first()->id, 'quantity' => 3, 'price' => 10],
    ['order_id' => Order::find(3)->id, 'product_id' => Product::where('name', 'HP LaserJet Pro')->first()->id, 'quantity' => 1, 'price' => 150],
    ['order_id' => Order::find(3)->id, 'product_id' => Product::where('name', 'NVIDIA RTX 3080')->first()->id, 'quantity' => 2, 'price' => 300],

        ];

        foreach ($orderItems as $item) {
            OrderItem::create($item);
        }

        $payments = [
            ['order_id' => Order::first()->id, 'payment_method' => 'cash','payment_status' => 'completed', 'total_amount' => 32],
            ['order_id' => Order::first()->id, 'payment_method' => 'paypal', 'payment_status' => 'completed', 'total_amount' => 500],
            ['order_id' => Order::find(2)->id, 'payment_method' => 'cash', 'payment_status' => 'pending', 'total_amount' => 150],
            ['order_id' => Order::find(3)->id, 'payment_method' => 'paypal', 'payment_status' => 'completed', 'total_amount' => 300],
            ['order_id' => Order::find(4)->id, 'payment_method' => 'cash', 'payment_status' => 'completed', 'total_amount' => 450],
        
        ];

        foreach ($payments as $payment) {
            Payment::create($payment);
        }

        $reviews = [
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'product_id' => Product::where('name', 'MacBook Pro 16"')->first()->id, 'rating' => 5, 'comment' => 'Amazing performance!'],
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'product_id' => Product::where('name', 'iPhone 14 Pro Max')->first()->id, 'rating' => 4, 'comment' => 'Great camera, but too expensive.'],
            ['user_id' => User::where('email', 'alice.brown@gtech.com')->first()->id, 'product_id' => Product::where('name', 'MacBook Pro 16"')->first()->id, 'rating' => 5, 'comment' => 'Absolutely love this laptop! Perfect for programming and design work.'],
    ['user_id' => User::where('email', 'bob.white@gtech.com')->first()->id, 'product_id' => Product::where('name', 'iPhone 14 Pro Max')->first()->id, 'rating' => 4, 'comment' => 'Amazing features but the battery could be better.'],
    ['user_id' => User::where('email', 'tom.green@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Sony WH-1000XM5')->first()->id, 'rating' => 5, 'comment' => 'Best noise-cancelling headphones I have ever owned!'],
    ['user_id' => User::where('email', 'sarah.blue@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Apple Watch Series 8')->first()->id, 'rating' => 4, 'comment' => 'Great features but wish it had longer battery life.'],
    ['user_id' => User::where('email', 'michael.red@gtech.com')->first()->id, 'product_id' => Product::where('name', 'PlayStation 5')->first()->id, 'rating' => 5, 'comment' => 'Fantastic console for gaming! Graphics are unreal.'],
    ['user_id' => User::where('email', 'emily.yellow@gtech.com')->first()->id, 'product_id' => Product::where('name', 'JBL Flip 5')->first()->id, 'rating' => 4, 'comment' => 'Good sound quality, but could be louder.'],
    ['user_id' => User::where('email', 'chris.orange@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Samsung T7 Portable SSD')->first()->id, 'rating' => 5, 'comment' => 'Super fast storage device, very reliable.'],
    ['user_id' => User::where('email', 'paul.purple@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Logitech MX Keys')->first()->id, 'rating' => 5, 'comment' => 'The best typing experience I have had.'],
    ['user_id' => User::where('email', 'john.doe@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Dell UltraSharp 27"')->first()->id, 'rating' => 4, 'comment' => 'Excellent monitor for multitasking.'],
    ['user_id' => User::where('email', 'jane.smith@gtech.com')->first()->id, 'product_id' => Product::where('name', 'HP LaserJet Pro')->first()->id, 'rating' => 4, 'comment' => 'Great printer for office use.'],

        ];

        foreach ($reviews as $review) {
            Review::create($review);
        }

        $cartItems = [
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Sony WH-1000XM5')->first()->id, 'quantity' => 2],
            ['user_id' => User::where('email', 'customer@gtech.com')->first()->id, 'product_id' => Product::where('name', 'PlayStation 5')->first()->id, 'quantity' => 1],
            ['user_id' => User::where('email', 'alice.brown@gtech.com')->first()->id, 'product_id' => Product::where('name', 'MacBook Pro 16"')->first()->id, 'quantity' => 1],
    ['user_id' => User::where('email', 'bob.white@gtech.com')->first()->id, 'product_id' => Product::where('name', 'iPhone 14 Pro Max')->first()->id, 'quantity' => 1],
    ['user_id' => User::where('email', 'tom.green@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Sony WH-1000XM5')->first()->id, 'quantity' => 2],
    ['user_id' => User::where('email', 'sarah.blue@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Apple Watch Series 8')->first()->id, 'quantity' => 1],
    ['user_id' => User::where('email', 'michael.red@gtech.com')->first()->id, 'product_id' => Product::where('name', 'PlayStation 5')->first()->id, 'quantity' => 1],
    ['user_id' => User::where('email', 'emily.yellow@gtech.com')->first()->id, 'product_id' => Product::where('name', 'JBL Flip 5')->first()->id, 'quantity' => 3],
    ['user_id' => User::where('email', 'chris.orange@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Samsung T7 Portable SSD')->first()->id, 'quantity' => 2],
    ['user_id' => User::where('email', 'paul.purple@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Logitech MX Keys')->first()->id, 'quantity' => 1],
    ['user_id' => User::where('email', 'john.doe@gtech.com')->first()->id, 'product_id' => Product::where('name', 'Dell UltraSharp 27"')->first()->id, 'quantity' => 1],
    ['user_id' => User::where('email', 'jane.smith@gtech.com')->first()->id, 'product_id' => Product::where('name', 'HP LaserJet Pro')->first()->id, 'quantity' => 1],
        ];

        foreach ($cartItems as $item) {
            ShoppingCart::create($item);
        }
    
    }
}
