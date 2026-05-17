<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seventh_box_users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->json('emojis');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seventh_box_users');
    }
};
