import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { leaveRequestsTable, employeesTable } from '../db/schema';
import { getLeaveRequests, getLeaveRequestsByEmployee } from '../handlers/get_leave_requests';
import { type CreateLeaveRequestInput } from '../schema';

// Test data for leave requests
const testEmployee1 = {
  id: 'EMP001',
  name: 'John Doe',
  department: 'Engineering',
  position: 'Software Engineer'
};

const testEmployee2 = {
  id: 'EMP002', 
  name: 'Jane Smith',
  department: 'HR',
  position: 'HR Manager'
};

const testLeaveRequest1: CreateLeaveRequestInput = {
  employee_id: 'EMP001',
  employee_name: 'John Doe',
  employee_department: 'Engineering',
  employee_position: 'Software Engineer',
  start_date: new Date('2024-01-15'),
  end_date: new Date('2024-01-17'),
  reason: 'Personal vacation'
};

const testLeaveRequest2: CreateLeaveRequestInput = {
  employee_id: 'EMP002',
  employee_name: 'Jane Smith',
  employee_department: 'HR', 
  employee_position: 'HR Manager',
  start_date: new Date('2024-02-01'),
  end_date: new Date('2024-02-05'),
  reason: 'Medical appointment'
};

const testLeaveRequest3: CreateLeaveRequestInput = {
  employee_id: 'EMP001',
  employee_name: 'John Doe',
  employee_department: 'Engineering',
  employee_position: 'Software Engineer',
  start_date: new Date('2024-03-10'),
  end_date: new Date('2024-03-12'),
  reason: 'Family emergency'
};

describe('getLeaveRequests', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no leave requests exist', async () => {
    const result = await getLeaveRequests();

    expect(result).toEqual([]);
  });

  it('should return all leave requests ordered by created_at desc', async () => {
    // Create employees first
    await db.insert(employeesTable).values([testEmployee1, testEmployee2]).execute();

    // Insert leave requests with slight delays to ensure different created_at times
    const request1 = await db.insert(leaveRequestsTable)
      .values(testLeaveRequest1)
      .returning()
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 1));

    const request2 = await db.insert(leaveRequestsTable)
      .values(testLeaveRequest2)
      .returning()
      .execute();

    await new Promise(resolve => setTimeout(resolve, 1));

    const request3 = await db.insert(leaveRequestsTable)
      .values(testLeaveRequest3)
      .returning()
      .execute();

    const result = await getLeaveRequests();

    expect(result).toHaveLength(3);

    // Should be ordered by created_at descending (newest first)
    expect(result[0].id).toEqual(request3[0].id);
    expect(result[1].id).toEqual(request2[0].id);
    expect(result[2].id).toEqual(request1[0].id);

    // Verify complete data structure
    expect(result[0]).toMatchObject({
      employee_id: 'EMP001',
      employee_name: 'John Doe',
      employee_department: 'Engineering',
      employee_position: 'Software Engineer',
      start_date: new Date('2024-03-10'),
      end_date: new Date('2024-03-12'),
      reason: 'Family emergency',
      status: 'pending'
    });

    // Verify timestamps are Date objects
    result.forEach(request => {
      expect(request.created_at).toBeInstanceOf(Date);
      expect(request.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should return leave requests with different statuses', async () => {
    // Create employee
    await db.insert(employeesTable).values(testEmployee1).execute();

    // Insert requests with different statuses
    await db.insert(leaveRequestsTable)
      .values([
        { ...testLeaveRequest1, status: 'approved' },
        { ...testLeaveRequest3, status: 'rejected' }
      ])
      .execute();

    const result = await getLeaveRequests();

    expect(result).toHaveLength(2);
    expect(result.some(r => r.status === 'approved')).toBe(true);
    expect(result.some(r => r.status === 'rejected')).toBe(true);
  });
});

