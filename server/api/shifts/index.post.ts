import prisma from '../../utils/prisma';

const VALID_SHIFT_TIMES = ['08-16', '08-20', '08-24', '16-24', '24-08'];

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // Validate required fields
    if (!body.employeeId || !body.employeeName || !body.shiftTime || !body.date) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields: employeeId, employeeName, shiftTime, date'
        });
    }

    // Validate shift time
    if (!VALID_SHIFT_TIMES.includes(body.shiftTime)) {
        throw createError({
            statusCode: 400,
            message: `Invalid shift time. Must be one of: ${VALID_SHIFT_TIMES.join(', ')}`
        });
    }

    // Create new shift
    const newShift = await prisma.shift.create({
        data: {
            employeeId: body.employeeId,
            employeeName: body.employeeName,
            shiftTime: body.shiftTime,
            date: body.date,
            status: body.status || 'scheduled'
        }
    });

    return {
        success: true,
        data: newShift,
        message: 'Shift created successfully'
    };
});
