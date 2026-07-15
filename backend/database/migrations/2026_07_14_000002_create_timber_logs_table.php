<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('timber_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('log_type')->default('cylinder'); // cylinder, rectangular, custom
            $table->string('species')->nullable(); // Teak, Mahogany, Jak, Mango...
            $table->decimal('diameter', 10, 3)->nullable();
            $table->string('diameter_unit')->nullable();
            $table->decimal('length', 10, 3);
            $table->string('length_unit');
            $table->string('calculation_method')->default('standard_cylinder'); // standard_cylinder, hoppus, custom
            $table->decimal('volume_cubic_feet', 12, 4)->nullable();
            $table->decimal('volume_cubic_meters', 12, 4)->nullable();
            $table->decimal('estimated_value', 12, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timber_logs');
    }
};
