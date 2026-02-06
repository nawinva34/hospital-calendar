import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const employeeId = searchParams.get('employeeId')
        const date = searchParams.get('date')

        const where: any = {}
        if (employeeId) where.employeeId = parseInt(employeeId)
        if (date) where.date = date

        const shifts = await prisma.shift.findMany({
            where,
            orderBy: { date: 'asc' }
        })

        return NextResponse.json({
            success: true,
            data: shifts
        })
    } catch (error) {
        console.error('Error fetching shifts:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch shifts' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const VALID_SHIFT_TIMES = ['08-16', '08-20', '08-24', '16-24', '24-08']
        if (!VALID_SHIFT_TIMES.includes(body.shiftTime)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid shift time. Must be one of: ${VALID_SHIFT_TIMES.join(', ')}`
                },
                { status: 400 }
            )
        }

        const newShift = await prisma.shift.create({
            data: {
                employeeId: body.employeeId,
                employeeName: body.employeeName,
                shiftTime: body.shiftTime,
                date: body.date,
                status: body.status || 'confirmed'
            }
        })

        return NextResponse.json({
            success: true,
            data: newShift,
            message: 'Shift created successfully'
        })
    } catch (error) {
        console.error('Error creating shift:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create shift' },
            { status: 500 }
        )
    }
}
