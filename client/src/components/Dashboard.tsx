import React, { useState } from 'react';

interface DashboardStats {
  totalLeavesThisMonth: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  pendingLeaves: number;
}

const Dashboard: React.FC = () => {
  // Static dashboard statistics
  const [stats] = useState<DashboardStats>({
    totalLeavesThisMonth: 24,
    approvedLeaves: 18,
    rejectedLeaves: 3,
    pendingLeaves: 3
  });

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: string;
    bgColor: string;
    textColor: string;
  }> = ({ title, value, icon, bgColor, textColor }) => (
    <div className={`${bgColor} rounded-lg shadow-md p-6 border-l-4 ${textColor}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`text-2xl ${textColor}`}>{icon}</div>
        </div>
        <div className="ml-4 flex-1">
          <div className="text-sm font-medium text-gray-600">{title}</div>
          <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Ringkasan data cuti karyawan bulan ini</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cuti Bulan Ini"
          value={stats.totalLeavesThisMonth}
          icon="📊"
          bgColor="bg-blue-50"
          textColor="border-blue-400 text-blue-600"
        />
        <StatCard
          title="Cuti Disetujui"
          value={stats.approvedLeaves}
          icon="✅"
          bgColor="bg-green-50"
          textColor="border-green-400 text-green-600"
        />
        <StatCard
          title="Cuti Ditolak"
          value={stats.rejectedLeaves}
          icon="❌"
          bgColor="bg-red-50"
          textColor="border-red-400 text-red-600"
        />
        <StatCard
          title="Menunggu Persetujuan"
          value={stats.pendingLeaves}
          icon="⏳"
          bgColor="bg-yellow-50"
          textColor="border-yellow-400 text-yellow-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <h3 className="text-lg font-medium">Ajukan Cuti Baru</h3>
            <p className="text-blue-100 text-sm mt-1">Buat permohonan cuti untuk karyawan</p>
            <div className="mt-3">
              <span className="inline-flex items-center text-sm font-medium text-white hover:text-blue-100 cursor-pointer">
                Mulai →
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <h3 className="text-lg font-medium">Lihat Semua Cuti</h3>
            <p className="text-green-100 text-sm mt-1">Kelola dan review permohonan cuti</p>
            <div className="mt-3">
              <span className="inline-flex items-center text-sm font-medium text-white hover:text-green-100 cursor-pointer">
                Lihat →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Aktivitas Terkini</h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 text-green-500">✅</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Cuti Ahmad Wijaya disetujui</p>
              <p className="text-xs text-gray-500">2 jam yang lalu</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 text-blue-500">📝</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Permohonan cuti baru dari Siti Nurhaliza</p>
              <p className="text-xs text-gray-500">4 jam yang lalu</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 text-red-500">❌</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Cuti Budi Santoso ditolak</p>
              <p className="text-xs text-gray-500">1 hari yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;