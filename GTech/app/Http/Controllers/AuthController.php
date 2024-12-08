<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Service\AuthService;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends BaseController
{

    private AuthService $authService;
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }


    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }


    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();


            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {

                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    // 'password' => bcrypt(uniqid()), 
                    'password' => Hash::make('123123'),
                    'role' => 'customer',
                ]);
            }


            Auth::login($user);


            $token = $user->createToken('API Token')->plainTextToken;


            return redirect()->to("http://localhost:3000/login?token=$token&role={$user->role}");
        } catch (\Exception $e) {
            return redirect()->to("http://localhost:3000/login?error=Google login failed: " . $e->getMessage());
        }
    }



    public function login(LoginRequest $request): Response
    {
        $validatedData = $request->validated();
        $response = $this->authService->login($validatedData);
        return Response($response, 200);
    }
    public function register(RegisterRequest $request): Response
    {
        $validatedData = $request->validated();
        $response = $this->authService->register($validatedData);

        if ($response['token']) {
            return Response($response, 201);
        } else {
            return Response(['message' => 'Registration failed'], 400);
        }
    }
}
