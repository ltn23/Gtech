<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Product::class;

    public function definition()
    {
        return [
            'category_id' => Category::factory(),
            'name' => $this->faker->word,
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'description' => $this->faker->paragraph,
            'image_url' => $this->faker->imageUrl,
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'status' => $this->faker->randomElement(['available', 'out_of_stock']),
        ];
    }
}
