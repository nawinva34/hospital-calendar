<template>
    <div class="page-content">
        <div class="container" style="max-width: 800px;">
            <div class="card">
                <div class="card-header">
                    <h1 class="card-title text-center">Sign In for Shift</h1>
                    <p class="text-center text-muted">Select your shift time and date</p>
                </div>

                <form @submit.prevent="handleSubmit">
                    <!-- Employee Selection -->
                    <div class="form-group">
                        <label class="form-label">Employee</label>
                        <select v-model="formData.employeeId" class="form-select" required>
                            <option value="">Select employee...</option>
                            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                                {{ emp.name }} - {{ emp.position }}
                            </option>
                        </select>
                    </div>

                    <!-- Date Selection -->
                    <div class="form-group">
                        <label class="form-label">Date</label>
                        <input v-model="formData.date" type="date" class="form-input" required />
                    </div>

                    <!-- Shift Time Selection -->
                    <div class="form-group">
                        <label class="form-label">Shift Time</label>
                        <div class="shift-times">
                            <div v-for="shift in shiftTimes" :key="shift.value" class="shift-card"
                                :class="{ 'selected': formData.shiftTime === shift.value }"
                                :style="{ borderColor: shift.color }" @click="formData.shiftTime = shift.value">
                                <div class="shift-time">{{ shift.time }}</div>
                                <div class="shift-label">{{ shift.label }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="text-center mt-lg">
                        <button type="submit" class="btn btn-primary"
                            :disabled="loading || !formData.employeeId || !formData.date || !formData.shiftTime">
                            {{ loading ? 'Submitting...' : 'Sign In' }}
                        </button>
                    </div>
                </form>

                <!-- Success/Error Message -->
                <div v-if="message" class="mt-lg" :class="message.type === 'success' ? 'alert-success' : 'alert-error'">
                    {{ message.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

useHead({
    title: 'Sign In - Hospital Shift Calendar'
});

interface Employee {
    id: number;
    name: string;
    position: string;
}

const employees = ref<Employee[]>([]);
const loading = ref(false);
const message = ref<{ type: string; text: string } | null>(null);

const formData = ref({
    employeeId: null as number | null,
    date: '',
    shiftTime: ''
});

const shiftTimes = [
    { value: '08-16', time: '08:00 - 16:00', label: 'Morning Shift', color: '#fbbf24' },
    { value: '08-20', time: '08:00 - 20:00', label: 'Day Shift', color: '#34d399' },
    { value: '08-24', time: '08:00 - 24:00', label: 'Extended Shift', color: '#a78bfa' },
    { value: '16-24', time: '16:00 - 24:00', label: 'Evening Shift', color: '#f472b6' },
    { value: '24-08', time: '24:00 - 08:00', label: 'Night Shift', color: '#60a5fa' }
];

const loadEmployees = async () => {
    try {
        const response = await $fetch('/api/employees');
        employees.value = response.data;
    } catch (error) {
        console.error('Failed to load employees:', error);
        message.value = { type: 'error', text: 'Failed to load employees' };
    }
};

onMounted(() => {
    loadEmployees();
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    formData.value.date = today;
});

const handleSubmit = async () => {
    if (!formData.value.shiftTime || !formData.value.employeeId || !formData.value.date) {
        message.value = { type: 'error', text: 'Please fill in all fields' };
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

        message.value = { type: 'success', text: 'Shift registered successfully!' };

        // Reset form
        formData.value.employeeId = null;
        formData.value.shiftTime = '';
        const today = new Date().toISOString().split('T')[0];
        formData.value.date = today;
    } catch (error: any) {
        message.value = { type: 'error', text: error.data?.message || 'Failed to register shift' };
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.shift-times {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.shift-card {
    padding: 1rem;
    border: 3px solid #e2e8f0;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
}

.shift-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.shift-card.selected {
    border-width: 3px;
    background: rgba(37, 99, 235, 0.05);
}

.shift-time {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
}

.shift-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.alert-success {
    padding: 1rem;
    background: #d1fae5;
    border: 1px solid #34d399;
    border-radius: 0.5rem;
    color: #065f46;
}

.alert-error {
    padding: 1rem;
    background: #fee2e2;
    border: 1px solid #ef4444;
    border-radius: 0.5rem;
    color: #991b1b;
}
</style>
