import { db } from '../db';
import { departmentsTable, positionsTable } from '../db/schema';
import { type Department, type Position } from '../schema';
import { eq, asc } from 'drizzle-orm';

export async function getDepartments(): Promise<Department[]> {
  try {
    const results = await db.select()
      .from(departmentsTable)
      .orderBy(asc(departmentsTable.name))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    throw error;
  }
}

export async function getPositions(): Promise<Position[]> {
  try {
    const results = await db.select()
      .from(positionsTable)
      .orderBy(asc(positionsTable.department_id), asc(positionsTable.name))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch positions:', error);
    throw error;
  }
}

export async function getPositionsByDepartment(departmentId: string): Promise<Position[]> {
  try {
    const results = await db.select()
      .from(positionsTable)
      .where(eq(positionsTable.department_id, departmentId))
      .orderBy(asc(positionsTable.name))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch positions by department:', error);
    throw error;
  }
}