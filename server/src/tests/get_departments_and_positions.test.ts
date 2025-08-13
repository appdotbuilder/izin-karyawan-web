import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { departmentsTable, positionsTable } from '../db/schema';
import { getDepartments, getPositions, getPositionsByDepartment } from '../handlers/get_departments_and_positions';

describe('getDepartments', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no departments exist', async () => {
    const result = await getDepartments();
    expect(result).toEqual([]);
  });

  it('should return all departments ordered by name', async () => {
    // Insert test departments in non-alphabetical order
    await db.insert(departmentsTable).values([
      { id: 'DEPT003', name: 'Marketing' },
      { id: 'DEPT001', name: 'Engineering' },
      { id: 'DEPT002', name: 'Human Resources' }
    ]).execute();

    const result = await getDepartments();

    expect(result).toHaveLength(3);
    expect(result[0].name).toEqual('Engineering');
    expect(result[1].name).toEqual('Human Resources');
    expect(result[2].name).toEqual('Marketing');
    
    // Verify all fields are present
    expect(result[0].id).toEqual('DEPT001');
    expect(result[0].name).toEqual('Engineering');
  });

  it('should handle single department', async () => {
    await db.insert(departmentsTable).values({
      id: 'DEPT001',
      name: 'Engineering'
    }).execute();

    const result = await getDepartments();

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual('DEPT001');
    expect(result[0].name).toEqual('Engineering');
  });
});

describe('getPositions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no positions exist', async () => {
    const result = await getPositions();
    expect(result).toEqual([]);
  });

  it('should return all positions ordered by department_id then name', async () => {
    // Insert test positions in mixed order
    await db.insert(positionsTable).values([
      { id: 'POS003', name: 'Software Engineer', department_id: 'DEPT002' },
      { id: 'POS001', name: 'Manager', department_id: 'DEPT001' },
      { id: 'POS004', name: 'Senior Software Engineer', department_id: 'DEPT002' },
      { id: 'POS002', name: 'Director', department_id: 'DEPT001' }
    ]).execute();

    const result = await getPositions();

    expect(result).toHaveLength(4);
    
    // Should be ordered by department_id first, then by name
    expect(result[0].department_id).toEqual('DEPT001');
    expect(result[0].name).toEqual('Director'); // Director comes before Manager alphabetically
    expect(result[1].department_id).toEqual('DEPT001');
    expect(result[1].name).toEqual('Manager');
    expect(result[2].department_id).toEqual('DEPT002');
    expect(result[2].name).toEqual('Senior Software Engineer');
    expect(result[3].department_id).toEqual('DEPT002');
    expect(result[3].name).toEqual('Software Engineer');
    
    // Verify all fields are present
    expect(result[0].id).toBeDefined();
    expect(result[0].name).toBeDefined();
    expect(result[0].department_id).toBeDefined();
  });

  it('should handle single position', async () => {
    await db.insert(positionsTable).values({
      id: 'POS001',
      name: 'Manager',
      department_id: 'DEPT001'
    }).execute();

    const result = await getPositions();

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual('POS001');
    expect(result[0].name).toEqual('Manager');
    expect(result[0].department_id).toEqual('DEPT001');
  });
});

describe('getPositionsByDepartment', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no positions exist for department', async () => {
    const result = await getPositionsByDepartment('DEPT001');
    expect(result).toEqual([]);
  });

  it('should return only positions for specified department ordered by name', async () => {
    // Insert positions for multiple departments
    await db.insert(positionsTable).values([
      { id: 'POS001', name: 'Software Engineer', department_id: 'DEPT001' },
      { id: 'POS002', name: 'Manager', department_id: 'DEPT002' },
      { id: 'POS003', name: 'Senior Software Engineer', department_id: 'DEPT001' },
      { id: 'POS004', name: 'Director', department_id: 'DEPT001' },
      { id: 'POS005', name: 'HR Specialist', department_id: 'DEPT002' }
    ]).execute();

    const result = await getPositionsByDepartment('DEPT001');

    expect(result).toHaveLength(3);
    
    // Should be ordered by name alphabetically
    expect(result[0].name).toEqual('Director');
    expect(result[1].name).toEqual('Senior Software Engineer');
    expect(result[2].name).toEqual('Software Engineer');
    
    // All should belong to DEPT001
    result.forEach(position => {
      expect(position.department_id).toEqual('DEPT001');
    });
    
    // Verify all fields are present
    expect(result[0].id).toBeDefined();
    expect(result[0].name).toBeDefined();
    expect(result[0].department_id).toEqual('DEPT001');
  });

  it('should return empty array for non-existent department', async () => {
    // Insert some positions for other departments
    await db.insert(positionsTable).values([
      { id: 'POS001', name: 'Software Engineer', department_id: 'DEPT001' },
      { id: 'POS002', name: 'Manager', department_id: 'DEPT002' }
    ]).execute();

    const result = await getPositionsByDepartment('DEPT999');
    expect(result).toEqual([]);
  });

  it('should handle single position for department', async () => {
    await db.insert(positionsTable).values({
      id: 'POS001',
      name: 'Manager',
      department_id: 'DEPT001'
    }).execute();

    const result = await getPositionsByDepartment('DEPT001');

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual('POS001');
    expect(result[0].name).toEqual('Manager');
    expect(result[0].department_id).toEqual('DEPT001');
  });

  it('should filter correctly with similar department IDs', async () => {
    // Test edge case with similar department IDs
    await db.insert(positionsTable).values([
      { id: 'POS001', name: 'Position A', department_id: 'DEPT1' },
      { id: 'POS002', name: 'Position B', department_id: 'DEPT10' },
      { id: 'POS003', name: 'Position C', department_id: 'DEPT1' }
    ]).execute();

    const result = await getPositionsByDepartment('DEPT1');

    expect(result).toHaveLength(2);
    expect(result[0].name).toEqual('Position A');
    expect(result[1].name).toEqual('Position C');
    
    // Ensure no positions from DEPT10 are included
    result.forEach(position => {
      expect(position.department_id).toEqual('DEPT1');
    });
  });
});