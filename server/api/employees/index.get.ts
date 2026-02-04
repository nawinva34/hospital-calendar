import prisma from '../../utils/prisma';

export default defineEventHandler(async () => {
    let employees = await prisma.employee.findMany();

    // Auto-seed for demo if empty
    if (employees.length === 0) {
        await prisma.employee.createMany({
            data: [
                { name: 'Dr. Sarah Johnson', position: 'Physician', department: 'Emergency', email: 'sarah.j@hospital.com' },
                { name: 'Nurse Michael Chen', position: 'Nurse', department: 'ICU', email: 'michael.c@hospital.com' },
                { name: 'Dr. Emily Rodriguez', position: 'Physician', department: 'Cardiology', email: 'emily.r@hospital.com' },
                { name: 'Nurse David Kim', position: 'Nurse', department: 'Pediatrics', email: 'david.k@hospital.com' },
            ]
        });
        employees = await prisma.employee.findMany();
    }

    return {
        success: true,
        data: employees,
        count: employees.length
    };
});
