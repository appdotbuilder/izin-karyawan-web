
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">
                        📊 Dashboard Sistem Izin Karyawan
                    </h1>
                    <p className="text-blue-100">
                        Kelola pengajuan izin dengan mudah dan efisien
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link
                        href="/"
                        className="group relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white hover:bg-gray-50 transition-colors p-6 flex flex-col justify-center items-center text-center"
                    >
                        <div className="text-4xl mb-3">📝</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Buat Pengajuan
                        </h3>
                        <p className="text-sm text-gray-600">
                            Ajukan izin cuti, sakit, atau keperluan pribadi
                        </p>
                    </Link>
                    
                    <Link
                        href="/leave-requests"
                        className="group relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white hover:bg-gray-50 transition-colors p-6 flex flex-col justify-center items-center text-center"
                    >
                        <div className="text-4xl mb-3">📋</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Lihat Pengajuan
                        </h3>
                        <p className="text-sm text-gray-600">
                            Kelola dan monitor semua pengajuan izin
                        </p>
                    </Link>
                    
                    <div className="group relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white p-6 flex flex-col justify-center items-center text-center">
                        <div className="text-4xl mb-3">📊</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Statistik
                        </h3>
                        <p className="text-sm text-gray-600">
                            Lihat laporan dan analisis pengajuan
                        </p>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border bg-white p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            🔥 Aktivitas Terbaru
                        </h2>
                        <Link
                            href="/leave-requests"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Lihat Semua →
                        </Link>
                    </div>
                    
                    <div className="space-y-4">
                        {/* Placeholder for recent activities */}
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                📝
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    Mulai dengan membuat pengajuan izin pertama Anda
                                </p>
                                <p className="text-xs text-gray-500">
                                    Klik "Buat Pengajuan" untuk memulai
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                📊
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    Sistem siap digunakan
                                </p>
                                <p className="text-xs text-gray-500">
                                    Semua fitur telah dikonfigurasi dengan baik
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
