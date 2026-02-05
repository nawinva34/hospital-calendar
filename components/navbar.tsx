'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

export default function Navbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Logo */}
                            <Link href="/" className="flex items-center ml-2 md:ml-0">
                                <span className="text-xl font-bold text-blue-600">ตารางเวร</span>
                            </Link>

                            {/* Desktop navigation */}
                            <div className="hidden md:flex md:ml-8 md:space-x-2">
                                <Link
                                    href="/"
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    ปฏิทิน
                                </Link>
                                <Link
                                    href="/employees"
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/employees'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    พนักงาน
                                </Link>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-3">
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                                AD
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile menu dialog */}
            <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                    <Dialog.Content className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xl font-bold text-blue-600">ตารางเวร</span>
                                <Dialog.Close className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Dialog.Close>
                            </div>

                            <nav className="space-y-2">
                                <Link
                                    href="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${pathname === '/'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    ปฏิทิน
                                </Link>
                                <Link
                                    href="/employees"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${pathname === '/employees'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    พนักงาน
                                </Link>
                            </nav>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}
