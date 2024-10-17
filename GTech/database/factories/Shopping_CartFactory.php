<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Shopping_cart;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shopping_Cart>
 */
class Shopping_CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Shopping_cart::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'product_id' => Product::factory(),
            'quantity' => $this->faker->numberBetween(1, 5),
        ];
    }
}
