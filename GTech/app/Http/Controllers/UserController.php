<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
        $user =  request()->user();
        // Return the user information as JSON
        return response()->json($user);
    }
    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:15',
            'address' => 'required|string|max:255',
            'role' => 'required|string|in:customer,admin',
            'gender' => 'sometimes|required|string|in:male,female',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create a new user
        $user = User::create($request->all());
        return response()->json($user, 201);
    }
    public function update(Request $request, $id)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'sometimes|required|string|max:15', 
            'address' => 'sometimes|required|string|max:255', 
            'role' => 'sometimes|required|string|in:customer,admin', 
            'gender' => 'sometimes|required|string|in:male,female',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Find the user and update
        $user = User::findOrFail($id);
        $user->update($request->all());

        return response()->json($user);
    }

    public function destroy($id)
    {
        // Find the user and delete
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
    
}