import { db } from '../db';
import { leaveRequestsTable } from '../db/schema';
import { type LeaveRequest } from '../schema';
import { eq, desc } from 'drizzle-orm';

export async function getLeaveRequests(): Promise<LeaveRequest[]> {
  try {
    const results = await db.select()
      .from(leaveRequestsTable)
      .orderBy(desc(leaveRequestsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch leave requests:', error);
    throw error;
  }
}

export async function getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
  try {
    const results = await db.select()
      .from(leaveRequestsTable)
      .where(eq(leaveRequestsTable.employee_id, employeeId))
      .orderBy(desc(leaveRequestsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch leave requests for employee:', error);
    throw error;
  }
}