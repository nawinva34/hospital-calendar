'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import * as Dialog from '@radix-ui/react-dialog'

interface Shift {
    id: number
    employeeId: number
    employeeName: string
    shiftTime: string
    date: string
    status: string
}

interface Employee {
    id: number
    name: string
    position: string
    department: string
    email: string
}

const SHIFT_COLORS: Record<string, { bg: string; label: string; text: string; bgClass: string; textClass: string }> = {
    '08-16': { bg: '#10b981', label: '08:00 – 16:00', text: 'เช้า', bgClass: 'bg-emerald-500', textClass: 'text-emerald-500' },
    '08-20': { bg: '#3b82f6', label: '08:00 – 20:00', text: 'กลางวัน', bgClass: 'bg-blue-500', textClass: 'text-blue-500' },
    '08-24': { bg: '#f59e0b', label: '08:00 – 24:00', text: 'ยาว', bgClass: 'bg-amber-500', textClass: 'text-amber-500' },
    '16-24': { bg: '#8b5cf6', label: '16:00 – 24:00', text: 'บ่าย', bgClass: 'bg-violet-500', textClass: 'text-violet-500' },
    '24-08': { bg: '#ef4444', label: '24:00 – 08:00', text: 'ดึก', bgClass: 'bg-red-500', textClass: 'text-red-500' },
}

