import { db } from '../db';
import { employeesTable, leaveRequestsTable } from '../db/schema';
import { type CreateLeaveRequestInput, type LeaveRequest } from '../schema';
import { eq } from 'drizzle-orm';

export const createLeaveRequest = async (input: CreateLeaveRequestInput): Promise<LeaveRequest> => {
  try {
    // Check if employee exists, create if not
    const existingEmployee = await db.select()
      .from(employeesTable)
      .where(eq(employeesTable.id, input.employee_id))
      .execute();

    if (existingEmployee.length === 0) {
      // Create employee record
      await db.insert(employeesTable)
        .values({
          id: input.employee_id,
          name: input.employee_name,
          department: input.employee_department,
          position: input.employee_position
        })
        .execute();
    }

    // Insert leave request
    const result = await db.insert(leaveRequestsTable)
      .values({
        employee_id: input.employee_id,
        employee_name: input.employee_name,
        employee_department: input.employee_department,
        employee_position: input.employee_position,
        start_date: input.start_date,
        end_date: input.end_date,
        reason: input.reason,
        status: 'pending'
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Leave request creation failed:', error);
    throw error;
  }
};