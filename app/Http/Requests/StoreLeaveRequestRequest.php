<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeaveRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_name' => 'required|string|max:255',
            'department' => 'required|string|in:HR,IT,Finance,Marketing,Operations,Sales',
            'position' => 'required|string|in:Manager,Supervisor,Team Lead,Senior Staff,Staff,Junior Staff,Intern',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'leave_type' => 'required|string|in:Cuti,Sakit,Izin Pribadi',
            'reason' => 'required|string|min:10|max:1000',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_name.required' => 'Nama karyawan wajib diisi.',
            'employee_name.max' => 'Nama karyawan tidak boleh lebih dari 255 karakter.',
            'department.required' => 'Departemen wajib dipilih.',
            'department.in' => 'Departemen yang dipilih tidak valid.',
            'position.required' => 'Jabatan wajib dipilih.',
            'position.in' => 'Jabatan yang dipilih tidak valid.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.date' => 'Tanggal mulai harus berupa tanggal yang valid.',
            'start_date.after_or_equal' => 'Tanggal mulai tidak boleh sebelum hari ini.',
            'end_date.required' => 'Tanggal selesai wajib diisi.',
            'end_date.date' => 'Tanggal selesai harus berupa tanggal yang valid.',
            'end_date.after_or_equal' => 'Tanggal selesai tidak boleh sebelum tanggal mulai.',
            'leave_type.required' => 'Jenis izin wajib dipilih.',
            'leave_type.in' => 'Jenis izin yang dipilih tidak valid.',
            'reason.required' => 'Alasan wajib diisi.',
            'reason.min' => 'Alasan harus minimal 10 karakter.',
            'reason.max' => 'Alasan tidak boleh lebih dari 1000 karakter.',
        ];
    }
}