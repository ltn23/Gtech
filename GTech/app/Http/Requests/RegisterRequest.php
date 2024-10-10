<?php


namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ];
    }
    public function messages(): array
    {
        return [
            'email.required' => 'The email is required to log in.',
            'email.email' => 'The email must be a valid email address.',
            'password.required' => 'Please provide a password.',
            'password.min' => 'Password must be at least 6 characters long.',
        ];
    }
}

