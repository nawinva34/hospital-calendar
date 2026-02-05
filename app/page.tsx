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
        status: 'confirmed'
    })

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

    const handleDateClick = (info: any) => {
        setSelectedDate(info.dateStr)
        setDayDetailsOpen(true)
    }

    const handleRegisterShift = async (e: React.FormEvent) => {
        e.preventDefault()

        const employee = employees.find(emp => emp.id === parseInt(formData.employeeId))
        if (!employee) return

        const res = await fetch('/api/shifts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                employeeId: parseInt(formData.employeeId),
                employeeName: employee.name
            })
        })

        if (res.ok) {
            fetchShifts()
            setRegisterDialogOpen(false)
            setFormData({ employeeId: '', shiftTime: '08-16', date: '', status: 'confirmed' })
        }
    }

    const getShiftColor = (shiftTime: string) => {
        const colors: Record<string, string> = {
            '08-16': '#4CAF50',
            '08-20': '#2196F3',
            '08-24': '#FF9800',
            '16-24': '#9C27B0',
            '24-08': '#F44336'
        }
        return colors[shiftTime] || '#757575'
    }

    const calendarEvents = shifts.map(shift => ({
        id: shift.id.toString(),
        title: `${shift.employeeName} (${shift.shiftTime})`,
        date: shift.date,
        backgroundColor: getShiftColor(shift.shiftTime),
        borderColor: getShiftColor(shift.shiftTime)
    }))

    const shiftsOnSelectedDate = selectedDate
        ? shifts.filter(s => s.date === selectedDate)
        : []

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">ตารางเวรปฏิบัติงาน</h1>
                    <button
                        onClick={() => {
                            setFormData({ ...formData, date: new Date().toISOString().split('T')[0] })
                            setRegisterDialogOpen(true)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        + ลงทะเบียนเวร
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={calendarEvents}
                        dateClick={handleDateClick}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth'
                        }}
                        height="auto"
                        locale="th"
                    />
                </div>
            </div>

            {/* Day Details Dialog */}
            <Dialog.Root open={dayDetailsOpen} onOpenChange={setDayDetailsOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md z-50 shadow-xl">
                        <Dialog.Title className="text-xl font-bold mb-4">
                            รายละเอียดวันที่ {selectedDate}
                        </Dialog.Title>

                        {shiftsOnSelectedDate.length === 0 ? (
                            <p className="text-gray-600 mb-4">ไม่มีเวรในวันนี้</p>
                        ) : (
                            <div className="space-y-2 mb-4">
                                {shiftsOnSelectedDate.map(shift => (
                                    <div key={shift.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="font-medium">{shift.employeeName}</div>
                                        <div className="text-sm text-gray-600">เวลา: {shift.shiftTime}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end space-x-2">
                            <Dialog.Close className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                ปิด
                            </Dialog.Close>
                            <button
                                onClick={() => {
                                    setFormData({ ...formData, date: selectedDate || '' })
                                    setDayDetailsOpen(false)
                                    setRegisterDialogOpen(true)
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                ลงทะเบียนเวร
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Register Shift Dialog */}
            <Dialog.Root open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md z-50 shadow-xl">
                        <Dialog.Title className="text-xl font-bold mb-4">ลงทะเบียนเวร</Dialog.Title>

                        <form onSubmit={handleRegisterShift} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    พนักงาน
                                </label>
                                <select
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">เลือกพนักงาน</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name} - {emp.position}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    เวลาเวร
                                </label>
                                <select
                                    value={formData.shiftTime}
                                    onChange={(e) => setFormData({ ...formData, shiftTime: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="08-16">08:00-16:00</option>
                                    <option value="08-20">08:00-20:00</option>
                                    <option value="08-24">08:00-24:00</option>
                                    <option value="16-24">16:00-24:00</option>
                                    <option value="24-08">24:00-08:00</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    วันที่
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Dialog.Close className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                                    ยกเลิก
                                </Dialog.Close>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}
