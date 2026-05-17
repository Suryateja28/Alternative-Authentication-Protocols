<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('box_auth_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->json('selected_boxes');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('box_auth_submissions');
    }
};
