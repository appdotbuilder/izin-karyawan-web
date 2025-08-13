import { db } from '../db';
import { leaveRequestsTable } from '../db/schema';
import { type DashboardStats } from '../schema';
import { eq, count, countDistinct } from 'drizzle-orm';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total requests count
    const totalRequestsResult = await db.select({
      total: count(leaveRequestsTable.id)
    })
    .from(leaveRequestsTable)
    .execute();

    const total_requests = totalRequestsResult[0]?.total || 0;

    // Get counts by status
    const pendingResult = await db.select({
      count: count(leaveRequestsTable.id)
    })
    .from(leaveRequestsTable)
    .where(eq(leaveRequestsTable.status, 'pending'))
    .execute();

    const approvedResult = await db.select({
      count: count(leaveRequestsTable.id)
    })
    .from(leaveRequestsTable)
    .where(eq(leaveRequestsTable.status, 'approved'))
    .execute();

    const rejectedResult = await db.select({
      count: count(leaveRequestsTable.id)
    })
    .from(leaveRequestsTable)
    .where(eq(leaveRequestsTable.status, 'rejected'))
    .execute();

    // Get total unique employees who have made requests
    const totalEmployeesResult = await db.select({
      count: countDistinct(leaveRequestsTable.employee_id)
    })
    .from(leaveRequestsTable)
    .execute();

    const pending_requests = pendingResult[0]?.count || 0;
    const approved_requests = approvedResult[0]?.count || 0;
    const rejected_requests = rejectedResult[0]?.count || 0;
    const total_employees = totalEmployeesResult[0]?.count || 0;

    return {
      total_requests,
      pending_requests,
      approved_requests,
      rejected_requests,
      total_employees
    };
  } catch (error) {
    console.error('Dashboard stats retrieval failed:', error);
    throw error;
  }
};