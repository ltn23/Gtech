<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'order_date', 'status', 'total_price'
    ];

    // An order belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // An order has many order items
    public function order_Items()
    {
        return $this->hasMany(Order_Item::class);
    }

    // An order can have one payment record
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