export default function Home() {
    const [shifts, setShifts] = useState<Shift[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [dayDetailsOpen, setDayDetailsOpen] = useState(false)
    const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        employeeId: '',
        shiftTime: '08-16',
        date: '',
        status: 'confirmed',
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchShifts()
        fetchEmployees()
    }, [])

    const fetchShifts = async () => {
        const res = await fetch('/api/shifts')
        const data = await res.json()
        if (data.success) setShifts(data.data)
    }

    const fetchEmployees = async () => {
        const res = await fetch('/api/employees')
        const data = await res.json()
        if (data.success) setEmployees(data.data)
    }

    const handleRegisterShift = async (e: React.FormEvent) => {
        e.preventDefault()
        const employee = employees.find(emp => emp.id === parseInt(formData.employeeId))
        if (!employee) return
        setSaving(true)
        const res = await fetch('/api/shifts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                employeeId: parseInt(formData.employeeId),
                employeeName: employee.name,
            }),
        })
        setSaving(false)
        if (res.ok) {
            fetchShifts()
            setRegisterDialogOpen(false)
            setFormData({ employeeId: '', shiftTime: '08-16', date: '', status: 'confirmed' })
        }
    }

    const getShiftColor = (shiftTime: string) => SHIFT_COLORS[shiftTime]?.bg ?? '#6b7280'
    const getShiftStyle = (shiftTime: string) => SHIFT_COLORS[shiftTime] ?? { bgClass: 'bg-slate-500', textClass: 'text-slate-500' }

    const calendarEvents = shifts.map(shift => ({
        id: shift.id.toString(),
        title: shift.employeeName,
        date: shift.date,
        backgroundColor: getShiftColor(shift.shiftTime),
        borderColor: 'transparent',
        extendedProps: { shiftTime: shift.shiftTime },
    }))

    const shiftsOnSelectedDate = selectedDate ? shifts.filter(s => s.date === selectedDate) : []

    return (
        <div className="min-h-screen bg-slate-50 font-kanit">
            <div className="max-w-5xl mx-auto px-4 py-5 pb-12">

                <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="m-0 text-[clamp(1.5rem,5vw,2rem)] font-bold text-slate-900 tracking-tight leading-tight">
                            ตารางเวรปฏิบัติงาน
                        </h1>
                        <p className="mt-1.5 text-sm text-slate-500">
                            จัดการและติดตามตารางเวรของพนักงาน
                        </p>
                    </div>
                    <button
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl cursor-pointer text-sm font-semibold shadow-[0_3px_12px_rgba(37,99,235,0.3)] hover:opacity-90 transition-all min-h-[44px] w-full sm:w-auto"
                        onClick={() => {
                            setFormData({ ...formData, date: new Date().toISOString().split('T')[0] })
                            setRegisterDialogOpen(true)
                        }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        ลงทะเบียนเวร
                    </button>
                </div>

                <div className="flex gap-3 flex-wrap mb-5">
                    {[
                        { label: 'เวรทั้งหมด', value: shifts.length, color: 'text-blue-600', bg: 'bg-blue-100' },
                        { label: 'พนักงาน', value: employees.length, color: 'text-emerald-500', bg: 'bg-emerald-100' },
                        { label: 'วันนี้', value: shifts.filter(s => s.date === new Date().toISOString().split('T')[0]).length, color: 'text-amber-500', bg: 'bg-amber-100' },
                    ].map(stat => (
                        <div key={stat.label} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-2.5 flex-[1_1_100px] border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold shrink-0 ${stat.bg} ${stat.color}`}>
                                {stat.value}
                            </div>
                            <span className="text-sm text-slate-500">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_24px_rgba(37,99,235,0.07)] border border-slate-100 mb-4">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={calendarEvents}
                        dateClick={(info) => {
                            setSelectedDate(info.dateStr)
                            setDayDetailsOpen(true)
                        }}
                        eventClick={(info) => {
                            const dateStr = info.event.startStr.split('T')[0]
                            setSelectedDate(dateStr)
                            setDayDetailsOpen(true)
                        }}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: '',
                        }}
                        height="auto"
                        locale="th"
                    />
                </div>

                <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_24px_rgba(37,99,235,0.07)] border border-slate-100">
                    <p className="m-0 mb-3 text-sm font-semibold text-slate-500 tracking-wider uppercase">ช่วงเวร</p>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(SHIFT_COLORS).map(([key, s]) => (
                            <div key={key} className={`flex items-center gap-2 rounded-xl px-3 py-1.5 bg-opacity-10 border border-opacity-20 ${s.bgClass.replace('bg-', 'bg-').replace('500', '500/10')} ${s.textClass.replace('text-', 'border-').replace('500', '500/20')}`}>
                                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.bgClass}`} />
                                <span className="text-xs text-slate-600">
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog.Root open={dayDetailsOpen} onOpenChange={setDayDetailsOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9998] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[22px] p-6 sm:p-7 w-[calc(100%-32px)] max-w-[440px] z-[9999] shadow-2xl max-h-[90vh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
                        <Dialog.Title asChild>
                            <div className="mb-5">
                                <p className="m-0 mb-0.5 text-xs font-semibold text-slate-400 tracking-wider uppercase">รายละเอียดวันที่</p>
                                <h2 className="m-0 text-xl font-bold text-slate-900">{selectedDate}</h2>
                            </div>
                        </Dialog.Title>

                        {shiftsOnSelectedDate.length === 0 ? (
                            <div className="flex flex-col items-center py-9 gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="m-0 text-slate-400 text-sm">
                                    ไม่มีเวรในวันนี้
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2.5 mb-5">
                                {shiftsOnSelectedDate.map(shift => {
                                    const shiftStyle = getShiftStyle(shift.shiftTime)
                                    return (
                                        <div key={shift.id} className="flex items-center gap-3.5 bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${shiftStyle.bgClass}`}>
                                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="m-0 text-sm font-semibold text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {shift.employeeName}
                                                </p>
                                                <p className="m-0 mt-0.5 text-xs text-slate-500">
                                                    {SHIFT_COLORS[shift.shiftTime]?.label ?? shift.shiftTime}
                                                    {SHIFT_COLORS[shift.shiftTime] ? ` · ${SHIFT_COLORS[shift.shiftTime].text}` : ''}
                                                </p>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-full text-[0.7rem] font-semibold whitespace-nowrap bg-opacity-10 border border-opacity-20 ${shiftStyle.bgClass.replace('bg-', 'bg-').replace('500', '500/10')} ${shiftStyle.textClass} ${shiftStyle.textClass.replace('text-', 'border-').replace('500', '500/20')}`}>
                                                {shift.status === 'confirmed' ? 'ยืนยัน' : shift.status}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-3.5 border-t border-slate-100">
                            <Dialog.Close asChild>
                                <button className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 text-sm font-medium transition-colors">
                                    ปิด
                                </button>
                            </Dialog.Close>
                            <button
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition-all"
                                onClick={() => {
                                    setFormData({ ...formData, date: selectedDate || '' })
                                    setDayDetailsOpen(false)
                                    setRegisterDialogOpen(true)
                                }}
                            >
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                ลงทะเบียนเวร
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9998] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[22px] p-6 sm:p-7 w-[calc(100%-32px)] max-w-[440px] z-[9999] shadow-2xl overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
                        <Dialog.Title asChild>
                            <div className="mb-5">
                                <p className="m-0 mb-0.5 text-xs font-semibold text-slate-400 tracking-wider uppercase">เพิ่มข้อมูล</p>
                                <h2 className="m-0 text-xl font-bold text-slate-900">ลงทะเบียนเวร</h2>
                            </div>
                        </Dialog.Title>

                        <form onSubmit={handleRegisterShift}>
                            <div className="flex flex-col gap-4">

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wider uppercase">พนักงาน</label>
                                    <select
                                        value={formData.employeeId}
                                        onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                        required
                                        className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-slate-200 text-sm text-slate-900 bg-slate-50 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                                    >
                                        <option value="">เลือกพนักงาน...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id.toString()}>
                                                {emp.name} – {emp.position}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wider uppercase">ช่วงเวร</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(SHIFT_COLORS).map(([key, s]) => {
                                            const active = formData.shiftTime === key
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, shiftTime: key })}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 cursor-pointer text-xs font-kanit transition-all ${active ? `border-transparent ${s.bgClass.replace('bg-', 'bg-').replace('500', '500/15')} ${s.textClass}` : 'border-slate-200 bg-white text-slate-500'} ${active ? 'font-semibold ring-2 ring-offset-1 ' + s.textClass.replace('text-', 'ring-').replace('500', '500/50') : 'font-normal hover:bg-slate-50'}`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.bgClass}`} />
                                                    {s.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wider uppercase">วันที่</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-slate-200 text-sm text-slate-900 bg-slate-50 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-5 mt-5 border-t border-slate-100">
                                <Dialog.Close asChild>
                                    <button type="button" className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors min-h-[44px]">ยกเลิก</button>
                                </Dialog.Close>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-[0_3px_12px_rgba(37,99,235,0.3)] transition-all min-h-[44px] ${saving ? 'opacity-70 cursor-not-allowed bg-blue-300' : 'bg-gradient-to-br from-blue-600 to-indigo-500 text-white hover:opacity-90 cursor-pointer'}`}
                                >
                                    {saving ? (
                                        <>
                                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white/50 border-t-white animate-spin inline-block" />
                                            กำลังบันทึก...
                                        </>
                                    ) : 'บันทึกเวร'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}
