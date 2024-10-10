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
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return [
                'message' => 'Wrong username or password',
                'token' => null,
            ];
        }
        $userName = $user->name;
        $userEmail = $user->email;
        $token =  $user->createToken($userName, [$user], Carbon::tomorrow())->plainTextToken;

        //    $a = '9|4uHT5dU7j0ycTxOr5c4VTC3Ivy8y6QlsprGtr4H7c8b529aa';
        //    $token = PersonalAccessToken::find($a);
        //    $user = $token->tokenable; 
        return [
            'messsage' => 'Logged in successfully',
            'token' =>  $token,
            'name' =>  $userName,
            'email' =>  $userEmail,
            'role' => $user->role
        ];
    }

    public function register($data)
    {
        $user = User::create([
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
