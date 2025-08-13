import { serial, text, pgTable, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Define leave status enum
export const leaveStatusEnum = pgEnum('leave_status', ['pending', 'approved', 'rejected']);

// Employees table
export const employeesTable = pgTable('employees', {
  id: text('id').primaryKey(), // Employee ID as string (e.g., EMP001)
  name: text('name').notNull(),
  department: text('department').notNull(),
  position: text('position').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Leave requests table
export const leaveRequestsTable = pgTable('leave_requests', {
  id: serial('id').primaryKey(),
  employee_id: text('employee_id').notNull(),
  employee_name: text('employee_name').notNull(), // Denormalized for easier queries
  employee_department: text('employee_department').notNull(), // Denormalized for easier queries
  employee_position: text('employee_position').notNull(), // Denormalized for easier queries
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  reason: text('reason').notNull(),
  status: leaveStatusEnum('status').default('pending').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Departments reference table
export const departmentsTable = pgTable('departments', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique()
});

// Positions reference table
export const positionsTable = pgTable('positions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  department_id: text('department_id').notNull()
});

// TypeScript types for the table schemas
export type Employee = typeof employeesTable.$inferSelect;
export type NewEmployee = typeof employeesTable.$inferInsert;

export type LeaveRequest = typeof leaveRequestsTable.$inferSelect;
export type NewLeaveRequest = typeof leaveRequestsTable.$inferInsert;

export type Department = typeof departmentsTable.$inferSelect;
export type NewDepartment = typeof departmentsTable.$inferInsert;

export type Position = typeof positionsTable.$inferSelect;
export type NewPosition = typeof positionsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  employees: employeesTable,
  leaveRequests: leaveRequestsTable,
  departments: departmentsTable,
  positions: positionsTable
};