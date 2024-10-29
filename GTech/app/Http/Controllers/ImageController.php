<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Models\Image;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        $image = new Image();
        $image->url = $request->url;
        $image->save();

        return response()->json(['message' => 'Image URL saved successfully!', 'image' => $image], 201);
    }
}
