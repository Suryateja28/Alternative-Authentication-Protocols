<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoxAuthSubmission extends Model
{
    protected $fillable = [
        'name',
        'email',
        'selected_boxes',
    ];

    protected function casts(): array
    {
        return [
            'selected_boxes' => 'array',
        ];
    }
}
