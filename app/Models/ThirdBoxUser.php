<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThirdBoxUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'brightness',
        'volume',
        'caps_lock',
    ];

    protected $casts = [
        'caps_lock' => 'boolean',
    ];
}
