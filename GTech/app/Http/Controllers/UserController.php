<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', '!=', 'admin')->get();
        return response()->json($users);
    }


    public function show()
    {
        // Get the authenticated user
        $user = Auth::user();
        
        // Return the user information as JSON
        return response()->json($user);
    }

    
}