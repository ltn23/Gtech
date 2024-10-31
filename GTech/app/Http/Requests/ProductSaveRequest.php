<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;

class ProductSaveRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'id' => ['nullable', Rule::exists('products', 'id')],
            'id' => ['nullable', Rule::exists('products', 'id')->where(function ($query) {
            // Chỉ kiểm tra nếu có id
            if ($this->input('id')) {
                $query->where('id', $this->input('id'));
            }
        })],
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'stock_quantity' => 'required|integer',
            'category_id' => ['nullable', Rule::exists('categories', 'id')],
            'image_url' => 'nullable|url',
            'status' => ['required', Rule::in(['available', 'out_of_stock'])],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation errors occurred.',
            'errors' => $validator->errors()
        ], 422));
    }
    
    public function messages(): array
    {
        return [
            'id.exists' => 'The selected product does not exist.',
        ];
    }
}
