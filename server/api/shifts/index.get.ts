import prisma from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    // Optional filtering by query params
    const query = getQuery(event);

    const where: any = {};
    if (query.employeeId) where.employeeId = parseInt(query.employeeId as string);
    if (query.date) where.date = query.date as string;
    if (query.shiftTime) where.shiftTime = query.shiftTime as string;

    const filteredShifts = await prisma.shift.findMany({ where });

    return {
        success: true,
        data: filteredShifts,
        count: filteredShifts.length
    };
});
