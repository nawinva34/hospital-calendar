'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Flex, Box, Button, IconButton, Text } from '@radix-ui/themes'

export default function Navbar() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            <Box asChild>
                <nav style={{
                    backgroundColor: '#000',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50
                }}>
                    <Flex className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" justify="between" align="center" style={{ height: '64px' }}>
                        <Flex align="center" gap="6">
                            {/* Logo */}
                            <Link href="/" className="flex items-center group" style={{ textDecoration: 'none' }}>
                                <Flex align="center" gap="2">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="white">
                                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                    <Text size="4" weight="medium" style={{ color: 'white' }}>
                                        Hospital Calendar
                                    </Text>
                                </Flex>
                            </Link>

                            {/* Desktop navigation */}
                            <Flex className="hidden md:flex" gap="1">
                                <Link href="/" style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="ghost"
                                        style={{
                                            color: pathname === '/' ? 'white' : 'rgba(255, 255, 255, 0.6)',
                                            fontWeight: pathname === '/' ? '500' : '400',
                                        }}
                                    >
                                        ปฏิทิน
                                    </Button>
                                </Link>
                                <Link href="/employees" style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="ghost"
                                        style={{
                                            color: pathname === '/employees' ? 'white' : 'rgba(255, 255, 255, 0.6)',
                                            fontWeight: pathname === '/employees' ? '500' : '400',
                                        }}
                                    >
                                        พนักงาน
                                    </Button>
                                </Link>
                            </Flex>
                        </Flex>

                        {/* Right side */}
                        <Flex align="center" gap="3">
                            {/* Mobile menu button */}
                            <Box className="md:hidden">
                                <IconButton
                                    variant="ghost"
                                    onClick={() => setMobileMenuOpen(true)}
                                    aria-label="เปิดเมนู"
                                    style={{ color: 'white' }}
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </IconButton>
                            </Box>

                        </Flex>
                    </Flex>
                </nav>
            </Box>

            {/* Mobile menu dialog */}
            <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-0 left-0 h-full w-72 bg-black z-50 shadow-2xl" style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Flex direction="column" style={{ height: '100%' }}>
                            <Box className="p-6" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Flex justify="between" align="center" mb="6">
                                    <Flex align="center" gap="2">
                                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="white">
                                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                        <Text size="3" weight="medium" style={{ color: 'white' }}>เมนู</Text>
                                    </Flex>
                                    <Dialog.Close asChild>
                                        <IconButton variant="ghost" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </IconButton>
                                    </Dialog.Close>
                                </Flex>
                                <Flex
                                    align="center"
                                    gap="3"
                                    p="3"
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}
                                >
                                    <Flex
                                        align="center"
                                        justify="center"
                                        style={{
                                            height: '40px',
                                            width: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            color: 'white',
                                            fontWeight: '500',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                        }}
                                    >
                                        AD
                                    </Flex>
                                    <Box>
                                        <Text size="2" weight="medium" style={{ color: 'white' }}>ผู้ดูแลระบบ</Text>
                                        <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>admin@hospital.com</Text>
                                    </Box>
                                </Flex>
                            </Box>

                            <Box className="flex-1 p-4" style={{ overflowY: 'auto' }}>
                                <Flex direction="column" gap="1">
                                    <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="ghost"
                                            style={{
                                                width: '100%',
                                                justifyContent: 'flex-start',
                                                color: pathname === '/' ? 'white' : 'rgba(255, 255, 255, 0.6)',
                                                backgroundColor: pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                            }}
                                        >
                                            <Flex align="center" gap="3">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <Text>ปฏิทินเวร</Text>
                                            </Flex>
                                        </Button>
                                    </Link>
                                    <Link href="/employees" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                                        <Button
                                            variant="ghost"
                                            style={{
                                                width: '100%',
                                                justifyContent: 'flex-start',
                                                color: pathname === '/employees' ? 'white' : 'rgba(255, 255, 255, 0.6)',
                                                backgroundColor: pathname === '/employees' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                            }}
                                        >
                                            <Flex align="center" gap="3">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <Text>จัดการพนักงาน</Text>
                                            </Flex>
                                        </Button>
                                    </Link>
                                </Flex>
                            </Box>

                            <Box className="p-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start', color: 'rgba(255, 255, 255, 0.6)' }}>
                                    <Flex align="center" gap="3">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <Text>ออกจากระบบ</Text>
                                    </Flex>
                                </Button>
                            </Box>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}
