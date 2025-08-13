<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Models\LeaveRequest;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaveRequests = LeaveRequest::latest()->paginate(10);
        
        return Inertia::render('leave-requests/index', [
            'leave_requests' => $leaveRequests
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeaveRequestRequest $request)
    {
        $leaveRequest = LeaveRequest::create($request->validated());

        return redirect()->back()->with('success', 'Pengajuan izin berhasil dikirim! Mohon tunggu konfirmasi dari atasan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(LeaveRequest $leaveRequest)
    {
        return Inertia::render('leave-requests/show', [
            'leave_request' => $leaveRequest
        ]);
    }
}