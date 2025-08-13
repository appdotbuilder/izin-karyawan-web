import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { employeesTable, leaveRequestsTable } from '../db/schema';
import { type CreateLeaveRequestInput } from '../schema';
import { createLeaveRequest } from '../handlers/create_leave_request';
import { eq } from 'drizzle-orm';

// Test input data
const testInput: CreateLeaveRequestInput = {
  employee_id: 'EMP001',
  employee_name: 'John Doe',
  employee_department: 'Engineering',
  employee_position: 'Software Developer',
  start_date: new Date('2024-01-15'),
  end_date: new Date('2024-01-20'),
  reason: 'Personal leave for family vacation'
};

describe('createLeaveRequest', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a leave request with new employee', async () => {
    const result = await createLeaveRequest(testInput);

    // Validate leave request fields
    expect(result.employee_id).toEqual('EMP001');
    expect(result.employee_name).toEqual('John Doe');
    expect(result.employee_department).toEqual('Engineering');
    expect(result.employee_position).toEqual('Software Developer');
    expect(result.start_date).toEqual(testInput.start_date);
    expect(result.end_date).toEqual(testInput.end_date);
    expect(result.reason).toEqual('Personal leave for family vacation');
    expect(result.status).toEqual('pending');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create employee record when employee does not exist', async () => {
    await createLeaveRequest(testInput);

    // Verify employee was created
    const employees = await db.select()
      .from(employeesTable)
      .where(eq(employeesTable.id, 'EMP001'))
      .execute();

    expect(employees).toHaveLength(1);
    expect(employees[0].id).toEqual('EMP001');
    expect(employees[0].name).toEqual('John Doe');
    expect(employees[0].department).toEqual('Engineering');
    expect(employees[0].position).toEqual('Software Developer');
    expect(employees[0].created_at).toBeInstanceOf(Date);
  });

  it('should save leave request to database', async () => {
    const result = await createLeaveRequest(testInput);

    // Verify leave request was saved
    const leaveRequests = await db.select()
      .from(leaveRequestsTable)
      .where(eq(leaveRequestsTable.id, result.id))
      .execute();

    expect(leaveRequests).toHaveLength(1);
    expect(leaveRequests[0].employee_id).toEqual('EMP001');
    expect(leaveRequests[0].employee_name).toEqual('John Doe');
    expect(leaveRequests[0].start_date).toEqual(testInput.start_date);
    expect(leaveRequests[0].end_date).toEqual(testInput.end_date);
    expect(leaveRequests[0].reason).toEqual(testInput.reason);
    expect(leaveRequests[0].status).toEqual('pending');
  });

  it('should not create duplicate employee when employee already exists', async () => {
    // Create employee first
    await db.insert(employeesTable)
      .values({
        id: 'EMP001',
        name: 'John Doe',
        department: 'Engineering',
        position: 'Software Developer'
      })
      .execute();

    // Create leave request
    await createLeaveRequest(testInput);

    // Verify only one employee record exists
    const employees = await db.select()
      .from(employeesTable)
      .where(eq(employeesTable.id, 'EMP001'))
      .execute();

    expect(employees).toHaveLength(1);
  });

  it('should create leave request for existing employee', async () => {
    // Create employee first
    await db.insert(employeesTable)
      .values({
        id: 'EMP001',
        name: 'John Doe',
        department: 'Engineering',
        position: 'Software Developer'
      })
      .execute();

    const result = await createLeaveRequest(testInput);

    // Verify leave request was created
    expect(result.employee_id).toEqual('EMP001');
    expect(result.status).toEqual('pending');
    expect(result.id).toBeDefined();
  });

  it('should handle multiple leave requests for same employee', async () => {
    // Create first leave request
    const result1 = await createLeaveRequest(testInput);

    // Create second leave request with different dates
    const secondInput: CreateLeaveRequestInput = {
      ...testInput,
      start_date: new Date('2024-02-01'),
      end_date: new Date('2024-02-05'),
      reason: 'Medical leave'
    };

    const result2 = await createLeaveRequest(secondInput);

    // Verify both requests exist
    const leaveRequests = await db.select()
      .from(leaveRequestsTable)
      .where(eq(leaveRequestsTable.employee_id, 'EMP001'))
      .execute();

    expect(leaveRequests).toHaveLength(2);
    expect(result1.id).not.toEqual(result2.id);
    
    // Verify employee exists only once
    const employees = await db.select()
      .from(employeesTable)
      .where(eq(employeesTable.id, 'EMP001'))
      .execute();

    expect(employees).toHaveLength(1);
  });

  it('should handle same-day leave requests', async () => {
    const singleDayInput: CreateLeaveRequestInput = {
      ...testInput,
      start_date: new Date('2024-01-15'),
      end_date: new Date('2024-01-15'),
      reason: 'Doctor appointment'
    };

    const result = await createLeaveRequest(singleDayInput);

    expect(result.start_date).toEqual(result.end_date);
    expect(result.reason).toEqual('Doctor appointment');
    expect(result.status).toEqual('pending');
  });

  it('should preserve date values correctly', async () => {
    const startDate = new Date('2024-03-10T00:00:00.000Z');
    const endDate = new Date('2024-03-15T00:00:00.000Z');
    
    const dateInput: CreateLeaveRequestInput = {
      ...testInput,
      start_date: startDate,
      end_date: endDate
    };

    const result = await createLeaveRequest(dateInput);

    expect(result.start_date).toEqual(startDate);
    expect(result.end_date).toEqual(endDate);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });
});