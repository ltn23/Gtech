<?php

namespace App\Service;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Socialite\Facades\Socialite;


class AuthService
{
    public function login($data)
    {
        $user = User::query()
            ->where('email', '=', $data['email'])
            ->first();

        // In ra giá trị của $user để kiểm tra
        if (!$user) {
            return [
                'message' => 'User does not exist',
                'token' => null,
            ];
        }

        if (!Hash::check($data['password'], $user->password)) {
            return [
                'message' => 'Wrong password',
                'token' => null,
            ];
        }

        // Nếu tìm thấy user và mật khẩu đúng, tiếp tục xử lý
        $userName = $user->name;
        $userEmail = $user->email;
        $token =  $user->createToken($userName, [$user], Carbon::tomorrow())->plainTextToken;

        return [
            'message' => 'Logged in successfully',
            'token' =>  $token,
            'name' =>  $userName,
            'email' =>  $userEmail,
            'role' => $user->role
        ];
    }


    public function register($data)
    {
        $user = User::create(attributes: [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'], [1]),
            'role' => 'customer',
        ]);

        $token = $user->createToken($user->name, [$user], Carbon::tomorrow())->plainTextToken;

        return [
            'message' => 'User registered successfully',
            'token' => $token,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];
    }
// Đăng nhập qua Google
public function handleGoogleLogin()
{
    return Socialite::driver('google')->redirect();
}

// Callback sau khi Google đăng nhập thành công
public function handleGoogleCallback()
{
    // Lấy thông tin người dùng từ Google
    $googleUser = Socialite::driver('google')->user();

    // Kiểm tra xem người dùng đã tồn tại chưa
    $user = User::where('email', $googleUser->getEmail())->first();

    if (!$user) {
        // Nếu người dùng chưa tồn tại, tạo mới với vai trò customer
        $user = User::create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'password' => bcrypt(uniqid()), // Tạo mật khẩu ngẫu nhiên
            'role' => 'customer', // Gán vai trò customer
        ]);
    }

    // Tạo token để đăng nhập
    $token = $user->createToken($user->name)->plainTextToken;

    return [
        'message' => 'Google Login successful',
        'token' => $token,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
    ];
}
    
}
