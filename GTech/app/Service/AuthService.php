<?php

namespace App\Service;

use App\Models\User;
use Carbon\Carbon;

class AuthService
{
    public function login($data)
    {
        $user = User::query()
            ->where('email', '=', $data['email'])
            ->where('password', $data['password'])
            ->first();
        $userName = $user->name;
        $userEmail = $user->email;
        $token =  $user->createToken($userName, [$user], Carbon::tomorrow())->plainTextToken;

        //    $a = '9|4uHT5dU7j0ycTxOr5c4VTC3Ivy8y6QlsprGtr4H7c8b529aa';
        //    $token = PersonalAccessToken::find($a);
        //    $user = $token->tokenable; 
        return [
            'token' =>  $token,
            'name' =>  $userName,
            'email' =>  $userEmail,
            'role' => $user->role
        ];
    }
}
