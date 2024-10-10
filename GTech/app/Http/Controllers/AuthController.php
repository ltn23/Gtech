<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Service\AuthService;
use Illuminate\Routing\Controller as BaseController;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends BaseController
{

    private AuthService $authService;
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
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
