'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<{name: string, email: string} | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me')
                const data = await res.json()
                if (data.success && data.data) {
                    setUser(data.data)
                }
            } catch (error) {
                console.error("Failed to fetch user", error)
            }
        }
        fetchUser()
    }, [pathname])

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            setUser(null)
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error("Logout failed", error)
        }
    }

    const navLinks = [
        {
            href: '/',
            label: 'ปฏิทิน',
            icon: (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            href: '/employees',
            label: 'พนักงาน',
            icon: (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
    ]

    return (
        <>
            <nav style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backdropFilter: 'blur(20px)',
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 16px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px', height: '36px',
                            background: 'linear-gradient(135deg, #2563eb, #6366f1)',
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span style={{
                            color: 'white', fontWeight: 600, fontSize: '1rem',
                            letterSpacing: '-0.01em', fontFamily: 'Kanit, sans-serif'
                        }}>
                            Hospital Calendar
                        </span>
                    </Link>

                    <div className="hidden md:flex" style={{ alignItems: 'center', gap: '4px' }}>
                        {user && navLinks.map(link => {
                            const active = pathname === link.href
                            return (
                                <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '7px 16px',
                                        borderRadius: '10px',
                                        fontSize: '0.9rem',
                                        fontWeight: active ? 600 : 400,
                                        color: active ? 'white' : 'rgba(255,255,255,0.55)',
                                        background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                                        transition: 'all 0.2s',
                                        fontFamily: 'Kanit, sans-serif',
                                        cursor: 'pointer',
                                    }}>
                                        {link.icon}
                                        {link.label}
                                    </div>
                                </Link>
                            )
                        })}
                        {user ? (
                            <div className="ml-2 flex items-center gap-3 pl-3 border-l border-white/10">
                                <div className="flex flex-col items-end">
                                    <span className="text-white text-sm font-semibold leading-tight">{user.name}</span>
                                    <span className="text-white/50 text-[0.65rem] leading-tight">{user.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                    title="ออกจากระบบ"
                                >
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '7px 16px',
                                    borderRadius: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: 'white',
                                    background: 'rgba(255,255,255,0.1)',
                                    transition: 'all 0.2s',
                                    fontFamily: 'Kanit, sans-serif',
                                    cursor: 'pointer',
                                }}>
                                    เข้าสู่ระบบ
                                </div>
                            </Link>
                        )}
                    </div>

                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="เปิดเมนู"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '10px',
                            width: '40px', height: '40px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </nav>

            <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay style={{
                        position: 'fixed', inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(6px)',
                        zIndex: 100,
                        animation: 'fadeIn 0.2s ease',
                    }} />
                    <Dialog.Content style={{
                        position: 'fixed', top: 0, right: 0,
                        height: '100%', width: '280px',
                        background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
                        borderLeft: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 101,
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
                        animation: 'slideInRight 0.25s ease',
                    }}>
                        <VisuallyHidden.Root>
                            <Dialog.Title>เมนูนำทาง</Dialog.Title>
                            <Dialog.Description>เมนูด้านข้างสำหรับใช้งานบนมือถือ</Dialog.Description>
                        </VisuallyHidden.Root>
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '32px', height: '32px',
                                    background: 'linear-gradient(135deg, #2563eb, #6366f1)',
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', fontFamily: 'Kanit, sans-serif' }}>
                                    เมนูหลัก
                                </span>
                            </div>
                            <Dialog.Close asChild>
                                <button style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: '8px',
                                    width: '36px', height: '36px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                                }}>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </Dialog.Close>
                        </div>

                        {user ? (
                            <div style={{ padding: '16px 20px' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '14px',
                                    padding: '12px 14px',
                                }}>
                                    <div style={{
                                        width: '42px', height: '42px',
                                        background: 'linear-gradient(135deg, #2563eb, #6366f1)',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontWeight: 700, fontSize: '0.9rem',
                                        fontFamily: 'Kanit, sans-serif',
                                        flexShrink: 0,
                                    }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'Kanit, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {user.name}
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', fontFamily: 'Kanit, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <div style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
                            <p style={{
                                color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600,
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                padding: '0 8px', marginBottom: '8px', fontFamily: 'Kanit, sans-serif',
                            }}>นำทาง</p>
                            {user ? navLinks.map(link => {
                                const active = pathname === link.href
                                return (
                                    <Link key={link.href} href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        style={{ textDecoration: 'none', display: 'block', marginBottom: '4px' }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '12px 14px',
                                            borderRadius: '12px',
                                            color: active ? 'white' : 'rgba(255,255,255,0.55)',
                                            background: active
                                                ? 'linear-gradient(135deg, rgba(37,99,235,0.3), rgba(99,102,241,0.2))'
                                                : 'transparent',
                                            border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                                            fontWeight: active ? 600 : 400,
                                            fontSize: '0.95rem',
                                            fontFamily: 'Kanit, sans-serif',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                        }}>
                                            <span style={{ opacity: active ? 1 : 0.7 }}>{link.icon}</span>
                                            {link.label}
                                        </div>
                                    </Link>
                                )
                            }) : (
                                <Link href="/login"
                                      onClick={() => setMobileMenuOpen(false)}
                                      style={{ textDecoration: 'none', display: 'block', marginBottom: '4px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px 14px',
                                        borderRadius: '12px',
                                        color: 'white',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid transparent',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        fontFamily: 'Kanit, sans-serif',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                    }}>
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        เข้าสู่ระบบ
                                    </div>
                                </Link>
                            )}
                        </div>

                        {user ? (
                            <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        handleLogout()
                                    }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        width: '100%', padding: '12px 14px',
                                        background: 'rgba(239,68,68,0.1)',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                        borderRadius: '12px',
                                        color: 'rgba(252,165,165,0.9)',
                                        fontSize: '0.95rem', fontWeight: 400,
                                        fontFamily: 'Kanit, sans-serif',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                    }}>
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    ออกจากระบบ
                                </button>
                            </div>
                        ) : null}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; } to { opacity: 1; }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); } to { transform: translateX(0); }
                }
            `}</style>
        </>
    )
}
