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
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->string('employee_name')->comment('Name of the employee requesting leave');
            $table->string('department')->comment('Department of the employee');
            $table->string('position')->comment('Position/job title of the employee');
            $table->date('start_date')->comment('Start date of the leave');
            $table->date('end_date')->comment('End date of the leave');
            $table->enum('leave_type', ['Cuti', 'Sakit', 'Izin Pribadi'])->comment('Type of leave requested');
            $table->text('reason')->comment('Reason for the leave request');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->comment('Status of the leave request');
            $table->timestamps();
            
            // Add indexes for performance
            $table->index('employee_name');
            $table->index('department');
            $table->index('status');
            $table->index(['status', 'created_at']);
            $table->index('start_date');
            $table->index('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};