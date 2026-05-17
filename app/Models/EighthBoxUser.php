<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EighthBoxUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'sequence',
    ];

    protected $casts = [
        'sequence' => 'array',
    ];
}
