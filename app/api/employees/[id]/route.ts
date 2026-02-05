import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/employees/[id] - Get single employee
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const employee = await prisma.employee.findUnique({
            where: { id: parseInt(id) }
        })

        if (!employee) {
            return NextResponse.json(
                { success: false, error: `Employee with ID ${id} not found` },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: employee
        })
    } catch (error) {
        console.error('Error fetching employee:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch employee' },
            { status: 500 }
        )
    }
}

// PUT /api/employees/[id] - Update employee
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: {
                name: body.name,
                position: body.position,
                department: body.department,
                email: body.email
            }
        })

        return NextResponse.json({
            success: true,
            data: updatedEmployee,
            message: 'Employee updated successfully'
        })
    } catch (error) {
        console.error('Error updating employee:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update employee' },
            { status: 500 }
        )
    }
}

// DELETE /api/employees/[id] - Delete employee
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const deletedEmployee = await prisma.employee.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            success: true,
            data: deletedEmployee,
            message: 'Employee deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting employee:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete employee' },
            { status: 500 }
        )
    }
}
