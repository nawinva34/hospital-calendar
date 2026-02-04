import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // Validate required fields
    if (!body.name || !body.position || !body.department || !body.email) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields: name, position, department, email'
        });
    }

    // Create new employee
    const newEmployee = await prisma.employee.create({
        data: {
            name: body.name,
            position: body.position,
            department: body.department,
            email: body.email
        }
    });

    return {
        success: true,
        data: newEmployee,
        message: 'Employee created successfully'
    };
});
