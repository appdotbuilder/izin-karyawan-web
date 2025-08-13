import React, { useState } from 'react';

interface LeaveFormData {
  employeeName: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const FormIzin: React.FC = () => {
  const [formData, setFormData] = useState<LeaveFormData>({
    employeeName: '',
    employeeId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [errors, setErrors] = useState<Partial<LeaveFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof LeaveFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LeaveFormData> = {};

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Nama karyawan harus diisi';
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'ID karyawan harus diisi';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Tanggal mulai harus diisi';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Tanggal selesai harus diisi';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Keterangan harus diisi';
    }

    // Validate date range
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Static form submission - just log to console and show alert
      console.log('Form Data:', formData);
      alert(`Permohonan cuti berhasil diajukan!\n\nData yang dikirim:\n${JSON.stringify(formData, null, 2)}`);
      
      // Reset form
      setFormData({
        employeeName: '',
        employeeId: '',
        startDate: '',
        endDate: '',
        reason: ''
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Form Permohonan Cuti</h1>
        <p className="mt-2 text-gray-600">Isi form berikut untuk mengajukan permohonan cuti</p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Name */}
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Karyawan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="employeeName"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.employeeName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.employeeName && (
              <p className="mt-1 text-sm text-red-600">{errors.employeeName}</p>
            )}
          </div>

          {/* Employee ID */}
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
              ID Karyawan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.employeeId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Contoh: EMP001"
            />
            {errors.employeeId && (
              <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              value={formData.reason}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Jelaskan alasan pengajuan cuti..."
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  employeeName: '',
                  employeeId: '',
                  startDate: '',
                  endDate: '',
                  reason: ''
                });
                setErrors({});
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormIzin;