'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

interface Employee {
    id: number
    name: string
    position: string
    department: string
    email: string
}

const DEPT_COLORS: Record<string, { bg: string; text: string }> = {
    ER: { bg: '#fef3c7', text: '#d97706' },
    ICU: { bg: '#dbeafe', text: '#2563eb' },
    Surgery: { bg: '#ede9fe', text: '#7c3aed' },
    OPD: { bg: '#d1fae5', text: '#059669' },
    Cardiology: { bg: '#fee2e2', text: '#dc2626' },
    Pediatrics: { bg: '#fce7f3', text: '#db2777' },
    Orthopedics: { bg: '#ecfdf5', text: '#059669' },
    default: { bg: '#f1f5f9', text: '#64748b' },
}

const AVATAR_GRADIENTS = [
    'linear-gradient(135deg, #2563eb, #6366f1)',
    'linear-gradient(135deg, #059669, #0891b2)',
    'linear-gradient(135deg, #d97706, #ef4444)',
    'linear-gradient(135deg, #7c3aed, #ec4899)',
    'linear-gradient(135deg, #0891b2, #2563eb)',
]

const getDeptColor = (dept: string) => DEPT_COLORS[dept] ?? DEPT_COLORS.default

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)
    const [search, setSearch] = useState('')
    const [formData, setFormData] = useState({ name: '', position: '', department: '', email: '' })

    useEffect(() => { fetchEmployees() }, [])

    const fetchEmployees = async () => {
        const res = await fetch('/api/employees')
        const data = await res.json()
        if (data.success) setEmployees(data.data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const res = await fetch('/api/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        setSaving(false)
        if (res.ok) {
            fetchEmployees()
            setDialogOpen(false)
            setFormData({ name: '', position: '', department: '', email: '' })
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        const res = await fetch(`/api/employees/${deleteTarget.id}`, { method: 'DELETE' })
        setDeleting(false)
        if (res.ok) {
            fetchEmployees()
            setDeleteTarget(null)
        }
    }

    const filtered = employees.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.position.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase())
    )

    const font = 'Kanit, sans-serif'

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)', fontFamily: font }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 16px 80px' }}>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 'clamp(1.3rem, 5vw, 1.8rem)', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                            จัดการพนักงาน
                        </h1>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                            {employees.length} คนในระบบ
                        </p>
                    </div>
                    <button
                        onClick={() => setDialogOpen(true)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '10px 18px',
                            background: 'linear-gradient(135deg, #2563eb, #6366f1)',
                            color: 'white', border: 'none', borderRadius: '12px',
                            cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, fontFamily: font,
                            boxShadow: '0 3px 12px rgba(37,99,235,0.3)',
                        }}
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        เพิ่มพนักงาน
                    </button>
                </div>

                {employees.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {[
                            { label: 'ทั้งหมด', value: employees.length, color: '#2563eb', bg: '#eff6ff' },
                            { label: 'แผนก', value: new Set(employees.map(e => e.department)).size, color: '#059669', bg: '#f0fdf4' },
                            { label: 'ตำแหน่ง', value: new Set(employees.map(e => e.position)).size, color: '#7c3aed', bg: '#f5f3ff' },
                        ].map(s => (
                            <div key={s.label} style={{
                                display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                                background: 'white', borderRadius: '12px', padding: '8px 14px',
                                border: '1px solid #e8edf5', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                            }}>
                                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: s.color }}>{s.value}</span>
                                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ position: 'relative', marginBottom: '14px' }}>
                    <svg style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                        width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ, ตำแหน่ง หรือแผนก..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 14px 10px 38px', borderRadius: '12px',
                            border: '1.5px solid #e2e8f0', fontSize: '0.88rem', fontFamily: font,
                            background: 'white', outline: 'none', boxSizing: 'border-box', color: '#0f172a',
                        }}
                    />
                </div>

                {filtered.length === 0 ? (
                    <div style={{
                        background: 'white', borderRadius: '18px', padding: '48px 24px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                        border: '1px solid #e8edf5',
                    }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '16px', background: '#f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
                            {search ? 'ไม่พบพนักงานที่ค้นหา' : 'ยังไม่มีพนักงานในระบบ'}
                        </p>
                        {!search && (
                            <button
                                onClick={() => setDialogOpen(true)}
                                style={{
                                    padding: '8px 20px', background: 'linear-gradient(135deg, #2563eb, #6366f1)',
                                    color: 'white', border: 'none', borderRadius: '10px',
                                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: font,
                                }}
                            >
                                เพิ่มพนักงานคนแรก
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="emp-list">
                        <div className="emp-desktop-header">
                            {['ชื่อ – ตำแหน่ง', 'แผนก', 'อีเมล', ''].map((h, i) => (
                                <span key={i} style={{
                                    fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8',
                                    letterSpacing: '0.05em', textTransform: 'uppercase',
                                    textAlign: i === 3 ? 'right' : 'left',
                                }}>{h}</span>
                            ))}
                        </div>

                        {filtered.map((emp, idx) => {
                            const dept = getDeptColor(emp.department)
                            const grad = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]
                            return (
                                <div key={emp.id} className="emp-card">
                                    <div className="emp-avatar" style={{ background: grad }}>
                                        {emp.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="emp-info">
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {emp.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px' }}>
                                            {emp.position}
                                        </div>
                                    </div>

                                    <div className="emp-dept">
                                        <span style={{
                                            display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                                            background: dept.bg, color: dept.text,
                                            fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap',
                                        }}>
                                            {emp.department}
                                        </span>
                                    </div>

                                    <div className="emp-email" style={{ fontSize: '0.75rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {emp.email}
                                    </div>

                                    <div className="emp-actions">
                                        <button
                                            onClick={() => setDeleteTarget(emp)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                padding: '5px 12px', background: '#fef2f2', color: '#ef4444',
                                                border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer',
                                                fontSize: '0.75rem', fontWeight: 600, fontFamily: font,
                                                minHeight: 'unset',
                                            }}
                                        >
                                            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(15,23,42,0.5)',
                        backdropFilter: 'blur(6px)',
                        zIndex: 9998,
                    }} />
                    <Dialog.Content style={{
                        position: 'fixed', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white', borderRadius: '22px',
                        padding: '28px 24px',
                        width: 'calc(100% - 32px)', maxWidth: '420px',
                        zIndex: 9999,
                        boxShadow: '0 24px 60px rgba(15,23,42,0.18)',
                        maxHeight: '90vh', overflowY: 'auto',
                    }}>
                        <Dialog.Title asChild>
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ margin: '0 0 2px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                    เพิ่มข้อมูล
                                </p>
                                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                                    เพิ่มพนักงาน
                                </h2>
                            </div>
                        </Dialog.Title>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {[
                                    { key: 'name', label: 'ชื่อ', placeholder: 'กรอกชื่อพนักงาน', type: 'text' },
                                    { key: 'position', label: 'ตำแหน่ง', placeholder: 'เช่น แพทย์, พยาบาล', type: 'text' },
                                    { key: 'department', label: 'แผนก', placeholder: 'เช่น ER, ICU, Surgery', type: 'text' },
                                    { key: 'email', label: 'อีเมล', placeholder: 'example@hospital.com', type: 'email' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '5px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                            {f.label}
                                        </label>
                                        <input
                                            type={f.type}
                                            placeholder={f.placeholder}
                                            value={formData[f.key as keyof typeof formData]}
                                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                            required
                                            style={{
                                                width: '100%', padding: '10px 13px', borderRadius: '10px',
                                                border: '1.5px solid #e2e8f0', fontSize: '0.9rem', fontFamily: font,
                                                color: '#0f172a', background: '#f8fafc', outline: 'none', boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '18px', marginTop: '18px', borderTop: '1px solid #f1f5f9' }}>
                                <Dialog.Close asChild>
                                    <button type="button" style={{
                                        padding: '9px 18px', background: '#f1f5f9', color: '#64748b',
                                        border: 'none', borderRadius: '11px', cursor: 'pointer',
                                        fontSize: '0.88rem', fontWeight: 500, fontFamily: font,
                                    }}>
                                        ยกเลิก
                                    </button>
                                </Dialog.Close>
                                <button type="submit" disabled={saving} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                                    padding: '9px 20px',
                                    background: saving ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #6366f1)',
                                    color: 'white', border: 'none', borderRadius: '11px',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    fontSize: '0.88rem', fontWeight: 600, fontFamily: font,
                                    boxShadow: '0 3px 10px rgba(37,99,235,0.25)',
                                }}>
                                    {saving && (
                                        <span style={{
                                            width: '12px', height: '12px', borderRadius: '50%',
                                            border: '2px solid rgba(255,255,255,0.4)',
                                            borderTopColor: 'white',
                                            animation: 'spin 0.6s linear infinite', display: 'inline-block',
                                        }} />
                                    )}
                                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null) }}>
                <Dialog.Portal>
                    <Dialog.Overlay style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(15,23,42,0.5)',
                        backdropFilter: 'blur(6px)',
                        zIndex: 9998,
                    }} />
                    <Dialog.Content style={{
                        position: 'fixed', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white', borderRadius: '22px',
                        padding: '28px 24px',
                        width: 'calc(100% - 32px)', maxWidth: '380px',
                        zIndex: 9999,
                        boxShadow: '0 24px 60px rgba(15,23,42,0.18)',
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                            <div style={{
                                width: '52px', height: '52px', borderRadius: '16px',
                                background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ef4444">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <div>
                                <Dialog.Title asChild>
                                    <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', fontFamily: font }}>
                                        ลบพนักงาน
                                    </h3>
                                </Dialog.Title>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontFamily: font, lineHeight: 1.5 }}>
                                    คุณต้องการลบ <strong style={{ color: '#0f172a' }}>{deleteTarget?.name}</strong> ออกจากระบบ?
                                    <br />การกระทำนี้ไม่สามารถย้อนกลับได้
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                            <Dialog.Close asChild>
                                <button style={{
                                    flex: 1, padding: '10px', background: '#f1f5f9', color: '#64748b',
                                    border: 'none', borderRadius: '11px', cursor: 'pointer',
                                    fontSize: '0.9rem', fontWeight: 500, fontFamily: font,
                                }}>
                                    ยกเลิก
                                </button>
                            </Dialog.Close>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                style={{
                                    flex: 1, padding: '10px',
                                    background: deleting ? '#fca5a5' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    color: 'white', border: 'none', borderRadius: '11px',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    fontSize: '0.9rem', fontWeight: 600, fontFamily: font,
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                    boxShadow: '0 3px 10px rgba(239,68,68,0.3)',
                                }}
                            >
                                {deleting && (
                                    <span style={{
                                        width: '12px', height: '12px', borderRadius: '50%',
                                        border: '2px solid rgba(255,255,255,0.4)',
                                        borderTopColor: 'white',
                                        animation: 'spin 0.6s linear infinite', display: 'inline-block',
                                    }} />
                                )}
                                {deleting ? 'กำลังลบ...' : 'ลบพนักงาน'}
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                input:focus { border-color: #2563eb !important; background: white !important; }

                .emp-list {
                    background: white;
                    border-radius: 18px;
                    border: 1px solid #e8edf5;
                    overflow: hidden;
                }

                .emp-desktop-header {
                    display: grid;
                    grid-template-columns: 1fr 130px 1fr 80px;
                    gap: 8px;
                    padding: 10px 16px;
                    background: #f8fafc;
                    border-bottom: 1px solid #e8edf5;
                }

                .emp-card {
                    display: grid;
                    grid-template-columns: 40px 1fr 130px 1fr 80px;
                    gap: 12px;
                    padding: 14px 16px;
                    align-items: center;
                    border-bottom: 1px solid #f1f5f9;
                    transition: background 0.12s;
                }

                .emp-card:last-child { border-bottom: none; }
                .emp-card:hover { background: #fafbff; }

                .emp-avatar {
                    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-weight: 700; font-size: 0.88rem; font-family: Kanit, sans-serif;
                }

                .emp-actions { display: flex; justify-content: flex-end; }

                @media (max-width: 640px) {
                    .emp-desktop-header { display: none; }

                    .emp-card {
                        grid-template-columns: 44px 1fr auto;
                        grid-template-rows: auto auto;
                        gap: 4px 12px;
                        padding: 14px;
                    }

                    .emp-avatar {
                        width: 44px; height: 44px; border-radius: 13px;
                        font-size: 1rem;
                        grid-row: 1 / 3;
                    }

                    .emp-info { grid-column: 2; grid-row: 1; }

                    .emp-dept {
                        grid-column: 2; grid-row: 2;
                        display: flex; align-items: center; gap: 6px;
                    }

                    .emp-email {
                        display: none;
                    }

                    .emp-actions {
                        grid-column: 3; grid-row: 1 / 3;
                        align-self: center;
                    }
                }
            `}</style>
        </div>
    )
}
