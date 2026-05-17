<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenthBoxUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'morse_code',
    ];
}