describe('getLeaveRequestsByEmployee', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no leave requests exist for employee', async () => {
    const result = await getLeaveRequestsByEmployee('EMP999');

    expect(result).toEqual([]);
  });

  it('should return only leave requests for specific employee', async () => {
    // Create employees
    await db.insert(employeesTable).values([testEmployee1, testEmployee2]).execute();

    // Insert leave requests for both employees
    await db.insert(leaveRequestsTable)
      .values([testLeaveRequest1, testLeaveRequest2, testLeaveRequest3])
      .execute();

    // Get requests for EMP001 only
    const result = await getLeaveRequestsByEmployee('EMP001');

    expect(result).toHaveLength(2);
    result.forEach(request => {
      expect(request.employee_id).toEqual('EMP001');
      expect(request.employee_name).toEqual('John Doe');
    });

    // Verify both requests for EMP001 are returned
    const reasons = result.map(r => r.reason);
    expect(reasons).toContain('Personal vacation');
    expect(reasons).toContain('Family emergency');
  });

  it('should return employee requests ordered by created_at desc', async () => {
    // Create employee
    await db.insert(employeesTable).values(testEmployee1).execute();

    // Insert requests with delays to ensure different timestamps
    const request1 = await db.insert(leaveRequestsTable)
      .values(testLeaveRequest1)
      .returning()
      .execute();

    await new Promise(resolve => setTimeout(resolve, 1));

    const request3 = await db.insert(leaveRequestsTable)
      .values(testLeaveRequest3)
      .returning()
      .execute();

    const result = await getLeaveRequestsByEmployee('EMP001');

    expect(result).toHaveLength(2);
    // Should be ordered by created_at descending (newest first)
    expect(result[0].id).toEqual(request3[0].id);
    expect(result[1].id).toEqual(request1[0].id);
  });

  it('should not return requests from other employees', async () => {
    // Create employees
    await db.insert(employeesTable).values([testEmployee1, testEmployee2]).execute();

    // Insert requests for both employees
    await db.insert(leaveRequestsTable)
      .values([testLeaveRequest1, testLeaveRequest2])
      .execute();

    // Get requests for EMP002 only
    const result = await getLeaveRequestsByEmployee('EMP002');

    expect(result).toHaveLength(1);
    expect(result[0].employee_id).toEqual('EMP002');
    expect(result[0].employee_name).toEqual('Jane Smith');
    expect(result[0].reason).toEqual('Medical appointment');
  });

  it('should handle non-existent employee gracefully', async () => {
    // Create some leave requests for existing employees
    await db.insert(employeesTable).values(testEmployee1).execute();
    await db.insert(leaveRequestsTable).values(testLeaveRequest1).execute();

    // Query for non-existent employee
    const result = await getLeaveRequestsByEmployee('NONEXISTENT');

    expect(result).toEqual([]);
  });

  it('should preserve all fields in returned data', async () => {
    // Create employee
    await db.insert(employeesTable).values(testEmployee1).execute();

    // Insert request
    await db.insert(leaveRequestsTable).values(testLeaveRequest1).execute();

    const result = await getLeaveRequestsByEmployee('EMP001');

    expect(result).toHaveLength(1);
    const request = result[0];

    // Verify all expected fields are present
    expect(request).toHaveProperty('id');
    expect(request).toHaveProperty('employee_id', 'EMP001');
    expect(request).toHaveProperty('employee_name', 'John Doe');
    expect(request).toHaveProperty('employee_department', 'Engineering');
    expect(request).toHaveProperty('employee_position', 'Software Engineer');
    expect(request).toHaveProperty('start_date');
    expect(request).toHaveProperty('end_date');
    expect(request).toHaveProperty('reason', 'Personal vacation');
    expect(request).toHaveProperty('status', 'pending');
    expect(request).toHaveProperty('created_at');
    expect(request).toHaveProperty('updated_at');

    // Verify date objects
    expect(request.start_date).toBeInstanceOf(Date);
    expect(request.end_date).toBeInstanceOf(Date);
    expect(request.created_at).toBeInstanceOf(Date);
    expect(request.updated_at).toBeInstanceOf(Date);
  });
});