import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id') || '0');

    const shift = await prisma.shift.findUnique({
        where: { id }
    });

    if (!shift) {
        throw createError({
            statusCode: 404,
            message: `Shift with ID ${id} not found`
        });
    }

    return {
        success: true,
        data: shift
    };
});
