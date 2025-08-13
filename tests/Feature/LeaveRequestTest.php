<?php

use App\Models\LeaveRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('welcome page displays the leave request form', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) =>
        $page->component('welcome')
    );
});

test('can create leave request with valid data', function () {
    $leaveRequestData = [
        'employee_name' => 'John Doe',
        'department' => 'IT',
        'position' => 'Senior Staff',
        'start_date' => now()->addDays(7)->format('Y-m-d'),
        'end_date' => now()->addDays(10)->format('Y-m-d'),
        'leave_type' => 'Cuti',
        'reason' => 'Need to take vacation for personal refreshment and family time.',
    ];

    $response = $this->post(route('leave-requests.store'), $leaveRequestData);

    $response->assertStatus(302);
    $response->assertRedirect('/');

    $this->assertDatabaseHas('leave_requests', [
        'employee_name' => 'John Doe',
        'department' => 'IT',
        'position' => 'Senior Staff',
        'leave_type' => 'Cuti',
        'status' => 'pending',
    ]);
});

test('leave request validation errors for missing required fields', function () {
    $response = $this->post(route('leave-requests.store'), []);

    $response->assertStatus(302);
    $response->assertSessionHasErrors([
        'employee_name',
        'department',
        'position',
        'start_date',
        'end_date',
        'leave_type',
        'reason',
    ]);
});

test('leave request validation for invalid date range', function () {
    $leaveRequestData = [
        'employee_name' => 'Jane Doe',
        'department' => 'HR',
        'position' => 'Manager',
        'start_date' => now()->addDays(10)->format('Y-m-d'),
        'end_date' => now()->addDays(5)->format('Y-m-d'), // End date before start date
        'leave_type' => 'Sakit',
        'reason' => 'Medical treatment required.',
    ];

    $response = $this->post(route('leave-requests.store'), $leaveRequestData);

    $response->assertStatus(302);
    $response->assertSessionHasErrors(['end_date']);
});

test('leave request validation for past start date', function () {
    $leaveRequestData = [
        'employee_name' => 'Bob Smith',
        'department' => 'Marketing',
        'position' => 'Staff',
        'start_date' => now()->subDays(1)->format('Y-m-d'), // Past date
        'end_date' => now()->addDays(2)->format('Y-m-d'),
        'leave_type' => 'Izin Pribadi',
        'reason' => 'Personal matters to attend.',
    ];

    $response = $this->post(route('leave-requests.store'), $leaveRequestData);

    $response->assertStatus(302);
    $response->assertSessionHasErrors(['start_date']);
});

test('can retrieve leave requests', function () {
    LeaveRequest::factory()->count(5)->create();

    $response = $this->get(route('leave-requests.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) =>
        $page->component('leave-requests/index')
            ->has('leave_requests.data', 5)
    );
});

test('can show specific leave request', function () {
    $leaveRequest = LeaveRequest::factory()->create([
        'employee_name' => 'Alice Johnson',
        'department' => 'Finance',
    ]);

    $response = $this->get(route('leave-requests.show', $leaveRequest));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) =>
        $page->component('leave-requests/show')
            ->where('leave_request.employee_name', 'Alice Johnson')
            ->where('leave_request.department', 'Finance')
    );
});

test('leave request model duration calculation', function () {
    $leaveRequest = LeaveRequest::factory()->create([
        'start_date' => '2024-01-01',
        'end_date' => '2024-01-05',
    ]);

    expect($leaveRequest->duration)->toBe(5);
});

test('leave request scopes work correctly', function () {
    LeaveRequest::factory()->create(['status' => 'pending']);
    LeaveRequest::factory()->create(['status' => 'approved']);
    LeaveRequest::factory()->create(['status' => 'rejected']);

    expect(LeaveRequest::pending()->count())->toBe(1);
    expect(LeaveRequest::approved()->count())->toBe(1);
});