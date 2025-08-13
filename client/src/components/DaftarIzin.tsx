import React, { useState } from 'react';

interface LeaveRequest {
  id: number;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

const DaftarIzin: React.FC = () => {
  // Static leave request data
  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employeeName: 'Ahmad Wijaya',
      department: 'IT',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      status: 'approved',
      reason: 'Cuti tahunan'
    },
    {
      id: 2,
      employeeName: 'Siti Nurhaliza',
      department: 'HR',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      status: 'pending',
      reason: 'Keperluan keluarga'
    },
    {
      id: 3,
      employeeName: 'Budi Santoso',
      department: 'Finance',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      status: 'rejected',
      reason: 'Cuti sakit'
    },
    {
      id: 4,
      employeeName: 'Diana Sari',
      department: 'Marketing',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      status: 'approved',
      reason: 'Cuti melahirkan'
    },
    {
      id: 5,
      employeeName: 'Eko Prasetyo',
      department: 'Operations',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      status: 'pending',
      reason: 'Liburan keluarga'
    },
    {
      id: 6,
      employeeName: 'Fatima Zahra',
      department: 'IT',
      startDate: '2024-01-18',
      endDate: '2024-01-19',
      status: 'approved',
      reason: 'Keperluan pribadi'
    }
  ]);

  const getStatusBadge = (status: LeaveRequest['status']) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved':
        return 'Disetujui';
      case 'rejected':
        return 'Ditolak';
      case 'pending':
        return 'Menunggu';
      default:
        return status;
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    
    if (startDate === endDate) {
      return start.toLocaleDateString('id-ID', options);
    }
    
    return `${start.toLocaleDateString('id-ID', options)} - ${end.toLocaleDateString('id-ID', options)}`;
  };

  const handleSendWA = (employeeName: string, status: string) => {
    console.log(`Sending WhatsApp to ${employeeName} - Status: ${status}`);
    alert(`WhatsApp akan dikirim ke ${employeeName}\nStatus: ${getStatusText(status as LeaveRequest['status'])}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daftar Permohonan Cuti</h1>
          <p className="mt-2 text-gray-600">Kelola dan pantau status permohonan cuti karyawan</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="mr-2">+</span>
            Tambah Cuti Baru
          </button>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600">⏳</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">Menunggu Persetujuan</p>
              <p className="text-2xl font-bold text-yellow-900">
                {leaveRequests.filter(req => req.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-green-600">✅</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Disetujui</p>
              <p className="text-2xl font-bold text-green-900">
                {leaveRequests.filter(req => req.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600">❌</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">Ditolak</p>
              <p className="text-2xl font-bold text-red-900">
                {leaveRequests.filter(req => req.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Karyawan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departemen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keterangan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.employeeName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateRange(request.startDate, request.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(request.status)}>
                      {getStatusText(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={request.reason}>
                      {request.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleSendWA(request.employeeName, request.status)}
                      className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <span className="mr-1">📱</span>
                      Send WA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State (if no data) */}
      {leaveRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada permohonan cuti</h3>
          <p className="text-gray-500">Permohonan cuti akan muncul di sini setelah diajukan</p>
        </div>
      )}
    </div>
  );
};

export default DaftarIzin;