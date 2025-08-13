import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface LeaveRequest {
    id: number;
    employee_name: string;
    department: string;
    position: string;
    start_date: string;
    end_date: string;
    leave_type: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface PaginatedLeaveRequests {
    data: LeaveRequest[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    leave_requests: PaginatedLeaveRequests;
    [key: string]: unknown;
}

export default function LeaveRequestsIndex({ leave_requests }: Props) {
    const getStatusBadge = (status: string) => {
        const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
        
        switch (status) {
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return '⏳ Menunggu';
            case 'approved':
                return '✅ Disetujui';
            case 'rejected':
                return '❌ Ditolak';
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AppShell>
            <Head title="📋 Daftar Pengajuan Izin" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📋 Daftar Pengajuan Izin
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Kelola semua pengajuan izin karyawan
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        ➕ Buat Pengajuan Baru
                    </Link>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    {leave_requests.data.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Belum ada pengajuan izin
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Mulai dengan membuat pengajuan izin pertama
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Buat Pengajuan
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Karyawan
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Departemen/Jabatan
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jenis Izin
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {leave_requests.data.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {request.employee_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Dibuat {formatDate(request.created_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {request.department}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {request.position}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div>{formatDate(request.start_date)}</div>
                                                    <div className="text-gray-500">
                                                        s/d {formatDate(request.end_date)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {request.leave_type === 'Cuti' && '🏖️ Cuti'}
                                                        {request.leave_type === 'Sakit' && '🤒 Sakit'}
                                                        {request.leave_type === 'Izin Pribadi' && '👨‍👩‍👧‍👦 Izin Pribadi'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={getStatusBadge(request.status)}>
                                                        {getStatusText(request.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        href={route('leave-requests.show', request.id)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    >
                                                        Lihat Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {leave_requests.last_page > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {leave_requests.prev_page_url && (
                                            <Link
                                                href={leave_requests.prev_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Sebelumnya
                                            </Link>
                                        )}
                                        {leave_requests.next_page_url && (
                                            <Link
                                                href={leave_requests.next_page_url}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Selanjutnya
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Menampilkan{' '}
                                                <span className="font-medium">{leave_requests.from}</span>
                                                {' '}sampai{' '}
                                                <span className="font-medium">{leave_requests.to}</span>
                                                {' '}dari{' '}
                                                <span className="font-medium">{leave_requests.total}</span>
                                                {' '}hasil
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                {leave_requests.prev_page_url && (
                                                    <Link
                                                        href={leave_requests.prev_page_url}
                                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                    >
                                                        ←
                                                    </Link>
                                                )}
                                                {leave_requests.next_page_url && (
                                                    <Link
                                                        href={leave_requests.next_page_url}
                                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                    >
                                                        →
                                                    </Link>
                                                )}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppShell>
    );
}