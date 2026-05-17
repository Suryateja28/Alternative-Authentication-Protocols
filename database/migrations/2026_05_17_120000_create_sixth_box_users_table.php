<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sixth_box_users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->json('combination');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sixth_box_users');
    }
};
