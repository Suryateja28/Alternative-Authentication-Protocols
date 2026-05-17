<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecondBoxUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'password',
        'delay',
    ];

    protected $hidden = [
        'password',
    ];
}
