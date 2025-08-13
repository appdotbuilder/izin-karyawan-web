import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

type LeaveStatus = 'pending' | 'approved' | 'rejected';

interface LeaveRequest {
  id: number;
  employee_id: string;
  employee_name: string;
  employee_department: string;
  employee_position: string;
  start_date: Date;
  end_date: Date;
  reason: string;
  status: LeaveStatus;
  created_at: Date;
  updated_at: Date;
}

interface LeaveRequestCardProps {
  request: LeaveRequest;
  onStatusUpdate?: (requestId: number, newStatus: LeaveStatus) => void;
}

export function LeaveRequestCard({ request, onStatusUpdate }: LeaveRequestCardProps) {
  const getStatusColor = (status: LeaveStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateDays = (startDate: Date, endDate: Date) => {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{request.employee_name}</CardTitle>
            <CardDescription>
              {request.employee_position} • {request.employee_department}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`${getStatusColor(request.status)} flex items-center space-x-1`}>
              {getStatusIcon(request.status)}
              <span className="capitalize">{request.status}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Leave Dates</Label>
            <p className="text-sm text-gray-600">
              {request.start_date.toLocaleDateString()} - {request.end_date.toLocaleDateString()}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Duration</Label>
            <p className="text-sm text-gray-600">
              {calculateDays(request.start_date, request.end_date)} days
            </p>
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium">Reason</Label>
          <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Submitted: {request.created_at.toLocaleDateString()} • 
            Updated: {request.updated_at.toLocaleDateString()}
          </div>
          
          {request.status === 'pending' && onStatusUpdate && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-300 hover:bg-green-50"
                onClick={() => onStatusUpdate(request.id, 'approved')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => onStatusUpdate(request.id, 'rejected')}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}