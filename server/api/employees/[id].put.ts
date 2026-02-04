import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const id = parseInt(getRouterParam(event, 'id') || '0');
    const body = await readBody(event);

    try {
        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: {
                name: body.name,
                position: body.position,
                department: body.department,
                email: body.email
            }
        });

        return {
            success: true,
            data: updatedEmployee,
            message: 'Employee updated successfully'
        };
    } catch (e) {
        throw createError({
            statusCode: 404,
            message: `Employee with ID ${id} not found`
        });
    }
});
