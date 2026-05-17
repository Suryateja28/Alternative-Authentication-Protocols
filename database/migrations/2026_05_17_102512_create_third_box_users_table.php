<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('third_box_users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->integer('brightness');
            $table->integer('volume');
            $table->boolean('caps_lock');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('third_box_users');
    }
};
