<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Routing\Controller;

class BaseController extends Controller
{
    public function sendSuccess($data = null, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Send an error response.
     *
     * @param string $message
     * @param int $code
     * @param mixed $errors
     * @return JsonResponse
     */
    public function sendError(string $message, int $code = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    /**
     * Throw an exception with a standardized API error response.
     *
     * @param string $message
     * @param int $code
     * @param mixed $errors
     * @throws HttpResponseException
     */
    public function throwError(string $message, int $code = 400, $errors = null): void
    {
        throw new HttpResponseException($this->sendError($message, $code, $errors));
    }
}
