import { z } from 'zod';

// Employee schema
export const employeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  department: z.string(),
  position: z.string(),
  created_at: z.coerce.date()
});

export type Employee = z.infer<typeof employeeSchema>;

// Leave request status enum
export const leaveStatusSchema = z.enum(['pending', 'approved', 'rejected']);
export type LeaveStatus = z.infer<typeof leaveStatusSchema>;

// Leave request schema
export const leaveRequestSchema = z.object({
  id: z.number(),
  employee_id: z.string(),
  employee_name: z.string(),
  employee_department: z.string(),
  employee_position: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string(),
  status: leaveStatusSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type LeaveRequest = z.infer<typeof leaveRequestSchema>;

// Input schema for creating leave requests
export const createLeaveRequestInputSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required'),
  employee_name: z.string().min(1, 'Employee name is required'),
  employee_department: z.string().min(1, 'Department is required'),
  employee_position: z.string().min(1, 'Position is required'),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string().min(1, 'Reason is required')
}).refine((data) => data.end_date >= data.start_date, {
  message: 'End date must be after or equal to start date',
  path: ['end_date']
});

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestInputSchema>;

// Input schema for updating leave request status
export const updateLeaveRequestStatusInputSchema = z.object({
  id: z.number(),
  status: leaveStatusSchema
});

export type UpdateLeaveRequestStatusInput = z.infer<typeof updateLeaveRequestStatusInputSchema>;

// Dashboard statistics schema
export const dashboardStatsSchema = z.object({
  total_requests: z.number(),
  pending_requests: z.number(),
  approved_requests: z.number(),
  rejected_requests: z.number(),
  total_employees: z.number()
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Department and position reference data
export const departmentSchema = z.object({
  id: z.string(),
  name: z.string()
});

export type Department = z.infer<typeof departmentSchema>;

export const positionSchema = z.object({
  id: z.string(),
  name: z.string(),
  department_id: z.string()
});

export type Position = z.infer<typeof positionSchema>;