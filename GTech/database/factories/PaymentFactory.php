<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Payment::class;

    public function definition()
    {
        return [
            'order_id' => Order::factory(),
            'payment_status' => $this->faker->randomElement(['pending', 'completed', 'failed']),
            'total_amount' => $this->faker->randomFloat(2, 50, 500),
        ];
    }
}
