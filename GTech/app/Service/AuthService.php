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


    public function handleGoogleCallback()
    {

        $googleUser = Socialite::driver('google')->user();


        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {

            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'password' => bcrypt(uniqid()),
                'role' => 'customer',
            ]);
        }


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
