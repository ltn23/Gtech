<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Image extends Model
{
    use HasFactory;

    // Tên bảng (nếu không tuân theo quy tắc đặt tên mặc định)
    protected $table = 'images';

    // Danh sách các cột có thể được gán hàng loạt
    protected $fillable = ['url'];

    // Nếu cần loại bỏ timestamps (created_at, updated_at)
    public $timestamps = true;
}
