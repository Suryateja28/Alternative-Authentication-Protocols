<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NinthBoxUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'grid_state',
    ];

    protected $casts = [
        'grid_state' => 'array',
    ];
}
