import { type SharedData } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Welcome() {
    const { auth, flash } = usePage<SharedData & { flash: { success?: string } }>().props;

    const { data, setData, post, processing, errors } = useForm({
        employee_name: '',
        department: '',
        position: '',
        start_date: '',
        end_date: '',
        leave_type: '',
        reason: ''
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        post(route('leave-requests.store'));
    };

    return (
        <>
            <Head title="📝 Pengajuan Izin Karyawan">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gray-100 py-8 px-4">
                {/* Navigation */}
                <header className="mb-8 flex justify-center">
                    <nav className="flex items-center justify-end gap-4 w-full max-w-2xl">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Main Content */}
                <div className="flex justify-center items-center">
                    <div className="w-full max-w-2xl">
                        {/* Hero Section */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                📝 Sistem Pengajuan Izin Karyawan
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                Ajukan izin cuti, sakit, atau keperluan pribadi dengan mudah dan terstruktur
                            </p>
                            
                            {/* Features */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="text-2xl mb-2">📅</div>
                                    <h3 className="font-semibold text-gray-900">Mudah Digunakan</h3>
                                    <p className="text-sm text-gray-600">Form sederhana dan intuitif</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="text-2xl mb-2">⚡</div>
                                    <h3 className="font-semibold text-gray-900">Proses Cepat</h3>
                                    <p className="text-sm text-gray-600">Pengajuan dalam hitungan menit</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="text-2xl mb-2">📊</div>
                                    <h3 className="font-semibold text-gray-900">Terorganisir</h3>
                                    <p className="text-sm text-gray-600">Data tersimpan dengan rapi</p>
                                </div>
                            </div>
                        </div>

                        {/* Success Message */}
                        {flash?.success && (
                            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="text-green-400 mr-3">
                                        ✅
                                    </div>
                                    <div>
                                        <p className="text-green-800 font-medium">
                                            {flash.success}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leave Request Form */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Formulir Pengajuan Izin
                                </h2>
                                <p className="text-gray-600">
                                    Lengkapi semua informasi yang diperlukan
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Employee Name */}
                                <div>
                                    <label htmlFor="employee_name" className="block text-sm font-medium text-gray-700 mb-2">
                                        👤 Nama Karyawan
                                    </label>
                                    <input
                                        id="employee_name"
                                        type="text"
                                        value={data.employee_name}
                                        onChange={e => setData('employee_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                    {errors.employee_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.employee_name}</p>
                                    )}
                                </div>

                                {/* Department */}
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                        🏢 Departemen
                                    </label>
                                    <select
                                        id="department"
                                        value={data.department}
                                        onChange={e => setData('department', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    >
                                        <option value="">Pilih Departemen</option>
                                        <option value="HR">Human Resources</option>
                                        <option value="IT">Information Technology</option>
                                        <option value="Finance">Keuangan</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Operations">Operasional</option>
                                        <option value="Sales">Penjualan</option>
                                    </select>
                                    {errors.department && (
                                        <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                                    )}
                                </div>

                                {/* Position */}
                                <div>
                                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                                        💼 Jabatan
                                    </label>
                                    <select
                                        id="position"
                                        value={data.position}
                                        onChange={e => setData('position', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    >
                                        <option value="">Pilih Jabatan</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="Team Lead">Team Lead</option>
                                        <option value="Senior Staff">Senior Staff</option>
                                        <option value="Staff">Staff</option>
                                        <option value="Junior Staff">Junior Staff</option>
                                        <option value="Intern">Intern</option>
                                    </select>
                                    {errors.position && (
                                        <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                                    )}
                                </div>

                                {/* Date Range */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                                            📅 Tanggal Mulai
                                        </label>
                                        <input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            required
                                        />
                                        {errors.start_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                            📅 Tanggal Selesai
                                        </label>
                                        <input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            required
                                        />
                                        {errors.end_date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Leave Type */}
                                <div>
                                    <label htmlFor="leave_type" className="block text-sm font-medium text-gray-700 mb-2">
                                        📋 Jenis Izin
                                    </label>
                                    <select
                                        id="leave_type"
                                        value={data.leave_type}
                                        onChange={e => setData('leave_type', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    >
                                        <option value="">Pilih Jenis Izin</option>
                                        <option value="Cuti">🏖️ Cuti</option>
                                        <option value="Sakit">🤒 Sakit</option>
                                        <option value="Izin Pribadi">👨‍👩‍👧‍👦 Izin Pribadi</option>
                                    </select>
                                    {errors.leave_type && (
                                        <p className="mt-1 text-sm text-red-600">{errors.leave_type}</p>
                                    )}
                                </div>

                                {/* Reason */}
                                <div>
                                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                                        📝 Alasan
                                    </label>
                                    <textarea
                                        id="reason"
                                        value={data.reason}
                                        onChange={e => setData('reason', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Jelaskan alasan pengajuan izin Anda..."
                                        required
                                    />
                                    {errors.reason && (
                                        <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? '⏳ Mengirim...' : '🚀 Kirim Pengajuan'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-8">
                            <p className="text-sm text-gray-500">
                                Sistem manajemen izin karyawan yang mudah dan efisien
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}