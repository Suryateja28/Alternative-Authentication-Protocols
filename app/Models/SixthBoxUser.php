<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SixthBoxUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'combination',
    ];

    protected $casts = [
        'combination' => 'array',
    ];
}
