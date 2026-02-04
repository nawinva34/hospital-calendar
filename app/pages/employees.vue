<template>
    <div class="page-content pa-4">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-6">
            <div>
                <h1 class="text-h5 font-weight-bold text-primary mb-1">จัดการพนักงาน</h1>
                <p class="text-body-2 text-medium-emphasis">รายชื่อและข้อมูลพนักงานทั้งหมด</p>
            </div>
            <v-btn color="primary" prepend-icon="mdi-plus" flat @click="openAddModal">
                เพิ่มพนักงาน
            </v-btn>
        </div>

        <v-card flat class="border rounded-lg overflow-hidden">
            <div class="table-responsive">
                <v-table>
                <thead>
                    <tr class="bg-surface-light">
                        <th class="text-left font-weight-bold">รหัส</th>
                        <th class="text-left font-weight-bold">ชื่อ-นามสกุล</th>
                        <th class="text-left font-weight-bold">ตำแหน่ง</th>
                        <th class="text-left font-weight-bold">แผนก</th>
                        <th class="text-left font-weight-bold">อีเมล</th>
                        <th class="text-right font-weight-bold">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="employee in employees" :key="employee.id" class="employee-row">
                        <td><span class="text-caption text-medium-emphasis">#{{ employee.id }}</span></td>
                        <td class="font-weight-medium">{{ employee.name }}</td>
                        <td>{{ employee.position }}</td>
                        <td>
                            <v-chip size="small" color="primary" variant="flat" label class="font-weight-medium">
                                {{ employee.department }}
                            </v-chip>
                        </td>
                        <td class="text-body-2 text-medium-emphasis">{{ employee.email }}</td>
                        <td class="text-right">
                            <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" class="mr-1"
                                @click="startEdit(employee)"></v-btn>
                            <v-btn icon="mdi-delete" size="small" variant="text" color="error"
                                @click="deleteEmployee(employee.id)"></v-btn>
                        </td>
                    </tr>
                    <tr v-if="employees.length === 0">
                        <td colspan="6" class="text-center py-8 text-medium-emphasis">
                            ไม่พบข้อมูลพนักงาน
                        </td>
                    </tr>
                </tbody>
            </v-table>
            </div>
        </v-card>

        <!-- Add/Edit Dialog -->
        <v-dialog v-model="isModalOpen" max-width="500" persistent>
            <v-card class="rounded-lg">
                <v-card-title class="d-flex justify-space-between align-center py-3 border-b">
                    <span class="text-h6 font-weight-bold">{{ editingEmployee ? 'แก้ไขข้อมูล' : 'เพิ่มพนักงานใหม่' }}</span>
                    <v-btn icon="mdi-close" variant="text" density="comfortable"
                        @click="closeModal"></v-btn>
                </v-card-title>

                <v-card-text class="pa-5">
                    <v-form @submit.prevent="handleSubmit">
                        <div class="mb-4">
                            <label class="text-caption font-weight-bold mb-1 d-block">ชื่อ-นามสกุล</label>
                            <v-text-field v-model="formData.name" variant="outlined" density="comfortable"
                                hide-details="auto" :rules="[v => !!v || 'กรุณาระบุชื่อ']" required></v-text-field>
                        </div>

                        <div class="mb-4">
                            <label class="text-caption font-weight-bold mb-1 d-block">ตำแหน่ง</label>
                            <v-text-field v-model="formData.position" variant="outlined" density="comfortable"
                                hide-details="auto" required></v-text-field>
                        </div>

                        <div class="mb-4">
                            <label class="text-caption font-weight-bold mb-1 d-block">แผนก</label>
                            <v-text-field v-model="formData.department" variant="outlined" density="comfortable"
                                hide-details="auto" required></v-text-field>
                        </div>

                        <div class="mb-6">
                            <label class="text-caption font-weight-bold mb-1 d-block">อีเมล</label>
                            <v-text-field v-model="formData.email" type="email" variant="outlined" density="comfortable"
                                hide-details="auto" required></v-text-field>
                        </div>

                        <div class="d-flex justify-end gap-2">
                            <v-btn variant="text" class="px-4" @click="closeModal">ยกเลิก</v-btn>
                            <v-btn color="primary" flat class="px-6" type="submit" :loading="submitting">
                                บันทึก
                            </v-btn>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

useHead({
    title: 'จัดการพนักงาน - ตารางเวรปฏิบัติงาน'
});

interface Employee {
    id: number;
    name: string;
    position: string;
    department: string;
    email: string;
}

const employees = ref<Employee[]>([]);
const isModalOpen = ref(false);
const submitting = ref(false);
const editingEmployee = ref<Employee | null>(null);

const formData = ref({
    name: '',
    position: '',
    department: '',
    email: ''
});

const loadEmployees = async () => {
    try {
        const response = await $fetch('/api/employees');
        employees.value = (response as any).data;
    } catch (error) {
        console.error('Failed to load employees:', error);
    }
};

onMounted(() => {
    loadEmployees();
});

const openAddModal = () => {
    editingEmployee.value = null;
    formData.value = {
        name: '',
        position: '',
        department: '',
        email: ''
    };
    isModalOpen.value = true;
};

const startEdit = (employee: Employee) => {
    editingEmployee.value = employee;
    formData.value = {
        name: employee.name,
        position: employee.position,
        department: employee.department,
        email: employee.email
    };
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    editingEmployee.value = null;
    formData.value = {
        name: '',
        position: '',
        department: '',
        email: ''
    };
};

const handleSubmit = async () => {
    submitting.value = true;

    try {
        if (editingEmployee.value) {
            await $fetch(`/api/employees/${editingEmployee.value.id}`, {
                method: 'PUT',
                body: formData.value
            });
        } else {
            await $fetch('/api/employees', {
                method: 'POST',
                body: formData.value
            });
        }

        closeModal();
        await loadEmployees();
    } catch (error: any) {
        alert(error.data?.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
        submitting.value = false;
    }
};

const deleteEmployee = async (id: number) => {
    if (!confirm('ยืนยันลบข้อมูลพนักงานนี้?')) {
        return;
    }

    try {
        await $fetch(`/api/employees/${id}`, {
            method: 'DELETE'
        });
        await loadEmployees();
    } catch (error: any) {
        alert(error.data?.message || 'ไม่สามารถลบข้อมูลได้');
    }
};
</script>

<style scoped>
.gap-2 {
    gap: 8px;
}
.border {
    border: 1px solid #dadce0;
}
.border-b {
    border-bottom: 1px solid #dadce0;
}
.employee-row:hover {
    background-color: #f8f9fa;
}
</style>
