<template>
    <div class="page-content pa-0 pa-md-4">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-6">
            <div>
                <h1 class="text-h5 font-weight-bold text-primary mb-1">ตารางเวรปฏิบัติงาน</h1>
                <p class="text-body-2 text-medium-emphasis">ดูและจัดการตารางเวรของโรงพยาบาล</p>
            </div>
            <v-btn color="primary" prepend-icon="mdi-plus" flat @click="openRegisterDialog()">
                ลงเวร
            </v-btn>
        </div>

        <!-- Calendar Grid -->
        <v-card flat class="border rounded-lg overflow-hidden">
            <CalendarView :shifts="shifts" @select-date="onDateSelected" />
        </v-card>

        <!-- Day Details Dialog -->
        <v-dialog v-model="detailsDialog" max-width="500" scrollable>
            <v-card class="rounded-lg">
                <v-card-title class="d-flex justify-space-between align-center py-3 border-b bg-surface-light">
                    <div>
                        <div class="text-caption text-medium-emphasis">เวรประจำวันที่</div>
                        <span class="text-h6 font-weight-bold">{{ formatDate(selectedDate) }}</span>
                    </div>
                    <v-btn icon="mdi-close" variant="text" density="comfortable" @click="detailsDialog = false"></v-btn>
                </v-card-title>

                <v-card-text class="pa-0" style="max-height: 60vh;">
                    <div v-if="shiftsForSelectedDate.length > 0">
                        <v-list lines="two" class="pa-0">
                            <v-list-item v-for="shift in shiftsForSelectedDate" :key="shift.id" class="border-b py-3">
                                <template v-slot:prepend>
                                    <v-avatar color="primary" variant="tonal" class="mr-3">
                                        <span class="text-subtitle-2 font-weight-bold">{{ shift.employeeName.charAt(0)
                                            }}</span>
                                    </v-avatar>
                                </template>

                                <v-list-item-title class="font-weight-bold text-body-1 mb-1">
                                    {{ shift.employeeName }}
                                </v-list-item-title>

                                <v-list-item-subtitle class="d-flex align-center gap-2">
                                    <v-chip size="x-small" :color="getShiftColor(shift.shiftTime)" label variant="flat"
                                        class="font-weight-medium">
                                        {{ getShiftTimeLabel(shift.shiftTime) }}
                                    </v-chip>
                                    <span class="text-caption text-medium-emphasis">{{ formatShiftTime(shift.shiftTime)
                                        }}</span>
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </div>
                    <div v-else class="pa-8 text-center text-medium-emphasis">
                        <v-icon icon="mdi-calendar-blank" size="48" color="grey-lighten-2" class="mb-2"></v-icon>
                        <div class="text-body-1">ยังไม่มีผู้ลงเวรในวันนี้</div>
                    </div>
                </v-card-text>

                <v-card-actions class="pa-4 border-t">
                    <v-btn block color="primary" size="large" flat prepend-icon="mdi-plus"
                        @click="openRegisterDialogFromDetails">
                        ลงชื่อขึ้นเวร
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Registration Dialog -->
        <v-dialog v-model="dialog" max-width="500" persistent>
            <v-card class="rounded-lg">
                <v-card-title class="d-flex justify-space-between align-center py-3 border-b">
                    <span class="text-h6 font-weight-bold">ลงชื่อขึ้นเวร</span>
                    <v-btn icon="mdi-close" variant="text" density="comfortable" @click="dialog = false"></v-btn>
                </v-card-title>

                <v-card-text class="pa-5">
                    <v-form @submit.prevent="handleSubmit">
                        <!-- Employee Select -->
                        <div class="mb-4">
                            <label class="text-caption font-weight-bold mb-1 d-block">พนักงาน</label>
                            <v-select v-model="formData.employeeId" :items="employees" item-title="name" item-value="id"
                                placeholder="เลือกพนักงาน" variant="outlined" density="comfortable" hide-details="auto"
                                :rules="[v => !!v || 'กรุณาเลือกพนักงาน']" required></v-select>
                        </div>

                        <!-- Date Picker -->
                        <div class="mb-4">
                            <label class="text-caption font-weight-bold mb-1 d-block">วันที่</label>
                            <v-text-field v-model="formData.date" type="date" variant="outlined" density="comfortable"
                                hide-details="auto" :rules="[v => !!v || 'กรุณาระบุวันที่']" required></v-text-field>
                        </div>

                        <!-- Shift Time Selection -->
                        <div class="mb-6">
                            <label class="text-caption font-weight-bold mb-2 d-block">ช่วงเวลา</label>
                            <div class="d-flex flex-wrap gap-2">
                                <div v-for="shift in shiftTimes" :key="shift.value"
                                    class="shift-option flex-grow-1 text-center py-2 px-3 cursor-pointer transition-all border rounded"
                                    :class="{ 'selected-shift': formData.shiftTime === shift.value }"
                                    @click="formData.shiftTime = shift.value">
                                    <div class="text-body-2 font-weight-bold">
                                        {{ shift.time }}
                                    </div>
                                    <div class="text-caption text-medium-emphasis shift-label">
                                        {{ shift.label }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Status Message -->
                        <v-alert v-if="message" :type="message.type" class="mb-4" density="comfortable" variant="tonal"
                            border="start">
                            {{ message.text }}
                        </v-alert>

                        <!-- Actions -->
                        <div class="d-flex justify-end gap-2 mt-2">
                            <v-btn variant="text" class="px-4" @click="dialog = false">ยกเลิก</v-btn>
                            <v-btn color="primary" flat class="px-6" type="submit" :loading="loading">
                                ยืนยัน
                            </v-btn>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import CalendarView from '~/components/CalendarView.vue';

useHead({
    title: 'ตารางเวรปฏิบัติงาน'
});

interface Shift {
    id: number;
    employeeId: number;
    employeeName: string;
    shiftTime: string;
    date: string;
    status: string;
}

interface Employee {
    id: number;
    name: string;
    position: string;
}

// State
const shifts = ref<Shift[]>([]);
const employees = ref<Employee[]>([]);
const dialog = ref(false);
const detailsDialog = ref(false);
const selectedDate = ref('');
const loading = ref(false);
const message = ref<{ type: 'success' | 'error' | 'info' | 'warning'; text: string } | null>(null);

const formData = ref({
    employeeId: null as number | null,
    date: '',
    shiftTime: ''
});

// Constants
const shiftTimes = [
    { value: '08-16', time: '08:00 - 16:00', label: 'เช้า', color: '#fbbf24' },
    { value: '08-20', time: '08:00 - 20:00', label: 'บ่าย', color: '#34d399' },
    { value: '08-24', time: '08:00 - 24:00', label: 'ยาว', color: '#a78bfa' },
    { value: '16-24', time: '16:00 - 24:00', label: 'ดึก', color: '#f472b6' },
    { value: '24-08', time: '24:00 - 08:00', label: 'ข้ามคืน', color: '#60a5fa' }
];

// Computed
const shiftsForSelectedDate = computed(() => {
    return shifts.value.filter(s => s.date === selectedDate.value);
});

// Methods
const loadShifts = async () => {
    try {
        const response = await $fetch('/api/shifts');
        shifts.value = (response as any).data;
    } catch (error) {
        console.error('Failed to load shifts:', error);
    }
};

const loadEmployees = async () => {
    try {
        const response = await $fetch('/api/employees');
        employees.value = (response as any).data;
    } catch (error) {
        console.error('Failed to load employees:', error);
    }
};

const openRegisterDialog = (date?: string) => {
    const today = new Date().toISOString().split('T')[0];
    formData.value = {
        employeeId: null,
        date: date || today,
        shiftTime: ''
    };
    message.value = null;
    dialog.value = true;
};

const openRegisterDialogFromDetails = () => {
    detailsDialog.value = false;
    openRegisterDialog(selectedDate.value);
};

const onDateSelected = (date: string) => {
    selectedDate.value = date;
    detailsDialog.value = true;
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
};

const getShiftColor = (time: string) => {
    const shift = shiftTimes.find(s => s.value === time);
    return shift ? shift.color : 'grey';
};

const getShiftTimeLabel = (time: string) => {
    const shift = shiftTimes.find(s => s.value === time);
    return shift ? shift.label : '';
};

const formatShiftTime = (time: string) => {
    return time.replace('-', ':00 - ') + ':00';
};

const handleSubmit = async () => {
    if (!formData.value.shiftTime || !formData.value.employeeId || !formData.value.date) {
        message.value = { type: 'error', text: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
        return;
    }

    loading.value = true;
    message.value = null;

    try {
        const employee = employees.value.find(e => e.id === formData.value.employeeId);

        await $fetch('/api/shifts', {
            method: 'POST',
            body: {
                employeeId: formData.value.employeeId,
                employeeName: employee?.name || '',
                shiftTime: formData.value.shiftTime,
                date: formData.value.date,
                status: 'scheduled'
            }
        });

        message.value = { type: 'success', text: 'ลงชื่อขึ้นเวรเรียบร้อยแล้ว' };
        await loadShifts(); // Refresh calendar

        setTimeout(() => {
            dialog.value = false;
        }, 1000);

    } catch (error: any) {
        message.value = { type: 'error', text: error.data?.message || 'ไม่สามารถลงชื่อได้' };
    } finally {
        loading.value = false;
    }
};


// Lifecycle
onMounted(() => {
    loadShifts();
    loadEmployees();
});
</script>

<style scoped>
.gap-2 {
    gap: 8px;
}

.cursor-pointer {
    cursor: pointer;
}

.border {
    border: 1px solid #dadce0;
}

.border-b {
    border-bottom: 1px solid #dadce0;
}

.shift-option:hover {
    background-color: #f8f9fa;
}

.selected-shift {
    background-color: #e8f0fe !important;
    border-color: #1a73e8 !important;
    color: #1a73e8;
}

.shift-label {
    font-size: 0.75rem;
}
</style>
