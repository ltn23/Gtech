<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Service\AuthService;
use Exception;
use Illuminate\Routing\Controller as BaseController;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Validation\ValidationException;

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
}
