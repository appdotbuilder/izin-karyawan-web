<?php

namespace Database\Seeders;

use App\Models\LeaveRequest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LeaveRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample leave requests
        LeaveRequest::factory()->count(15)->create();
        
        // Create some specific examples
        LeaveRequest::factory()->pending()->create([
            'employee_name' => 'Ahmad Fauzi',
            'department' => 'IT',
            'position' => 'Senior Staff',
            'leave_type' => 'Cuti',
            'reason' => 'Berlibur bersama keluarga ke Bali selama satu minggu untuk refreshing setelah menyelesaikan proyek besar.',
        ]);

        LeaveRequest::factory()->approved()->create([
            'employee_name' => 'Siti Nurhaliza',
            'department' => 'HR',
            'position' => 'Manager',
            'leave_type' => 'Sakit',
            'reason' => 'Sakit demam tinggi dan perlu istirahat total di rumah atas saran dokter.',
        ]);

        LeaveRequest::factory()->pending()->create([
            'employee_name' => 'Budi Santoso',
            'department' => 'Marketing',
            'position' => 'Team Lead',
            'leave_type' => 'Izin Pribadi',
            'reason' => 'Menghadiri pernikahan adik kandung di kampung halaman dan perlu membantu persiapan acara.',
        ]);
    }
}