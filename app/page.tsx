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

const SHIFT_COLORS: Record<string, { bg: string; label: string; text: string }> = {
    '08-16': { bg: '#10b981', label: '08:00 – 16:00', text: 'เช้า' },
    '08-20': { bg: '#3b82f6', label: '08:00 – 20:00', text: 'กลางวัน' },
    '08-24': { bg: '#f59e0b', label: '08:00 – 24:00', text: 'ยาว' },
    '16-24': { bg: '#8b5cf6', label: '16:00 – 24:00', text: 'บ่าย' },
    '24-08': { bg: '#ef4444', label: '24:00 – 08:00', text: 'ดึก' },
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

    const calendarEvents = shifts.map(shift => ({
        id: shift.id.toString(),
        title: shift.employeeName,
        date: shift.date,
        backgroundColor: getShiftColor(shift.shiftTime),
        borderColor: 'transparent',
        extendedProps: { shiftTime: shift.shiftTime },
    }))

    const shiftsOnSelectedDate = selectedDate ? shifts.filter(s => s.date === selectedDate) : []
    const cardStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
        background: '#ffffff',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 24px rgba(37,99,235,0.07)',
        border: '1px solid #e8edf5',
        ...extra,
    })

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1.5px solid #e2e8f0',
        fontSize: '0.95rem',
        fontFamily: 'Kanit, sans-serif',
        color: '#0f172a',
        background: '#f8fafc',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    }

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: '#64748b',
        marginBottom: '6px',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        fontFamily: 'Kanit, sans-serif',
    }

    const primaryBtnStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '11px 22px',
        background: 'linear-gradient(135deg, #2563eb, #6366f1)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: 600,
        fontFamily: 'Kanit, sans-serif',
        boxShadow: '0 3px 12px rgba(37,99,235,0.3)',
        transition: 'all 0.2s',
        minHeight: '44px',
    }

    const ghostBtnStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 20px',
        background: '#f1f5f9',
        color: '#64748b',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: 500,
        fontFamily: 'Kanit, sans-serif',
        transition: 'all 0.2s',
        minHeight: '44px',
    }

    const dialogOverlayStyle: React.CSSProperties = {
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 9998,
    }

    const dialogContentStyle: React.CSSProperties = {
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        borderRadius: '22px',
        padding: '28px 24px',
        width: 'calc(100% - 32px)',
        maxWidth: '440px',
        zIndex: 9999,
        boxShadow: '0 30px 80px rgba(15,23,42,0.2)',
        maxHeight: '90vh',
        overflowY: 'auto',
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px 16px 48px' }}>

                <div className="page-header-row">
                    <div>
                        <h1 style={{
                            margin: 0, fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                            fontWeight: 700, color: '#0f172a',
                            letterSpacing: '-0.02em', lineHeight: 1.2,
                            fontFamily: 'Kanit, sans-serif',
                        }}>
                            ตารางเวรปฏิบัติงาน
                        </h1>
                        <p style={{
                            margin: '6px 0 0', fontSize: '0.9rem',
                            color: '#64748b', fontFamily: 'Kanit, sans-serif',
                        }}>
                            จัดการและติดตามตารางเวรของพนักงาน
                        </p>
                    </div>
                    <button
                        style={primaryBtnStyle}
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

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {[
                        { label: 'เวรทั้งหมด', value: shifts.length, color: '#2563eb', bg: '#dbeafe' },
                        { label: 'พนักงาน', value: employees.length, color: '#10b981', bg: '#d1fae5' },
                        { label: 'วันนี้', value: shifts.filter(s => s.date === new Date().toISOString().split('T')[0]).length, color: '#f59e0b', bg: '#fef3c7' },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            background: 'white', borderRadius: '14px',
                            padding: '10px 16px', flex: '1 1 100px',
                            border: '1px solid #e8edf5',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '10px',
                                background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem', fontWeight: 700, color: stat.color,
                                fontFamily: 'Kanit, sans-serif', flexShrink: 0,
                            }}>
                                {stat.value}
                            </div>
                            <span style={{ fontSize: '0.82rem', color: '#64748b', fontFamily: 'Kanit, sans-serif' }}>
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={cardStyle({ marginBottom: '16px' })}>
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

                <div style={cardStyle()}>
                    <p style={{
                        margin: '0 0 12px', fontSize: '0.85rem', fontWeight: 600,
                        color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase',
                        fontFamily: 'Kanit, sans-serif',
                    }}>ช่วงเวร</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {Object.entries(SHIFT_COLORS).map(([key, s]) => (
                            <div key={key} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: s.bg + '18',
                                border: `1.5px solid ${s.bg}33`,
                                borderRadius: '10px',
                                padding: '6px 12px',
                            }}>
                                <div style={{
                                    width: '10px', height: '10px',
                                    borderRadius: '50%', background: s.bg, flexShrink: 0,
                                }} />
                                <span style={{ fontSize: '0.8rem', color: '#475569', fontFamily: 'Kanit, sans-serif' }}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog.Root open={dayDetailsOpen} onOpenChange={setDayDetailsOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay style={dialogOverlayStyle} />
                    <Dialog.Content className="radix-themes" style={dialogContentStyle}>
                        <Dialog.Title asChild>
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{
                                    margin: '0 0 2px', fontSize: '0.75rem', fontWeight: 600,
                                    color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase',
                                    fontFamily: 'Kanit, sans-serif',
                                }}>รายละเอียดวันที่</p>
                                <h2 style={{
                                    margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a',
                                    fontFamily: 'Kanit, sans-serif',
                                }}>{selectedDate}</h2>
                            </div>
                        </Dialog.Title>

                        {shiftsOnSelectedDate.length === 0 ? (
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                padding: '36px 0', gap: '12px',
                            }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '16px',
                                    background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', fontFamily: 'Kanit, sans-serif' }}>
                                    ไม่มีเวรในวันนี้
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                {shiftsOnSelectedDate.map(shift => (
                                    <div key={shift.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                        background: '#f8fafc', borderRadius: '14px', padding: '14px',
                                        border: '1px solid #e2e8f0',
                                    }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                                            background: getShiftColor(shift.shiftTime),
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{
                                                margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a',
                                                fontFamily: 'Kanit, sans-serif',
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                            }}>{shift.employeeName}</p>
                                            <p style={{
                                                margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b',
                                                fontFamily: 'Kanit, sans-serif',
                                            }}>
                                                {SHIFT_COLORS[shift.shiftTime]?.label ?? shift.shiftTime}
                                                {SHIFT_COLORS[shift.shiftTime] ? ` · ${SHIFT_COLORS[shift.shiftTime].text}` : ''}
                                            </p>
                                        </div>
                                        <div style={{
                                            padding: '3px 10px', borderRadius: '20px',
                                            background: getShiftColor(shift.shiftTime) + '22',
                                            color: getShiftColor(shift.shiftTime),
                                            fontSize: '0.72rem', fontWeight: 600,
                                            fontFamily: 'Kanit, sans-serif',
                                            border: `1px solid ${getShiftColor(shift.shiftTime)}44`,
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {shift.status === 'confirmed' ? 'ยืนยัน' : shift.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{
                            display: 'flex', justifyContent: 'flex-end', gap: '8px',
                            paddingTop: '14px', borderTop: '1px solid #f1f5f9',
                        }}>
                            <Dialog.Close asChild>
                                <button style={{
                                    padding: '6px 16px', borderRadius: '9px', border: 'none',
                                    background: '#f1f5f9', color: '#64748b', cursor: 'pointer',
                                    fontSize: '0.82rem', fontWeight: 500, fontFamily: 'Kanit, sans-serif',
                                    transition: 'background 0.15s',
                                }}>ปิด</button>
                            </Dialog.Close>
                            <button
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '6px 14px', borderRadius: '9px', border: 'none',
                                    background: 'linear-gradient(135deg, #2563eb, #6366f1)',
                                    color: 'white', cursor: 'pointer',
                                    fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Kanit, sans-serif',
                                    boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                                    transition: 'all 0.15s',
                                }}
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
                    <Dialog.Overlay style={dialogOverlayStyle} />
                    <Dialog.Content className="radix-themes" style={dialogContentStyle}>
                        <Dialog.Title asChild>
                            <div style={{ marginBottom: '22px' }}>
                                <p style={{
                                    margin: '0 0 2px', fontSize: '0.75rem', fontWeight: 600,
                                    color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase',
                                    fontFamily: 'Kanit, sans-serif',
                                }}>เพิ่มข้อมูล</p>
                                <h2 style={{
                                    margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a',
                                    fontFamily: 'Kanit, sans-serif',
                                }}>ลงทะเบียนเวร</h2>
                            </div>
                        </Dialog.Title>

                        <form onSubmit={handleRegisterShift}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                                <div>
                                    <label style={labelStyle}>พนักงาน</label>
                                    <select
                                        value={formData.employeeId}
                                        onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                        required
                                        style={inputStyle}
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
                                    <label style={labelStyle}>ช่วงเวร</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {Object.entries(SHIFT_COLORS).map(([key, s]) => {
                                            const active = formData.shiftTime === key
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, shiftTime: key })}
                                                    style={{
                                                        padding: '7px 13px',
                                                        borderRadius: '10px',
                                                        border: active ? `2px solid ${s.bg}` : '2px solid #e2e8f0',
                                                        background: active ? s.bg + '15' : 'white',
                                                        color: active ? s.bg : '#64748b',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem',
                                                        fontWeight: active ? 600 : 400,
                                                        fontFamily: 'Kanit, sans-serif',
                                                        transition: 'all 0.15s',
                                                        display: 'flex', alignItems: 'center', gap: '5px',
                                                    }}
                                                >
                                                    <span style={{
                                                        width: '8px', height: '8px', borderRadius: '50%',
                                                        background: s.bg, flexShrink: 0,
                                                    }} />
                                                    {s.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>วันที่</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={{
                                display: 'flex', justifyContent: 'flex-end', gap: '10px',
                                paddingTop: '20px', marginTop: '20px', borderTop: '1px solid #f1f5f9',
                            }}>
                                <Dialog.Close asChild>
                                    <button type="button" style={ghostBtnStyle}>ยกเลิก</button>
                                </Dialog.Close>
                                <button
                                    type="submit"
                                    style={{ ...primaryBtnStyle, opacity: saving ? 0.7 : 1 }}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span style={{
                                                width: '14px', height: '14px', borderRadius: '50%',
                                                border: '2px solid rgba(255,255,255,0.5)',
                                                borderTopColor: 'white', animation: 'spin 0.6s linear infinite',
                                                display: 'inline-block',
                                            }} />
                                            กำลังบันทึก...
                                        </>
                                    ) : 'บันทึกเวร'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                input[type="date"]:focus, select:focus { border-color: #2563eb !important; outline: none; }

                .page-header-row {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                @media (max-width: 480px) {
                    .page-header-row {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .page-header-row button {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    )
}
