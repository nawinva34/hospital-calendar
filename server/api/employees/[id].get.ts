import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id') || '0');

    const employee = await prisma.employee.findUnique({
        where: { id }
    });

    if (!employee) {
        throw createError({
            statusCode: 404,
            message: `Employee with ID ${id} not found`
        });
    }

    return {
        success: true,
        data: employee
    };
});
