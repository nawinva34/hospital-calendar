import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id') || '0');

    try {
        const deletedEmployee = await prisma.employee.delete({
            where: { id }
        });

        return {
            success: true,
            data: deletedEmployee,
            message: 'Employee deleted successfully'
        };
    } catch (e) {
        throw createError({
            statusCode: 404,
            message: `Employee with ID ${id} not found`
        });
    }
});
