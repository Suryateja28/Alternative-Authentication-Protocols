<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ninth_box_users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->json('grid_state');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ninth_box_users');
    }
};
