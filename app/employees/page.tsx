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

const DEPT_COLORS: Record<string, string> = {
    ER: 'bg-amber-100 text-amber-600',
    ICU: 'bg-blue-100 text-blue-600',
    Surgery: 'bg-violet-100 text-violet-600',
    OPD: 'bg-emerald-100 text-emerald-600',
    Cardiology: 'bg-red-100 text-red-600',
    Pediatrics: 'bg-pink-100 text-pink-600',
    Orthopedics: 'bg-emerald-50 text-emerald-600',
    default: 'bg-slate-100 text-slate-500',
}

const AVATAR_GRADIENTS = [
    'from-blue-600 to-indigo-500',
    'from-emerald-600 to-cyan-600',
    'from-amber-600 to-red-500',
    'from-violet-600 to-pink-500',
    'from-cyan-600 to-blue-600',
]

const getDeptColorClass = (dept: string) => DEPT_COLORS[dept] ?? DEPT_COLORS.default

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

    return (
        <div className="min-h-screen bg-slate-50 font-kanit">
            <div className="max-w-4xl mx-auto px-4 py-5 pb-20">

                <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                    <div>
                        <h1 className="m-0 text-[clamp(1.3rem,5vw,1.8rem)] font-bold text-slate-900 tracking-tight leading-tight">
                            จัดการพนักงาน
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            {employees.length} คนในระบบ
                        </p>
                    </div>
                    <button
                        onClick={() => setDialogOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl cursor-pointer text-sm font-semibold shadow-[0_3px_12px_rgba(37,99,235,0.3)] hover:opacity-90 transition-opacity"
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        เพิ่มพนักงาน
                    </button>
                </div>

                {employees.length > 0 && (
                    <div className="flex gap-2.5 mb-4 overflow-x-auto pb-1">
                        {[
                            { label: 'ทั้งหมด', value: employees.length, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'แผนก', value: new Set(employees.map(e => e.department)).size, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'ตำแหน่ง', value: new Set(employees.map(e => e.position)).size, color: 'text-violet-600', bg: 'bg-violet-50' },
                        ].map(s => (
                            <div key={s.label} className={`flex items-center gap-2 flex-shrink-0 bg-white rounded-xl px-3.5 py-2 border border-slate-100 shadow-sm`}>
                                <span className={`text-[1.05rem] font-bold ${s.color}`}>{s.value}</span>
                                <span className="text-[0.78rem] text-slate-500">{s.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative mb-3.5">
                    <svg className="absolute left-[13px] top-1/2 -translate-y-1/2 pointer-events-none"
                        width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ, ตำแหน่ง หรือแผนก..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full py-2.5 pr-3.5 pl-10 rounded-xl border-[1.5px] border-slate-200 text-sm bg-white outline-none text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl py-12 px-6 flex flex-col items-center gap-3 border border-slate-100">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#94a3b8">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="m-0 text-slate-400 text-sm">
                            {search ? 'ไม่พบพนักงานที่ค้นหา' : 'ยังไม่มีพนักงานในระบบ'}
                        </p>
                        {!search && (
                            <button
                                onClick={() => setDialogOpen(true)}
                                className="px-5 py-2 bg-gradient-to-br from-blue-600 to-indigo-500 text-white border-none rounded-xl cursor-pointer text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                เพิ่มพนักงานคนแรก
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="hidden sm:grid grid-cols-[1fr_130px_1fr_80px] gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                            {['ชื่อ – ตำแหน่ง', 'แผนก', 'อีเมล', ''].map((h, i) => (
                                <span key={i} className={`text-[0.7rem] font-semibold text-slate-400 tracking-wider uppercase ${i === 3 ? 'text-right' : 'text-left'}`}>
                                    {h}
                                </span>
                            ))}
                        </div>

                        {filtered.map((emp, idx) => {
                            const deptClass = getDeptColorClass(emp.department)
                            const gradClass = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]
                            return (
                                <div key={emp.id} className="grid grid-cols-[44px_1fr_auto] grid-rows-[auto_auto] sm:grid-cols-[40px_1fr_130px_1fr_80px] sm:grid-rows-1 gap-x-3 gap-y-1 sm:gap-3 p-3.5 sm:p-4 items-center border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors">
                                    <div className={`col-start-1 row-span-2 sm:row-span-1 w-11 h-11 sm:w-9 sm:h-9 rounded-xl flex shrink-0 items-center justify-center text-white font-bold text-base sm:text-sm bg-gradient-to-br ${gradClass}`}>
                                        {emp.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="col-start-2 row-start-1 sm:col-auto sm:row-auto min-w-0">
                                        <div className="text-sm font-semibold text-slate-900 truncate">
                                            {emp.name}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-[1px]">
                                            {emp.position}
                                        </div>
                                    </div>

                                    <div className="col-start-2 row-start-2 flex items-center gap-1.5 sm:col-auto sm:row-auto">
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold whitespace-nowrap ${deptClass}`}>
                                            {emp.department}
                                        </span>
                                    </div>

                                    <div className="hidden sm:block text-xs text-slate-400 truncate">
                                        {emp.email}
                                    </div>

                                    <div className="col-start-3 row-span-2 self-center flex justify-end sm:col-auto sm:row-auto sm:self-auto">
                                        <button
                                            onClick={() => setDeleteTarget(emp)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg cursor-pointer text-xs font-semibold hover:bg-red-100 transition-colors min-h-[unset]"
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
                    <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9998] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[22px] p-6 sm:p-7 w-[calc(100%-32px)] max-w-[420px] z-[9999] shadow-2xl max-h-[90vh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
                        <Dialog.Title asChild>
                            <div className="mb-5">
                                <p className="m-0 mb-0.5 text-[0.7rem] font-semibold text-slate-400 tracking-wider uppercase">
                                    เพิ่มข้อมูล
                                </p>
                                <h2 className="m-0 text-xl font-bold text-slate-900">
                                    เพิ่มพนักงาน
                                </h2>
                            </div>
                        </Dialog.Title>

                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-3.5">
                                {[
                                    { key: 'name', label: 'ชื่อ', placeholder: 'กรอกชื่อพนักงาน', type: 'text' },
                                    { key: 'position', label: 'ตำแหน่ง', placeholder: 'เช่น แพทย์, พยาบาล', type: 'text' },
                                    { key: 'department', label: 'แผนก', placeholder: 'เช่น ER, ICU, Surgery', type: 'text' },
                                    { key: 'email', label: 'อีเมล', placeholder: 'example@hospital.com', type: 'email' },
                                ].map(f => (
                                    <div key={f.key}>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wider uppercase">
                                            {f.label}
                                        </label>
                                        <input
                                            type={f.type}
                                            placeholder={f.placeholder}
                                            value={formData[f.key as keyof typeof formData]}
                                            onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                            required
                                            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-slate-200 text-sm text-slate-900 bg-slate-50 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                                <Dialog.Close asChild>
                                    <button type="button" className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                                        ยกเลิก
                                    </button>
                                </Dialog.Close>
                                <button type="submit" disabled={saving} className={`inline-flex items-center gap-2 px-5 py-2 text-white rounded-xl text-sm font-semibold shadow-md ${saving ? 'bg-blue-300 cursor-not-allowed' : 'bg-gradient-to-br from-blue-600 to-indigo-500 hover:opacity-90 cursor-pointer'} transition-all`}>
                                    {saving && (
                                        <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block" />
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
                    <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9998] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[22px] p-6 sm:p-7 w-[calc(100%-32px)] max-w-[380px] z-[9999] shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#ef4444">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <div>
                                <Dialog.Title asChild>
                                    <h3 className="m-0 mb-1.5 text-base font-bold text-slate-900">
                                        ลบพนักงาน
                                    </h3>
                                </Dialog.Title>
                                <Dialog.Description asChild>
                                    <p className="m-0 text-sm text-slate-500 leading-relaxed">
                                        คุณต้องการลบ <strong className="text-slate-900">{deleteTarget?.name}</strong> ออกจากระบบ?
                                        <br />การกระทำนี้ไม่สามารถย้อนกลับได้
                                    </p>
                                </Dialog.Description>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <Dialog.Close asChild>
                                <button className="flex-1 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                                    ยกเลิก
                                </button>
                            </Dialog.Close>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className={`flex-1 py-2.5 text-white rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md ${deleting ? 'bg-red-300 cursor-not-allowed' : 'bg-gradient-to-br from-red-500 to-red-600 hover:opacity-90 cursor-pointer'} transition-all`}
                            >
                                {deleting && (
                                    <span className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block" />
                                )}
                                {deleting ? 'กำลังลบ...' : 'ลบพนักงาน'}
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    )
}
