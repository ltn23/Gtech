<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show()
    {
        // Get the authenticated user
        $user = Auth::user();
        
        // Return the user information as JSON
        return response()->json($user);
    }

    
}