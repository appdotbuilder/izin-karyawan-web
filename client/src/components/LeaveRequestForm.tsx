import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  created_at: Date;
}

interface CreateLeaveRequestInput {
  employee_id: string;
  employee_name: string;
  employee_department: string;
  employee_position: string;
  start_date: string;
  end_date: string;
  reason: string;
}

interface LeaveRequestFormProps {
  employees: Employee[];
  onSubmit: (formData: CreateLeaveRequestInput) => void;
}

export function LeaveRequestForm({ employees, onSubmit }: LeaveRequestFormProps) {
  const [formData, setFormData] = useState<CreateLeaveRequestInput>({
    employee_id: '',
    employee_name: '',
    employee_department: '',
    employee_position: '',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employee_id: employeeId,
        employee_name: employee.name,
        employee_department: employee.department,
        employee_position: employee.position
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.employee_id || !formData.start_date || !formData.end_date || !formData.reason.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate < startDate) {
      alert('End date must be after or equal to start date');
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      employee_id: '',
      employee_name: '',
      employee_department: '',
      employee_position: '',
      start_date: '',
      end_date: '',
      reason: ''
    });
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      employee_name: '',
      employee_department: '',
      employee_position: '',
      start_date: '',
      end_date: '',
      reason: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <span>Submit Leave Request</span>
        </CardTitle>
        <CardDescription>
          Fill out the form below to submit a new leave request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee *</Label>
              <Select value={formData.employee_id} onValueChange={handleEmployeeSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Position</Label>
              <Input value={formData.employee_position} disabled className="bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date *</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.start_date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData(prev => ({ ...prev, start_date: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date *</Label>
              <Input
                id="end-date"
                type="date"
                value={formData.end_date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData(prev => ({ ...prev, end_date: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave *</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed reason for your leave request..."
              value={formData.reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData(prev => ({ ...prev, reason: e.target.value }))
              }
              className="min-h-20"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}