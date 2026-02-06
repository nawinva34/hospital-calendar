'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Flex, Box, Button, Card, Heading, Text, Table, Badge, Avatar, TextField } from '@radix-ui/themes'

interface Employee {
    id: number
    name: string
    position: string
    department: string
    email: string
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        department: '',
        email: ''
    })

    useEffect(() => {
        fetchEmployees()
    }, [])

    const fetchEmployees = async () => {
        const res = await fetch('/api/employees')
        const data = await res.json()
        if (data.success) setEmployees(data.data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const res = await fetch('/api/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        if (res.ok) {
            fetchEmployees()
            setDialogOpen(false)
            setFormData({ name: '', position: '', department: '', email: '' })
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบพนักงานคนนี้?')) return

        const res = await fetch(`/api/employees/${id}`, {
            method: 'DELETE'
        })

        if (res.ok) {
            fetchEmployees()
        }
    }

    return (
        <Box style={{ minHeight: '100vh', backgroundColor: 'var(--gray-2)' }}>
            <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Flex justify="between" align="center" mb="6" wrap="wrap" gap="4">
                    <Box>
                        <Heading size="8" mb="1">จัดการพนักงาน</Heading>
                        <Text color="gray">จัดการข้อมูลพนักงานในระบบ</Text>
                    </Box>
                    <Button
                        size="3"
                        onClick={() => setDialogOpen(true)}
                    >
                        <Flex align="center" gap="2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <Text>เพิ่มพนักงาน</Text>
                        </Flex>
                    </Button>
                </Flex>

                <Card size="3">
                    <Box className="overflow-x-auto">
                        <Table.Root variant="surface">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>ชื่อ</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>ตำแหน่ง</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>แผนก</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>อีเมล</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell align="right">การจัดการ</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {employees.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell colSpan={5}>
                                            <Flex direction="column" align="center" py="8">
                                                <svg className="h-16 w-16 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <Text color="gray">ยังไม่มีพนักงานในระบบ</Text>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setDialogOpen(true)}
                                                    mt="4"
                                                >
                                                    เพิ่มพนักงานคนแรก
                                                </Button>
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    employees.map((employee) => (
                                        <Table.Row key={employee.id}>
                                            <Table.Cell>
                                                <Flex align="center" gap="3">
                                                    <Avatar
                                                        fallback={employee.name.charAt(0)}
                                                        color="blue"
                                                        size="2"
                                                    />
                                                    <Text weight="medium">{employee.name}</Text>
                                                </Flex>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge color="blue" variant="soft">
                                                    {employee.position}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text>{employee.department}</Text>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Text color="gray">{employee.email}</Text>
                                            </Table.Cell>
                                            <Table.Cell align="right">
                                                <Button
                                                    variant="soft"
                                                    color="red"
                                                    size="2"
                                                    onClick={() => handleDelete(employee.id)}
                                                >
                                                    <Flex align="center" gap="1">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        <Text>ลบ</Text>
                                                    </Flex>
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Card>

                {/* Employee Stats */}
                {employees.length > 0 && (
                    <Flex gap="4" mt="6" wrap="wrap">
                        <Card size="2" style={{ flex: '1 1 300px' }}>
                            <Flex align="center" gap="3">
                                <Flex
                                    align="center"
                                    justify="center"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--blue-3)',
                                        color: 'var(--blue-9)',
                                    }}
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </Flex>
                                <Box>
                                    <Text size="2" color="gray">พนักงานทั้งหมด</Text>
                                    <Heading size="6">{employees.length}</Heading>
                                </Box>
                            </Flex>
                        </Card>
                        <Card size="2" style={{ flex: '1 1 300px' }}>
                            <Flex align="center" gap="3">
                                <Flex
                                    align="center"
                                    justify="center"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--green-3)',
                                        color: 'var(--green-9)',
                                    }}
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </Flex>
                                <Box>
                                    <Text size="2" color="gray">แผนก</Text>
                                    <Heading size="6">{new Set(employees.map(e => e.department)).size}</Heading>
                                </Box>
                            </Flex>
                        </Card>
                        <Card size="2" style={{ flex: '1 1 300px' }}>
                            <Flex align="center" gap="3">
                                <Flex
                                    align="center"
                                    justify="center"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '8px',
                                        backgroundColor: 'var(--purple-3)',
                                        color: 'var(--purple-9)',
                                    }}
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </Flex>
                                <Box>
                                    <Text size="2" color="gray">ตำแหน่ง</Text>
                                    <Heading size="6">{new Set(employees.map(e => e.position)).size}</Heading>
                                </Box>
                            </Flex>
                        </Card>
                    </Flex>
                )}
            </Box>

            {/* Add Employee Dialog */}
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-2xl">
                        <Dialog.Title asChild>
                            <Heading size="6" mb="4">เพิ่มพนักงาน</Heading>
                        </Dialog.Title>

                        <form onSubmit={handleSubmit}>
                            <Flex direction="column" gap="4">
                                <Box>
                                    <Text as="label" size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                                        ชื่อ
                                    </Text>
                                    <TextField.Root
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="กรอกชื่อพนักงาน"
                                        required
                                    />
                                </Box>

                                <Box>
                                    <Text as="label" size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                                        ตำแหน่ง
                                    </Text>
                                    <TextField.Root
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        placeholder="เช่น แพทย์, พยาบาล"
                                        required
                                    />
                                </Box>

                                <Box>
                                    <Text as="label" size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                                        แผนก
                                    </Text>
                                    <TextField.Root
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        placeholder="เช่น ER, ICU, Surgery"
                                        required
                                    />
                                </Box>

                                <Box>
                                    <Text as="label" size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                                        อีเมล
                                    </Text>
                                    <TextField.Root
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="example@hospital.com"
                                        required
                                    />
                                </Box>

                                <Flex justify="end" gap="2" pt="4" style={{ borderTop: '1px solid var(--gray-5)' }}>
                                    <Dialog.Close asChild>
                                        <Button type="button" variant="soft" color="gray">ยกเลิก</Button>
                                    </Dialog.Close>
                                    <Button type="submit">บันทึก</Button>
                                </Flex>
                            </Flex>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </Box>
    )
}
