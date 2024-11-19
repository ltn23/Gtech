<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Routing\Controller;

class ChatbotController extends Controller
{
    public function handleChat(Request $request)
    {
        $client = new Client(['base_uri' => 'http://localhost:11434']);

        try {
            $response = $client->post('/v1/chat/completions', [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => 'gemma2:9b', // Đảm bảo model này đã được tải trong Ollama
                    'messages' => $request->input('messages'),
                ],
            ]);

            $responseBody = json_decode($response->getBody(), true);

            return response()->json([
                'status' => 'success',
                'data' => $responseBody,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
