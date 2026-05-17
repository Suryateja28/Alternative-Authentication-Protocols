<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeventhBoxUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'emojis',
    ];

    protected $casts = [
        'emojis' => 'array',
    ];
}
