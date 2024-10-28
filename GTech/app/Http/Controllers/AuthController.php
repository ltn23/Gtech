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

class AuthController extends BaseController
{

    private AuthService $authService;
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    // Điều hướng người dùng đến trang đăng nhập của Google
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    
public function handleGoogleCallback()
{
    try {
        $googleUser = Socialite::driver('google')->user();

        // Kiểm tra xem người dùng đã tồn tại chưa
        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            // Nếu người dùng chưa tồn tại, tạo mới với vai trò 'customer'
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'password' => bcrypt(uniqid()), // Tạo mật khẩu ngẫu nhiên
                'role' => 'customer',
            ]);
        }

        // Đăng nhập người dùng
        Auth::login($user);

        // Tạo token đăng nhập cho API
        $token = $user->createToken('API Token')->plainTextToken;

        // Chuyển hướng người dùng về giao diện đăng nhập, kèm theo token và thông tin cần thiết
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
