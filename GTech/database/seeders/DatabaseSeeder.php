<?php

namespace Database\Seeders;

use App\Models\User;
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
            'role' => 'customer',
        ]);
    }
}
