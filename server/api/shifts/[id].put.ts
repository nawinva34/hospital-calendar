import prisma from '../../utils/prisma';

const VALID_SHIFT_TIMES = ['08-16', '08-20', '08-24', '16-24', '24-08'];

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id') || '0');
    const body = await readBody(event);

    // Validate shift time if provided
    if (body.shiftTime && !VALID_SHIFT_TIMES.includes(body.shiftTime)) {
        throw createError({
            statusCode: 400,
            message: `Invalid shift time. Must be one of: ${VALID_SHIFT_TIMES.join(', ')}`
        });
    }

    try {
        const updatedShift = await prisma.shift.update({
            where: { id },
            data: {
                employeeId: body.employeeId,
                employeeName: body.employeeName,
                shiftTime: body.shiftTime,
                date: body.date,
                status: body.status
            }
        });

        return {
            success: true,
            data: updatedShift,
            message: 'Shift updated successfully'
        };
    } catch (e) {
        throw createError({
            statusCode: 404,
            message: `Shift with ID ${id} not found`
        });
    }
});
