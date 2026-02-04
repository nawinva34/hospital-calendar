import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id') || '0');

    try {
        const deletedShift = await prisma.shift.delete({
            where: { id }
        });

        return {
            success: true,
            data: deletedShift,
            message: 'Shift deleted successfully'
        };
    } catch (e) {
        throw createError({
            statusCode: 404,
            message: `Shift with ID ${id} not found`
        });
    }
});
