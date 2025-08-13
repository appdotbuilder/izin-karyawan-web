import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { leaveRequestsTable } from '../db/schema';
import { getDashboardStats } from '../handlers/get_dashboard_stats';

describe('getDashboardStats', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return zero stats when no leave requests exist', async () => {
    const result = await getDashboardStats();

    expect(result.total_requests).toEqual(0);
    expect(result.pending_requests).toEqual(0);
    expect(result.approved_requests).toEqual(0);
    expect(result.rejected_requests).toEqual(0);
    expect(result.total_employees).toEqual(0);
  });

  it('should return correct stats for single leave request', async () => {
    // Create a test leave request
    await db.insert(leaveRequestsTable)
      .values({
        employee_id: 'EMP001',
        employee_name: 'John Doe',
        employee_department: 'Engineering',
        employee_position: 'Software Engineer',
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-01-17'),
        reason: 'Vacation',
        status: 'pending'
      })
      .execute();

    const result = await getDashboardStats();

    expect(result.total_requests).toEqual(1);
    expect(result.pending_requests).toEqual(1);
    expect(result.approved_requests).toEqual(0);
    expect(result.rejected_requests).toEqual(0);
    expect(result.total_employees).toEqual(1);
  });

  it('should correctly count requests by status', async () => {
    // Create multiple leave requests with different statuses
    await db.insert(leaveRequestsTable)
      .values([
        {
          employee_id: 'EMP001',
          employee_name: 'John Doe',
          employee_department: 'Engineering',
          employee_position: 'Software Engineer',
          start_date: new Date('2024-01-15'),
          end_date: new Date('2024-01-17'),
          reason: 'Vacation',
          status: 'pending'
        },
        {
          employee_id: 'EMP002',
          employee_name: 'Jane Smith',
          employee_department: 'Marketing',
          employee_position: 'Marketing Manager',
          start_date: new Date('2024-01-20'),
          end_date: new Date('2024-01-22'),
          reason: 'Personal',
          status: 'approved'
        },
        {
          employee_id: 'EMP003',
          employee_name: 'Bob Johnson',
          employee_department: 'HR',
          employee_position: 'HR Specialist',
          start_date: new Date('2024-01-25'),
          end_date: new Date('2024-01-26'),
          reason: 'Medical',
          status: 'rejected'
        },
        {
          employee_id: 'EMP001',
          employee_name: 'John Doe',
          employee_department: 'Engineering',
          employee_position: 'Software Engineer',
          start_date: new Date('2024-02-01'),
          end_date: new Date('2024-02-03'),
          reason: 'Conference',
          status: 'approved'
        }
      ])
      .execute();

    const result = await getDashboardStats();

    expect(result.total_requests).toEqual(4);
    expect(result.pending_requests).toEqual(1);
    expect(result.approved_requests).toEqual(2);
    expect(result.rejected_requests).toEqual(1);
    expect(result.total_employees).toEqual(3); // 3 unique employees
  });

  it('should count unique employees correctly with multiple requests per employee', async () => {
    // Create multiple requests for the same employees
    await db.insert(leaveRequestsTable)
      .values([
        {
          employee_id: 'EMP001',
          employee_name: 'John Doe',
          employee_department: 'Engineering',
          employee_position: 'Software Engineer',
          start_date: new Date('2024-01-15'),
          end_date: new Date('2024-01-17'),
          reason: 'Vacation',
          status: 'pending'
        },
        {
          employee_id: 'EMP001',
          employee_name: 'John Doe',
          employee_department: 'Engineering',
          employee_position: 'Software Engineer',
          start_date: new Date('2024-02-15'),
          end_date: new Date('2024-02-17'),
          reason: 'Personal',
          status: 'approved'
        },
        {
          employee_id: 'EMP002',
          employee_name: 'Jane Smith',
          employee_department: 'Marketing',
          employee_position: 'Marketing Manager',
          start_date: new Date('2024-01-20'),
          end_date: new Date('2024-01-22'),
          reason: 'Medical',
          status: 'rejected'
        }
      ])
      .execute();

    const result = await getDashboardStats();

    expect(result.total_requests).toEqual(3);
    expect(result.pending_requests).toEqual(1);
    expect(result.approved_requests).toEqual(1);
    expect(result.rejected_requests).toEqual(1);
    expect(result.total_employees).toEqual(2); // Only 2 unique employees despite 3 requests
  });

  it('should handle large dataset correctly', async () => {
    // Create many requests to test performance and correctness
    const requests = [];
    for (let i = 1; i <= 50; i++) {
      const statuses = ['pending', 'approved', 'rejected'] as const;
      const status = statuses[i % 3];
      
      requests.push({
        employee_id: `EMP${String(i % 10).padStart(3, '0')}`, // 10 unique employees
        employee_name: `Employee ${i % 10}`,
        employee_department: i % 2 === 0 ? 'Engineering' : 'Marketing',
        employee_position: i % 2 === 0 ? 'Engineer' : 'Manager',
        start_date: new Date(`2024-01-${String(i % 28 + 1).padStart(2, '0')}`),
        end_date: new Date(`2024-01-${String((i % 28 + 1) + 1).padStart(2, '0')}`),
        reason: 'Test reason',
        status
      });
    }

    await db.insert(leaveRequestsTable)
      .values(requests)
      .execute();

    const result = await getDashboardStats();

    expect(result.total_requests).toEqual(50);
    expect(result.pending_requests).toBeGreaterThanOrEqual(16); // ~17 pending (50/3)
    expect(result.approved_requests).toBeGreaterThanOrEqual(16); // ~17 approved (50/3)
    expect(result.rejected_requests).toBeGreaterThanOrEqual(16); // ~16 rejected (50/3)
    expect(result.total_employees).toEqual(10); // 10 unique employees
    
    // Verify all counts add up
    const statusSum = result.pending_requests + result.approved_requests + result.rejected_requests;
    expect(statusSum).toEqual(50);
  });

  it('should handle edge case with empty database gracefully', async () => {
    // This test ensures the handler doesn't crash on empty tables
    const result = await getDashboardStats();

    expect(typeof result.total_requests).toBe('number');
    expect(typeof result.pending_requests).toBe('number');
    expect(typeof result.approved_requests).toBe('number');
    expect(typeof result.rejected_requests).toBe('number');
    expect(typeof result.total_employees).toBe('number');
    
    expect(result.total_requests).toEqual(0);
    expect(result.pending_requests).toEqual(0);
    expect(result.approved_requests).toEqual(0);
    expect(result.rejected_requests).toEqual(0);
    expect(result.total_employees).toEqual(0);
  });
});