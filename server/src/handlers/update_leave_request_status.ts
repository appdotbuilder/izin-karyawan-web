import { db } from '../db';
import { leaveRequestsTable } from '../db/schema';
import { type UpdateLeaveRequestStatusInput, type LeaveRequest } from '../schema';
import { eq } from 'drizzle-orm';

export async function updateLeaveRequestStatus(input: UpdateLeaveRequestStatusInput): Promise<LeaveRequest> {
  try {
    // Update the leave request status and updated_at timestamp
    const result = await db.update(leaveRequestsTable)
      .set({
        status: input.status,
        updated_at: new Date()
      })
      .where(eq(leaveRequestsTable.id, input.id))
      .returning()
      .execute();

    // Check if leave request was found and updated
    if (result.length === 0) {
      throw new Error(`Leave request with ID ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Leave request status update failed:', error);
    throw error;
  }
}