'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import * as Dialog from '@radix-ui/react-dialog'
import { Flex, Box, Button, Card, Heading, Text, Select, TextField } from '@radix-ui/themes'

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
            '08-16': '#10b981',
            '08-20': '#3b82f6',
            '08-24': '#f59e0b',
            '16-24': '#8b5cf6',
            '24-08': '#ef4444'
        }
        return colors[shiftTime] || '#6b7280'
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
        <Box style={{ minHeight: '100vh', backgroundColor: 'var(--gray-2)' }}>
            <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Flex justify="between" align="center" mb="6" wrap="wrap" gap="4">
                    <Box>
                        <Heading size="8" mb="1">ตารางเวรปฏิบัติงาน</Heading>
                        <Text color="gray">จัดการและติดตามตารางเวรของพนักงาน</Text>
                    </Box>
                    <Button
                        size="3"
                        onClick={() => {
                            setFormData({ ...formData, date: new Date().toISOString().split('T')[0] })
                            setRegisterDialogOpen(true)
                        }}
                    >
                        <Flex align="center" gap="2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <Text>ลงทะเบียนเวร</Text>
                        </Flex>
                    </Button>
                </Flex>

                <Box className="bg-white rounded-xl shadow-sm border border-gray-200" style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={calendarEvents}
                        dateClick={(info) => {
                            console.log('Date clicked:', info.dateStr)
                            setSelectedDate(info.dateStr)
                            setDayDetailsOpen(true)
                        }}
                        eventClick={(info) => {
                            console.log('Event clicked:', info.event.start)
                            const dateStr = info.event.startStr.split('T')[0]
                            setSelectedDate(dateStr)
                            setDayDetailsOpen(true)
                        }}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth'
                        }}
                        height="auto"
                        locale="th"
                    />
                </Box>

                {/* Shift Legend */}
                <Card size="2" mt="4">
                    <Heading size="4" mb="3">สีของช่วงเวร</Heading>
                    <Flex wrap="wrap" gap="3">
                        {[
                            { color: '#10b981', label: '08:00-16:00' },
                            { color: '#3b82f6', label: '08:00-20:00' },
                            { color: '#f59e0b', label: '08:00-24:00' },
                            { color: '#8b5cf6', label: '16:00-24:00' },
                            { color: '#ef4444', label: '24:00-08:00' },
                        ].map((shift, idx) => (
                            <Flex key={idx} align="center" gap="2">
                                <Box style={{ height: '16px', width: '16px', borderRadius: '4px', backgroundColor: shift.color }}></Box>
                                <Text size="2" color="gray">{shift.label}</Text>
                            </Flex>
                        ))}
                    </Flex>
                </Card>
            </Box>

            {/* Day Details Dialog */}
            <Dialog.Root open={dayDetailsOpen} onOpenChange={setDayDetailsOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', zIndex: 9998 }} />
                    <Dialog.Content className="radix-themes" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '448px', zIndex: 9999, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <Dialog.Title asChild>
                            <Heading size="6" mb="4">รายละเอียดวันที่ {selectedDate}</Heading>
                        </Dialog.Title>

                        {shiftsOnSelectedDate.length === 0 ? (
                            <Flex direction="column" align="center" py="8">
                                <svg className="h-16 w-16 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <Text color="gray">ไม่มีเวรในวันนี้</Text>
                            </Flex>
                        ) : (
                            <Flex direction="column" gap="2" mb="4">
                                {shiftsOnSelectedDate.map(shift => (
                                    <Card key={shift.id} style={{ background: 'linear-gradient(to right, var(--blue-2), var(--indigo-2))' }}>
                                        <Flex justify="between" align="center">
                                            <Box>
                                                <Text weight="bold" size="3">{shift.employeeName}</Text>
                                                <Flex align="center" gap="1" mt="1">
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <Text size="2" color="gray">{shift.shiftTime}</Text>
                                                </Flex>
                                            </Box>
                                            <Box style={{ height: '12px', width: '12px', borderRadius: '50%', backgroundColor: getShiftColor(shift.shiftTime) }}></Box>
                                        </Flex>
                                    </Card>
                                ))}
                            </Flex>
                        )}

                        <Flex justify="end" gap="3" pt="4" style={{ borderTop: '1px solid var(--gray-5)' }}>
                            <Dialog.Close asChild>
                                <Button size="3" variant="soft" color="gray">ปิด</Button>
                            </Dialog.Close>
                            <Button
                                size="3"
                                onClick={() => {
                                    setFormData({ ...formData, date: selectedDate || '' })
                                    setDayDetailsOpen(false)
                                    setRegisterDialogOpen(true)
                                }}
                            >
                                ลงทะเบียนเวร
                            </Button>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Register Shift Dialog */}
            <Dialog.Root open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', zIndex: 9998 }} />
                    <Dialog.Content className="radix-themes" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '448px', zIndex: 9999, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <Dialog.Title asChild>
                            <Heading size="6" mb="4">ลงทะเบียนเวร</Heading>
                        </Dialog.Title>

                        <form onSubmit={handleRegisterShift}>
                            <Flex direction="column" gap="4">
                                <Box>
                                    <Text as="label" size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                                        พนักงาน
                                    </Text>
                                    {/* <Select.Root
                                        size="3"
                                        value={formData.employeeId}
                                        onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                                        required
                                    >
                                        <Select.Trigger variant="surface" radius="full" placeholder="เลือกพนักงาน" style={{ width: '100%' }} />
                                        <Select.Content>
                                            {employees.map(emp => (
                                                <Select.Item key={emp.id} value={emp.id.toString()}>
                                                    {emp.name} - {emp.position}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root> */}
                                    <Select.Root size="2" defaultValue="apple">
                                        <Select.Trigger />
                                        <Select.Content>
                                            <Select.Item value="apple">Apple</Select.Item>
                                            <Select.Item value="orange">Orange</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                </Box>

                                <Box>
                                    <Text as="label" size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                                        เวลาเวร
                                    </Text>
                                    <Flex gap="2" wrap="wrap">
                                        {['08-16', '08-20', '08-24', '16-24', '24-08'].map((time) => {
                                            const timeLabels: Record<string, string> = {
                                                '08-16': '08:00-16:00',
                                                '08-20': '08:00-20:00',
                                                '08-24': '08:00-24:00',
                                                '16-24': '16:00-24:00',
                                                '24-08': '24:00-08:00'
                                            };
                                            const isSelected = formData.shiftTime === time;
                                            return (
                                                <Button
                                                    key={time}
                                                    type="button"
                                                    size="3"
                                                    variant={isSelected ? "solid" : "soft"}
                                                    radius="full"
                                                    style={{
                                                        cursor: 'pointer',
                                                        marginRight: '8px',
                                                        marginBottom: '8px',
                                                        backgroundColor: isSelected ? getShiftColor(time) : undefined,
                                                        borderColor: isSelected ? getShiftColor(time) : undefined,
                                                        color: isSelected ? 'white' : getShiftColor(time)
                                                    }}
                                                    onClick={() => setFormData({ ...formData, shiftTime: time })}
                                                >
                                                    {timeLabels[time]}
                                                </Button>
                                            );
                                        })}

                                    </Flex>
                                </Box>

                                <Box>
                                    <Text as="label" size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                                        วันที่
                                    </Text>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                        style={{ fontFamily: 'Kanit, sans-serif' }}
                                    />
                                </Box>

                                <Flex justify="end" gap="3" pt="4" style={{ borderTop: '1px solid var(--gray-5)' }}>
                                    <Dialog.Close asChild>
                                        <Button size="3" type="button" variant="soft" color="gray">ยกเลิก</Button>
                                    </Dialog.Close>
                                    <Button size="3" type="submit">บันทึก</Button>

                                    <Select.Root defaultValue="apple">
                                        <Select.Trigger color="cyan" variant="soft" />
                                        <Select.Content color="cyan">
                                            <Select.Item value="apple">Apple</Select.Item>
                                            <Select.Item value="orange">Orange</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                </Flex>
                            </Flex>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </Box>
    )
}
