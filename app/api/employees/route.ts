import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/employees - Get all employees
export async function GET() {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { id: 'asc' }
        })

        // Auto-seed if empty
        if (employees.length === 0) {
            const seedEmployees = [
                { name: 'Dr. Sarah Johnson', position: 'แพทย์', department: 'ER', email: 'sarah.j@hospital.com' },
                { name: 'Nurse Michael Chen', position: 'พยาบาล', department: 'ICU', email: 'michael.c@hospital.com' },
                { name: 'Dr. Emily Rodriguez', position: 'แพทย์', department: 'Surgery', email: 'emily.r@hospital.com' },
                { name: 'Nurse David Kim', position: 'พยาบาล', department: 'Pediatrics', email: 'david.k@hospital.com' },
                { name: 'Dr. James Wilson', position: 'แพทย์', department: 'Cardiology', email: 'james.w@hospital.com' },
            ]

            await prisma.employee.createMany({
                data: seedEmployees
            })

            const newEmployees = await prisma.employee.findMany({
                orderBy: { id: 'asc' }
            })

            return NextResponse.json({
                success: true,
                data: newEmployees
            })
        }

        return NextResponse.json({
            success: true,
            data: employees
        })
    } catch (error) {
        console.error('Error fetching employees:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch employees' },
            { status: 500 }
        )
    }
}

// POST /api/employees - Create new employee
export async function POST(request: Request) {
    try {
        const body = await request.json()

        const newEmployee = await prisma.employee.create({
            data: {
                name: body.name,
                position: body.position,
                department: body.department,
                email: body.email
            }
        })

        return NextResponse.json({
            success: true,
            data: newEmployee,
            message: 'Employee created successfully'
        })
    } catch (error) {
        console.error('Error creating employee:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create employee' },
            { status: 500 }
        )
    }
}
