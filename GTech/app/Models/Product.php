<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'price',
        'description',
        'image_url',
        'stock_quantity',
        'status'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
