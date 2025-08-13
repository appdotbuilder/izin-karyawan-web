import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { leaveRequestsTable } from '../db/schema';
import { type UpdateLeaveRequestStatusInput, type LeaveStatus } from '../schema';
import { updateLeaveRequestStatus } from '../handlers/update_leave_request_status';
import { eq } from 'drizzle-orm';

describe('updateLeaveRequestStatus', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper function to create a test leave request
  const createTestLeaveRequest = async () => {
    const result = await db.insert(leaveRequestsTable)
      .values({
        employee_id: 'EMP001',
        employee_name: 'John Doe',
        employee_department: 'Engineering',
        employee_position: 'Software Engineer',
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-01-17'),
        reason: 'Personal leave',
        status: 'pending'
      })
      .returning()
      .execute();
    
    return result[0];
  };

  it('should successfully update leave request status from pending to approved', async () => {
    // Create test leave request
    const leaveRequest = await createTestLeaveRequest();

    const input: UpdateLeaveRequestStatusInput = {
      id: leaveRequest.id,
      status: 'approved'
    };

    const result = await updateLeaveRequestStatus(input);

    // Verify the returned result
    expect(result.id).toEqual(leaveRequest.id);
    expect(result.status).toEqual('approved');
    expect(result.employee_id).toEqual('EMP001');
    expect(result.employee_name).toEqual('John Doe');
    expect(result.employee_department).toEqual('Engineering');
    expect(result.employee_position).toEqual('Software Engineer');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > leaveRequest.updated_at).toBe(true);
  });

  it('should successfully update leave request status from pending to rejected', async () => {
    // Create test leave request
    const leaveRequest = await createTestLeaveRequest();

    const input: UpdateLeaveRequestStatusInput = {
      id: leaveRequest.id,
      status: 'rejected'
    };

    const result = await updateLeaveRequestStatus(input);

    expect(result.id).toEqual(leaveRequest.id);
    expect(result.status).toEqual('rejected');
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > leaveRequest.updated_at).toBe(true);
  });

  it('should update the database record correctly', async () => {
    // Create test leave request
    const leaveRequest = await createTestLeaveRequest();

    const input: UpdateLeaveRequestStatusInput = {
      id: leaveRequest.id,
      status: 'approved'
    };

    await updateLeaveRequestStatus(input);

    // Verify the database was updated
    const updatedRecords = await db.select()
      .from(leaveRequestsTable)
      .where(eq(leaveRequestsTable.id, leaveRequest.id))
      .execute();

    expect(updatedRecords).toHaveLength(1);
    const updatedRecord = updatedRecords[0];
    expect(updatedRecord.status).toEqual('approved');
    expect(updatedRecord.updated_at).toBeInstanceOf(Date);
    expect(updatedRecord.updated_at > leaveRequest.updated_at).toBe(true);
  });

  it('should allow updating from approved back to pending', async () => {
    // Create test leave request and update it to approved first
    const leaveRequest = await createTestLeaveRequest();
    
    await db.update(leaveRequestsTable)
      .set({ status: 'approved' })
      .where(eq(leaveRequestsTable.id, leaveRequest.id))
      .execute();

    const input: UpdateLeaveRequestStatusInput = {
      id: leaveRequest.id,
      status: 'pending'
    };

    const result = await updateLeaveRequestStatus(input);

    expect(result.status).toEqual('pending');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should allow updating from rejected to approved', async () => {
    // Create test leave request and update it to rejected first
    const leaveRequest = await createTestLeaveRequest();
    
    await db.update(leaveRequestsTable)
      .set({ status: 'rejected' })
      .where(eq(leaveRequestsTable.id, leaveRequest.id))
      .execute();

    const input: UpdateLeaveRequestStatusInput = {
      id: leaveRequest.id,
      status: 'approved'
    };

    const result = await updateLeaveRequestStatus(input);

    expect(result.status).toEqual('approved');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should preserve all other fields when updating status', async () => {
    // Create test leave request
    const leaveRequest = await createTestLeaveRequest();

    const input: UpdateLeaveRequestStatusInput = {
      id: leaveRequest.id,
      status: 'approved'
    };

    const result = await updateLeaveRequestStatus(input);

    // All other fields should remain unchanged
    expect(result.employee_id).toEqual(leaveRequest.employee_id);
    expect(result.employee_name).toEqual(leaveRequest.employee_name);
    expect(result.employee_department).toEqual(leaveRequest.employee_department);
    expect(result.employee_position).toEqual(leaveRequest.employee_position);
    expect(result.start_date).toEqual(leaveRequest.start_date);
    expect(result.end_date).toEqual(leaveRequest.end_date);
    expect(result.reason).toEqual(leaveRequest.reason);
    expect(result.created_at).toEqual(leaveRequest.created_at);
    // Only status and updated_at should change
    expect(result.status).not.toEqual(leaveRequest.status);
    expect(result.updated_at).not.toEqual(leaveRequest.updated_at);
  });

  it('should throw error when leave request does not exist', async () => {
    const input: UpdateLeaveRequestStatusInput = {
      id: 999999, // Non-existent ID
      status: 'approved'
    };

    await expect(updateLeaveRequestStatus(input)).rejects.toThrow(/Leave request with ID 999999 not found/i);
  });

  it('should handle multiple leave requests independently', async () => {
    // Create multiple test leave requests
    const leaveRequest1 = await createTestLeaveRequest();
    
    const leaveRequest2 = await db.insert(leaveRequestsTable)
      .values({
        employee_id: 'EMP002',
        employee_name: 'Jane Smith',
        employee_department: 'Marketing',
        employee_position: 'Marketing Manager',
        start_date: new Date('2024-01-20'),
        end_date: new Date('2024-01-22'),
        reason: 'Vacation',
        status: 'pending'
      })
      .returning()
      .execute()
      .then(result => result[0]);

    // Update only the first leave request
    const input: UpdateLeaveRequestStatusInput = {
      id: leaveRequest1.id,
      status: 'approved'
    };

    await updateLeaveRequestStatus(input);

    // Verify first request was updated
    const updatedRecord1 = await db.select()
      .from(leaveRequestsTable)
      .where(eq(leaveRequestsTable.id, leaveRequest1.id))
      .execute()
      .then(results => results[0]);

    expect(updatedRecord1.status).toEqual('approved');

    // Verify second request was not affected
    const unchangedRecord2 = await db.select()
      .from(leaveRequestsTable)
      .where(eq(leaveRequestsTable.id, leaveRequest2.id))
      .execute()
      .then(results => results[0]);

    expect(unchangedRecord2.status).toEqual('pending');
    expect(unchangedRecord2.updated_at).toEqual(leaveRequest2.updated_at);
  });

  it('should work with all valid status enum values', async () => {
    const leaveRequest = await createTestLeaveRequest();

    // Test each valid status value
    const validStatuses: LeaveStatus[] = ['pending', 'approved', 'rejected'];

    for (const status of validStatuses) {
      const input: UpdateLeaveRequestStatusInput = {
        id: leaveRequest.id,
        status: status
      };

      const result = await updateLeaveRequestStatus(input);
      expect(result.status).toEqual(status);
    }
  });
});