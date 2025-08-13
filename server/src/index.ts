import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createLeaveRequestInputSchema,
  updateLeaveRequestStatusInputSchema
} from './schema';

// Import handlers
import { createLeaveRequest } from './handlers/create_leave_request';
import { getLeaveRequests, getLeaveRequestsByEmployee } from './handlers/get_leave_requests';
import { updateLeaveRequestStatus } from './handlers/update_leave_request_status';
import { getDashboardStats } from './handlers/get_dashboard_stats';
import {
  getDepartments,
  getPositions,
  getPositionsByDepartment
} from './handlers/get_departments_and_positions';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Leave request management
  createLeaveRequest: publicProcedure
    .input(createLeaveRequestInputSchema)
    .mutation(({ input }) => createLeaveRequest(input)),

  getLeaveRequests: publicProcedure
    .query(() => getLeaveRequests()),

  getLeaveRequestsByEmployee: publicProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(({ input }) => getLeaveRequestsByEmployee(input.employeeId)),

  updateLeaveRequestStatus: publicProcedure
    .input(updateLeaveRequestStatusInputSchema)
    .mutation(({ input }) => updateLeaveRequestStatus(input)),

  // Dashboard statistics
  getDashboardStats: publicProcedure
    .query(() => getDashboardStats()),

  // Reference data for forms
  getDepartments: publicProcedure
    .query(() => getDepartments()),

  getPositions: publicProcedure
    .query(() => getPositions()),

  getPositionsByDepartment: publicProcedure
    .input(z.object({ departmentId: z.string() }))
    .query(({ input }) => getPositionsByDepartment(input.departmentId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Employee Leave Request System TRPC server listening at port: ${port}`);
}

start();