import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/shifts/[id] - Get single shift
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const shift = await prisma.shift.findUnique({
            where: { id: parseInt(id) }
        })

        if (!shift) {
            return NextResponse.json(
                { success: false, error: `Shift with ID ${id} not found` },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: shift
        })
    } catch (error) {
        console.error('Error fetching shift:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch shift' },
            { status: 500 }
        )
    }
}

// PUT /api/shifts/[id] - Update shift
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        const VALID_SHIFT_TIMES = ['08-16', '08-20', '08-24', '16-24', '24-08']
        if (body.shiftTime && !VALID_SHIFT_TIMES.includes(body.shiftTime)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid shift time. Must be one of: ${VALID_SHIFT_TIMES.join(', ')}`
                },
                { status: 400 }
            )
        }

        const updatedShift = await prisma.shift.update({
            where: { id: parseInt(id) },
            data: {
                employeeId: body.employeeId,
                employeeName: body.employeeName,
                shiftTime: body.shiftTime,
                date: body.date,
                status: body.status
            }
        })

        return NextResponse.json({
            success: true,
            data: updatedShift,
            message: 'Shift updated successfully'
        })
    } catch (error) {
        console.error('Error updating shift:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update shift' },
            { status: 500 }
        )
    }
}

// DELETE /api/shifts/[id] - Delete shift
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const deletedShift = await prisma.shift.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({
            success: true,
            data: deletedShift,
            message: 'Shift deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting shift:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete shift' },
            { status: 500 }
        )
    }
}
