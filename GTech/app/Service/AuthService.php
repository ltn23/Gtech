<?php

namespace App\Service;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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
}
