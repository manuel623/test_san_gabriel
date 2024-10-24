<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type'); // 'VT', 'VBL', or 'BT'
            $table->text('video_path')->nullable(); // Para los tipos VT y VBL
            $table->text('banner_image')->nullable(); // Para los tipos VBL y BT
            $table->text('banner_text')->nullable(); // Para el tipo VBL
            $table->integer('duration')->nullable(); // Para los banners (en segundos)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
