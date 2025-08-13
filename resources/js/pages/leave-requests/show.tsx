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
    updated_at: string;
}

interface Props {
    leave_request: LeaveRequest;
    [key: string]: unknown;
}

export default function LeaveRequestShow({ leave_request }: Props) {
    const getStatusBadge = (status: string) => {
        const baseClasses = "px-4 py-2 text-sm font-medium rounded-full";
        
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
                return '⏳ Menunggu Persetujuan';
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

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateDuration = () => {
        const start = new Date(leave_request.start_date);
        const end = new Date(leave_request.end_date);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const getLeaveTypeIcon = (type: string) => {
        switch (type) {
            case 'Cuti':
                return '🏖️';
            case 'Sakit':
                return '🤒';
            case 'Izin Pribadi':
                return '👨‍👩‍👧‍👦';
            default:
                return '📝';
        }
    };

    return (
        <AppShell>
            <Head title={`📋 Pengajuan Izin - ${leave_request.employee_name}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href={route('leave-requests.index')}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-2"
                        >
                            ← Kembali ke Daftar
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📋 Detail Pengajuan Izin
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Pengajuan #{leave_request.id}
                        </p>
                    </div>
                    <div>
                        <span className={getStatusBadge(leave_request.status)}>
                            {getStatusText(leave_request.status)}
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Employee Information */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                👤 Informasi Karyawan
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Nama Lengkap
                                    </label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">
                                        {leave_request.employee_name}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Departemen
                                    </label>
                                    <p className="mt-1 text-lg text-gray-900">
                                        🏢 {leave_request.department}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-500">
                                        Jabatan
                                    </label>
                                    <p className="mt-1 text-lg text-gray-900">
                                        💼 {leave_request.position}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Leave Details */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                📅 Detail Izin
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Tanggal Mulai
                                    </label>
                                    <p className="mt-1 text-lg text-gray-900">
                                        {formatDate(leave_request.start_date)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Tanggal Selesai
                                    </label>
                                    <p className="mt-1 text-lg text-gray-900">
                                        {formatDate(leave_request.end_date)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Durasi
                                    </label>
                                    <p className="mt-1 text-lg font-semibold text-blue-600">
                                        ⏱️ {calculateDuration()} hari
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Jenis Izin
                                    </label>
                                    <p className="mt-1 text-lg text-gray-900">
                                        {getLeaveTypeIcon(leave_request.leave_type)} {leave_request.leave_type}
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Alasan
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-900 leading-relaxed">
                                        {leave_request.reason}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Timeline & Actions */}
                    <div className="space-y-6">
                        {/* Status Timeline */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                📊 Status Timeline
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Pengajuan Dibuat
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDateTime(leave_request.created_at)}
                                        </p>
                                    </div>
                                </div>
                                
                                {leave_request.status !== 'pending' && (
                                    <div className="flex items-start space-x-3">
                                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                            leave_request.status === 'approved' ? 'bg-green-400' : 'bg-red-400'
                                        }`}></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {leave_request.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatDateTime(leave_request.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                {leave_request.status === 'pending' && (
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Menunggu Persetujuan
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Sedang dalam proses review
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">
                                ⚡ Aksi Cepat
                            </h2>
                            <div className="space-y-3">
                                <Link
                                    href="/"
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    📝 Buat Pengajuan Baru
                                </Link>
                                <Link
                                    href={route('leave-requests.index')}
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    📋 Lihat Semua Pengajuan
                                </Link>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                            <h3 className="text-lg font-medium mb-2">
                                📈 Ringkasan
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>ID Pengajuan:</span>
                                    <span className="font-mono">#{leave_request.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Durasi Izin:</span>
                                    <span className="font-semibold">{calculateDuration()} hari</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="font-semibold capitalize">
                                        {leave_request.status === 'pending' && 'Menunggu'}
                                        {leave_request.status === 'approved' && 'Disetujui'}
                                        {leave_request.status === 'rejected' && 'Ditolak'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}